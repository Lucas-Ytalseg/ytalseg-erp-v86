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

type VinculoInfo = { vinculoId?: string; notaId?: string; historicoPdfId?: string };

type DocResumo = { id: string; temArquivo: boolean; temDados?: boolean };

// V17.5: dados da nota usados pra ordenar o "Histórico de notas" e pra mostrar as notas
// que não têm lançamento no Financeiro (ex.: nota cancelada, notas antigas da Prefeitura).
type NotaResumo = DocResumo & {
  numeroNota: string;
  cliente: string;
  valor: number;
  padraoNota: string;
  cancelada: boolean;
  mesReferencia?: number | null;
  anoReferencia?: number | null;
  ligadaALancamento: boolean;
};

const NOMES_MESES_HIST = ["", "JANEIRO", "FEVEREIRO", "MARÇO", "ABRIL", "MAIO", "JUNHO", "JULHO", "AGOSTO", "SETEMBRO", "OUTUBRO", "NOVEMBRO", "DEZEMBRO"];

// Mesma regra da aba "Notas Fiscais Emitidas" (V16.5): a numeração recomeçou do 1 no
// Emissor Nacional, então o bloco novo (5, 4, 3, 2, 1) vem antes das notas antigas da
// Prefeitura (868, 867...). Bloco maior = mais recente.
function blocoDaNota(padrao: string) {
  return padrao === "nacional_danfse" ? 2 : padrao === "manual" ? 0 : 1;
}

function numeroDaNota(texto: string | undefined) {
  return Number(String(texto || "").replace(/\D/g, "")) || 0;
}

function ehSemNota(texto: string | undefined) {
  return /^\s*s\s*\/?\s*n\s*$/i.test(String(texto || ""));
}

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

const CODIGO_NBS = "1.1401.11.00";
const URL_EMISSOR_NACIONAL = "https://www.nfse.gov.br/EmissorNacional";

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
  // V16: padrão do Emissor Nacional (desde nov/2026) - antes era "03115" da Prefeitura de SP
  codigoServico: "17.01.01 / 001 - Assessoria ou consultoria de qualquer natureza, não contida em outros itens desta lista.",
  descricao: "",
  numeroNota: "",
  statusNota: "preparada",
};

