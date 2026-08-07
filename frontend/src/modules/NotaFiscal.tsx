import React, { useEffect, useMemo, useState } from "react";
import NotasFiscaisEmitidas from "./NotasFiscaisEmitidas";
import { abrirArquivoAutenticado } from "../services/auth";

const API_BASE = "/api";

const VERDE = "#00B050";

const STATUS_LISTA = [
  { valor: "pendente", label: "Pendente" },
  { valor: "nota_enviada", label: "Nota enviada" },
  { valor: "cobrado", label: "Cobrado" },
  { valor: "prometeu_pagar", label: "Prometeu pagar" },
  { valor: "negociacao", label: "Em negociação" },
  { valor: "aprovado", label: "Aprovado" },
  { valor: "recebido", label: "Recebido" },
  { valor: "nota_cancelada", label: "Nota cancelada" },
];

function statusLabel(valor: string) {
  return STATUS_LISTA.find((s) => s.valor === valor)?.label || valor || "Pendente";
}

type Cliente = {
  id: string;
  nome: string;
  cnpj: string;
  email?: string;
  endereco?: string;
  municipio?: string;
  uf?: string;
};

type Lancamento = {
  id: string;
  cliente: string;
  referencia: string;
  descricao: string;
  valor: number;
  status: string;
  dataEmissao: string;
  dataRecebimento?: string;
  vencimento?: string;
  dataPromessaPagamento?: string;
  notaEnviada?: boolean;
  dataEnvioNota?: string;
  observacao?: string;
  nota?: string;
  mesReferencia?: number | null;
  anoReferencia?: number | null;
};

type VinculoInfo = { notaId?: string; historicoPdfId?: string };

type DocResumo = { id: string; temArquivo: boolean };

type NotaForm = {
  cliente: string;
  cnpj: string;
  email: string;
  endereco: string;
  municipio: string;
  uf: string;
  referencia: string;
  vencimento: string;
  valor: number;
  pedidoCompra: string;
  codigoServico: string;
  descricao: string;
  numeroNota: string;
  statusNota: "preparada" | "emitida";
};

function brl(v: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(v || 0));
}

function hoje() {
  return new Date().toISOString().slice(0, 10);
}

const modeloDescricao = (referencia: string, vencimento: string) =>
`REFERENTE A SERVIÇOS PRESTADOS EM ASSESSORIA E CONSULTORIA EM SEGURANÇA DO TRABALHO,
DURANTE O MÊS DE ${referencia || "____"}.
VENCIMENTO ${vencimento || "__/__/____"}.

DADOS BANCÁRIOS PARA PAGAMENTO:

BANCO ITAÚ
AGÊNCIA 8078
CONTA CORRENTE 23126-6
PIX: 18.315.702/0001-20`;

const vazio: NotaForm = {
  cliente: "",
  cnpj: "",
  email: "",
  endereco: "",
  municipio: "São Paulo",
  uf: "SP",
  referencia: "",
  vencimento: "",
  valor: 0,
  pedidoCompra: "",
  codigoServico: "03115 - Assessoria ou consultoria de qualquer natureza, não contida em outros itens desta lista.",
  descricao: "",
  numeroNota: "",
  statusNota: "preparada",
};

