import React, { useEffect, useMemo, useState } from "react";

const API_BASE = "/api";
const CHAVE_REABRIR = "ytalseg_reabrir_relatorio_pendente";

type HistoricoItem = {
  id: string;
  tipo: "Cliente" | "Interno" | string;
  cliente: string;
  referencia: string;
  valor: number;
  criadoEm: string;
  temArquivo: boolean;
  temDados: boolean;
};

function brl(v: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(v || 0));
}

function dataBR(iso: string) {
  try {
    return new Date(iso).toLocaleString("pt-BR");
  } catch {
    return iso;
  }
}

const MESES = ["Todos", "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

export default function HistoricoPDFs({ onAbrirRelatorio }: { onAbrirRelatorio?: () => void }) {
  const [lista, setLista] = useState<HistoricoItem[]>([]);
  const [busca, setBusca] = useState("");
  const [tipo, setTipo] = useState("Todos");
  const [mes, setMes] = useState("Todos");
  const [ano, setAno] = useState("Todos");
  const [ordem, setOrdem] = useState<"recente" | "antigo">("recente");
  const [msg, setMsg] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function carregar() {
    setCarregando(true);
    setMsg("");
    try {
      const res = await fetch(`${API_BASE}/historico-pdfs`);
      const data = await res.json();
      if (data.status === "ok") {
        setLista(data.historico || []);
      } else {
        setMsg("Erro ao carregar histórico. Verifique a conexão com o servidor.");
      }
    } catch (err) {
      setMsg(`Erro ao carregar histórico: ${err}`);
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  const anosDisponiveis = useMemo(() => {
    const anos = new Set<string>();
    lista.forEach((item) => {
      const a = new Date(item.criadoEm).getFullYear();
      if (!Number.isNaN(a)) anos.add(String(a));
    });
    return ["Todos", ...Array.from(anos).sort((a, b) => Number(b) - Number(a))];
  }, [lista]);

  const filtrados = useMemo(() => {
    const buscaMin = busca.trim().toLowerCase();
    let itens = lista.filter((item) => {
      const okTipo = tipo === "Todos" || item.tipo === tipo;
      const okBusca = !buscaMin || `${item.cliente} ${item.referencia}`.toLowerCase().includes(buscaMin);
      const dataItem = new Date(item.criadoEm);
      const okMes = mes === "Todos" || MESES[dataItem.getMonth() + 1] === mes;
      const okAno = ano === "Todos" || String(dataItem.getFullYear()) === ano;
      return okTipo && okBusca && okMes && okAno;
    });

    itens = itens.slice().sort((a, b) => {
      const da = new Date(a.criadoEm).getTime();
      const db = new Date(b.criadoEm).getTime();
      return ordem === "recente" ? db - da : da - db;
    });

    return itens;
  }, [lista, busca, tipo, mes, ano, ordem]);

  async function reabrir(item: HistoricoItem) {
    if (!item.temDados) {
      setMsg("Este registro não tem dados salvos para reabrir (foi gerado antes desta função existir).");
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/historico-pdfs/${item.id}`);
      const data = await res.json();
      if (data.status !== "ok" || !data.item?.dados) {
        setMsg("Não consegui carregar os dados deste relatório.");
        return;
      }
      localStorage.setItem(CHAVE_REABRIR, JSON.stringify(data.item.dados));
      if (onAbrirRelatorio) {
        onAbrirRelatorio();
      } else {
        setMsg("Dados carregados. Abra a aba Relatórios para continuar.");
      }
    } catch (err) {
      setMsg(`Erro ao reabrir: ${err}`);
    }
  }

  async function excluir(item: HistoricoItem) {
    if (!confirm(`Excluir o registro de "${item.cliente}" (${item.referencia})?`)) return;
    await fetch(`${API_BASE}/historico-pdfs/${item.id}`, { method: "DELETE" });
    await carregar();
  }

  async function limparTudo() {
    if (!confirm("Excluir TODO o histórico de PDFs? Esta ação não pode ser desfeita.")) return;
    await fetch(`${API_BASE}/historico-pdfs`, { method: "DELETE" });
    await carregar();
  }

  return (
    <div className="hist-page">
      <style>{`
        .hist-page { display: grid; gap: 16px; }
        .hist-head { display: flex; justify-content: space-between; gap: 14px; align-items: end; flex-wrap: wrap; }
        .hist-title h1 { margin: 0; font-size: 30px; font-weight: 1000; color: #111827; }
        .hist-title p { margin: 6px 0 0; color: #6b7280; font-weight: 800; }
        .hist-actions { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; }
        .hist-input, .hist-select { border: 1px solid #d1d5db; border-radius: 10px; padding: 10px 12px; font-size: 13px; font-weight: 800; background: white; }
        .hist-btn { border: 0; border-radius: 10px; padding: 10px 13px; font-weight: 900; cursor: pointer; background: #e5e7eb; color: #111; }
        .hist-btn-green { background: #00B050; color: white; }
        .hist-btn-red { background: #fee2e2; color: #991b1b; }
        .hist-card { background: white; border: 1px solid #e5e7eb; border-radius: 22px; box-shadow: 0 10px 24px rgba(0,0,0,.06); overflow: hidden; overflow-x: auto; }
        .hist-table { width: 100%; border-collapse: collapse; font-size: 13px; }
        .hist-table th { text-align: left; background: #f9fafb; padding: 12px; border-bottom: 1px solid #e5e7eb; font-weight: 1000; color: #374151; white-space: nowrap; }
        .hist-table td { padding: 12px; border-bottom: 1px solid #eef0f2; font-weight: 750; vertical-align: middle; }
        .hist-badge { display: inline-flex; padding: 5px 9px; border-radius: 999px; background: #ecfdf5; color: #166534; font-size: 12px; font-weight: 1000; }
        .hist-badge.interno { background: #eff6ff; color: #1d4ed8; }
        .hist-empty { padding: 22px; color: #6b7280; font-weight: 900; }
        .hist-msg { padding: 12px; border-radius: 14px; background: #fff7ed; border: 1px solid #fed7aa; color: #9a3412; font-weight: 900; }

        @media (max-width: 800px) {
          .hist-table thead { display: none; }
          .hist-table, .hist-table tbody, .hist-table tr, .hist-table td { display: block; width: 100%; }
          .hist-table tr { border-bottom: 8px solid #f3f4f6; padding: 10px 0; }
          .hist-table td { border-bottom: none; padding: 6px 12px; }
          .hist-table td::before { content: attr(data-label); display: block; font-size: 11px; font-weight: 1000; color: #9ca3af; margin-bottom: 2px; }
        }
      `}</style>

      <div className="hist-head">
        <div className="hist-title">
          <h1>Histórico de PDFs</h1>
          <p>Relatórios (Cliente/Interno) gerados na aba Relatórios ficam registrados aqui automaticamente.</p>
        </div>

        <div className="hist-actions">
          <input
            className="hist-input"
            placeholder="Buscar por cliente..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
          <select className="hist-select" value={tipo} onChange={(e) => setTipo(e.target.value)}>
            <option>Todos</option>
            <option>Cliente</option>
            <option>Interno</option>
          </select>
          <select className="hist-select" value={mes} onChange={(e) => setMes(e.target.value)}>
            {MESES.map((m) => <option key={m}>{m}</option>)}
          </select>
          <select className="hist-select" value={ano} onChange={(e) => setAno(e.target.value)}>
            {anosDisponiveis.map((a) => <option key={a}>{a}</option>)}
          </select>
          <select className="hist-select" value={ordem} onChange={(e) => setOrdem(e.target.value as any)}>
            <option value="recente">Mais recente primeiro</option>
            <option value="antigo">Mais antigo primeiro</option>
          </select>
          <button className="hist-btn hist-btn-green" onClick={carregar} disabled={carregando}>
            {carregando ? "Atualizando..." : "Atualizar"}
          </button>
          <button className="hist-btn hist-btn-red" onClick={limparTudo}>Limpar tudo</button>
        </div>
      </div>

      {msg && <div className="hist-msg">{msg}</div>}

      <div className="hist-card">
        <table className="hist-table">
          <thead>
            <tr>
              <th>Tipo</th>
              <th>Cliente</th>
              <th>Referência</th>
              <th>Valor</th>
              <th>Gerado em</th>
              <th>Ações</th>
            </tr>
          </thead>

          <tbody>
            {filtrados.map((item) => (
              <tr key={item.id}>
                <td data-label="Tipo">
                  <span className={`hist-badge ${item.tipo === "Interno" ? "interno" : ""}`}>{item.tipo}</span>
                </td>
                <td data-label="Cliente">{item.cliente}</td>
                <td data-label="Referência">{item.referencia || "-"}</td>
                <td data-label="Valor">{brl(item.valor)}</td>
                <td data-label="Gerado em">{dataBR(item.criadoEm)}</td>
                <td data-label="Ações">
                  <div className="hist-actions">
                    <button className="hist-btn hist-btn-green" onClick={() => reabrir(item)}>
                      Reabrir/Reimprimir
                    </button>
                    <button className="hist-btn hist-btn-red" onClick={() => excluir(item)}>
                      Excluir
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtrados.length === 0 && (
          <div className="hist-empty">
            Nenhum PDF encontrado ainda. Gere um PDF Cliente ou Interno na aba Relatórios para aparecer aqui.
          </div>
        )}
      </div>
    </div>
  );
}
