import React, { useEffect, useMemo, useState } from "react";

const API_BASE = "/api";

type PDFItem = {
  id: string;
  tipo: "Cliente" | "Interno" | string;
  nome: string;
  caminho: string;
  criadoEm: string;
};

declare global {
  interface Window {
    ytalsegAPI?: {
      listarPDFs?: () => Promise<{ ok: boolean; historico: PDFItem[] }>;
      abrirPDF?: (caminho: string) => Promise<{ ok: boolean; erro?: string }>;
      abrirPastaPDF?: (caminho: string) => Promise<{ ok: boolean; erro?: string }>;
    };
  }
}

function dataBR(iso: string) {
  try {
    return new Date(iso).toLocaleString("pt-BR");
  } catch {
    return iso;
  }
}

export default function HistoricoPDFs() {
  const [lista, setLista] = useState<PDFItem[]>([]);
  const [busca, setBusca] = useState("");
  const [tipo, setTipo] = useState("Todos");
  const [msg, setMsg] = useState("");

  async function carregar() {
    try {
      // Modo desktop: usa API Electron
      if (window.ytalsegAPI?.listarPDFs) {
        const res = await window.ytalsegAPI.listarPDFs();
        if (res.ok) setLista(res.historico || []);
        return;
      }

      // Modo web/mobile: usa API HTTP
      const res = await fetch(`${API_BASE}/historico-pdfs`);
      const data = await res.json();
      if (data.ok) setLista(data.historico || []);
      else setMsg("Erro ao carregar histórico. Verifique a conexão com o servidor.");
    } catch (err) {
      setMsg(`Erro ao carregar PDFs: ${err}`);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  const filtrados = useMemo(() => {
    return lista.filter((item) => {
      const okTipo = tipo === "Todos" || item.tipo === tipo;
      const alvo = `${item.nome} ${item.caminho} ${item.tipo}`.toLowerCase();
      const okBusca = alvo.includes(busca.toLowerCase());
      return okTipo && okBusca;
    });
  }, [lista, busca, tipo]);

  async function abrir(item: PDFItem) {
    // Modo desktop: abre via API Electron
    if (window.ytalsegAPI?.abrirPDF) {
      const res = await window.ytalsegAPI.abrirPDF(item.caminho);
      if (res && !res.ok) setMsg(res.erro || "Não consegui abrir o PDF.");
      return;
    }

    // Modo web/mobile: abre em nova aba
    const urlDownload = (item as any).url_download || `/pdfs/${item.nome}`;
    window.open(`${API_BASE}${urlDownload}`, "_blank");
  }

  async function abrirPasta(item: PDFItem) {
    // Modo desktop: abre pasta via API Electron
    if (window.ytalsegAPI?.abrirPastaPDF) {
      const res = await window.ytalsegAPI.abrirPastaPDF(item.caminho);
      if (res && !res.ok) setMsg(res.erro || "Não consegui abrir a pasta.");
      return;
    }

    // Modo web/mobile: tenta abrir a pasta (geralmente não funciona no web)
    setMsg("Abrir pasta não disponível no modo web. Use o modo desktop para acessar o diretório.");
  }

  return (
    <div className="hist-page">
      <style>{`
        .hist-page {
          display: grid;
          gap: 16px;
        }

        .hist-head {
          display: flex;
          justify-content: space-between;
          gap: 14px;
          align-items: end;
          flex-wrap: wrap;
        }

        .hist-title h1 {
          margin: 0;
          font-size: 30px;
          font-weight: 1000;
          color: #111827;
        }

        .hist-title p {
          margin: 6px 0 0;
          color: #6b7280;
          font-weight: 800;
        }

        .hist-actions {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          align-items: center;
        }

        .hist-input,
        .hist-select {
          border: 1px solid #d1d5db;
          border-radius: 10px;
          padding: 10px 12px;
          font-size: 13px;
          font-weight: 800;
          background: white;
        }

        .hist-btn {
          border: 0;
          border-radius: 10px;
          padding: 10px 13px;
          font-weight: 900;
          cursor: pointer;
          background: #e5e7eb;
          color: #111;
        }

        .hist-btn-green {
          background: #00B050;
          color: white;
        }

        .hist-card {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 22px;
          box-shadow: 0 10px 24px rgba(0,0,0,.06);
          overflow: hidden;
        }

        .hist-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 13px;
        }

        .hist-table th {
          text-align: left;
          background: #f9fafb;
          padding: 12px;
          border-bottom: 1px solid #e5e7eb;
          font-weight: 1000;
          color: #374151;
        }

        .hist-table td {
          padding: 12px;
          border-bottom: 1px solid #eef0f2;
          font-weight: 750;
          vertical-align: middle;
        }

        .hist-badge {
          display: inline-flex;
          padding: 5px 9px;
          border-radius: 999px;
          background: #ecfdf5;
          color: #166534;
          font-size: 12px;
          font-weight: 1000;
        }

        .hist-badge.interno {
          background: #eff6ff;
          color: #1d4ed8;
        }

        .hist-path {
          max-width: 420px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          color: #6b7280;
          font-size: 12px;
        }

        .hist-empty {
          padding: 22px;
          color: #6b7280;
          font-weight: 900;
        }

        .hist-msg {
          padding: 12px;
          border-radius: 14px;
          background: #fff7ed;
          border: 1px solid #fed7aa;
          color: #9a3412;
          font-weight: 900;
        }
      `}</style>

      <div className="hist-head">
        <div className="hist-title">
          <h1>Histórico de PDFs</h1>
          <p>Lista automática dos PDFs Cliente e Interno gerados pelo aplicativo.</p>
        </div>

        <div className="hist-actions">
          <input
            className="hist-input"
            placeholder="Buscar PDF..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />

          <select className="hist-select" value={tipo} onChange={(e) => setTipo(e.target.value)}>
            <option>Todos</option>
            <option>Cliente</option>
            <option>Interno</option>
          </select>

          <button className="hist-btn hist-btn-green" onClick={carregar}>
            Atualizar
          </button>
        </div>
      </div>

      {msg && <div className="hist-msg">{msg}</div>}

      <div className="hist-card">
        <table className="hist-table">
          <thead>
            <tr>
              <th>Tipo</th>
              <th>Arquivo</th>
              <th>Gerado em</th>
              <th>Caminho</th>
              <th>Ações</th>
            </tr>
          </thead>

          <tbody>
            {filtrados.map((item) => (
              <tr key={item.id}>
                <td>
                  <span className={`hist-badge ${item.tipo === "Interno" ? "interno" : ""}`}>
                    {item.tipo}
                  </span>
                </td>
                <td>{item.nome}</td>
                <td>{dataBR(item.criadoEm)}</td>
                <td>
                  <div className="hist-path" title={item.caminho}>
                    {item.caminho}
                  </div>
                </td>
                <td>
                  <div className="hist-actions">
                    <button className="hist-btn" onClick={() => abrir(item)}>
                      Abrir
                    </button>
                    <button className="hist-btn" onClick={() => abrirPasta(item)}>
                      Pasta
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtrados.length === 0 && (
          <div className="hist-empty">
            Nenhum PDF encontrado ainda. Gere um PDF Cliente ou Interno para aparecer aqui.
          </div>
        )}
      </div>
    </div>
  );
}
