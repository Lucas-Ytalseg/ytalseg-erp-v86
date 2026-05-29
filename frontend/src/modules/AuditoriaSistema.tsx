import { useEffect, useMemo, useState } from "react";

const LOG_KEY = "ytalseg_auditoria_v18";
const REL_KEY = "ytalseg_relatorios_versoes_v11_2";
const PACOTE_KEY = "ytalseg_pacotes_cliente_v11_6";

type LogItem = {
  id: number;
  tipo: string;
  descricao: string;
  origem: string;
  criadoEm: string;
};

function dataBR(v?: string) {
  if (!v) return "-";
  try {
    return new Date(v).toLocaleString("pt-BR");
  } catch {
    return v;
  }
}

function gerarSnapshotLogs() {
  const logs: LogItem[] = [];

  try {
    const relatorios = JSON.parse(localStorage.getItem(REL_KEY) || "[]");
    if (Array.isArray(relatorios)) {
      relatorios.slice(0, 80).forEach((r: any) => {
        logs.push({
          id: Number(r.id || Date.now()),
          tipo: "Relatório",
          origem: "Relatórios",
          descricao: `${r.cliente || "Cliente não informado"} • ${r.tipo || "-"} • ${r.status || "Rascunho"} • R$ ${Number(r.valor || 0).toFixed(2)}`,
          criadoEm: r.criadoEm || new Date().toISOString(),
        });
      });
    }
  } catch {}

  try {
    const pacotes = JSON.parse(localStorage.getItem(PACOTE_KEY) || "[]");
    if (Array.isArray(pacotes)) {
      pacotes.slice(0, 80).forEach((p: any) => {
        logs.push({
          id: Number(p.id || Date.now()),
          tipo: "Pacote",
          origem: "Pacote Cliente",
          descricao: `${p.cliente || "Cliente não informado"} • ${p.status || "Pendente"} • PDF: ${p.pdfCliente ? "sim" : "não"} • NF: ${p.notaFiscal ? "sim" : "não"} • Comprovante: ${p.comprovante ? "sim" : "não"}`,
          criadoEm: p.criadoEm || new Date().toISOString(),
        });
      });
    }
  } catch {}

  return logs.sort((a, b) => String(b.criadoEm).localeCompare(String(a.criadoEm)));
}