export default function NotaFiscal({ onAbrirRelatorio }: { onAbrirRelatorio?: () => void } = {}) {
  // V16.3: a tela ficava muito comprida com as 4 partes juntas - agora cada parte
  // abre pelo seu botão. As partes escondidas continuam montadas (display:none),
  // então nada se perde ao trocar de botão (ex: nota subida esperando confirmação).
  const [aba, setAba] = useState<"lancamentos" | "previa" | "historico" | "emitidas">("emitidas");
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [financeiro, setFinanceiro] = useState<Lancamento[]>([]);
  const [form, setForm] = useState<NotaForm>({ ...vazio });
  const [selecionado, setSelecionado] = useState("");
  const [erro, setErro] = useState("");
  const [copiado, setCopiado] = useState("");
  const [detalheAberto, setDetalheAberto] = useState<Lancamento | null>(null);
  const [notasPainel, setNotasPainel] = useState<NotaResumo[]>([]);
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
      const [resClientes, resFin, resDash, resHist, resNotas] = await Promise.all([
        fetch(`${API_BASE}/empresas`),
        fetch(`${API_BASE}/financeiro`).catch(() => null),
        fetch(`${API_BASE}/dashboard/financeiro-notas`).catch(() => null),
        fetch(`${API_BASE}/historico-pdfs`).catch(() => null),
        // V17.5: lista completa de notas (o painel acima deixa as canceladas de fora)
        fetch(`${API_BASE}/notas-fiscais`).catch(() => null),
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
          const notasDash: any[] = dataDash.notas || [];
          const ligadas = new Set(
            notasDash
              .filter((n) => (n.financeiroIdsResolvidos || []).length > 0 || !!n.financeiroIdResolvido)
              .map((n) => n.id)
          );
          let notasCompletas: any[] = notasDash;
          if (resNotas) {
            const dataNotas = await resNotas.json().catch(() => null);
            if (dataNotas?.status === "ok" && Array.isArray(dataNotas.notas)) notasCompletas = dataNotas.notas;
          }
          setNotasPainel(notasCompletas.map((n: any) => ({
            id: n.id,
            temArquivo: !!n.temArquivo,
            numeroNota: n.numeroNota || "",
            cliente: n.cliente || "",
            valor: Number(n.valor || 0),
            padraoNota: n.padraoNota || "",
            cancelada: !!n.cancelada,
            mesReferencia: n.mesReferencia,
            anoReferencia: n.anoReferencia,
            ligadaALancamento: ligadas.has(n.id),
          })));
          setVinculosFinanceiro(dataDash.vinculosFinanceiro || {});
        }
      }
      if (resHist) {
        const dataHist = await resHist.json();
        if (dataHist.status === "ok") {
          setHistoricoPdfs((dataHist.historico || []).map((h: any) => ({ id: h.id, temArquivo: !!h.temArquivo, temDados: !!h.temDados })));
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

  // V17.5: "Histórico de notas" em ordem de emissão (igual à aba Notas Fiscais Emitidas)
  // e com TODAS as notas, inclusive as que não têm lançamento no Financeiro (ex.: nota
  // cancelada). Ordem: 1) lançamentos ainda sem nota (pendência a resolver); 2) notas do
  // mais recente pro mais antigo (bloco nacional 5,4,3... depois Prefeitura 868,867...);
  // 3) lançamentos S/N (só relatório, sem nota com imposto) no fim.
  type LinhaHistorico =
    | { tipo: "lanc"; chave: string; l: Lancamento }
    | { tipo: "nota"; chave: string; n: NotaResumo };

  const linhasHistorico = useMemo<LinhaHistorico[]>(() => {
    const notaPorId = new Map(notasPainel.map((n) => [n.id, n]));
    const notasAbsorvidas = new Set<string>();

    // Nota de cada lançamento: a vinculada; se não houver vínculo, a nota com o mesmo
    // número (lançamentos antigos guardaram só o número no campo "Nº NF").
    const notaDoLancamento = (l: Lancamento): NotaResumo | null => {
      const idVinc = vinculosFinanceiro[l.id]?.notaId;
      if (idVinc && notaPorId.has(idVinc)) return notaPorId.get(idVinc)!;
      const num = numeroDaNota(l.nota);
      if (!num || ehSemNota(l.nota)) return null;
      const mesmas = notasPainel.filter((n) => numeroDaNota(n.numeroNota) === num);
      if (mesmas.length === 0) return null;
      const nomeL = (l.cliente || "").trim().toUpperCase().slice(0, 4);
      return mesmas.find((n) => n.cliente.toUpperCase().startsWith(nomeL)) || mesmas[0];
    };

    type Item = { linha: LinhaHistorico; grupo: number; bloco: number; numero: number; ano: number; mes: number; extra: string };
    const itens: Item[] = [];

    for (const l of financeiro) {
      const n = notaDoLancamento(l);
      if (n) notasAbsorvidas.add(n.id);
      const numero = n ? numeroDaNota(n.numeroNota) : numeroDaNota(l.nota);
      const grupo = ehSemNota(l.nota) && !n ? 2 : numero ? 1 : 0;
      itens.push({
        linha: { tipo: "lanc", chave: `hist-${l.id}`, l },
        grupo,
        bloco: n ? blocoDaNota(n.padraoNota) : 1,
        numero,
        ano: Number(l.anoReferencia || 0),
        mes: Number(l.mesReferencia || 0),
        extra: l.dataEmissao || "",
      });
    }

    for (const n of notasPainel) {
      if (n.ligadaALancamento || notasAbsorvidas.has(n.id)) continue;
      itens.push({
        linha: { tipo: "nota", chave: `hist-nota-${n.id}`, n },
        grupo: 1,
        bloco: blocoDaNota(n.padraoNota),
        numero: numeroDaNota(n.numeroNota),
        ano: Number(n.anoReferencia || 0),
        mes: Number(n.mesReferencia || 0),
        extra: "",
      });
    }

    itens.sort((a, b) =>
      a.grupo - b.grupo ||
      b.bloco - a.bloco ||
      b.numero - a.numero ||
      b.ano - a.ano ||
      b.mes - a.mes ||
      b.extra.localeCompare(a.extra)
    );
    return itens.map((i) => i.linha);
  }, [financeiro, notasPainel, vinculosFinanceiro]);

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
Código de Tributação Nacional: ${form.codigoServico}
Código NBS: ${CODIGO_NBS}
Valor: ${brl(form.valor)}
DESCRIÇÃO DO SERVIÇO:
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
    window.open(URL_EMISSOR_NACIONAL, "_blank");
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
      // Relatório feito no ERP só tem os dados (sem PDF) e também pode ser vinculado.
      const temConteudo = (c: any) => c.temArquivo || (tipo === "relatorio" && c.temDados);
      candidatos = candidatos.filter(temConteudo);
      if (candidatos.length === 0) {
        // Sem sugestão automática (cliente/valor não bateram) - mostra a lista completa,
        // o backend recusa com mensagem clara se o item escolhido já estiver vinculado.
        const resTudo = await fetch(tipo === "nota" ? `${API_BASE}/notas-fiscais` : `${API_BASE}/historico-pdfs`);
        const dataTudo = await resTudo.json();
        candidatos = (tipo === "nota" ? dataTudo.notas || [] : dataTudo.historico || []).filter(temConteudo);
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

  // Tira só a nota ou só o relatório do lançamento (vinculou errado) - não apaga nada:
  // o PDF continua no sistema e volta a aparecer pra ser vinculado de novo.
  async function desvincular(lancId: string, tipo: "nota" | "relatorio") {
    const vinculoId = vinculosFinanceiro[lancId]?.vinculoId;
    if (!vinculoId) return;
    const oque = tipo === "nota" ? "a nota fiscal" : "o relatório";
    if (!confirm(`Desvincular ${oque} deste lançamento?\n\nNada é apagado: ${oque} continua no sistema e pode ser vinculado de novo.`)) return;
    setVinculando(true);
    setErro("");
    try {
      const res = await fetch(`${API_BASE}/vinculos/${vinculoId}/lado/${tipo}`, { method: "DELETE" });
      const data = await res.json();
      if (data.status !== "ok") {
        setErro(data.erro || data.detail || "Não foi possível desvincular.");
        return;
      }
      await carregar();
    } catch (err) {
      setErro(`Erro ao desvincular: ${err}`);
    } finally {
      setVinculando(false);
    }
  }

  // Relatório feito no próprio ERP não tem PDF guardado, só os dados (o PDF sai pela
  // impressão). Pra "ver", reabre ele na aba Relatórios - mesmo caminho do
  // "Reabrir/Reimprimir" do Histórico de PDFs (chave lida pelo Relatorios.tsx).
  async function reabrirRelatorio(id: string) {
    setErro("");
    try {
      const res = await fetch(`${API_BASE}/historico-pdfs/${id}`);
      const data = await res.json();
      if (data.status !== "ok" || !data.item?.dados) {
        setErro("Não consegui carregar os dados deste relatório.");
        return;
      }
      localStorage.setItem("ytalseg_reabrir_relatorio_pendente", JSON.stringify(data.item.dados));
      if (onAbrirRelatorio) onAbrirRelatorio();
      else setErro("Relatório carregado. Abra a aba Relatórios para ver.");
    } catch (err) {
      setErro(`Erro ao abrir o relatório: ${err}`);
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
        .abas-nf { display:flex; flex-wrap:wrap; gap:8px; margin:0 0 16px; }
        .aba-nf { border:1px solid #d1d5db; background:#fff; color:#111827; font-weight:900; padding:10px 16px; border-radius:12px; cursor:pointer; font-size:14px; }
        .aba-nf.ativa { background:${VERDE}; border-color:${VERDE}; color:#fff; box-shadow:0 8px 18px rgba(0,176,80,.22); }
        @media(max-width:600px){ .aba-nf { flex:1 1 45%; padding:10px 8px; } }
        @media(max-width:1000px){ .grid,.rows{grid-template-columns:1fr;} }
        @media(max-width:600px){ .modal-linha{grid-template-columns:1fr;} }
      `}</style>

      <div className="head">
        <div>
          <h1>Nota Fiscal — Emissor Nacional</h1>
          <p>Prepare, consulte e guarde as notas fiscais. Use os botões abaixo para trocar de parte.</p>
        </div>
        <button className="btn-primary" onClick={abrirPortal}>Abrir Emissor Nacional (nfse.gov.br)</button>
      </div>

      {erro && <div className="box" style={{color:"#b91c1c",fontWeight:900}}>{erro}</div>}

      <div className="abas-nf">
        {([
          ["historico", "Histórico de notas"],
          ["lancamentos", "Lançamentos / Dados"],
          ["emitidas", "Notas Fiscais Emitidas"],
          ["previa", "Prévia do pacote"],
        ] as const).map(([id, rotulo]) => (
          <button key={id} className={`aba-nf${aba === id ? " ativa" : ""}`} onClick={() => setAba(id)}>
            {rotulo}
          </button>
        ))}
      </div>

      <div className="grid" style={{ display: aba === "lancamentos" ? undefined : "none" }}>
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
            <label>Código de tributação nacional (NBS {CODIGO_NBS})</label>
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
            <input value={form.numeroNota} onChange={(e) => atualizar("numeroNota", e.target.value)} placeholder="Ex: 1" />
          </div>

          <div className="actions">
            <button className="btn-primary" onClick={marcarEmitida}>Marcar nota como emitida</button>
          </div>

          {form.statusNota === "emitida" && <div className="status">Nota emitida registrada</div>}
        </div>
      </div>

      <div className="box" style={{ display: aba === "historico" ? undefined : "none" }}>
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
            {linhasHistorico.length === 0 && (
              <tr><td colSpan={6}>Nenhuma nota ou lançamento encontrado.</td></tr>
            )}
            {linhasHistorico.map((linha) => {
              if (linha.tipo === "nota") {
                const n = linha.n;
                const ref = n.mesReferencia && n.anoReferencia ? `${NOMES_MESES_HIST[n.mesReferencia] || ""} / ${n.anoReferencia}` : "-";
                return (
                  <tr key={linha.chave} style={n.cancelada ? { opacity: 0.6 } : undefined}>
                    <td>{n.cliente}</td>
                    <td>{ref}</td>
                    <td>{n.cancelada ? <s>{brl(n.valor)}</s> : brl(n.valor)}</td>
                    <td>{n.numeroNota || "-"}</td>
                    <td>{n.cancelada ? "Nota cancelada" : "Nota sem lançamento"}</td>
                    <td>
                      <div className="actions">
                        {n.temArquivo && (
                          <button className="btn-gray" onClick={() => verArquivo("nota", n.id)} disabled={carregandoArquivo === `nota-${n.id}`}>
                            {carregandoArquivo === `nota-${n.id}` ? "Abrindo..." : "Ver nota"}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              }
              const l = linha.l;
              const nota = notaVinculada(l.id);
              const historico = historicoVinculado(l.id);
              const temDocumento = !!(nota?.temArquivo || historico?.temArquivo);
              return (
                <tr key={linha.chave}>
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
                      {historico && !historico.temArquivo && historico.temDados && (
                        <button className="btn-gray" onClick={() => reabrirRelatorio(historico.id)} title="Abre o relatório na aba Relatórios (de lá dá pra ver e imprimir)">
                          Ver relatório
                        </button>
                      )}
                      {vinculosFinanceiro[l.id]?.vinculoId && vinculosFinanceiro[l.id]?.notaId && (
                        <button className="btn-gray" disabled={vinculando} onClick={() => desvincular(l.id, "nota")} title="Tira a nota deste lançamento sem apagar nada">
                          Desvincular nota
                        </button>
                      )}
                      {vinculosFinanceiro[l.id]?.vinculoId && vinculosFinanceiro[l.id]?.historicoPdfId && (
                        <button className="btn-gray" disabled={vinculando} onClick={() => desvincular(l.id, "relatorio")} title="Tira o relatório deste lançamento sem apagar nada">
                          Desvincular relatório
                        </button>
                      )}
                      {!nota && (
                        <button className="btn-gray" onClick={() => abrirVincular(l.id, "nota")}>
                          {pickerVinculo?.lancId === l.id && pickerVinculo.tipo === "nota" ? "Fechar" : "Vincular nota"}
                        </button>
                      )}
                      {!historico && (
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

      <div style={{ display: aba === "emitidas" ? undefined : "none" }}>
        <NotasFiscaisEmitidas refrescarTick={tick} onMudou={carregar} />
      </div>

      <div className="box" style={{ display: aba === "previa" ? undefined : "none" }}>
        <h2>Prévia do pacote para o portal</h2>
        <div className="preview">
{`TOMADOR:
Razão Social: ${form.cliente || "-"}
CNPJ: ${form.cnpj || "-"}
E-mail: ${form.email || "-"}
Endereço: ${form.endereco || "-"}
Município/UF: ${form.municipio || "-"} - ${form.uf || "-"}

SERVIÇO:
Código de Tributação Nacional: ${form.codigoServico}
Código NBS: ${CODIGO_NBS}
Valor: ${brl(form.valor)}
DESCRIÇÃO DO SERVIÇO:
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
