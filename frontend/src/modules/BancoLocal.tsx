import { useEffect, useMemo, useState } from "react";

const CHAVES = [
  { key: "ytalseg_relatorios_versoes_v11_2", label: "Relatórios / versões" },
  { key: "ytalseg_pacotes_cliente_v11_6", label: "Pacotes do cliente" },
  { key: "ytalseg_config_v11_7", label: "Configurações do sistema" },
  { key: "ytalseg_relatorio_rascunho_v11", label: "Rascunho automático" },
  { key: "ytalseg_envio_pdf_handoff_v14", label: "Vínculo pacote → envio" },
];

type ItemBanco = {
  key: string;
  label: string;
  existe: boolean;
  tamanho: number;
  registros: number;
};

function bytes(v: number) {
  if (!v) return "0 B";
  if (v < 1024) return `${v} B`;
  const kb = v / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  return `${(kb / 1024).toFixed(2)} MB`;
}

function contarRegistros(raw: string | null) {
  if (!raw) return 0;
  try {
    const data = JSON.parse(raw);
    if (Array.isArray(data)) return data.length;
    if (data && typeof data === "object") return Object.keys(data).length;
  } catch {
    return 1;
  }
  return 1;
}

export default function BancoLocal() {
  const [itens, setItens] = useState<ItemBanco[]>([]);
  const [status, setStatus] = useState("");

  function carregar() {
    const lista = CHAVES.map((item) => {
      const raw = localStorage.getItem(item.key);
      return {
        key: item.key,
        label: item.label,
        existe: Boolean(raw),
        tamanho: raw ? new Blob([raw]).size : 0,
        registros: contarRegistros(raw),
      };
    });
    setItens(lista);
  }

  useEffect(() => {
    carregar();
  }, []);

  const resumo = useMemo(() => {
    return {
      bases: itens.filter((i) => i.existe).length,
      registros: itens.reduce((acc, i) => acc + i.registros, 0),
      tamanho: itens.reduce((acc, i) => acc + i.tamanho, 0),
    };
  }, [itens]);

  function exportarBanco() {
    const payload = {
      versao: "V17",
      geradoEm: new Date().toISOString(),
      dados: CHAVES.reduce((acc, item) => {
        acc[item.key] = localStorage.getItem(item.key);
        return acc;
      }, {} as Record<string, string | null>),
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ytalseg_banco_local_v17_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setStatus("Banco local exportado com sucesso.");
  }

  function importarBanco(file: File | null) {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(String(reader.result || "{}"));
        const dados = data.dados || data;

        Object.keys(dados).forEach((key) => {
          if (!CHAVES.some((c) => c.key === key)) return;
          if (dados[key] === null || dados[key] === undefined) {
            localStorage.removeItem(key);
          } else {
            localStorage.setItem(key, String(dados[key]));
          }
        });

        carregar();
        setStatus("Banco local importado com sucesso.");
      } catch {
        setStatus("Erro ao importar banco local.");
      }
    };

    reader.readAsText(file);
  }

  function limparChave(key: string) {
    const ok = window.confirm(`Deseja apagar a base local: ${key}?`);
    if (!ok) return;

    localStorage.removeItem(key);
    carregar();
    setStatus("Base apagada.");
  }

  return (
    <div className="banco-page">
      <style>{`
        .banco-page { display: grid; gap: 16px; }
        .banco-head { display: flex; justify-content: space-between; align-items: end; gap: 14px; flex-wrap: wrap; }
        .banco-title h1 { margin: 0; font-size: 30px; font-weight: 1000; color: #111827; }
        .banco-title p { margin: 6px 0 0; color: #6b7280; font-weight: 800; }
        .banco-actions { display: flex; gap: 8px; flex-wrap: wrap; }
        .banco-btn { border: 0; border-radius: 10px; padding: 10px 13px; font-weight: 900; cursor: pointer; background: #e5e7eb; color: #111; }
        .banco-btn-green { background: #00B050; color: white; }
        .banco-cards { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 12px; }
        .banco-card, .banco-box { background: white; border: 1px solid #e5e7eb; border-radius: 18px; padding: 16px; box-shadow: 0 10px 22px rgba(0,0,0,.05); }
        .banco-card span { display: block; color: #6b7280; font-size: 12px; font-weight: 1000; text-transform: uppercase; }
        .banco-card strong { display: block; margin-top: 6px; color: #00B050; font-size: 26px; font-weight: 1000; }
        .banco-table { width: 100%; border-collapse: collapse; font-size: 13px; }
        .banco-table th { text-align: left; background: #f9fafb; padding: 12px; color: #374151; font-weight: 1000; border-bottom: 1px solid #e5e7eb; }
        .banco-table td { padding: 12px; border-bottom: 1px solid #eef0f2; font-weight: 800; }
        .banco-badge { display: inline-flex; padding: 5px 9px; border-radius: 999px; font-size: 12px; font-weight: 1000; background: #ecfdf5; color: #166534; }
        .banco-badge.off { background: #f3f4f6; color: #6b7280; }
        .banco-status { padding: 12px; border-radius: 14px; background: #ecfdf5; border: 1px solid rgba(0,176,80,.25); color: #166534; font-weight: 900; }
        @media (max-width: 900px) { .banco-cards { grid-template-columns: 1fr; } .banco-table { font-size: 12px; } }
      `}</style>

      <div className="banco-head">
        <div className="banco-title">
          <h1>Banco Local</h1>
          <p>Controle, exportação e restauração dos dados locais do sistema.</p>
        </div>

        <div className="banco-actions">
          <button className="banco-btn banco-btn-green" onClick={exportarBanco}>Exportar banco</button>
          <label className="banco-btn">
            Importar banco
            <input type="file" accept="application/json" style={{ display: "none" }} onChange={(e) => importarBanco(e.target.files?.[0] || null)} />
          </label>
          <button className="banco-btn" onClick={carregar}>Atualizar</button>
        </div>
      </div>

      {status && <div className="banco-status">{status}</div>}

      <div className="banco-cards">
        <Card titulo="Bases ativas" valor={String(resumo.bases)} />
        <Card titulo="Registros" valor={String(resumo.registros)} />
        <Card titulo="Tamanho" valor={bytes(resumo.tamanho)} />
      </div>

      <div className="banco-box">
        <table className="banco-table">
          <thead>
            <tr>
              <th>Base</th>
              <th>Status</th>
              <th>Registros</th>
              <th>Tamanho</th>
              <th>Ação</th>
            </tr>
          </thead>
          <tbody>
            {itens.map((item) => (
              <tr key={item.key}>
                <td><strong>{item.label}</strong><br /><small>{item.key}</small></td>
                <td><span className={`banco-badge ${item.existe ? "" : "off"}`}>{item.existe ? "Ativa" : "Vazia"}</span></td>
                <td>{item.registros}</td>
                <td>{bytes(item.tamanho)}</td>
                <td><button className="banco-btn" onClick={() => limparChave(item.key)}>Limpar</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Card({ titulo, valor }: { titulo: string; valor: string }) {
  return (
    <div className="banco-card">
      <span>{titulo}</span>
      <strong>{valor}</strong>
    </div>
  );
}
