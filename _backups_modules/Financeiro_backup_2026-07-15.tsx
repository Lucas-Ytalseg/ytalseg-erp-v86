import React, { useEffect, useMemo, useState } from "react";

const API_BASE = "/api";
const VERDE = "#00B050";

type Lancamento = {
  id: string;
  cliente: string;
  referencia: string;
  descricao: string;
  valor: number;
  status: string;
  dataEmissao: string;
  dataRecebimento: string;
  vencimento: string;
  dataPromessaPagamento: string;
  notaEnviada: boolean;
  dataEnvioNota: string;
  observacao: string;
  nota: string;
  mesReferencia: number | null;
  anoReferencia: number | null;
};

const NOMES_MESES = ["", "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

const STATUS_LISTA = [
  { valor: "pendente", label: "Pendente", cor: "#6b7280", fundo: "#f3f4f6" },
  { valor: "nota_enviada", label: "Nota enviada", cor: "#1d4ed8", fundo: "#eff6ff" },
  { valor: "cobrado", label: "Cobrado", cor: "#b45309", fundo: "#fef3c7" },
  { valor: "prometeu_pagar", label: "Prometeu pagar", cor: "#6d28d9", fundo: "#f3e8ff" },
  { valor: "negociacao", label: "Em negociação", cor: "#0e7490", fundo: "#ecfeff" },
  { valor: "aprovado", label: "Aprovado", cor: "#047857", fundo: "#ecfdf5" },
  { valor: "recebido", label: "Recebido", cor: "#15803d", fundo: "#dcfce7" },
];

function statusInfo(valor: string) {
  return STATUS_LISTA.find((s) => s.valor === valor) || STATUS_LISTA[0];
}

function brl(v: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(v || 0));
}

