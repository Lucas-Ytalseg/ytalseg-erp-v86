import React, { useEffect, useMemo, useState } from "react";

const API_BASE = "/api";

const VERDE = "#00B050";

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
  status: "pendente" | "recebido";
  dataEmissao: string;
  vencimento?: string;
  nota?: string;
};

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

  async function carregar() {
    try {
      setErro("");
      const [resClientes, resFin] = await Promise.all([
        fetch(`${API_BASE}/empresas`),
        fetch(`${API_BASE}/financeiro`).catch(() => null),
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
    } catch {
      setErro("Não consegui carregar clientes/financeiro. Confira o backend.");
    }
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

  function visualizarLancamento(lanc: Lancamento) {
    setSelecionado(lanc.id);
    aplicarLancamento(lanc.id);
  }

  function abrirPortal() {
    window.open("https://nfe.prefeitura.sp.gov.br/", "_blank");
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
        @media(max-width:1000px){ .grid,.rows{grid-template-columns:1fr;} }
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
            {financeiro.map((l) => (
              <tr key={`hist-${l.id}`}>
                <td>{l.cliente}</td>
                <td>{l.referencia || "-"}</td>
                <td>{brl(l.valor)}</td>
                <td>{l.nota || "Pendente"}</td>
                <td>{l.status}</td>
                <td>
                  <div className="actions">
                    <button className="btn-gray" onClick={() => visualizarLancamento(l)}>Visualizar</button>
                    <button className="btn-gray" onClick={() => copiarTexto(`Cliente: ${l.cliente}\nReferência: ${l.referencia}\nValor: ${brl(l.valor)}\nNota: ${l.nota || "Pendente"}`, "Dados da nota")}>Copiar</button>
                    <button className="btn-gray" onClick={() => excluirLancamento(l.id)}>Excluir</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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
    </div>
  );
}
