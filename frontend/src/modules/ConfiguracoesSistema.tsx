import { useEffect, useState } from "react";

const KEY = "ytalseg_config_v11_7";

type Config = {
  empresa: string;
  mesPadrao: string;
  pastaPDF: string;
  pastaBackup: string;
  observacoesPadrao: string;
  pix: string;
  responsavel: string;
  email: string;
  telefone: string;
};

const PADRAO: Config = {
  empresa: "",
  mesPadrao: "",
  pastaPDF: "",
  pastaBackup: "",
  observacoesPadrao: "",
  pix: "",
  responsavel: "",
  email: "",
  telefone: "",
};

export default function ConfiguracoesSistema() {
  const [config, setConfig] = useState<Config>(PADRAO);
  const [msg, setMsg] = useState("");

  function carregar() {
    try {
      const data = JSON.parse(localStorage.getItem(KEY) || "{}");
      setConfig({ ...PADRAO, ...data });
    } catch {
      setConfig(PADRAO);
    }
  }

  function salvar() {
    localStorage.setItem(KEY, JSON.stringify(config));
    setMsg("Configurações salvas com sucesso.");
  }

  function limpar() {
    const ok = window.confirm("Deseja limpar todas as configurações salvas?");
    if (!ok) return;

    localStorage.removeItem(KEY);
    setConfig(PADRAO);
    setMsg("Configurações limpas.");
  }

  function update(campo: keyof Config, valor: string) {
    setConfig((prev) => ({ ...prev, [campo]: valor }));
  }

  useEffect(() => {
    carregar();
  }, []);

  return (
    <div className="config-page">
      <style>{`
        .config-page {
          display: grid;
          gap: 16px;
        }

        .config-head {
          display: flex;
          justify-content: space-between;
          align-items: end;
          gap: 14px;
          flex-wrap: wrap;
        }

        .config-title h1 {
          margin: 0;
          font-size: 30px;
          font-weight: 1000;
          color: #111827;
        }

        .config-title p {
          margin: 6px 0 0;
          color: #6b7280;
          font-weight: 800;
        }

        .config-box {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 22px;
          padding: 18px;
          box-shadow: 0 10px 24px rgba(0,0,0,.06);
        }

        .config-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 14px;
        }

        .config-field {
          display: grid;
          gap: 6px;
        }

        .config-field.full {
          grid-column: 1 / -1;
        }

        .config-field label {
          font-size: 12px;
          font-weight: 1000;
          color: #006b34;
          text-transform: uppercase;
        }

        .config-input,
        .config-textarea {
          width: 100%;
          border: 1px solid #d1d5db;
          border-radius: 10px;
          padding: 10px 12px;
          font-size: 13px;
          font-weight: 800;
          background: white;
        }

        .config-textarea {
          min-height: 100px;
          resize: vertical;
        }

        .config-actions {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          margin-top: 16px;
        }

        .config-btn {
          border: 0;
          border-radius: 10px;
          padding: 10px 13px;
          font-weight: 900;
          cursor: pointer;
          background: #e5e7eb;
          color: #111;
        }

        .config-btn-green {
          background: #00B050;
          color: white;
        }

        .config-msg {
          padding: 12px;
          border-radius: 14px;
          background: #ecfdf5;
          border: 1px solid rgba(0,176,80,.25);
          color: #166534;
          font-weight: 900;
        }

        .config-preview {
          display: grid;
          gap: 8px;
          font-size: 13px;
          font-weight: 800;
          color: #374151;
        }

        .config-preview strong {
          color: #111827;
        }

        @media (max-width: 900px) {
          .config-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="config-head">
        <div className="config-title">
          <h1>Configurações do Sistema</h1>
          <p>Dados padrão para relatórios, backups, PDFs e atendimento.</p>
        </div>
      </div>

      {msg && <div className="config-msg">{msg}</div>}

      <div className="config-box">
        <div className="config-grid">
          <Campo label="Empresa padrão">
            <input className="config-input" value={config.empresa} onChange={(e) => update("empresa", e.target.value)} placeholder="Ex: YTALSEG" />
          </Campo>

          <Campo label="Mês padrão">
            <input className="config-input" value={config.mesPadrao} onChange={(e) => update("mesPadrao", e.target.value)} placeholder="Ex: Março / 2026" />
          </Campo>

          <Campo label="Pasta padrão de PDFs">
            <input className="config-input" value={config.pastaPDF} onChange={(e) => update("pastaPDF", e.target.value)} placeholder="Ex: C:\\YTALSEG\\PDFs" />
          </Campo>

          <Campo label="Pasta padrão de backup">
            <input className="config-input" value={config.pastaBackup} onChange={(e) => update("pastaBackup", e.target.value)} placeholder="Ex: C:\\YTALSEG\\Backups" />
          </Campo>

          <Campo label="Pix / dados bancários">
            <input className="config-input" value={config.pix} onChange={(e) => update("pix", e.target.value)} placeholder="Chave Pix ou dados bancários" />
          </Campo>

          <Campo label="Responsável / assinatura">
            <input className="config-input" value={config.responsavel} onChange={(e) => update("responsavel", e.target.value)} placeholder="Nome do responsável" />
          </Campo>

          <Campo label="E-mail">
            <input className="config-input" value={config.email} onChange={(e) => update("email", e.target.value)} placeholder="email@empresa.com" />
          </Campo>

          <Campo label="Telefone">
            <input className="config-input" value={config.telefone} onChange={(e) => update("telefone", e.target.value)} placeholder="(00) 00000-0000" />
          </Campo>

          <Campo label="Observações padrão" full>
            <textarea className="config-textarea" value={config.observacoesPadrao} onChange={(e) => update("observacoesPadrao", e.target.value)} placeholder="Texto padrão para observações..." />
          </Campo>
        </div>

        <div className="config-actions">
          <button className="config-btn config-btn-green" onClick={salvar}>Salvar configurações</button>
          <button className="config-btn" onClick={carregar}>Recarregar</button>
          <button className="config-btn" onClick={limpar}>Limpar</button>
        </div>
      </div>

      <div className="config-box">
        <h3 style={{ marginTop: 0 }}>Prévia das configurações</h3>
        <div className="config-preview">
          <div><strong>Empresa:</strong> {config.empresa || "-"}</div>
          <div><strong>Mês padrão:</strong> {config.mesPadrao || "-"}</div>
          <div><strong>Responsável:</strong> {config.responsavel || "-"}</div>
          <div><strong>Pix / Banco:</strong> {config.pix || "-"}</div>
          <div><strong>E-mail:</strong> {config.email || "-"}</div>
          <div><strong>Telefone:</strong> {config.telefone || "-"}</div>
        </div>
      </div>
    </div>
  );
}

function Campo({ label, full, children }: { label: string; full?: boolean; children: React.ReactNode }) {
  return (
    <div className={`config-field ${full ? "full" : ""}`}>
      <label>{label}</label>
      {children}
    </div>
  );
}
