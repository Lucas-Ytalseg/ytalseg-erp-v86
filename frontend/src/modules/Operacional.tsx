import React, { useEffect, useMemo, useState } from "react";

const API_BASE = "/api";

const VERDE = "#00B050";

type Financeiro = {
  id: string;
  cliente: string;
  referencia: string;
  descricao: string;
  valor: number;
  status: "pendente" | "recebido";
  dataEmissao: string;
  dataRecebimento?: string;
  vencimento?: string;
  observacao?: string;
  nota?: string;
  promessaPagamento?: string;
};

type Operacao = {
  id: string;
  tipo: "aprovacao" | "nota" | "tarefa";
  cliente: string;
  referencia: string;
  valor: number;
  status: string;
  data: string;
  observacao: string;
};

function brl(v: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(v || 0));
}

function hoje() {
  return new Date().toISOString().slice(0, 10);
}

function diasDesde(data?: string) {
  if (!data) return 0;
  const h = new Date(hoje()).getTime();
  const d = new Date(data).getTime();
  return Math.max(0, Math.floor((h - d) / (1000 * 60 * 60 * 24)));
}

function msgAprovacao(item: Operacao) {
  return `Olá, tudo bem?\n\nPassando para verificar a aprovação do relatório ${item.referencia} no valor de ${brl(item.valor)}.\n\nFico no aguardo para sequência de emissão da nota.\n\nYTALSEG`;
}