function hoje() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function curta(iso?: string) {
  if (!iso) return "-";
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function estaVencido(l: Lancamento) {
  return !!l.vencimento && l.vencimento < hoje() && l.status !== "recebido";
}

// A data de envio é a fonte da verdade: se foi preenchida, a nota foi enviada,
// mesmo que a caixinha "Nota fiscal enviada?" não tenha sido marcada.
function notaFoiEnviada(l: Lancamento) {
  return !!l.notaEnviada || !!l.dataEnvioNota;
}

const vazio: Lancamento = {
  id: "", cliente: "", referencia: "", descricao: "", valor: 0,
  status: "pendente", dataEmissao: "", dataRecebimento: "",
  vencimento: "", dataPromessaPagamento: "", notaEnviada: false, dataEnvioNota: "",
  observacao: "", nota: "", mesReferencia: null, anoReferencia: null,
};

export default function Financeiro() {
  const agora = new Date();
  const [lista, setLista] = useState<Lancamento[]>([]);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  const [mesSelecionado, setMesSelecionado] = useState(agora.getMonth() + 1);
  const [anoSelecionado, setAnoSelecionado] = useState(agora.getFullYear());
  const todosOsMeses = mesSelecionado === 0;

  const [busca, setBusca] = useState("");
  const [statusFiltro, setStatusFiltro] = useState("Todos");

  const [editandoId, setEditandoId] = useState("");
  const [rascunho, setRascunho] = useState<Lancamento | null>(null);

  const [mostrarNovo, setMostrarNovo] = useState(false);
  const [novo, setNovo] = useState<Lancamento>({ ...vazio, mesReferencia: agora.getMonth() + 1, anoReferencia: agora.getFullYear() });

  const [exportando, setExportando] = useState<{ titulo: string; texto: string } | null>(null);
  const [clienteExportar, setClienteExportar] = useState("");

  const [exportMes, setExportMes] = useState(agora.getMonth() + 1);
  const [exportAno, setExportAno] = useState(agora.getFullYear());
  const [resumoPeriodo, setResumoPeriodo] = useState<"mes" | "todos">("mes");
  const [csvPeriodo, setCsvPeriodo] = useState<"mes" | "ano" | "todos">("mes");

  useEffect(() => {
    if (mesSelecionado !== 0) {
      setExportMes(mesSelecionado);
      setExportAno(anoSelecionado);
    }
  }, [mesSelecionado, anoSelecionado]);

  useEffect(() => {
    if (todosOsMeses) {
      setResumoPeriodo("todos");
      setCsvPeriodo("todos");
    } else {
      setResumoPeriodo("mes");
      setCsvPeriodo("mes");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [todosOsMeses]);

  async function carregar() {
    setCarregando(true);
    try {
      const res = await fetch(`${API_BASE}/financeiro`);
      const data = await res.json();
      if (data.status === "ok") {
        setLista(data.lancamentos || []);
        setErro("");
      } else {
        setErro("Erro ao carregar lançamentos.");
      }
    } catch {
      setErro("Erro ao conectar com o servidor.");
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => { carregar(); }, []);

  const clientesConhecidos = useMemo(() => {
    const nomes = new Set(lista.map((l) => l.cliente).filter(Boolean));
    return Array.from(nomes).sort((a, b) => a.localeCompare(b, "pt-BR"));
  }, [lista]);

  const itensDoMes = useMemo(() => {
    if (todosOsMeses) return lista;
    return lista.filter((l) => Number(l.mesReferencia) === mesSelecionado && Number(l.anoReferencia) === anoSelecionado);
  }, [lista, todosOsMeses, mesSelecionado, anoSelecionado]);

  const itensAnteriores = useMemo(() => {
    if (todosOsMeses) return [];
    return lista.filter((l) => {
      if (l.status === "recebido") return false;
      const ano = Number(l.anoReferencia) || 0;
      const mes = Number(l.mesReferencia) || 0;
      return ano < anoSelecionado || (ano === anoSelecionado && mes < mesSelecionado);
    });
  }, [lista, todosOsMeses, mesSelecionado, anoSelecionado]);

  function aplicarFiltros(itens: Lancamento[]) {
    const buscaMin = busca.trim().toLowerCase();
    return itens.filter((l) => {
      const okBusca = !buscaMin || l.cliente.toLowerCase().includes(buscaMin);
      const okStatus = statusFiltro === "Todos" || l.status === statusFiltro;
      return okBusca && okStatus;
    });
  }

  const itensDoMesFiltrados = useMemo(() => aplicarFiltros(itensDoMes), [itensDoMes, busca, statusFiltro]);
  const itensAnterioresFiltrados = useMemo(() => aplicarFiltros(itensAnteriores), [itensAnteriores, busca, statusFiltro]);

  const totaisMes = useMemo(() => {
    const base = todosOsMeses ? itensDoMesFiltrados : itensDoMes;
    const total = base.reduce((a, x) => a + Number(x.valor || 0), 0);
    const recebido = base.filter((x) => x.status === "recebido").reduce((a, x) => a + Number(x.valor || 0), 0);
    const pendente = total - recebido;
    return { total, recebido, pendente };
  }, [todosOsMeses, itensDoMes, itensDoMesFiltrados]);

  const totalAnteriores = useMemo(
    () => itensAnteriores.reduce((a, x) => a + Number(x.valor || 0), 0),
    [itensAnteriores]
  );

  const gruposTodos = useMemo(() => {
    if (!todosOsMeses) return [];
    const ordenado = [...itensDoMesFiltrados].sort((a, b) => {
      const anoA = Number(a.anoReferencia) || 0;
      const anoB = Number(b.anoReferencia) || 0;
      if (anoB !== anoA) return anoB - anoA;
      const mesA = Number(a.mesReferencia) || 0;
      const mesB = Number(b.mesReferencia) || 0;
      if (mesB !== mesA) return mesB - mesA;
      return (b.vencimento || "").localeCompare(a.vencimento || "");
    });
    const grupos: { chave: string; titulo: string; itens: Lancamento[] }[] = [];
    const indice = new Map<string, number>();
    ordenado.forEach((l) => {
      const ano = Number(l.anoReferencia) || 0;
      const mes = Number(l.mesReferencia) || 0;
      const chave = `${ano}-${mes}`;
      const titulo = mes ? `${NOMES_MESES[mes]}/${ano}` : "Sem mês definido";
      if (!indice.has(chave)) {
        indice.set(chave, grupos.length);
        grupos.push({ chave, titulo, itens: [] });
      }
      grupos[indice.get(chave)!].itens.push(l);
    });
    return grupos;
  }, [todosOsMeses, itensDoMesFiltrados]);

  async function salvar(l: Lancamento) {
    const res = await fetch(`${API_BASE}/financeiro`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(l),
    });
    const data = await res.json();
    if (data.status !== "ok") {
      setErro("Erro ao salvar lançamento.");
      return;
    }
    await carregar();
  }

  function abrirEdicao(l: Lancamento) {
    setEditandoId(l.id);
    setRascunho({ ...l });
  }

  function fecharEdicao() {
    setEditandoId("");
    setRascunho(null);
  }

  async function salvarEdicao() {
    if (!rascunho) return;
    if (rascunho.status === "recebido" && !rascunho.dataRecebimento) {
      rascunho.dataRecebimento = hoje();
    }
    await salvar(rascunho);
    fecharEdicao();
  }

  async function marcarRecebidoRapido(l: Lancamento) {
    const data = window.prompt("Data de recebimento (AAAA-MM-DD):", hoje());
    if (data === null) return;
    await salvar({ ...l, status: "recebido", dataRecebimento: data || hoje() });
  }

  async function excluir(l: Lancamento) {
    if (!confirm(`Excluir o lançamento de "${l.cliente}" (${l.referencia})?`)) return;
    await fetch(`${API_BASE}/financeiro/${l.id}`, { method: "DELETE" });
    await carregar();
  }

  async function criarLancamento() {
    if (!novo.cliente.trim()) {
      alert("Informe o cliente/empresa.");
      return;
    }
    const referencia = `${NOMES_MESES[novo.mesReferencia || mesSelecionado]} / ${novo.anoReferencia || anoSelecionado}`;
    await salvar({
      ...novo,
      referencia,
      dataEmissao: hoje(),
    });
    setNovo({ ...vazio, mesReferencia: mesSelecionado, anoReferencia: anoSelecionado });
    setMostrarNovo(false);
  }

  function linhaResumo(l: Lancamento, comReferencia: boolean) {
    const info = statusInfo(l.status);
    const prefixo = comReferencia ? l.referencia : l.cliente;
    let statusTexto = info.label;
    if (l.status === "recebido") statusTexto = `Recebido em ${curta(l.dataRecebimento)}`;
    else if (l.status === "nota_enviada" && l.dataEnvioNota) statusTexto = `${info.label} (enviada ${curta(l.dataEnvioNota)})`;
    else if (l.status === "prometeu_pagar" && l.dataPromessaPagamento) statusTexto = `${info.label} (${curta(l.dataPromessaPagamento)})`;
    return `• ${prefixo} — ${brl(l.valor)} — Venc. ${curta(l.vencimento)} — Status: ${statusTexto}`;
  }

  function refCurta(l: Lancamento) {
    if (!l.mesReferencia) return "";
    return `${NOMES_MESES[l.mesReferencia].slice(0, 3)}/${String(l.anoReferencia).slice(2)}`;
  }

  function linhaRecebido(l: Lancamento, comRef: boolean) {
    const nf = l.nota ? ` (NF ${l.nota})` : "";
    const ref = comRef ? ` — Ref. ${refCurta(l)}` : "";
    return `• ${l.cliente} — ${brl(l.valor)}${ref} — Recebido em ${curta(l.dataRecebimento)}${nf}`;
  }

  function linhaNoPrazo(l: Lancamento, comRef: boolean) {
    const nf = l.nota ? ` (NF ${l.nota})` : "";
    const ref = comRef ? ` — Ref. ${refCurta(l)}` : "";
    return `• ${l.cliente} — ${brl(l.valor)}${ref} — Venc. ${curta(l.vencimento)} — Nota enviada em ${curta(l.dataEnvioNota)}${nf}`;
  }

  function linhaPendenteEnvio(l: Lancamento, comRef: boolean) {
    const ref = comRef ? ` — Ref. ${refCurta(l)}` : "";
    return `• ${l.cliente} — ${brl(l.valor)}${ref} — Venc. ${curta(l.vencimento)}`;
  }

  function linhaVencido(l: Lancamento, comRef: boolean) {
    const info = statusInfo(l.status);
    const promessa = l.dataPromessaPagamento ? ` (${curta(l.dataPromessaPagamento)})` : "";
    const ref = comRef ? ` — Ref. ${refCurta(l)}` : "";
    return `• ${l.cliente} — ${brl(l.valor)}${ref} — Venceu em ${curta(l.vencimento)} — Status: ${info.label}${promessa}`;
  }

  function exportarResumo() {
    const todos = resumoPeriodo === "todos";
    const itens = todos
      ? lista
      : lista.filter((l) => Number(l.mesReferencia) === exportMes && Number(l.anoReferencia) === exportAno);
    const h = hoje();

    const recebidos: Lancamento[] = [];
    const noPrazo: Lancamento[] = [];
    const pendentesEnvio: Lancamento[] = [];
    const vencidos: Lancamento[] = [];

    itens.forEach((l) => {
      if (l.status === "recebido") recebidos.push(l);
      else if (l.vencimento && l.vencimento < h) vencidos.push(l);
      else if (notaFoiEnviada(l)) noPrazo.push(l);
      else pendentesEnvio.push(l);
    });

    const secoes: string[] = [];
    if (recebidos.length) secoes.push(`✅ *RECEBIDOS*\n${recebidos.map((l) => linhaRecebido(l, todos)).join("\n")}`);
    if (noPrazo.length) secoes.push(`⏳ *NO PRAZO (A RECEBER)*\n${noPrazo.map((l) => linhaNoPrazo(l, todos)).join("\n")}`);
    if (pendentesEnvio.length) secoes.push(`📤 *PENDENTES DE ENVIO DE NOTA*\n${pendentesEnvio.map((l) => linhaPendenteEnvio(l, todos)).join("\n")}`);
    if (vencidos.length) secoes.push(`🔴 *VENCIDOS*\n${vencidos.map((l) => linhaVencido(l, todos)).join("\n")}`);

    const gerado = itens.reduce((a, x) => a + Number(x.valor || 0), 0);
    const recebido = recebidos.reduce((a, x) => a + Number(x.valor || 0), 0);
    const aberto = gerado - recebido;

    const corpo = secoes.length ? secoes.join("\n\n") : "Nenhum lançamento encontrado.";
    const titulo = todos ? "Todos os meses" : `${NOMES_MESES[exportMes]}/${exportAno}`;
    const texto = `*YTALSEG — Cobranças ${titulo}*\n\n${corpo}\n\n*TOTAIS${todos ? "" : " DO MÊS"}*\nGerado: ${brl(gerado)} | Recebido: ${brl(recebido)} | Em aberto: ${brl(aberto)}`;
    setExportando({ titulo: `Resumo — ${titulo}`, texto });
  }

  function paraNumeroBR(v: number) {
    return Number(v || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function dataCompleta(iso?: string) {
    if (!iso) return "";
    const d = new Date(`${iso}T00:00:00`);
    if (Number.isNaN(d.getTime())) return iso;
    return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
  }

  function csvCampo(v: any) {
    const s = String(v ?? "");
    return `"${s.replace(/"/g, '""')}"`;
  }

  function exportarCSV() {
    const itens = csvPeriodo === "mes"
      ? lista.filter((l) => Number(l.mesReferencia) === exportMes && Number(l.anoReferencia) === exportAno)
      : csvPeriodo === "ano"
      ? lista.filter((l) => Number(l.anoReferencia) === exportAno)
      : lista;

    if (itens.length === 0) {
      alert("Nenhum lançamento encontrado para esse período.");
      return;
    }

    const cabecalho = ["Cliente", "Mês de referência", "Valor", "Nº NF", "Data envio nota", "Vencimento", "Data prometida", "Data recebimento", "Status", "Observações"];
    const linhas = itens.map((l) => [
      l.cliente,
      l.mesReferencia ? `${NOMES_MESES[l.mesReferencia]}/${l.anoReferencia}` : "",
      paraNumeroBR(l.valor),
      l.nota || "",
      dataCompleta(l.dataEnvioNota),
      dataCompleta(l.vencimento),
      dataCompleta(l.dataPromessaPagamento),
      dataCompleta(l.dataRecebimento),
      statusInfo(l.status).label,
      l.observacao || "",
    ].map(csvCampo).join(";"));

    const conteudo = "﻿" + [cabecalho.map(csvCampo).join(";"), ...linhas].join("\r\n");
    const blob = new Blob([conteudo], { type: "text/csv;charset=utf-8;" });
    const nomeArquivo = csvPeriodo === "mes"
      ? `financeiro_${NOMES_MESES[exportMes].toLowerCase()}_${exportAno}.csv`
      : csvPeriodo === "ano"
      ? `financeiro_${exportAno}.csv`
      : `financeiro_todos_os_meses.csv`;

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = nomeArquivo;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function exportarCliente() {
    if (!clienteExportar) {
      alert("Selecione um cliente para exportar.");
      return;
    }
    const itens = lista.filter((l) => l.cliente === clienteExportar);
    const linhas = itens.map((l) => linhaResumo(l, true));
    const total = itens.reduce((a, x) => a + Number(x.valor || 0), 0);
    const recebido = itens.filter((x) => x.status === "recebido").reduce((a, x) => a + Number(x.valor || 0), 0);
    const aberto = total - recebido;
    const texto = `*YTALSEG — Cobranças ${clienteExportar}*\n\n${linhas.join("\n") || "Nenhum lançamento encontrado."}\n\nTotal: ${brl(total)} | Recebido: ${brl(recebido)} | Em aberto: ${brl(aberto)}`;
    setExportando({ titulo: `Resumo de ${clienteExportar}`, texto });
  }

  async function copiarExportado() {
    if (!exportando) return;
    await navigator.clipboard.writeText(exportando.texto);
    alert("Texto copiado! Já pode colar no WhatsApp.");
  }

  function linhaEditavel(l: Lancamento) {
    if (!rascunho) return null;
    return (
      <tr className="linha-edicao">
        <td colSpan={9}>
          <div className="form-edicao">
            <div className="campo">
              <label>Cliente</label>
              <input value={rascunho.cliente} onChange={(e) => setRascunho({ ...rascunho, cliente: e.target.value })} />
            </div>
            <div className="campo">
              <label>Valor</label>
              <input type="number" value={rascunho.valor} onChange={(e) => setRascunho({ ...rascunho, valor: Number(e.target.value || 0) })} />
            </div>
            <div className="campo">
              <label>Vencimento</label>
              <input type="date" value={rascunho.vencimento} onChange={(e) => setRascunho({ ...rascunho, vencimento: e.target.value })} />
            </div>
            <div className="campo">
              <label>Status</label>
              <select value={rascunho.status} onChange={(e) => setRascunho({ ...rascunho, status: e.target.value })}>
                {STATUS_LISTA.map((s) => <option key={s.valor} value={s.valor}>{s.label}</option>)}
              </select>
            </div>
            <div className="campo">
              <label>Promessa de pagamento</label>
              <input type="date" value={rascunho.dataPromessaPagamento} onChange={(e) => setRascunho({ ...rascunho, dataPromessaPagamento: e.target.value })} />
            </div>
            <div className="campo campo-check">
              <label>Nota fiscal enviada?</label>
              <input type="checkbox" checked={rascunho.notaEnviada} onChange={(e) => setRascunho({ ...rascunho, notaEnviada: e.target.checked })} />
            </div>
            <div className="campo">
              <label>Data de envio da nota</label>
              <input type="date" value={rascunho.dataEnvioNota} onChange={(e) => setRascunho({ ...rascunho, dataEnvioNota: e.target.value, notaEnviada: !!e.target.value })} />
            </div>
            <div className="campo">
              <label>Número da nota fiscal</label>
              <input value={rascunho.nota} onChange={(e) => setRascunho({ ...rascunho, nota: e.target.value })} />
            </div>
            <div className="campo">
              <label>Data de recebimento</label>
              <input type="date" value={rascunho.dataRecebimento} onChange={(e) => setRascunho({ ...rascunho, dataRecebimento: e.target.value })} />
            </div>
            <div className="campo campo-obs">
              <label>Observações</label>
              <textarea value={rascunho.observacao} onChange={(e) => setRascunho({ ...rascunho, observacao: e.target.value })} />
            </div>
          </div>
          <div className="actions" style={{ marginTop: 10 }}>
            <button className="btn btn-green" onClick={salvarEdicao}>Salvar</button>
            <button className="btn" onClick={fecharEdicao}>Cancelar</button>
          </div>
        </td>
      </tr>
    );
  }

  function tabela(itens: Lancamento[]) {
    return (
      <table>
        <thead>
          <tr>
            <th>Cliente</th>
            <th>Referência</th>
            <th>Valor</th>
            <th>Vencimento</th>
            <th>Nº NF</th>
            <th>Nota enviada</th>
            <th>Recebimento</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {itens.map((l) => {
            const info = statusInfo(l.status);
            const atrasado = estaVencido(l);
            return (
              <React.Fragment key={l.id}>
                <tr className={atrasado ? "linha-vencida" : ""}>
                  <td data-label="Cliente">
                    <div style={{ fontWeight: 900 }}>{l.cliente}</div>
                    {l.observacao && <div className="obs-resumo">{l.observacao}</div>}
                  </td>
                  <td data-label="Referência">{l.referencia || "-"}</td>
                  <td data-label="Valor">{brl(l.valor)}</td>
                  <td data-label="Vencimento" className={atrasado ? "texto-vencido" : ""}>
                    {curta(l.vencimento)}{atrasado ? " (vencido)" : ""}
                  </td>
                  <td data-label="Nº NF">{l.nota || "—"}</td>
                  <td data-label="Nota enviada">{l.dataEnvioNota ? curta(l.dataEnvioNota) : (l.notaEnviada ? "Sim" : "—")}</td>
                  <td data-label="Recebimento">{l.dataRecebimento ? curta(l.dataRecebimento) : "—"}</td>
                  <td data-label="Status">
                    <span className="pill" style={{ color: info.cor, background: info.fundo }}>{info.label}</span>
                  </td>
                  <td data-label="Ações">
                    <div className="actions">
                      <button className="btn" onClick={() => abrirEdicao(l)}>Editar</button>
                      {l.status !== "recebido" && (
                        <button className="btn btn-green" onClick={() => marcarRecebidoRapido(l)}>Receber</button>
                      )}
                      <button className="btn btn-red" onClick={() => excluir(l)}>Excluir</button>
                    </div>
                  </td>
                </tr>
                {editandoId === l.id && linhaEditavel(l)}
              </React.Fragment>
            );
          })}
          {itens.length === 0 && (
            <tr><td colSpan={9} className="vazio">Nenhum lançamento encontrado.</td></tr>
          )}
        </tbody>
      </table>
    );
  }

  function tabelaAgrupada(grupos: { chave: string; titulo: string; itens: Lancamento[] }[]) {
    if (grupos.length === 0) {
      return <div className="vazio" style={{ padding: "12px 0" }}>Nenhum lançamento encontrado.</div>;
    }
    return (
      <div style={{ display: "grid", gap: 18 }}>
        {grupos.map((g) => (
          <div key={g.chave}>
            <h3 className="grupo-mes-titulo">{g.titulo}</h3>
            {tabela(g.itens)}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="page">
      <style>{`
        .page{display:grid;gap:18px}
        .head{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px}
        .head h1{margin:0;font-size:30px;font-weight:1000}
        .filtros{display:flex;gap:8px;flex-wrap:wrap;align-items:center}
        .cards{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}
        .card,.box{background:#fff;border:1px solid #e5e7eb;border-radius:22px;padding:18px}
        .card span{display:block;font-size:12px;color:#6b7280;font-weight:1000}
        .card strong{display:block;margin-top:8px;font-size:26px;color:${VERDE};font-weight:1000}
        .box{overflow-x:auto}
        table{width:100%;border-collapse:collapse;font-size:13px}
        th{background:#f9fafb;text-align:left;padding:10px;border-bottom:1px solid #e5e7eb;white-space:nowrap}
        td{padding:10px;border-bottom:1px solid #edf0f2;vertical-align:top}
        .btn{border:0;padding:8px 10px;border-radius:10px;cursor:pointer;font-weight:900;background:#e5e7eb}
        .btn-green{background:${VERDE};color:#fff}
        .btn-red{background:#fee2e2;color:#991b1b}
        .actions{display:flex;gap:6px;flex-wrap:wrap}
        .pill{padding:5px 10px;border-radius:999px;font-size:11px;font-weight:1000;white-space:nowrap}
        input,select,textarea{border:1px solid #d1d5db;border-radius:8px;padding:7px;font-size:12px;font-family:inherit}
        select.hist-select,input.hist-input{padding:9px 11px}
        .linha-vencida{background:#fff1f1}
        .texto-vencido{color:#b91c1c;font-weight:1000}
        .obs-resumo{font-size:11px;color:#6b7280;margin-top:2px}
        .vazio{color:#6b7280;font-weight:800}
        .rotulo-exportar{font-size:12px;font-weight:900;color:#374151;display:flex;align-items:center;white-space:nowrap}
        .exportar-barra{padding:12px 14px}
        .exportar-linha{display:flex;align-items:center;gap:6px;flex-wrap:wrap}
        .separador-exportar{width:1px;align-self:stretch;background:#e5e7eb;margin:0 2px}
        .mini-select{padding:6px 8px;font-size:12px;max-width:170px}
        .mini-input{padding:6px 8px;font-size:12px;width:72px}
        .btn-sm{padding:6px 10px;font-size:12px}
        .grupo-mes-titulo{margin:0 0 8px;font-size:13px;font-weight:1000;color:#374151;background:#f3f4f6;padding:8px 12px;border-radius:10px}
        .form-edicao{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}
        .campo{display:flex;flex-direction:column;gap:4px}
        .campo label{font-size:11px;font-weight:1000;color:#374151}
        .campo-check{flex-direction:row;align-items:center;gap:8px}
        .campo-obs{grid-column:1 / -1}
        .campo-obs textarea{min-height:60px}
        .linha-edicao td{background:#f9fafb}
        .painel-novo{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;align-items:end}
        .exportar-overlay{position:fixed;inset:0;background:rgba(0,0,0,.35);display:flex;align-items:center;justify-content:center;z-index:50;padding:20px}
        .exportar-caixa{background:#fff;border-radius:18px;padding:20px;max-width:520px;width:100%;display:grid;gap:12px}
        .exportar-caixa pre{white-space:pre-wrap;font-family:inherit;font-size:13px;background:#f9fafb;border:1px solid #e5e7eb;border-radius:12px;padding:12px;max-height:340px;overflow:auto}

        @media(max-width:900px){
          .cards{grid-template-columns:1fr}
          .painel-novo{grid-template-columns:1fr 1fr}
          .form-edicao{grid-template-columns:1fr}
          .exportar-linha{gap:8px}
          .separador-exportar{display:none}
          .mini-select{flex:1 1 130px;max-width:none}
          .mini-input{flex:0 0 70px}
          .btn-sm{flex:0 0 auto}
          table thead{display:none}
          table, tbody, tr, td{display:block;width:100%}
          tr{border-bottom:8px solid #f3f4f6;padding:8px 0}
          td{border-bottom:none}
          td[data-label]::before{content:attr(data-label);display:block;font-size:11px;font-weight:1000;color:#9ca3af;margin-bottom:2px}
          .linha-edicao td{padding:10px}
        }
      `}</style>

      <div className="head">
        <h1>Financeiro — Agenda de Cobrança</h1>
        <div className="filtros">
          <select className="hist-select" value={mesSelecionado} onChange={(e) => setMesSelecionado(Number(e.target.value))}>
            <option value={0}>Todos os meses</option>
            {NOMES_MESES.slice(1).map((nome, i) => <option key={nome} value={i + 1}>{nome}</option>)}
          </select>
          {!todosOsMeses && (
            <input className="hist-input" type="number" style={{ width: 90 }} value={anoSelecionado} onChange={(e) => setAnoSelecionado(Number(e.target.value || agora.getFullYear()))} />
          )}
          <input className="hist-input" placeholder="Buscar cliente..." value={busca} onChange={(e) => setBusca(e.target.value)} />
          <select className="hist-select" value={statusFiltro} onChange={(e) => setStatusFiltro(e.target.value)}>
            <option>Todos</option>
            {STATUS_LISTA.map((s) => <option key={s.valor} value={s.valor}>{s.label}</option>)}
          </select>
          <button className="btn" onClick={carregar}>{carregando ? "Atualizando..." : "Atualizar"}</button>
          <button className="btn btn-green" onClick={() => setMostrarNovo((v) => !v)}>+ Novo lançamento</button>
        </div>
      </div>

      {erro && <div className="box" style={{ color: "#b91c1c", fontWeight: 900 }}>{erro}</div>}

      {mostrarNovo && (
        <div className="box">
          <h2 style={{ marginTop: 0 }}>Novo lançamento</h2>
          <div className="painel-novo">
            <div className="campo">
              <label>Cliente</label>
              <input value={novo.cliente} onChange={(e) => setNovo({ ...novo, cliente: e.target.value })} />
            </div>
            <div className="campo">
              <label>Mês de referência</label>
              <select value={novo.mesReferencia || mesSelecionado} onChange={(e) => setNovo({ ...novo, mesReferencia: Number(e.target.value) })}>
                {NOMES_MESES.slice(1).map((nome, i) => <option key={nome} value={i + 1}>{nome}</option>)}
              </select>
            </div>
            <div className="campo">
              <label>Ano de referência</label>
              <input type="number" value={novo.anoReferencia || anoSelecionado} onChange={(e) => setNovo({ ...novo, anoReferencia: Number(e.target.value) })} />
            </div>
            <div className="campo">
              <label>Valor</label>
              <input type="number" value={novo.valor} onChange={(e) => setNovo({ ...novo, valor: Number(e.target.value || 0) })} />
            </div>
            <div className="campo">
              <label>Vencimento</label>
              <input type="date" value={novo.vencimento} onChange={(e) => setNovo({ ...novo, vencimento: e.target.value })} />
            </div>
            <div className="campo campo-obs">
              <label>Observações</label>
              <input value={novo.observacao} onChange={(e) => setNovo({ ...novo, observacao: e.target.value })} />
            </div>
          </div>
          <div className="actions" style={{ marginTop: 12 }}>
            <button className="btn btn-green" onClick={criarLancamento}>Adicionar</button>
            <button className="btn" onClick={() => setMostrarNovo(false)}>Cancelar</button>
          </div>
        </div>
      )}

      <div className="cards">
        <div className="card">
          <span>{todosOsMeses ? "Total (todos os meses, filtro atual)" : `Total do mês (${NOMES_MESES[mesSelecionado]}/${anoSelecionado})`}</span>
          <strong>{brl(totaisMes.total)}</strong>
        </div>
        <div className="card"><span>Recebido{todosOsMeses ? " (filtro atual)" : " no mês"}</span><strong>{brl(totaisMes.recebido)}</strong></div>
        <div className="card"><span>Pendente/em aberto{todosOsMeses ? " (filtro atual)" : " no mês"}</span><strong>{brl(totaisMes.pendente)}</strong></div>
      </div>

      <div className="box exportar-barra">
        <div className="exportar-linha">
          <span className="rotulo-exportar">Mês/ano:</span>
          <select className="mini-select" value={exportMes} onChange={(e) => setExportMes(Number(e.target.value))}>
            {NOMES_MESES.slice(1).map((nome, i) => <option key={nome} value={i + 1}>{nome}</option>)}
          </select>
          <input className="mini-input" type="number" value={exportAno} onChange={(e) => setExportAno(Number(e.target.value || anoSelecionado))} />

          <span className="separador-exportar" />

          <select className="mini-select" value={resumoPeriodo} onChange={(e) => setResumoPeriodo(e.target.value as "mes" | "todos")}>
            <option value="mes">Resumo: mês acima</option>
            <option value="todos">Resumo: todos os meses</option>
          </select>
          <button className="btn btn-sm btn-green" onClick={exportarResumo}>Exportar resumo</button>

          <select className="mini-select" value={csvPeriodo} onChange={(e) => setCsvPeriodo(e.target.value as "mes" | "ano" | "todos")}>
            <option value="mes">CSV: mês acima</option>
            <option value="ano">CSV: ano {exportAno}</option>
            <option value="todos">CSV: todos os meses</option>
          </select>
          <button className="btn btn-sm" onClick={exportarCSV}>Exportar CSV</button>

          <select className="mini-select" value={clienteExportar} onChange={(e) => setClienteExportar(e.target.value)}>
            <option value="">Cliente...</option>
            {clientesConhecidos.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <button className="btn btn-sm" onClick={exportarCliente}>Exportar cliente</button>
        </div>
      </div>

      <div className="box">
        <div className="head" style={{ marginBottom: 10 }}>
          <h2 style={{ margin: 0 }}>
            {todosOsMeses ? "Todos os lançamentos" : `Lançamentos de ${NOMES_MESES[mesSelecionado]}/${anoSelecionado}`}
          </h2>
        </div>
        {todosOsMeses ? tabelaAgrupada(gruposTodos) : tabela(itensDoMesFiltrados)}
      </div>

      {!todosOsMeses && itensAnteriores.length > 0 && (
        <div className="box">
          <h2 style={{ marginTop: 0 }}>
            Acumulado de meses anteriores (em aberto) — Total: {brl(totalAnteriores)}
          </h2>
          {tabela(itensAnterioresFiltrados)}
        </div>
      )}

      {exportando && (
        <div className="exportar-overlay" onClick={() => setExportando(null)}>
          <div className="exportar-caixa" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ margin: 0 }}>{exportando.titulo}</h3>
            <pre>{exportando.texto}</pre>
            <div className="actions">
              <button className="btn btn-green" onClick={copiarExportado}>Copiar</button>
              <button className="btn" onClick={() => setExportando(null)}>Fechar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
