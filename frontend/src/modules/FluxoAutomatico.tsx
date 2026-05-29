import { useEffect, useMemo, useState } from "react";

const REL_KEY = "ytalseg_relatorios_versoes_v11_2";
const PACOTE_KEY = "ytalseg_pacotes_cliente_v11_6";
const HANDOFF_KEY = "ytalseg_envio_pdf_handoff_v14";

type Relatorio = {
  id: number;
  tipo?: string;
  cliente?: string;
  valor?: number;
  status?: string;
  criadoEm?: string;
};

type Pacote = {
  id: number;
  cliente: string;
  valor?: number;
  status: string;
  criadoEm: string;
  pdfCliente: boolean;
  notaFiscal: boolean;
  comprovante: boolean;
  observacoes?: string;
};

function brl(v?: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number(v || 0));
}

function dataBR(v?: string) {
  if (!v) return "-";
  try {
    return new Date(v).toLocaleString("pt-BR");
  } catch {
    return v;
  }
}

export default function FluxoAutomaticoV23() {
  const [relatorios, setRelatorios] = useState<Relatorio[]>([]);
  const [pacotes, setPacotes] = useState<Pacote[]>([]);
  const [relatorioId, setRelatorioId] = useState("");
  const [pacoteId, setPacoteId] = useState("");
  const [clienteManual, setClienteManual] = useState("");
  const [status, setStatus] = useState("");

  function carregar() {
    try {
      const rel = JSON.parse(localStorage.getItem(REL_KEY) || "[]");
      const pac = JSON.parse(localStorage.getItem(PACOTE_KEY) || "[]");
      setRelatorios(Array.isArray(rel) ? rel : []);
      setPacotes(Array.isArray(pac) ? pac : []);
    } catch {
      setRelatorios([]);
      setPacotes([]);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  const relatorioSelecionado = useMemo(
    () => relatorios.find((r) => String(r.id) === relatorioId),
    [relatorios, relatorioId]
  );

  const pacoteSelecionado = useMemo(
    () => pacotes.find((p) => String(p.id) === pacoteId),
    [pacotes, pacoteId]
  );

  const clienteFinal = pacoteSelecionado?.cliente || relatorioSelecionado?.cliente || clienteManual || "";
  const valorFinal = pacoteSelecionado?.valor || relatorioSelecionado?.valor || 0;

  function prepararEnvio() {
    const cliente = clienteFinal.trim();

    if (!cliente) {
      setStatus("Selecione um relatório, pacote ou informe um cliente manualmente.");
      return;
    }

    const mensagem = [
      `Olá, segue o material do cliente ${cliente} para conferência.`,
      "",
      `Valor: ${brl(valorFinal)}`,
      relatorioSelecionado ? `Relatório: ${relatorioSelecionado.tipo || "-"} • ${relatorioSelecionado.status || "Rascunho"}` : "",
      pacoteSelecionado ? `Pacote: ${pacoteSelecionado.status}` : "",
      "",
      pacoteSelecionado
        ? [
            "Checklist do pacote:",
            `- PDF Cliente: ${pacoteSelecionado.pdfCliente ? "Sim" : "Não"}`,
            `- Nota Fiscal: ${pacoteSelecionado.notaFiscal ? "Sim" : "Não"}`,
            `- Comprovante: ${pacoteSelecionado.comprovante ? "Sim" : "Não"}`,
          ].join("\n")
        : "",
      "",
      pacoteSelecionado?.observacoes ? `Observações: ${pacoteSelecionado.observacoes}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    localStorage.setItem(
      HANDOFF_KEY,
      JSON.stringify({
        origem: "fluxo-v23",
        cliente,
        valor: valorFinal,
        relatorioId: relatorioSelecionado?.id,
        pacoteId: pacoteSelecionado?.id,
        mensagem,
        criadoEm: new Date().toISOString(),
      })
    );

    setStatus("Fluxo preparado. Abra o menu Envio PDF para selecionar o PDF e enviar.");
  }

  function copiarResumo() {
    const cliente = clienteFinal.trim();

    if (!cliente) {
      setStatus("Nada para copiar. Selecione um relatório, pacote ou informe cliente.");
      return;
    }

    const texto = [
      `Cliente: ${cliente}`,
      `Valor: ${brl(valorFinal)}`,
      relatorioSelecionado ? `Relatório: ${dataBR(relatorioSelecionado.criadoEm)}` : "",
      pacoteSelecionado ? `Pacote: ${dataBR(pacoteSelecionado.criadoEm)}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    navigator.clipboard?.writeText(texto);
    setStatus("Resumo copiado.");
  }

  function marcarPacoteComoEnviado() {
    if (!pacoteSelecionado) {
      setStatus("Selecione um pacote para marcar como enviado.");
      return;
    }

    const atualizados = pacotes.map((p) =>
      p.id === pacoteSelecionado.id ? { ...p, status: "Enviado" } : p
    );

    setPacotes(atualizados);
    localStorage.setItem(PACOTE_KEY, JSON.stringify(atualizados));
    setStatus("Pacote marcado como Enviado.");
  }

  return (
    <div className="fluxo-page">
      <style>{`
        .fluxo-page { display: grid; gap: 16px; }
        .fluxo-head h1 { margin: 0; font-size: 30px; font-weight: 1000; color: #111827; }
        .fluxo-head p { margin: 6px 0 0; color: #6b7280; font-weight: 800; }
        .fluxo-box, .fluxo-card { background: white; border: 1px solid #e5e7eb; border-radius: 22px; padding: 18px; box-shadow: 0 10px 24px rgba(0,0,0,.06); }
        .fluxo-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; }
        .fluxo-field { display: grid; gap: 6px; }
        .fluxo-field.full { grid-column: 1 / -1; }
        .fluxo-field label { font-size: 12px; font-weight: 1000; color: #006b34; text-transform: uppercase; }
        .fluxo-input, .fluxo-select { width: 100%; border: 1px solid #d1d5db; border-radius: 10px; padding: 10px 12px; font-size: 13px; font-weight: 800; background: white; }
        .fluxo-actions { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 16px; }
        .fluxo-btn { border: 0; border-radius: 10px; padding: 10px 13px; font-weight: 900; cursor: pointer; background: #e5e7eb; color: #111; }
        .fluxo-btn-green { background: #00B050; color: white; }
        .fluxo-cards { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 12px; }
        .fluxo-card span { display: block; color: #6b7280; font-size: 12px; font-weight: 1000; text-transform: uppercase; }
        .fluxo-card strong { display: block; margin-top: 6px; color: #00B050; font-size: 24px; font-weight: 1000; word-break: break-word; }
        .fluxo-status { padding: 12px; border-radius: 14px; background: #ecfdf5; border: 1px solid rgba(0,176,80,.25); color: #166534; font-weight: 900; }
        .fluxo-preview { white-space: pre-wrap; background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 14px; padding: 12px; color: #374151; font-size: 13px; font-weight: 800; line-height: 1.45; }
        @media (max-width: 900px) { .fluxo-grid, .fluxo-cards { grid-template-columns: 1fr; } }
      `}</style>

      <div className="fluxo-head">
        <h1>Fluxo Automático</h1>
        <p>Prepare relatório, pacote e envio em um único painel.</p>
      </div>

      {status && <div className="fluxo-status">{status}</div>}

      <div className="fluxo-cards">
        <div className="fluxo-card">
          <span>Cliente</span>
          <strong>{clienteFinal || "-"}</strong>
        </div>
        <div className="fluxo-card">
          <span>Valor</span>
          <strong>{brl(valorFinal)}</strong>
        </div>
        <div className="fluxo-card">
          <span>Status pacote</span>
          <strong>{pacoteSelecionado?.status || "-"}</strong>
        </div>
      </div>

      <div className="fluxo-box">
        <div className="fluxo-grid">
          <Campo label="Relatório">
            <select className="fluxo-select" value={relatorioId} onChange={(e) => setRelatorioId(e.target.value)}>
              <option value="">Selecionar relatório...</option>
              {relatorios.map((r) => (
                <option key={r.id} value={String(r.id)}>
                  {r.cliente || "Cliente"} — {r.tipo || "-"} — {brl(r.valor)} — {dataBR(r.criadoEm)}
                </option>
              ))}
            </select>
          </Campo>

          <Campo label="Pacote">
            <select className="fluxo-select" value={pacoteId} onChange={(e) => setPacoteId(e.target.value)}>
              <option value="">Selecionar pacote...</option>
              {pacotes.map((p) => (
                <option key={p.id} value={String(p.id)}>
                  {p.cliente || "Cliente"} — {p.status} — {brl(p.valor)} — {dataBR(p.criadoEm)}
                </option>
              ))}
            </select>
          </Campo>

          <Campo label="Cliente manual" full>
            <input
              className="fluxo-input"
              placeholder="Usar apenas se não tiver relatório/pacote"
              value={clienteManual}
              onChange={(e) => setClienteManual(e.target.value)}
            />
          </Campo>
        </div>

        <div className="fluxo-actions">
          <button className="fluxo-btn fluxo-btn-green" onClick={prepararEnvio}>
            Preparar envio PDF
          </button>
          <button className="fluxo-btn" onClick={marcarPacoteComoEnviado}>
            Marcar pacote enviado
          </button>
          <button className="fluxo-btn" onClick={copiarResumo}>
            Copiar resumo
          </button>
          <button className="fluxo-btn" onClick={carregar}>
            Atualizar dados
          </button>
        </div>
      </div>

      <div className="fluxo-box">
        <h3 style={{ marginTop: 0 }}>Prévia do fluxo</h3>
        <div className="fluxo-preview">
{[
  `Cliente: ${clienteFinal || "-"}`,
  `Valor: ${brl(valorFinal)}`,
  `Relatório: ${relatorioSelecionado ? `${relatorioSelecionado.tipo || "-"} • ${relatorioSelecionado.status || "Rascunho"}` : "-"}`,
  `Pacote: ${pacoteSelecionado ? `${pacoteSelecionado.status} • PDF ${pacoteSelecionado.pdfCliente ? "OK" : "pendente"} • NF ${pacoteSelecionado.notaFiscal ? "OK" : "pendente"} • Comprovante ${pacoteSelecionado.comprovante ? "OK" : "pendente"}` : "-"}`,
].join("\\n")}
        </div>
      </div>
    </div>
  );
}

function Campo({ label, full, children }: { label: string; full?: boolean; children: React.ReactNode }) {
  return (
    <div className={`fluxo-field ${full ? "full" : ""}`}>
      <label>{label}</label>
      {children}
    </div>
  );
}
