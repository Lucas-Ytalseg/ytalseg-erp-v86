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

const STATUS = ["Rascunho", "Enviado", "Aprovado", "Nota emitida", "Cobrado", "Pago"];

function brl(v: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number(v || 0));
}

function mesAno(data?: string) {
  if (!data) return "Sem data";
  try {
    return new Date(data).toLocaleDateString("pt-BR", {
      month: "short",
      year: "2-digit",
    });
  } catch {
    return "Sem data";
  }
}

export default function DashboardGraficos() {
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

  const dados = useMemo(() => {
    const porStatus = STATUS.map((status) => {
      const itens = lista.filter((i) => (i.status || "Rascunho") === status);
      return {
        status,
        qtd: itens.length,
        valor: itens.reduce((acc, i) => acc + Number(i.valor || 0), 0),
      };
    });

    const porMesMap = new Map<string, number>();
    lista.forEach((item) => {
      const key = mesAno(item.criadoEm);
      porMesMap.set(key, (porMesMap.get(key) || 0) + Number(item.valor || 0));
    });

    const porMes = Array.from(porMesMap.entries())
      .map(([mes, valor]) => ({ mes, valor }))
      .slice(0, 8)
      .reverse();

    const porClienteMap = new Map<string, number>();
    lista.forEach((item) => {
      const cliente = item.cliente || "Cliente não informado";
      porClienteMap.set(cliente, (porClienteMap.get(cliente) || 0) + Number(item.valor || 0));
    });

    const porCliente = Array.from(porClienteMap.entries())
      .map(([cliente, valor]) => ({ cliente, valor }))
      .sort((a, b) => b.valor - a.valor)
      .slice(0, 8);

    const total = lista.reduce((acc, item) => acc + Number(item.valor || 0), 0);
    const pago = lista
      .filter((item) => (item.status || "Rascunho") === "Pago")
      .reduce((acc, item) => acc + Number(item.valor || 0), 0);
    const aberto = total - pago;

    return { porStatus, porMes, porCliente, total, pago, aberto };
  }, [lista]);

  const maxStatus = Math.max(...dados.porStatus.map((i) => i.valor), 1);
  const maxMes = Math.max(...dados.porMes.map((i) => i.valor), 1);
  const maxCliente = Math.max(...dados.porCliente.map((i) => i.valor), 1);

  return (
    <div className="dash-graf-page">
      <style>{`
        .dash-graf-page {
          display: grid;
          gap: 16px;
        }

        .dash-graf-head {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          align-items: end;
          flex-wrap: wrap;
        }

        .dash-graf-title h1 {
          margin: 0;
          font-size: 30px;
          font-weight: 1000;
          color: #111827;
        }

        .dash-graf-title p {
          margin: 6px 0 0;
          color: #6b7280;
          font-weight: 800;
        }

        .dash-graf-btn {
          border: 0;
          border-radius: 10px;
          padding: 10px 13px;
          font-weight: 900;
          cursor: pointer;
          background: #00B050;
          color: white;
        }

        .dash-graf-cards {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 12px;
        }

        .dash-graf-card {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 18px;
          padding: 16px;
          box-shadow: 0 10px 22px rgba(0,0,0,.05);
        }

        .dash-graf-card span {
          display: block;
          color: #6b7280;
          font-size: 12px;
          font-weight: 1000;
          text-transform: uppercase;
        }

        .dash-graf-card strong {
          display: block;
          margin-top: 6px;
          color: #00B050;
          font-size: 26px;
          font-weight: 1000;
        }

        .dash-graf-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .dash-graf-panel {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 22px;
          padding: 18px;
          box-shadow: 0 10px 24px rgba(0,0,0,.06);
        }

        .dash-graf-panel.full {
          grid-column: 1 / -1;
        }

        .dash-graf-panel h3 {
          margin: 0 0 14px;
          color: #111827;
          font-size: 20px;
          font-weight: 1000;
        }

        .bar-row {
          display: grid;
          grid-template-columns: 120px 1fr 120px;
          gap: 10px;
          align-items: center;
          padding: 9px 0;
          border-top: 1px solid #eef0f2;
          font-size: 13px;
          font-weight: 850;
        }

        .bar-row:first-of-type {
          border-top: none;
        }

        .bar-track {
          height: 14px;
          border-radius: 999px;
          background: #eef0f2;
          overflow: hidden;
        }

        .bar-fill {
          height: 100%;
          border-radius: 999px;
          background: linear-gradient(90deg, #00B050, #58d68d);
        }

        .bar-value {
          text-align: right;
          color: #374151;
          font-weight: 1000;
        }

        .mini-chart {
          display: flex;
          align-items: end;
          gap: 10px;
          height: 220px;
          padding: 12px 4px 0;
          border-bottom: 1px solid #e5e7eb;
        }

        .mini-col-wrap {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: end;
          height: 100%;
        }

        .mini-col {
          width: 100%;
          max-width: 44px;
          min-height: 4px;
          border-radius: 10px 10px 0 0;
          background: linear-gradient(180deg, #00B050, #86efac);
        }

        .mini-label {
          margin-top: 8px;
          font-size: 11px;
          font-weight: 900;
          color: #6b7280;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 70px;
        }

        .empty {
          color: #6b7280;
          font-weight: 900;
          padding: 10px 0;
        }

        @media (max-width: 1000px) {
          .dash-graf-cards,
          .dash-graf-grid {
            grid-template-columns: 1fr;
          }

          .dash-graf-panel.full {
            grid-column: auto;
          }

          .bar-row {
            grid-template-columns: 1fr;
          }

          .bar-value {
            text-align: left;
          }
        }
      `}</style>

      <div className="dash-graf-head">
        <div className="dash-graf-title">
          <h1>Dashboard com Gráficos</h1>
          <p>Análise visual dos valores, status, clientes e evolução mensal.</p>
        </div>

        <button className="dash-graf-btn" onClick={carregar}>
          Atualizar
        </button>
      </div>

      <div className="dash-graf-cards">
        <Card titulo="Total geral" valor={brl(dados.total)} />
        <Card titulo="Total pago" valor={brl(dados.pago)} />
        <Card titulo="Em aberto" valor={brl(dados.aberto)} />
      </div>

      <div className="dash-graf-grid">
        <div className="dash-graf-panel">
          <h3>Valores por status</h3>
          {dados.porStatus.every((i) => i.valor === 0) && <div className="empty">Sem dados ainda.</div>}
          {dados.porStatus.map((item) => (
            <div className="bar-row" key={item.status}>
              <div>{item.status}</div>
              <div className="bar-track">
                <div className="bar-fill" style={{ width: `${Math.max(3, (item.valor / maxStatus) * 100)}%` }} />
              </div>
              <div className="bar-value">{brl(item.valor)}</div>
            </div>
          ))}
        </div>

        <div className="dash-graf-panel">
          <h3>Evolução mensal</h3>
          {dados.porMes.length === 0 && <div className="empty">Sem dados ainda.</div>}
          <div className="mini-chart">
            {dados.porMes.map((item) => (
              <div className="mini-col-wrap" key={item.mes} title={`${item.mes} - ${brl(item.valor)}`}>
                <div className="mini-col" style={{ height: `${Math.max(4, (item.valor / maxMes) * 190)}px` }} />
                <div className="mini-label">{item.mes}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="dash-graf-panel full">
          <h3>Top clientes por valor</h3>
          {dados.porCliente.length === 0 && <div className="empty">Sem dados ainda.</div>}
          {dados.porCliente.map((item) => (
            <div className="bar-row" key={item.cliente}>
              <div title={item.cliente}>{item.cliente}</div>
              <div className="bar-track">
                <div className="bar-fill" style={{ width: `${Math.max(3, (item.valor / maxCliente) * 100)}%` }} />
              </div>
              <div className="bar-value">{brl(item.valor)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Card({ titulo, valor }: { titulo: string; valor: string }) {
  return (
    <div className="dash-graf-card">
      <span>{titulo}</span>
      <strong>{valor}</strong>
    </div>
  );
}