export default function Operacional() {
  const [financeiro, setFinanceiro] = useState<Financeiro[]>([]);
  const [operacoes, setOperacoes] = useState<Operacao[]>([]);
  const [erro, setErro] = useState("");
  const [backupMsg, setBackupMsg] = useState("");

  async function carregar() {
    try {
      setErro("");
      const resFin = await fetch(`${API_BASE}/financeiro`);
      const dataFin = await resFin.json();
      if (dataFin.status === "ok") setFinanceiro(dataFin.lancamentos || []);
      const salvo = localStorage.getItem("ytalseg_operacional_v10_13");
      setOperacoes(salvo ? JSON.parse(salvo) : []);
    } catch {
      setErro("Não consegui carregar dados. Confira se o backend está rodando.");
    }
  }

  useEffect(() => { carregar(); }, []);
  useEffect(() => { localStorage.setItem("ytalseg_operacional_v10_13", JSON.stringify(operacoes)); }, [operacoes]);

  const aprovacoesPendentes = useMemo(() => operacoes.filter((o) => o.tipo === "aprovacao" && o.status !== "aprovado"), [operacoes]);

  const notasPendentes = useMemo(() => {
    const vindasFinanceiro = financeiro
      .filter((f) => f.status === "pendente" && !f.nota)
      .map((f) => ({
        id: f.id, tipo: "nota" as const, cliente: f.cliente, referencia: f.referencia,
        valor: f.valor, status: "sem nota", data: f.dataEmissao || hoje(), observacao: f.descricao || "",
      }));
    const manuais = operacoes.filter((o) => o.tipo === "nota" && o.status !== "emitida");
    return [...vindasFinanceiro, ...manuais];
  }, [financeiro, operacoes]);

  const calendario = useMemo(() => {
    const vencimentos = financeiro.filter((f) => f.status === "pendente" && f.vencimento).map((f) => ({
      data: f.vencimento || "", tipo: "Vencimento", cliente: f.cliente, texto: `${f.referencia} - ${brl(f.valor)}`,
    }));
    const promessas = financeiro.filter((f) => f.status === "pendente" && f.promessaPagamento).map((f) => ({
      data: f.promessaPagamento || "", tipo: "Promessa pagamento", cliente: f.cliente, texto: `${f.referencia} - ${brl(f.valor)}`,
    }));
    const tarefas = operacoes.filter((o) => o.tipo === "tarefa").map((o) => ({
      data: o.data, tipo: "Tarefa", cliente: o.cliente, texto: o.observacao || o.referencia,
    }));
    return [...vencimentos, ...promessas, ...tarefas].filter((x) => x.data).sort((a, b) => a.data.localeCompare(b.data)).slice(0, 30);
  }, [financeiro, operacoes]);

  function addAprovacao() {
    const cliente = prompt("Cliente?");
    if (!cliente) return;
    const referencia = prompt("Referência? Ex: MARÇO / 2026") || "";
    const valor = Number(prompt("Valor?") || 0);
    setOperacoes((prev) => [{ id: crypto.randomUUID(), tipo: "aprovacao", cliente, referencia, valor, status: "aguardando", data: hoje(), observacao: "" }, ...prev]);
  }

  function addTarefa() {
    const cliente = prompt("Cliente / assunto?");
    if (!cliente) return;
    const data = prompt("Data? AAAA-MM-DD") || hoje();
    const observacao = prompt("Tarefa?") || "";
    setOperacoes((prev) => [{ id: crypto.randomUUID(), tipo: "tarefa", cliente, referencia: "", valor: 0, status: "pendente", data, observacao }, ...prev]);
  }

  function aprovar(id: string) {
    setOperacoes((prev) => prev.map((o) => (o.id === id ? { ...o, status: "aprovado" } : o)));
  }

  function remover(id: string) {
    setOperacoes((prev) => prev.filter((o) => o.id !== id));
  }

  async function copiar(msg: string) {
    await navigator.clipboard.writeText(msg);
    alert("Mensagem copiada.");
  }

  async function backupAgora() {
    try {
      const res = await fetch(`${API_BASE}/backup`, { method: "POST" });
      const data = await res.json();
      if (data.status === "ok") setBackupMsg(`Backup criado: ${data.arquivo}`);
      else setBackupMsg(data.erro || "Erro no backup.");
    } catch {
      setBackupMsg("Backend sem rota /backup. Substitua o main.py pela versão V10.13.");
    }
  }

  return (
    <div className="operacional-page">
      <style>{`
        .operacional-page { display:grid; gap:18px; }
        .head { display:flex; justify-content:space-between; gap:16px; align-items:center; }
        .head h1 { margin:0; font-size:30px; font-weight:1000; color:#111827; }
        .head p { margin:5px 0 0; color:#6b7280; font-weight:700; }
        .actions { display:flex; gap:10px; flex-wrap:wrap; }
        .btn { border:0; background:#e5e7eb; color:#111; font-weight:900; padding:10px 13px; border-radius:10px; cursor:pointer; }
        .btn-green { background:${VERDE}; color:white; }
        .btn-red { background:#fee2e2; color:#991b1b; }
        .cards { display:grid; grid-template-columns:repeat(4,1fr); gap:14px; }
        .card, .box { background:white; border:1px solid #e5e7eb; border-radius:22px; padding:18px; box-shadow:0 10px 24px rgba(0,0,0,.06); }
        .card span { display:block; color:#6b7280; font-size:12px; font-weight:1000; text-transform:uppercase; }
        .card strong { display:block; margin-top:8px; color:${VERDE}; font-size:30px; font-weight:1000; }
        .grid { display:grid; grid-template-columns:1fr 1fr; gap:18px; }
        h2 { margin:0 0 14px; font-size:21px; font-weight:1000; }
        table { width:100%; border-collapse:collapse; font-size:13px; }
        th { text-align:left; background:#f9fafb; padding:10px; border-bottom:1px solid #e5e7eb; font-weight:1000; }
        td { padding:10px; border-bottom:1px solid #edf0f2; font-weight:700; vertical-align:top; }
        .pill { display:inline-flex; padding:5px 9px; border-radius:999px; font-size:12px; font-weight:1000; background:#fef3c7; color:#92400e; }
        .warn { background:#fee2e2; color:#991b1b; }
        .msg { color:#006b34; font-weight:900; }
        @media(max-width:1050px){ .cards,.grid{grid-template-columns:1fr 1fr;} }
        @media(max-width:700px){ .cards,.grid{grid-template-columns:1fr;} }
      `}</style>

      <div className="head">
        <div>
          <h1>Operacional Master</h1>
          <p>Aprovações, notas pendentes, backup e calendário em uma tela.</p>
        </div>
        <div className="actions">
          <button className="btn btn-green" onClick={carregar}>Atualizar</button>
          <button className="btn" onClick={addAprovacao}>+ Aprovação</button>
          <button className="btn" onClick={addTarefa}>+ Tarefa</button>
          <button className="btn" onClick={backupAgora}>Backup agora</button>
        </div>
      </div>

      {erro && <div className="box" style={{color:"#b91c1c",fontWeight:900}}>{erro}</div>}
      {backupMsg && <div className="box msg">{backupMsg}</div>}

      <div className="cards">
        <div className="card"><span>Aprovações pendentes</span><strong>{aprovacoesPendentes.length}</strong></div>
        <div className="card"><span>Notas sem emitir</span><strong>{notasPendentes.length}</strong></div>
        <div className="card"><span>Eventos calendário</span><strong>{calendario.length}</strong></div>
        <div className="card"><span>Financeiro pendente</span><strong>{financeiro.filter(f=>f.status==="pendente").length}</strong></div>
      </div>

      <div className="grid">
        <div className="box">
          <h2>Aprovações Pendentes</h2>
          <table>
            <thead><tr><th>Cliente</th><th>Referência</th><th>Dias</th><th>Ações</th></tr></thead>
            <tbody>
              {aprovacoesPendentes.length === 0 && <tr><td colSpan={4}>Nenhuma aprovação pendente.</td></tr>}
              {aprovacoesPendentes.map((a) => (
                <tr key={a.id}>
                  <td>{a.cliente}</td>
                  <td>{a.referencia}<br />{brl(a.valor)}</td>
                  <td>{diasDesde(a.data)} dias</td>
                  <td><div className="actions">
                    <button className="btn" onClick={() => copiar(msgAprovacao(a))}>Cobrar</button>
                    <button className="btn btn-green" onClick={() => aprovar(a.id)}>Aprovar</button>
                    <button className="btn btn-red" onClick={() => remover(a.id)}>Excluir</button>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="box">
          <h2>Nota Fiscal Pendente</h2>
          <table>
            <thead><tr><th>Cliente</th><th>Referência</th><th>Valor</th><th>Status</th></tr></thead>
            <tbody>
              {notasPendentes.length === 0 && <tr><td colSpan={4}>Nenhuma nota pendente.</td></tr>}
              {notasPendentes.map((n) => (
                <tr key={`${n.id}-${n.tipo}`}>
                  <td>{n.cliente}</td><td>{n.referencia}</td><td>{brl(n.valor)}</td><td><span className="pill warn">{n.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid">
        <div className="box">
          <h2>Calendário Operacional</h2>
          <table>
            <thead><tr><th>Data</th><th>Tipo</th><th>Cliente</th><th>Detalhe</th></tr></thead>
            <tbody>
              {calendario.length === 0 && <tr><td colSpan={4}>Nenhum evento no calendário.</td></tr>}
              {calendario.map((c, i) => (
                <tr key={i}><td>{c.data}</td><td><span className="pill">{c.tipo}</span></td><td>{c.cliente}</td><td>{c.texto}</td></tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="box">
          <h2>Backup e Segurança</h2>
          <p style={{fontWeight:700,color:"#4b5563"}}>Use o botão <b>Backup agora</b> para copiar o banco SQLite para a pasta de backups.</p>
          <p style={{fontWeight:700,color:"#4b5563"}}>Banco principal esperado: <b>backend/app/ytalseg_erp.db</b></p>
          <div className="actions"><button className="btn btn-green" onClick={backupAgora}>Criar backup agora</button></div>
        </div>
      </div>
    </div>
  );
}
