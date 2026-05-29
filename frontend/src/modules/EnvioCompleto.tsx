import { useEffect, useMemo, useState } from "react";

const REL_KEY = "ytalseg_relatorios_versoes_v11_2";
const PACOTE_KEY = "ytalseg_pacotes_cliente_v11_6";
const HANDOFF_KEY = "ytalseg_envio_pdf_handoff_v14";
const HIST_KEY = "ytalseg_envios_v25";

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

type EnvioHistorico = {
  id: number;
  cliente: string;
  valor: number;
  canal: string;
  criadoEm: string;
  mensagem: string;
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

export default function EnvioCompletoV25() {
  const [relatorios, setRelatorios] = useState<Relatorio[]>([]);
  const [pacotes, setPacotes] = useState<Pacote[]>([]);
  const [historico, setHistorico] = useState<EnvioHistorico[]>([]);
  const [relatorioId, setRelatorioId] = useState("");
  const [pacoteId, setPacoteId] = useState("");
  const [clienteManual, setClienteManual] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [status, setStatus] = useState("");

  function carregar() {
    try {
      const rel = JSON.parse(localStorage.getItem(REL_KEY) || "[]");
      const pac = JSON.parse(localStorage.getItem(PACOTE_KEY) || "[]");
      const hist = JSON.parse(localStorage.getItem(HIST_KEY) || "[]");
      setRelatorios(Array.isArray(rel) ? rel : []);
      setPacotes(Array.isArray(pac) ? pac : []);
      setHistorico(Array.isArray(hist) ? hist : []);
    } catch {
      setRelatorios([]);
      setPacotes([]);
      setHistorico([]);
    }
  }

  useEffect(() => {
    carregar();

    try {
      const raw = localStorage.getItem(HANDOFF_KEY);
      if (!raw) return;

      const data = JSON.parse(raw);
      if (data.cliente) setClienteManual(data.cliente);
      if (data.pacoteId) setPacoteId(String(data.pacoteId));
      if (data.relatorioId) setRelatorioId(String(data.relatorioId));
      setStatus("Dados carregados automaticamente do fluxo anterior.");
    } catch {
      // não bloqueia
    }
  }, []);

  const relatorio = useMemo(
    () => relatorios.find((r) => String(r.id) === relatorioId),
    [relatorios, relatorioId]
  );

  const pacote = useMemo(
    () => pacotes.find((p) => String(p.id) === pacoteId),
    [pacotes, pacoteId]
  );

  const clienteFinal = pacote?.cliente || relatorio?.cliente || clienteManual || "";
  const valorFinal = Number(pacote?.valor || relatorio?.valor || 0);

  function montarMensagem() {
    return [
      `Olá, segue o material do cliente ${clienteFinal || "-"} para conferência.`,
      "",
      `Valor: ${brl(valorFinal)}`,
      relatorio ? `Relatório: ${relatorio.tipo || "-"} • ${relatorio.status || "Rascunho"} • ${dataBR(relatorio.criadoEm)}` : "",
      pacote ? `Pacote: ${pacote.status} • ${dataBR(pacote.criadoEm)}` : "",
      pacote
        ? [
            "",
            "Checklist:",
            `- PDF Cliente: ${pacote.pdfCliente ? "OK" : "Pendente"}`,
            `- Nota Fiscal: ${pacote.notaFiscal ? "OK" : "Pendente"}`,
            `- Comprovante: ${pacote.comprovante ? "OK" : "Pendente"}`,
          ].join("\n")
        : "",
      arquivo ? `\nPDF selecionado: ${arquivo.name}` : "",
      pacote?.observacoes ? `\nObservações: ${pacote.observacoes}` : "",
    ]
      .filter(Boolean)
      .join("\n");
  }

  function salvarHistorico(canal: string) {
    const item: EnvioHistorico = {
      id: Date.now(),
      cliente: clienteFinal || "Cliente não informado",
      valor: valorFinal,
      canal,
      criadoEm: new Date().toISOString(),
      mensagem: montarMensagem(),
    };

    const novaLista = [item, ...historico].slice(0, 80);
    setHistorico(novaLista);
    localStorage.setItem(HIST_KEY, JSON.stringify(novaLista));
  }

  function validar() {
    if (!clienteFinal.trim()) {
      setStatus("Informe ou selecione um cliente.");
      return false;
    }

    return true;
  }

  function abrirWhatsApp() {
    if (!validar()) return;

    const numero = telefone.replace(/\D/g, "");
    const texto = encodeURIComponent(montarMensagem());
    const url = numero ? `https://wa.me/55${numero}?text=${texto}` : `https://wa.me/?text=${texto}`;
    window.open(url, "_blank");

    salvarHistorico("WhatsApp");
    setStatus("WhatsApp aberto. Anexe o PDF selecionado se necessário.");
  }

  function abrirEmail() {
    if (!validar()) return;

    const assunto = encodeURIComponent(`Relatório YTALSEG - ${clienteFinal}`);
    const corpo = encodeURIComponent(montarMensagem());
    window.location.href = `mailto:${email}?subject=${assunto}&body=${corpo}`;

    salvarHistorico("E-mail");
    setStatus("E-mail aberto. Anexe o PDF selecionado antes de enviar.");
  }

  async function copiarMensagem() {
    try {
      await navigator.clipboard.writeText(montarMensagem());
      salvarHistorico("Mensagem copiada");
      setStatus("Mensagem copiada.");
    } catch {
      setStatus("Não foi possível copiar automaticamente.");
    }
  }

  function marcarPacoteEnviado() {
    if (!pacote) {
      setStatus("Selecione um pacote para marcar como enviado.");
      return;
    }

    const atualizados = pacotes.map((p) =>
      p.id === pacote.id ? { ...p, status: "Enviado" } : p
    );

    setPacotes(atualizados);
    localStorage.setItem(PACOTE_KEY, JSON.stringify(atualizados));
    setStatus("Pacote marcado como Enviado.");
  }

  function limparSelecao() {
    setRelatorioId("");
    setPacoteId("");
    setClienteManual("");
    setTelefone("");
    setEmail("");
    setArquivo(null);
    setStatus("Seleção limpa.");
  }

  return (
    <div className="v25-page">
      <style>{`
        .v25-page { display: grid; gap: 16px; }
        .v25-head h1 { margin: 0; font-size: 30px; font-weight: 1000; color: #111827; }
        .v25-head p { margin: 6px 0 0; color: #6b7280; font-weight: 800; }
        .v25-box, .v25-card { background: white; border: 1px solid #e5e7eb; border-radius: 22px; padding: 18px; box-shadow: 0 10px 24px rgba(0,0,0,.06); }
        .v25-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; }
        .v25-field { display: grid; gap: 6px; }
        .v25-field.full { grid-column: 1 / -1; }
        .v25-field label { font-size: 12px; font-weight: 1000; color: #006b34; text-transform: uppercase; }
        .v25-input, .v25-select, .v25-textarea { width: 100%; border: 1px solid #d1d5db; border-radius: 10px; padding: 10px 12px; font-size: 13px; font-weight: 800; background: white; }
        .v25-textarea { min-height: 150px; resize: vertical; }
        .v25-actions { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 16px; }
        .v25-btn { border: 0; border-radius: 10px; padding: 10px 13px; font-weight: 900; cursor: pointer; background: #e5e7eb; color: #111; }
        .v25-btn-green { background: #00B050; color: white; }
        .v25-cards { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 12px; }
        .v25-card span { display: block; color: #6b7280; font-size: 12px; font-weight: 1000; text-transform: uppercase; }
        .v25-card strong { display: block; margin-top: 6px; color: #00B050; font-size: 24px; font-weight: 1000; word-break: break-word; }
        .v25-status { padding: 12px; border-radius: 14px; background: #ecfdf5; border: 1px solid rgba(0,176,80,.25); color: #166534; font-weight: 900; }
        .v25-preview { white-space: pre-wrap; background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 14px; padding: 12px; color: #374151; font-size: 13px; font-weight: 800; line-height: 1.45; }
        .v25-history { display: grid; gap: 8px; }
        .v25-history-item { border-top: 1px solid #eef0f2; padding-top: 8px; font-size: 13px; font-weight: 800; color: #374151; }
        @media (max-width: 900px) { .v25-grid, .v25-cards { grid-template-columns: 1fr; } }
      `}</style>

      <div className="v25-head">
        <h1>Envio Completo 1 Clique</h1>
        <p>Selecione relatório/pacote, PDF e canal de envio em uma única tela.</p>
      </div>

      {status && <div className="v25-status">{status}</div>}

      <div className="v25-cards">
        <div className="v25-card">
          <span>Cliente</span>
          <strong>{clienteFinal || "-"}</strong>
        </div>
        <div className="v25-card">
          <span>Valor</span>
          <strong>{brl(valorFinal)}</strong>
        </div>
        <div className="v25-card">
          <span>PDF</span>
          <strong>{arquivo?.name || "-"}</strong>
        </div>
      </div>

      <div className="v25-box">
        <div className="v25-grid">
          <Campo label="Relatório">
            <select className="v25-select" value={relatorioId} onChange={(e) => setRelatorioId(e.target.value)}>
              <option value="">Selecionar relatório...</option>
              {relatorios.map((r) => (
                <option key={r.id} value={String(r.id)}>
                  {r.cliente || "Cliente"} — {r.tipo || "-"} — {brl(r.valor)} — {dataBR(r.criadoEm)}
                </option>
              ))}
            </select>
          </Campo>

          <Campo label="Pacote">
            <select className="v25-select" value={pacoteId} onChange={(e) => setPacoteId(e.target.value)}>
              <option value="">Selecionar pacote...</option>
              {pacotes.map((p) => (
                <option key={p.id} value={String(p.id)}>
                  {p.cliente || "Cliente"} — {p.status} — {brl(p.valor)} — {dataBR(p.criadoEm)}
                </option>
              ))}
            </select>
          </Campo>

          <Campo label="Cliente manual">
            <input className="v25-input" value={clienteManual} onChange={(e) => setClienteManual(e.target.value)} placeholder="Opcional" />
          </Campo>

          <Campo label="PDF">
            <input className="v25-input" type="file" accept="application/pdf" onChange={(e) => setArquivo(e.target.files?.[0] || null)} />
          </Campo>

          <Campo label="WhatsApp">
            <input className="v25-input" value={telefone} onChange={(e) => setTelefone(e.target.value)} placeholder="DDD + número" />
          </Campo>

          <Campo label="E-mail">
            <input className="v25-input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="cliente@email.com" />
          </Campo>
        </div>

        <div className="v25-actions">
          <button className="v25-btn v25-btn-green" onClick={abrirWhatsApp}>Enviar WhatsApp</button>
          <button className="v25-btn v25-btn-green" onClick={abrirEmail}>Enviar E-mail</button>
          <button className="v25-btn" onClick={copiarMensagem}>Copiar mensagem</button>
          <button className="v25-btn" onClick={marcarPacoteEnviado}>Marcar pacote enviado</button>
          <button className="v25-btn" onClick={limparSelecao}>Limpar</button>
          <button className="v25-btn" onClick={carregar}>Atualizar</button>
        </div>
      </div>

      <div className="v25-box">
        <h3 style={{ marginTop: 0 }}>Prévia da mensagem</h3>
        <div className="v25-preview">{montarMensagem()}</div>
      </div>

      <div className="v25-box">
        <h3 style={{ marginTop: 0 }}>Histórico rápido de envios</h3>
        <div className="v25-history">
          {historico.length === 0 && <div>Nenhum envio registrado ainda.</div>}
          {historico.slice(0, 8).map((h) => (
            <div className="v25-history-item" key={h.id}>
              {dataBR(h.criadoEm)} • {h.canal} • {h.cliente} • {brl(h.valor)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Campo({ label, full, children }: { label: string; full?: boolean; children: React.ReactNode }) {
  return (
    <div className={`v25-field ${full ? "full" : ""}`}>
      <label>{label}</label>
      {children}
    </div>
  );
}
