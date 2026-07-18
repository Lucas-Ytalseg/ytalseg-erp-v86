import { useEffect, useMemo, useState } from "react";

type AnexoInfo = {
  nome: string;
  tamanho: number;
  url: string;
};

function formatBytes(bytes: number) {
  if (!bytes) return "0 KB";
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  return `${(kb / 1024).toFixed(2)} MB`;
}

export default function EnvioPDFReal() {
  const [cliente, setCliente] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [mensagem, setMensagem] = useState("Olá, segue em anexo/compartilhamento o relatório YTALSEG para conferência.");
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [status, setStatus] = useState("");
  const [pacoteRecebido, setPacoteRecebido] = useState<any | null>(null);

  const anexo: AnexoInfo | null = useMemo(() => {
    if (!arquivo) return null;
    return {
      nome: arquivo.name,
      tamanho: arquivo.size,
      url: URL.createObjectURL(arquivo),
    };
  }, [arquivo]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("ytalseg_envio_pdf_handoff_v14");
      if (!raw) return;

      const data = JSON.parse(raw);
      setPacoteRecebido(data);

      if (data.cliente) setCliente(data.cliente);
      if (data.mensagem) setMensagem(data.mensagem);

      setStatus("Dados recebidos do Pacote Cliente. Selecione o PDF e envie.");
    } catch {
      // não bloqueia a tela
    }
  }, []);

  function limparDadosDoPacote() {
    localStorage.removeItem("ytalseg_envio_pdf_handoff_v14");
    setPacoteRecebido(null);
    setStatus("Vínculo com pacote removido desta tela.");
  }

  function validar() {
    if (!cliente.trim()) {
      setStatus("Informe o cliente antes de enviar.");
      return false;
    }

    if (!arquivo) {
      setStatus("Selecione o PDF do relatório antes de enviar.");
      return false;
    }

    return true;
  }

  async function copiarMensagem() {
    const texto = montarMensagem();
    try {
      await navigator.clipboard.writeText(texto);
      setStatus("Mensagem copiada. Agora anexe o PDF no e-mail ou WhatsApp.");
    } catch {
      setStatus("Não consegui copiar automaticamente. Copie manualmente a mensagem da tela.");
    }
  }

  function montarMensagem() {
    return [
      `Cliente: ${cliente || "-"}`,
      "",
      mensagem,
      "",
      arquivo ? `Arquivo: ${arquivo.name} (${formatBytes(arquivo.size)})` : "Arquivo: não selecionado",
    ].join("\n");
  }

  function abrirWhatsApp() {
    if (!validar()) return;

    const numeroLimpo = telefone.replace(/\D/g, "");
    const texto = encodeURIComponent(montarMensagem());
    const url = numeroLimpo
      ? `https://wa.me/55${numeroLimpo}?text=${texto}`
      : `https://wa.me/?text=${texto}`;

    window.open(url, "_blank");
    setStatus("WhatsApp aberto. Anexe o PDF selecionado manualmente na conversa.");
  }

  function abrirEmail() {
    if (!validar()) return;

    const assunto = encodeURIComponent(`Relatório YTALSEG - ${cliente}`);
    const corpo = encodeURIComponent(montarMensagem());
    const destino = email.trim();

    window.location.href = `mailto:${destino}?subject=${assunto}&body=${corpo}`;
    setStatus("E-mail aberto. Anexe o PDF selecionado manualmente antes de enviar.");
  }

  function abrirPDF() {
    if (!anexo) {
      setStatus("Selecione um PDF primeiro.");
      return;
    }

    window.open(anexo.url, "_blank");
    setStatus("PDF aberto para conferência.");
  }

  return (
    <div className="envio-pdf-page">
      <style>{`
        .envio-pdf-page {
          display: grid;
          gap: 16px;
        }

        .envio-pdf-head h1 {
          margin: 0;
          font-size: 30px;
          font-weight: 1000;
          color: #111827;
        }

        .envio-pdf-head p {
          margin: 6px 0 0;
          color: #6b7280;
          font-weight: 800;
        }

        .envio-pdf-box {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 22px;
          padding: 18px;
          box-shadow: 0 10px 24px rgba(0,0,0,.06);
        }

        .envio-pdf-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 14px;
        }

        .envio-pdf-field {
          display: grid;
          gap: 6px;
        }

        .envio-pdf-field.full {
          grid-column: 1 / -1;
        }

        .envio-pdf-field label {
          font-size: 12px;
          font-weight: 1000;
          color: #006b34;
          text-transform: uppercase;
        }

        .envio-pdf-input,
        .envio-pdf-textarea {
          width: 100%;
          border: 1px solid #d1d5db;
          border-radius: 10px;
          padding: 10px 12px;
          font-size: 13px;
          font-weight: 800;
          background: white;
        }

        .envio-pdf-textarea {
          min-height: 120px;
          resize: vertical;
        }

        .envio-pdf-actions {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          margin-top: 16px;
        }

        .envio-pdf-btn {
          border: 0;
          border-radius: 10px;
          padding: 10px 13px;
          font-weight: 900;
          cursor: pointer;
          background: #e5e7eb;
          color: #111;
        }

        .envio-pdf-btn-green {
          background: #00B050;
          color: white;
        }

        .envio-pdf-status {
          padding: 12px;
          border-radius: 14px;
          background: #ecfdf5;
          border: 1px solid rgba(0,176,80,.25);
          color: #166534;
          font-weight: 900;
        }

        .envio-pdf-file {
          padding: 12px;
          border-radius: 14px;
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          color: #374151;
          font-size: 13px;
          font-weight: 850;
        }

        .envio-pdf-preview {
          white-space: pre-wrap;
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 14px;
          padding: 12px;
          color: #374151;
          font-size: 13px;
          font-weight: 750;
          line-height: 1.45;
        }

        @media (max-width: 900px) {
          .envio-pdf-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="envio-pdf-head">
        <h1>Envio com PDF Real</h1>
        <p>Selecione o PDF gerado, prepare a mensagem e abra WhatsApp ou e-mail.</p>
      </div>

      {status && <div className="envio-pdf-status">{status}</div>}

      {pacoteRecebido && (
        <div className="envio-pdf-status">
          <strong>Dados vinculados do Pacote Cliente:</strong>
          <br />
          Cliente: {pacoteRecebido.cliente || "-"} • Valor: {pacoteRecebido.valor ? new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(pacoteRecebido.valor || 0)) : "-"} • Status: {pacoteRecebido.status || "-"}
          <div style={{ marginTop: 10 }}>
            <button className="envio-pdf-btn" onClick={limparDadosDoPacote}>
              Limpar vínculo
            </button>
          </div>
        </div>
      )}

      <div className="envio-pdf-box">
        <div className="envio-pdf-grid">
          <Campo label="Cliente">
            <input className="envio-pdf-input" value={cliente} onChange={(e) => setCliente(e.target.value)} placeholder="Nome do cliente" />
          </Campo>

          <Campo label="Telefone WhatsApp">
            <input className="envio-pdf-input" value={telefone} onChange={(e) => setTelefone(e.target.value)} placeholder="DDD + número" />
          </Campo>

          <Campo label="E-mail">
            <input className="envio-pdf-input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="cliente@email.com" />
          </Campo>

          <Campo label="PDF do relatório">
            <input className="envio-pdf-input" type="file" accept="application/pdf" onChange={(e) => setArquivo(e.target.files?.[0] || null)} />
          </Campo>

          <Campo label="Mensagem" full>
            <textarea className="envio-pdf-textarea" value={mensagem} onChange={(e) => setMensagem(e.target.value)} />
          </Campo>
        </div>

        {anexo && (
          <div className="envio-pdf-file" style={{ marginTop: 14 }}>
            PDF selecionado: <strong>{anexo.nome}</strong> — {formatBytes(anexo.tamanho)}
          </div>
        )}

        <div className="envio-pdf-actions">
          <button className="envio-pdf-btn envio-pdf-btn-green" onClick={abrirWhatsApp}>
            Abrir WhatsApp
          </button>
          <button className="envio-pdf-btn envio-pdf-btn-green" onClick={abrirEmail}>
            Abrir e-mail
          </button>
          <button className="envio-pdf-btn" onClick={abrirPDF}>
            Conferir PDF
          </button>
          <button className="envio-pdf-btn" onClick={copiarMensagem}>
            Copiar mensagem
          </button>
        </div>
      </div>

      <div className="envio-pdf-box">
        <h3 style={{ marginTop: 0 }}>Prévia da mensagem</h3>
        <div className="envio-pdf-preview">{montarMensagem()}</div>
      </div>
    </div>
  );
}

function Campo({ label, full, children }: { label: string; full?: boolean; children: React.ReactNode }) {
  return (
    <div className={`envio-pdf-field ${full ? "full" : ""}`}>
      <label>{label}</label>
      {children}
    </div>
  );
}
