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
};

type Colaborador = {
  id: string;
  nome: string;
  funcao: string;
  telefone: string;
  ativo: boolean;
  diaria: number;
  comissao: number;
  documentos: string;
  validade: string;
};

type Cliente = {
  id: string;
  nome: string;
  cnpj: string;
};

function brl(v: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number(v || 0));
}

function Card({
  titulo,
  valor,
  detalhe,
  tipo = "normal",
}: {
  titulo: string;
  valor: string;
  detalhe: string;
  tipo?: "normal" | "alerta" | "ok";
}) {
  return (
    <div className={`dash-card ${tipo}`}>
      <span>{titulo}</span>
      <strong>{valor}</strong>
      <p>{detalhe}</p>
    </div>
  );
}

function mesAtualChave() {
  const agora = new Date();
  return `${agora.getFullYear()}-${String(agora.getMonth() + 1).padStart(2, "0")}`;
}

export default function Dashboard() {
  const [financeiro, setFinanceiro] = useState<Financeiro[]>([]);
  const [equipe, setEquipe] = useState<Colaborador[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [erro, setErro] = useState("");

  async function carregarTudo() {
    try {
      setErro("");

      const [resFin, resClientes, resEquipe] = await Promise.all([
        fetch(`${API_BASE}/financeiro`),
        fetch(`${API_BASE}/empresas`),
        fetch(`${API_BASE}/equipe`).catch(() => null),
      ]);

      const dataFin = await resFin.json();
      const dataClientes = await resClientes.json();

      if (dataFin.status === "ok") {
        setFinanceiro(dataFin.lancamentos || []);
      }

      if (dataClientes.status === "ok") {
        setClientes(dataClientes.empresas || []);
      }

      if (resEquipe) {
        const dataEquipe = await resEquipe.json();
        if (dataEquipe.status === "ok") {
          setEquipe(dataEquipe.equipe || []);
        }
      }
    } catch {
      setErro("Não consegui carregar dados do backend SQLite. Confira se o backend está rodando.");
    }
  }

  useEffect(() => {
    carregarTudo();
  }, []);

  const resumo = useMemo(() => {
    const chaveMes = mesAtualChave();

    const lancamentosMes = financeiro.filter((f) =>
      (f.dataEmissao || "").startsWith(chaveMes)
    );

    const base = lancamentosMes.length ? lancamentosMes : financeiro;

    const total = base.reduce((acc, f) => acc + Number(f.valor || 0), 0);
    const recebido = base
      .filter((f) => f.status === "recebido")
      .reduce((acc, f) => acc + Number(f.valor || 0), 0);
    const pendente = base
      .filter((f) => f.status === "pendente")
      .reduce((acc, f) => acc + Number(f.valor || 0), 0);

    const clientesComLancamento = new Set(base.map((f) => f.cliente).filter(Boolean));

    const equipeAtiva = equipe.filter((e) => e.ativo).length;

    const documentosComValidade = equipe.filter((e) => e.validade);
    const hoje = new Date();
    const docsVencendo = documentosComValidade.filter((e) => {
      const validade = new Date(e.validade);
      const diff = validade.getTime() - hoje.getTime();
      const dias = diff / (1000 * 60 * 60 * 24);
      return dias >= 0 && dias <= 30;
    }).length;

    const docsVencidos = documentosComValidade.filter((e) => {
      const validade = new Date(e.validade);
      return validade < hoje;
    }).length;

    const topClientes = Object.entries(
      base.reduce((acc: Record<string, number>, f) => {
        const nome = f.cliente || "Sem cliente";
        acc[nome] = (acc[nome] || 0) + Number(f.valor || 0);
        return acc;
      }, {})
    )
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    const pendencias = base.filter((f) => f.status === "pendente").slice(0, 6);

    return {
      total,
      recebido,
      pendente,
      qtdLancamentos: base.length,
      clientesAtivos: clientes.length || clientesComLancamento.size,
      equipeAtiva,
      docsVencendo,
      docsVencidos,
      topClientes,
      pendencias,
    };
  }, [financeiro, equipe, clientes]);

  return (
    <div className="dashboard-vivo">
      <style>{`
        .dashboard-vivo { display: grid; gap: 18px; }
        .dash-head { display:flex; justify-content:space-between; align-items:flex-start; gap:16px; }
        .dash-head h1 { margin:0; font-size:34px; font-weight:1000; color:#111827; }
        .dash-head p { margin:6px 0 0; color:#6b7280; font-weight:700; }
        .head-actions { display:flex; gap:10px; align-items:center; }
        .live-pill { background:#eafff2; color:#006b34; border:1px solid rgba(0,176,80,.25); padding:9px 13px; border-radius:999px; font-size:12px; font-weight:1000; }
        .btn-refresh { border:0; background:${VERDE}; color:white; font-weight:900; padding:10px 14px; border-radius:12px; cursor:pointer; }
        .cards { display:grid; grid-template-columns: repeat(4, minmax(0,1fr)); gap:14px; }
        .dash-card { background:white; border:1px solid #e5e7eb; border-radius:22px; padding:18px; box-shadow:0 10px 24px rgba(0,0,0,.06); }
        .dash-card span { display:block; color:#6b7280; font-size:12px; font-weight:1000; text-transform:uppercase; }
        .dash-card strong { display:block; margin-top:8px; color:${VERDE}; font-size:30px; font-weight:1000; }
        .dash-card p { margin:6px 0 0; color:#6b7280; font-size:12px; font-weight:700; }
        .dash-card.alerta strong { color:#b45309; }
        .dash-card.ok strong { color:#166534; }
        .dash-grid { display:grid; grid-template-columns: 1.2fr .9fr; gap:18px; }
        .panel { background:white; border:1px solid #e5e7eb; border-radius:24px; padding:20px; box-shadow:0 10px 24px rgba(0,0,0,.06); }
        .panel h2 { margin:0 0 14px; font-size:21px; font-weight:1000; color:#111827; }
        .mini-table { width:100%; border-collapse:collapse; font-size:13px; }
        .mini-table th { text-align:left; background:#f9fafb; padding:10px; color:#374151; font-weight:1000; border-bottom:1px solid #e5e7eb; }
        .mini-table td { padding:10px; border-bottom:1px solid #edf0f2; font-weight:700; }
        .mini-table tr:last-child td { border-bottom:0; }
        .status { display:inline-flex; padding:5px 9px; border-radius:999px; font-size:12px; font-weight:1000; background:#fef3c7; color:#92400e; }
        .empty { color:#6b7280; font-weight:700; padding:12px 0; }
        .alert-box { background:#fff7ed; color:#9a3412; border:1px solid #fed7aa; border-radius:16px; padding:12px; font-weight:900; margin-top:8px; }
        .ok-box { background:#ecfdf5; color:#166534; border:1px solid #bbf7d0; border-radius:16px; padding:12px; font-weight:900; margin-top:8px; }
        @media(max-width: 1100px) { .cards { grid-template-columns: 1fr 1fr; } .dash-grid { grid-template-columns:1fr; } }
        @media(max-width: 650px) { .cards { grid-template-columns:1fr; } }
      `}</style>

      <div className="dash-head">
        <div>
          <h1>Dashboard Vivo</h1>
          <p>Indicadores reais puxados do SQLite: Financeiro, Clientes e Equipe.</p>
        </div>

        <div className="head-actions">
          <button className="btn-refresh" onClick={carregarTudo}>Atualizar</button>
          <div className="live-pill">SQLite conectado</div>
        </div>
      </div>

      {erro && <div className="alert-box">{erro}</div>}

      <div className="cards">
        <Card titulo="Faturamento lançado" valor={brl(resumo.total)} detalhe={`${resumo.qtdLancamentos} lançamentos`} />
        <Card titulo="Recebido" valor={brl(resumo.recebido)} detalhe="Entradas confirmadas" tipo="ok" />
        <Card titulo="Pendente" valor={brl(resumo.pendente)} detalhe="Valores em aberto" tipo={resumo.pendente > 0 ? "alerta" : "ok"} />
        <Card titulo="Clientes ativos" valor={String(resumo.clientesAtivos)} detalhe="Base de clientes cadastrada" />
        <Card titulo="Equipe ativa" valor={String(resumo.equipeAtiva)} detalhe="Colaboradores ativos" />
        <Card titulo="Docs vencendo" valor={String(resumo.docsVencendo)} detalhe="Próximos 30 dias" tipo={resumo.docsVencendo > 0 ? "alerta" : "ok"} />
        <Card titulo="Docs vencidos" valor={String(resumo.docsVencidos)} detalhe="Requer atenção" tipo={resumo.docsVencidos > 0 ? "alerta" : "ok"} />
        <Card titulo="Relatórios/Notas" valor={String(resumo.qtdLancamentos)} detalhe="Registros financeiros" />
      </div>

      <div className="dash-grid">
        <div className="panel">
          <h2>Ranking de clientes por valor</h2>

          {resumo.topClientes.length === 0 ? (
            <div className="empty">Ainda não há lançamentos financeiros.</div>
          ) : (
            <table className="mini-table">
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>Valor</th>
                </tr>
              </thead>
              <tbody>
                {resumo.topClientes.map(([cliente, valor]) => (
                  <tr key={cliente}>
                    <td>{cliente}</td>
                    <td>{brl(valor)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="panel">
          <h2>Pendências financeiras</h2>

          {resumo.pendencias.length === 0 ? (
            <div className="ok-box">Nenhuma pendência financeira no momento.</div>
          ) : (
            <table className="mini-table">
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>Valor</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {resumo.pendencias.map((p) => (
                  <tr key={p.id}>
                    <td>{p.cliente}</td>
                    <td>{brl(p.valor)}</td>
                    <td><span className="status">Pendente</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
