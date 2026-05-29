import { useEffect, useMemo, useState } from "react";

const KEY = "ytalseg_relatorios_versoes_v11_2";

type RelatorioHistorico = {
  id: number;
  tipo?: "cliente" | "interno" | string;
  cliente?: string;
  valor?: number;
  status?: string;
  criadoEm?: string;
};

function brl(v: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number(v || 0));
}

export default function DashboardOperacional() {
  const [lista, setLista] = useState<RelatorioHistorico[]>([]);

  function carregar() {
    try {
      const data = JSON.parse(localStorage.getItem(KEY) || "[]");
      setLista(Array.isArray(data) ? data : []);
    } catch {
      setLista([]);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  const stats = useMemo(() => {
    const total = lista.reduce((acc, item) => acc + Number(item.valor || 0), 0);
    const pago = lista
      .filter((item) => (item.status || "Rascunho") === "Pago")
      .reduce((acc, item) => acc + Number(item.valor || 0), 0);

    const aberto = total - pago;
    const enviados = lista.filter((item) => (item.status || "Rascunho") === "Enviado").length;
    const aprovados = lista.filter((item) => (item.status || "Rascunho") === "Aprovado").length;
    const notaEmitida = lista.filter((item) => (item.status || "Rascunho") === "Nota emitida").length;
    const pendentes = lista.filter((item) => (item.status || "Rascunho") !== "Pago").length;

    return {
      total,
      pago,
      aberto,
      enviados,
      aprovados,
      notaEmitida,
      pendentes,
      quantidade: lista.length,
    };
  }, [lista]);

  const pendencias = useMemo(() => {
    return lista
      .filter((item) => (item.status || "Rascunho") !== "Pago")
      .slice(0, 8);
  }, [lista]);

  return (
    <div className="dash-op-page">
      <style>{`
        .dash-op-page {
          display: grid;
          gap: 16px;
        }

        .dash-op-head {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          align-items: end;
          flex-wrap: wrap;
        }

        .dash-op-title h1 {
          margin: 0;
          font-size: 30px;
          font-weight: 1000;
          color: #111827;
        }

        .dash-op-title p {
          margin: 6px 0 0;
          color: #6b7280;
          font-weight: 800;
        }

        .dash-op-btn {
          border: 0;
          border-radius: 10px;
          padding: 10px 13px;
          font-weight: 900;
          cursor: pointer;
          background: #00B050;
          color: white;
        }

        .dash-op-cards {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 12px;
        }

        .dash-op-card {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 18px;
          padding: 16px;
          box-shadow: 0 10px 22px rgba(0,0,0,.05);
        }

        .dash-op-card span {
          display: block;
          color: #6b7280;
          font-size: 12px;
          font-weight: 1000;
          text-transform: uppercase;
        }

        .dash-op-card strong {
          display: block;
          margin-top: 6px;
          color: #00B050;
          font-size: 26px;
          font-weight: 1000;
        }

        .dash-op-panel {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 22px;
          padding: 18px;
          box-shadow: 0 10px 24px rgba(0,0,0,.06);
        }

        .dash-op-panel h3 {
          margin: 0 0 12px;
          color: #111827;
          font-size: 20px;
          font-weight: 1000;
        }

        .dash-op-row {
          display: grid;
          grid-template-columns: 1.5fr .8fr .8fr .8fr;
          gap: 10px;
          padding: 10px 0;
          border-top: 1px solid #eef0f2;
          font-size: 13px;
          font-weight: 800;
          align-items: center;
        }

        .dash-op-row:first-of-type {
          border-top: none;
        }

        .dash-op-badge {
          display: inline-flex;
          justify-content: center;
          padding: 5px 9px;
          border-radius: 999px;
          background: #fff7ed;
          color: #9a3412;
          font-size: 12px;
          font-weight: 1000;
        }

        .dash-op-empty {
          color: #6b7280;
          font-weight: 900;
          padding: 8px 0;
        }

        @media (max-width: 1000px) {
          .dash-op-cards {
            grid-template-columns: 1fr 1fr;
          }

          .dash-op-row {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 700px) {
          .dash-op-cards {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="dash-op-head">
        <div className="dash-op-title">
          <h1>Dashboard Operacional</h1>
          <p>Visão rápida dos relatórios, valores e pendências.</p>
        </div>

        <button className="dash-op-btn" onClick={carregar}>
          Atualizar
        </button>
      </div>

      <div className="dash-op-cards">
        <Card titulo="Total geral" valor={brl(stats.total)} />
        <Card titulo="Total pago" valor={brl(stats.pago)} />
        <Card titulo="Em aberto" valor={brl(stats.aberto)} />
        <Card titulo="Relatórios" valor={String(stats.quantidade)} />
        <Card titulo="Enviados" valor={String(stats.enviados)} />
        <Card titulo="Aprovados" valor={String(stats.aprovados)} />
        <Card titulo="Nota emitida" valor={String(stats.notaEmitida)} />
        <Card titulo="Pendentes" valor={String(stats.pendentes)} />
      </div>

      <div className="dash-op-panel">
        <h3>Pendências operacionais</h3>

        {pendencias.length === 0 && (
          <div className="dash-op-empty">Nenhuma pendência encontrada.</div>
        )}

        {pendencias.map((item) => (
          <div className="dash-op-row" key={item.id}>
            <div>{item.cliente || "Cliente não informado"}</div>
            <div>{brl(Number(item.valor || 0))}</div>
            <div>{item.tipo || "-"}</div>
            <div>
              <span className="dash-op-badge">{item.status || "Rascunho"}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Card({ titulo, valor }: { titulo: string; valor: string }) {
  return (
    <div className="dash-op-card">
      <span>{titulo}</span>
      <strong>{valor}</strong>
    </div>
  );
}