export default function NotaFiscal() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [financeiro, setFinanceiro] = useState<Lancamento[]>([]);
  const [form, setForm] = useState<NotaForm>({ ...vazio });
  const [selecionado, setSelecionado] = useState("");
  const [erro, setErro] = useState("");
  const [copiado, setCopiado] = useState("");
  const [detalheAberto, setDetalheAberto] = useState<Lancamento | null>(null);
  const [notasPainel, setNotasPainel] = useState<DocResumo[]>([]);
  const [historicoPdfs, setHistoricoPdfs] = useState<DocResumo[]>([]);
  const [vinculosFinanceiro, setVinculosFinanceiro] = useState<Record<string, VinculoInfo>>({});
  const [carregandoArquivo, setCarregandoArquivo] = useState<string | null>(null);
  const [pickerVinculo, setPickerVinculo] = useState<{ lancId: string; tipo: "nota" | "relatorio" } | null>(null);
  const [candidatosVinculo, setCandidatosVinculo] = useState<any[]>([]);
  const [buscandoCandidatos, setBuscandoCandidatos] = useState(false);
  const [vinculando, setVinculando] = useState(false);
  // NotasFiscaisEmitidas é renderizado logo abaixo, na mesma página, mas busca seus
  // próprios dados de forma independente - esse contador avisa o filho toda vez que
  // este componente recarrega os dados (por mutação própria ou clique em Atualizar),
  // pra manter os dois em sincronia sem precisar de um estado global.
  const [tick, setTick] = useState(0);

  async function carregar() {
    try {
      setErro("");
      const [resClientes, resFin, resDash, resHist] = await Promise.all([
        fetch(`${API_BASE}/empresas`),
        fetch(`${API_BASE}/financeiro`).catch(() => null),
        fetch(`${API_BASE}/dashboard/financeiro-notas`).catch(() => null),
        fetch(`${API_BASE}/historico-pdfs`).catch(() => null),
      ]);

      const dataClientes = await resClientes.json();
      if (dataClientes.status === "ok") {
        setClientes(dataClientes.empresas || []);
      }

      if (resFin) {
        const dataFin = await resFin.json();
        if (dataFin.status === "ok") {
          setFinanceiro(dataFin.lancamentos || []);
        }
      }

      // Documento real vinculado a cada lançamento (nota fiscal e/ou relatório do
      // Histórico) — o casamento cliente+valor+mês/ano já é feito uma vez só no
      // backend (mesma lógica usada pelo Dashboard), aqui só consultamos o mapa.
      if (resDash) {
        const dataDash = await resDash.json();
        if (dataDash.status === "ok") {
          setNotasPainel((dataDash.notas || []).map((n: any) => ({ id: n.id, temArquivo: !!n.temArquivo })));
          setVinculosFinanceiro(dataDash.vinculosFinanceiro || {});
        }
      }
      if (resHist) {
        const dataHist = await resHist.json();
        if (dataHist.status === "ok") {
          setHistoricoPdfs((dataHist.historico || []).map((h: any) => ({ id: h.id, temArquivo: !!h.temArquivo })));
        }
      }
    } catch {
      setErro("Não consegui carregar clientes/financeiro. Confira o backend.");
    }
    setTick((t) => t + 1);
  }

  function notaVinculada(lancId: string) {
    const notaId = vinculosFinanceiro[lancId]?.notaId;
    if (!notaId) return null;
    return notasPainel.find((n) => n.id === notaId) || null;
  }

  function historicoVinculado(lancId: string) {
    const histId = vinculosFinanceiro[lancId]?.historicoPdfId;
    if (!histId) return null;
    return historicoPdfs.find((h) => h.id === histId) || null;
  }

  useEffect(() => {
    carregar();
  }, []);

  const pendentes = useMemo(
    () => financeiro.filter((l) => l.status === "pendente"),
    [financeiro]
  );

  function aplicarLancamento(id: string) {
    setSelecionado(id);
    const lanc = financeiro.find((l) => l.id === id);
    if (!lanc) return;

    const cliente = clientes.find(
      (c) => c.nome?.toLowerCase() === lanc.cliente?.toLowerCase()
    );

    const ref = lanc.referencia || "";
    const vencimento = lanc.vencimento || "";

    setForm({
      ...vazio,
      cliente: cliente?.nome || lanc.cliente || "",
      cnpj: cliente?.cnpj || "",
      email: cliente?.email || "",
      endereco: cliente?.endereco || "",
      municipio: cliente?.municipio || "",
      uf: cliente?.uf || "",
      referencia: ref,
      vencimento,
      valor: Number(lanc.valor || 0),
      pedidoCompra: "",
      descricao: modeloDescricao(ref.toUpperCase(), vencimento),
      statusNota: "preparada",
      numeroNota: lanc.nota || "",
    });
  }

  function atualizar(campo: keyof NotaForm, valor: any) {
    setForm((prev) => ({
      ...prev,
      [campo]: campo === "valor" ? Number(valor || 0) : valor,
    }));
  }

  async function copiarTexto(texto: string, label: string) {
    await navigator.clipboard.writeText(texto || "");
    setCopiado(`${label} copiado.`);
    setTimeout(() => setCopiado(""), 2000);
  }

  function copiarPacotePortal() {
    const pacote = `
TOMADOR:
Razão Social: ${form.cliente}
CNPJ: ${form.cnpj}
E-mail: ${form.email}
Endereço: ${form.endereco}
Município/UF: ${form.municipio} - ${form.uf}

SERVIÇO:
Código: ${form.codigoServico}
Valor: ${brl(form.valor)}
DISCRIMINAÇÃO:
${form.descricao}
`.trim();

    copiarTexto(pacote, "Pacote da nota");
  }

  async function marcarEmitida() {
    if (!form.numeroNota.trim()) {
      alert("Informe o número da nota emitida.");
      return;
    }

    if (selecionado) {
      const lanc = financeiro.find((l) => l.id === selecionado);
      if (lanc) {
        await fetch(`${API_BASE}/financeiro`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...lanc,
            nota: form.numeroNota,
            descricao: lanc.descricao || "Nota fiscal emitida",
          }),
        });
      }
    }

    setForm((prev) => ({ ...prev, statusNota: "emitida" }));
    await carregar();
    alert("Nota marcada como emitida no sistema.");
  }

  async function excluirLancamento(id: string) {
    if (!confirm("Excluir esta nota/lançamento?")) return;

    await fetch(`${API_BASE}/financeiro/${id}`, { method: "DELETE" });
    await carregar();
  }

  function abrirDetalhe(lanc: Lancamento) {
    setDetalheAberto(lanc);
  }

  function abrirPortal() {
    window.open("https://nfe.prefeitura.sp.gov.br/", "_blank");
  }

  async function abrirVincular(lancId: string, tipo: "nota" | "relatorio") {
    if (pickerVinculo?.lancId === lancId && pickerVinculo?.tipo === tipo) {
      setPickerVinculo(null);
      return;
    }
    setPickerVinculo({ lancId, tipo });
    setCandidatosVinculo([]);
    setBuscandoCandidatos(true);
    setErro("");
    try {
      const res = await fetch(`${API_BASE}/vinculos/sugestoes?tipo=financeiro&id=${lancId}`);
      const data = await res.json();
      let candidatos: any[] = data.status === "ok" ? (tipo === "nota" ? data.candidatosNota : data.candidatosHistorico) || [] : [];
      // Só mostra quem realmente tem arquivo anexado - vincular um registro sem PDF
      // (só dados, sem upload) cria o vínculo mas nunca vai ter o que visualizar.
      candidatos = candidatos.filter((c: any) => c.temArquivo);
      if (candidatos.length === 0) {
        // Sem sugestão automática (cliente/valor não bateram) - mostra a lista completa,
        // o backend recusa com mensagem clara se o item escolhido já estiver vinculado.
        const resTudo = await fetch(tipo === "nota" ? `${API_BASE}/notas-fiscais` : `${API_BASE}/historico-pdfs`);
        const dataTudo = await resTudo.json();
        candidatos = (tipo === "nota" ? dataTudo.notas || [] : dataTudo.historico || []).filter((c: any) => c.temArquivo);
      }
      setCandidatosVinculo(candidatos);
    } catch (err) {
      setErro(`Não consegui buscar as opções pra vincular: ${err}`);
    } finally {
      setBuscandoCandidatos(false);
    }
  }

  async function confirmarVincular(lancId: string, tipo: "nota" | "relatorio", idEscolhido: string) {
    setVinculando(true);
    setErro("");
    try {
      const body =
        tipo === "nota"
          ? { lancamentoId: lancId, notaId: idEscolhido, origem: "manual" }
          : { lancamentoId: lancId, historicoId: idEscolhido, origem: "manual" };
      const res = await fetch(`${API_BASE}/vinculos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (res.status === 409 || data.status !== "ok") {
        setErro(data.erro || "Não foi possível vincular.");
        return;
      }
      setPickerVinculo(null);
      await carregar();
    } catch (err) {
      setErro(`Erro ao vincular: ${err}`);
    } finally {
      setVinculando(false);
    }
  }

  async function verArquivo(tipo: "nota" | "relatorio", id: string) {
    const chave = `${tipo}-${id}`;
    setCarregandoArquivo(chave);
    setErro("");
    try {
      const url = tipo === "nota" ? `${API_BASE}/notas-fiscais/${id}/arquivo` : `${API_BASE}/historico-pdfs/${id}/arquivo`;
      await abrirArquivoAutenticado(url);
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Erro ao abrir o arquivo.");
    } finally {
      setCarregandoArquivo(null);
    }
  }

  return (
    <div className="nota-page">
      <style>{`
        .nota-page { display:grid; gap:18px; }
        .head { display:flex; justify-content:space-between; align-items:center; gap:16px; }
        .head h1 { margin:0; font-size:30px; font-weight:1000; color:#111827; }
        .head p { margin:5px 0 0; color:#6b7280; font-weight:700; }
        .btn-primary { border:0; background:${VERDE}; color:white; font-weight:900; padding:12px 16px; border-radius:12px; cursor:pointer; box-shadow:0 8px 18px rgba(0,176,80,.22); }
        .btn-gray { border:0; background:#e5e7eb; color:#111; font-weight:900; padding:10px 13px; border-radius:10px; cursor:pointer; }
        .btn-gold { border:0; background:#facc15; color:#1f2937; font-weight:1000; padding:12px 16px; border-radius:12px; cursor:pointer; }
        .grid { display:grid; grid-template-columns: .85fr 1.15fr; gap:18px; align-items:start; }
        .box { background:#fff; border:1px solid #e5e7eb; border-radius:22px; padding:18px; box-shadow:0 10px 24px rgba(0,0,0,.06); }
        .box h2 { margin:0 0 14px; font-size:22px; font-weight:1000; color:#111827; }
        .field { margin-bottom:12px; }
        .field label { display:block; font-size:12px; color:#374151; font-weight:1000; margin-bottom:5px; }
        .field input, .field select, .field textarea { width:100%; border:1px solid #d1d5db; border-radius:10px; padding:10px; font-size:13px; background:white; }
        .field textarea { min-height:160px; resize:vertical; font-family:Consolas, monospace; }
        .rows { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
        .actions { display:flex; gap:10px; flex-wrap:wrap; margin-top:14px; }
        .mini-table { width:100%; border-collapse:collapse; font-size:13px; }
        .mini-table th { text-align:left; background:#f9fafb; padding:10px; border-bottom:1px solid #e5e7eb; }
        .mini-table td { padding:10px; border-bottom:1px solid #edf0f2; font-weight:700; }
        .status { display:inline-flex; padding:6px 10px; border-radius:999px; font-size:12px; font-weight:1000; background:#dcfce7; color:#166534; }
        .copy-ok { color:#006b34; font-weight:1000; }
        .preview { border:1px dashed #b7c2bd; background:#f8fafc; border-radius:14px; padding:14px; white-space:pre-wrap; font-family:Consolas, monospace; font-size:12px; }
        .valor { font-size:34px; font-weight:1000; color:${VERDE}; }
        .modal-overlay { position:fixed; inset:0; background:rgba(17,24,39,.55); display:flex; align-items:center; justify-content:center; padding:20px; z-index:1000; }
        .modal-box { background:#fff; border-radius:22px; padding:22px; max-width:560px; width:100%; max-height:85vh; overflow-y:auto; box-shadow:0 20px 60px rgba(0,0,0,.3); }
        .modal-head { display:flex; justify-content:space-between; align-items:flex-start; gap:12px; margin-bottom:14px; }
        .modal-head h2 { margin:0; font-size:22px; font-weight:1000; color:#111827; }
        .modal-close { border:0; background:#f3f4f6; color:#111; width:32px; height:32px; border-radius:10px; font-weight:1000; cursor:pointer; font-size:16px; flex-shrink:0; }
        .modal-linha { display:grid; grid-template-columns:160px 1fr; gap:10px; padding:9px 0; border-bottom:1px solid #f1f5f9; font-size:13px; }
        .modal-linha strong { color:#374151; font-weight:1000; }
        .modal-linha span { color:#111827; font-weight:700; white-space:pre-wrap; }
        @media(max-width:1000px){ .grid,.rows{grid-template-columns:1fr;} }
        @media(max-width:600px){ .modal-linha{grid-template-columns:1fr;} }
      `}</style>

      <div className="head">
        <div>
          <h1>Pré-Emissão NFS-e São Paulo</h1>
          <p>Prepare dados da nota a partir do relatório aprovado e financeiro.</p>
        </div>
        <button className="btn-primary" onClick={abrirPortal}>Abrir Nota do Milhão</button>
      </div>

      {erro && <div className="box" style={{color:"#b91c1c",fontWeight:900}}>{erro}</div>}

      <div className="grid">
        <div className="box">
          <h2>Lançamentos pendentes</h2>
          <div className="field">
            <label>Selecionar lançamento financeiro</label>
            <select value={selecionado} onChange={(e) => aplicarLancamento(e.target.value)}>
              <option value="">Selecione...</option>
              {pendentes.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.cliente} - {l.referencia} - {brl(l.valor)}
                </option>
              ))}
            </select>
          </div>

          <table className="mini-table">
            <thead>
              <tr><th>Cliente</th><th>Ref.</th><th>Valor</th></tr>
            </thead>
            <tbody>
              {pendentes.length === 0 && (
                <tr><td colSpan={3}>Nenhum lançamento pendente.</td></tr>
              )}
              {pendentes.slice(0, 8).map((l) => (
                <tr key={l.id}>
                  <td>{l.cliente}</td>
                  <td>{l.referencia}</td>
                  <td>{brl(l.valor)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="actions">
            <button className="btn-gray" onClick={carregar}>Atualizar</button>
          </div>
        </div>

        <div className="box">
          <h2>Dados da NFS-e</h2>

          <div className="rows">
            <div className="field">
              <label>Tomador / Razão Social</label>
              <input value={form.cliente} onChange={(e) => atualizar("cliente", e.target.value)} />
            </div>
            <div className="field">
              <label>CNPJ</label>
              <input value={form.cnpj} onChange={(e) => atualizar("cnpj", e.target.value)} />
            </div>
            <div className="field">
              <label>E-mail</label>
              <input value={form.email} onChange={(e) => atualizar("email", e.target.value)} />
            </div>
            <div className="field">
              <label>Endereço</label>
              <input value={form.endereco} onChange={(e) => atualizar("endereco", e.target.value)} />
            </div>
            <div className="field">
              <label>Município</label>
              <input value={form.municipio} onChange={(e) => atualizar("municipio", e.target.value)} />
            </div>
            <div className="field">
              <label>UF</label>
              <input value={form.uf} onChange={(e) => atualizar("uf", e.target.value)} />
            </div>
            <div className="field">
              <label>Referência</label>
              <input value={form.referencia} onChange={(e) => {
                atualizar("referencia", e.target.value);
                atualizar("descricao", modeloDescricao(e.target.value.toUpperCase(), form.vencimento));
              }} />
            </div>
            <div className="field">
              <label>Vencimento</label>
              <input value={form.vencimento} onChange={(e) => {
                atualizar("vencimento", e.target.value);
                atualizar("descricao", modeloDescricao(form.referencia.toUpperCase(), e.target.value));
              }} />
            </div>
            <div className="field">
              <label>Valor da nota</label>
              <input type="number" value={form.valor} onChange={(e) => atualizar("valor", e.target.value)} />
            </div>
          </div>

          <div className="field">
            <label>Código do serviço</label>
            <input value={form.codigoServico} onChange={(e) => atualizar("codigoServico", e.target.value)} />
          </div>

          <div className="field">
            <label>Discriminação dos serviços</label>
            <div style={{fontSize:11,color:"#6b7280",fontWeight:800,marginBottom:6}}>
              Se houver pedido de compra, digite manualmente na primeira linha da descrição.
            </div>
            <textarea value={form.descricao} onChange={(e) => atualizar("descricao", e.target.value)} />
          </div>

          <div className="valor">{brl(form.valor)}</div>

          <div className="actions">
            <button className="btn-gray" onClick={() => copiarTexto(form.cliente, "Razão social")}>Copiar cliente</button>
            <button className="btn-gray" onClick={() => copiarTexto(form.cnpj, "CNPJ")}>Copiar CNPJ</button>
            <button className="btn-gray" onClick={() => copiarTexto(form.descricao, "Discriminação")}>Copiar discriminação</button>
            <button className="btn-gold" onClick={copiarPacotePortal}>Copiar pacote completo</button>
          </div>

          {copiado && <div className="copy-ok">{copiado}</div>}

          <div className="field" style={{marginTop:16}}>
            <label>Número da nota emitida</label>
            <input value={form.numeroNota} onChange={(e) => atualizar("numeroNota", e.target.value)} placeholder="Ex: 00000824" />
          </div>

          <div className="actions">
            <button className="btn-primary" onClick={marcarEmitida}>Marcar nota como emitida</button>
          </div>

          {form.statusNota === "emitida" && <div className="status">Nota emitida registrada</div>}
        </div>
      </div>

      <div className="box">
        <h2>Histórico de notas e pendências</h2>
        <table className="mini-table">
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Referência</th>
              <th>Valor</th>
              <th>Nota</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {financeiro.length === 0 && (
              <tr><td colSpan={6}>Nenhuma nota ou lançamento encontrado.</td></tr>
            )}
            {financeiro.map((l) => {
              const nota = notaVinculada(l.id);
              const historico = historicoVinculado(l.id);
              const temDocumento = !!(nota?.temArquivo || historico?.temArquivo);
              return (
                <tr key={`hist-${l.id}`}>
                  <td>{l.cliente}</td>
                  <td>{l.referencia || "-"}</td>
                  <td>{brl(l.valor)}</td>
                  <td>{l.nota || "Pendente"}</td>
                  <td>{l.status}</td>
                  <td>
                    <div className="actions">
                      {nota?.temArquivo && (
                        <button className="btn-gray" onClick={() => verArquivo("nota", nota.id)} disabled={carregandoArquivo === `nota-${nota.id}`}>
                          {carregandoArquivo === `nota-${nota.id}` ? "Abrindo..." : "Ver nota"}
                        </button>
                      )}
                      {historico?.temArquivo && (
                        <button className="btn-gray" onClick={() => verArquivo("relatorio", historico.id)} disabled={carregandoArquivo === `relatorio-${historico.id}`}>
                          {carregandoArquivo === `relatorio-${historico.id}` ? "Abrindo..." : "Ver relatório"}
                        </button>
                      )}
                      {!nota?.temArquivo && (
                        <button className="btn-gray" onClick={() => abrirVincular(l.id, "nota")}>
                          {pickerVinculo?.lancId === l.id && pickerVinculo.tipo === "nota" ? "Fechar" : "Vincular nota"}
                        </button>
                      )}
                      {!historico?.temArquivo && (
                        <button className="btn-gray" onClick={() => abrirVincular(l.id, "relatorio")}>
                          {pickerVinculo?.lancId === l.id && pickerVinculo.tipo === "relatorio" ? "Fechar" : "Vincular relatório"}
                        </button>
                      )}
                      <button className="btn-gray" onClick={() => abrirDetalhe(l)}>{temDocumento ? "Ver detalhes" : "Visualizar"}</button>
                      <button
                        className="btn-gray"
                        title="Copia um resumo deste lançamento (cliente, referência, valor e número da nota) para colar em outro lugar, como WhatsApp, e-mail ou uma anotação — não é o pacote de emissão da nota."
                        onClick={() => copiarTexto(`Cliente: ${l.cliente}\nReferência: ${l.referencia}\nValor: ${brl(l.valor)}\nNota: ${l.nota || "Pendente"}`, "Dados da nota")}
                      >
                        Copiar resumo
                      </button>
                      <button className="btn-gray" onClick={() => excluirLancamento(l.id)}>Excluir</button>
                    </div>
                    {pickerVinculo?.lancId === l.id && (
                      <div style={{ marginTop: 8, display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                        <select
                          defaultValue=""
                          disabled={vinculando}
                          onChange={(e) => e.target.value && confirmarVincular(l.id, pickerVinculo.tipo, e.target.value)}
                          style={{ border: "1px solid #d1d5db", borderRadius: 8, padding: 8, fontSize: 12, fontWeight: 700, maxWidth: 320 }}
                        >
                          <option value="">
                            {buscandoCandidatos
                              ? "Buscando..."
                              : candidatosVinculo.length === 0
                              ? pickerVinculo.tipo === "nota"
                                ? "Nenhuma nota com arquivo disponível"
                                : "Nenhum relatório com arquivo disponível"
                              : pickerVinculo.tipo === "nota"
                              ? "Escolher nota fiscal..."
                              : "Escolher relatório..."}
                          </option>
                          {candidatosVinculo.map((c: any) => (
                            <option key={c.id} value={c.id}>
                              {pickerVinculo.tipo === "nota"
                                ? `${c.numeroNota || "s/ número"} — ${c.cliente || "-"} — ${brl(c.valor)}`
                                : `${c.cliente || "-"} — ${c.referencia || "-"} — ${brl(c.valor)}`}
                            </option>
                          ))}
                        </select>
                        <button className="btn-gray" onClick={() => setPickerVinculo(null)}>Cancelar</button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <NotasFiscaisEmitidas refrescarTick={tick} onMudou={carregar} />

      <div className="box">
        <h2>Prévia do pacote para o portal</h2>
        <div className="preview">
{`TOMADOR:
Razão Social: ${form.cliente || "-"}
CNPJ: ${form.cnpj || "-"}
E-mail: ${form.email || "-"}
Endereço: ${form.endereco || "-"}
Município/UF: ${form.municipio || "-"} - ${form.uf || "-"}

SERVIÇO:
Código: ${form.codigoServico}
Valor: ${brl(form.valor)}
DISCRIMINAÇÃO:
${form.descricao || "-"}`}
        </div>
      </div>

      {detalheAberto && (
        <div className="modal-overlay" onClick={() => setDetalheAberto(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <h2>{detalheAberto.cliente}</h2>
              <button className="modal-close" onClick={() => setDetalheAberto(null)}>×</button>
            </div>
            <div className="modal-linha"><strong>Referência</strong><span>{detalheAberto.referencia || "-"}</span></div>
            <div className="modal-linha"><strong>Valor</strong><span>{brl(detalheAberto.valor)}</span></div>
            <div className="modal-linha"><strong>Status</strong><span>{statusLabel(detalheAberto.status)}</span></div>
            <div className="modal-linha"><strong>Vencimento</strong><span>{detalheAberto.vencimento || "-"}</span></div>
            <div className="modal-linha"><strong>Emissão</strong><span>{detalheAberto.dataEmissao || "-"}</span></div>
            <div className="modal-linha"><strong>Recebimento</strong><span>{detalheAberto.dataRecebimento || "-"}</span></div>
            <div className="modal-linha"><strong>Nota fiscal</strong><span>{detalheAberto.nota || "Pendente"}</span></div>
            <div className="modal-linha">
              <strong>Nota enviada?</strong>
              <span>{detalheAberto.notaEnviada || detalheAberto.dataEnvioNota ? `Sim, em ${detalheAberto.dataEnvioNota || "-"}` : "Não"}</span>
            </div>
            <div className="modal-linha"><strong>Observação</strong><span>{detalheAberto.observacao || "-"}</span></div>
            <div className="modal-linha"><strong>Discriminação / Descrição</strong><span>{detalheAberto.descricao || "-"}</span></div>
          </div>
        </div>
      )}
    </div>
  );
}