export default function AuditoriaSistema() {
  const [logs, setLogs] = useState<LogItem[]>([]);
  const [filtro, setFiltro] = useState("Todos");
  const [busca, setBusca] = useState("");
  const [msg, setMsg] = useState("");

  function carregar() {
    const salvos = (() => {
      try {
        const data = JSON.parse(localStorage.getItem(LOG_KEY) || "[]");
        return Array.isArray(data) ? data : [];
      } catch {
        return [];
      }
    })();

    const snapshot = gerarSnapshotLogs();
    const combinados = [...salvos, ...snapshot];

    const unicos = Array.from(
      new Map(combinados.map((item) => [`${item.tipo}-${item.id}-${item.criadoEm}`, item])).values()
    );

    setLogs(unicos.sort((a, b) => String(b.criadoEm).localeCompare(String(a.criadoEm))).slice(0, 200));
  }

  useEffect(() => {
    carregar();
  }, []);

  const filtrados = useMemo(() => {
    return logs.filter((item) => {
      const okFiltro = filtro === "Todos" || item.tipo === filtro;
      const alvo = `${item.tipo} ${item.origem} ${item.descricao}`.toLowerCase();
      const okBusca = alvo.includes(busca.toLowerCase());
      return okFiltro && okBusca;
    });
  }, [logs, filtro, busca]);

  const resumo = useMemo(() => {
    return {
      total: filtrados.length,
      relatorios: logs.filter((i) => i.tipo === "Relatório").length,
      pacotes: logs.filter((i) => i.tipo === "Pacote").length,
      sistema: logs.filter((i) => i.tipo === "Sistema").length,
    };
  }, [filtrados, logs]);

  function registrarEventoManual() {
    const descricao = window.prompt("Descreva o evento para registrar na auditoria:");
    if (!descricao?.trim()) return;

    const novo: LogItem = {
      id: Date.now(),
      tipo: "Sistema",
      origem: "Registro manual",
      descricao,
      criadoEm: new Date().toISOString(),
    };

    const atualizados = [novo, ...logs].slice(0, 200);
    setLogs(atualizados);

    const logsSistema = atualizados.filter((i) => i.tipo === "Sistema");
    localStorage.setItem(LOG_KEY, JSON.stringify(logsSistema));
    setMsg("Evento registrado.");
  }

  function exportarAuditoria() {
    const payload = {
      versao: "V18",
      geradoEm: new Date().toISOString(),
      logs: filtrados,
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ytalseg_auditoria_v18_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setMsg("Auditoria exportada.");
  }

  function limparAuditoriaManual() {
    if (!window.confirm("Deseja limpar apenas os registros manuais da auditoria?")) return;
    localStorage.removeItem(LOG_KEY);
    carregar();
    setMsg("Registros manuais apagados.");
  }

  return (
    <div className="audit-page">
      <style>{`
        .audit-page { display: grid; gap: 16px; }
        .audit-head { display: flex; justify-content: space-between; align-items: end; gap: 14px; flex-wrap: wrap; }
        .audit-title h1 { margin: 0; font-size: 30px; font-weight: 1000; color: #111827; }
        .audit-title p { margin: 6px 0 0; color: #6b7280; font-weight: 800; }
        .audit-actions { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; }
        .audit-input, .audit-select, .audit-btn { border: 1px solid #d1d5db; border-radius: 10px; padding: 10px 12px; font-size: 13px; font-weight: 900; background: white; }
        .audit-btn { border: 0; cursor: pointer; background: #e5e7eb; color: #111; }
        .audit-btn-green { background: #00B050; color: white; }
        .audit-cards { display: grid; grid-template-columns: repeat(4, minmax(0,1fr)); gap: 12px; }
        .audit-card, .audit-box { background: white; border: 1px solid #e5e7eb; border-radius: 18px; padding: 16px; box-shadow: 0 10px 22px rgba(0,0,0,.05); }
        .audit-card span { display: block; color: #6b7280; font-size: 12px; font-weight: 1000; text-transform: uppercase; }
        .audit-card strong { display: block; margin-top: 6px; color: #00B050; font-size: 26px; font-weight: 1000; }
        .audit-msg { padding: 12px; border-radius: 14px; background: #ecfdf5; border: 1px solid rgba(0,176,80,.25); color: #166534; font-weight: 900; }
        .audit-list { display: grid; gap: 10px; }
        .audit-item { background: white; border: 1px solid #e5e7eb; border-radius: 18px; padding: 16px; box-shadow: 0 10px 22px rgba(0,0,0,.05); display: grid; grid-template-columns: .7fr 1fr 2fr .9fr; gap: 12px; align-items: center; }
        .audit-badge { display: inline-flex; justify-content: center; padding: 6px 10px; border-radius: 999px; background: #eff6ff; color: #1d4ed8; font-size: 12px; font-weight: 1000; }
        .audit-badge.pacote { background: #fff7ed; color: #9a3412; }
        .audit-badge.sistema { background: #ecfdf5; color: #166534; }
        .audit-empty { color: #6b7280; font-weight: 900; padding: 16px; }
        @media (max-width: 1000px) {
          .audit-cards { grid-template-columns: 1fr 1fr; }
          .audit-item { grid-template-columns: 1fr; }
        }
        @media (max-width: 700px) { .audit-cards { grid-template-columns: 1fr; } }
      `}</style>

      <div className="audit-head">
        <div className="audit-title">
          <h1>Auditoria do Sistema</h1>
          <p>Rastreamento local de relatórios, pacotes e eventos importantes.</p>
        </div>

        <div className="audit-actions">
          <input className="audit-input" placeholder="Buscar..." value={busca} onChange={(e) => setBusca(e.target.value)} />
          <select className="audit-select" value={filtro} onChange={(e) => setFiltro(e.target.value)}>
            <option>Todos</option>
            <option>Relatório</option>
            <option>Pacote</option>
            <option>Sistema</option>
          </select>
          <button className="audit-btn audit-btn-green" onClick={carregar}>Atualizar</button>
        </div>
      </div>

      {msg && <div className="audit-msg">{msg}</div>}

      <div className="audit-cards">
        <Card titulo="Eventos filtrados" valor={String(resumo.total)} />
        <Card titulo="Relatórios" valor={String(resumo.relatorios)} />
        <Card titulo="Pacotes" valor={String(resumo.pacotes)} />
        <Card titulo="Sistema" valor={String(resumo.sistema)} />
      </div>

      <div className="audit-box">
        <div className="audit-actions">
          <button className="audit-btn audit-btn-green" onClick={registrarEventoManual}>Registrar evento</button>
          <button className="audit-btn" onClick={exportarAuditoria}>Exportar auditoria</button>
          <button className="audit-btn" onClick={limparAuditoriaManual}>Limpar eventos manuais</button>
        </div>
      </div>

      <div className="audit-list">
        {filtrados.length === 0 && <div className="audit-box audit-empty">Nenhum evento encontrado.</div>}

        {filtrados.map((item) => (
          <div className="audit-item" key={`${item.tipo}-${item.id}-${item.criadoEm}`}>
            <div>
              <span className={`audit-badge ${item.tipo === "Pacote" ? "pacote" : item.tipo === "Sistema" ? "sistema" : ""}`}>
                {item.tipo}
              </span>
            </div>
            <div><strong>{item.origem}</strong></div>
            <div>{item.descricao}</div>
            <div>{dataBR(item.criadoEm)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Card({ titulo, valor }: { titulo: string; valor: string }) {
  return (
    <div className="audit-card">
      <span>{titulo}</span>
      <strong>{valor}</strong>
    </div>
  );
}
