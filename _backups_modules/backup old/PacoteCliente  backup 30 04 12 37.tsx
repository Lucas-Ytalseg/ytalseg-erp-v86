import { useEffect, useMemo, useState } from "react";

declare global {
  interface Window {
    ytalsegAPI?: {
      exportarPacote?: (data: {
        cliente: string;
        arquivos: { nome: string; conteudo: string }[];
      }) => Promise<{ ok: boolean; path?: string; erro?: string }>;
    };
  }
}

const REL_KEY = "ytalseg_relatorios_versoes_v11_2";
const PACOTE_KEY = "ytalseg_pacotes_cliente_v11_6";

type RelatorioHistorico = {
  id: number;
  tipo?: "cliente" | "interno" | string;
  cliente?: string;
  valor?: number;
  status?: string;
  criadoEm?: string;
};

type Pacote = {
  id: number;
  cliente: string;
  relatorioId?: number;
  valor?: number;
  status: string;
  criadoEm: string;
  pdfCliente: boolean;
  notaFiscal: boolean;
  comprovante: boolean;
  observacoes: string;
};

const STATUS = ["Pendente", "Em separação", "Enviado", "Aprovado", "Concluído"];

function brl(v?: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(v || 0));
}

function dataBR(v?: string) {
  if (!v) return "-";
  try { return new Date(v).toLocaleString("pt-BR"); } catch { return v; }
}

export default function PacoteCliente() {
  const [relatorios, setRelatorios] = useState<RelatorioHistorico[]>([]);
  const [pacotes, setPacotes] = useState<Pacote[]>([]);
  const [relatorioSelecionado, setRelatorioSelecionado] = useState("");
  const [clienteManual, setClienteManual] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [exportStatus, setExportStatus] = useState("");

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

  function salvarPacotes(lista: Pacote[]) {
    setPacotes(lista);
    localStorage.setItem(PACOTE_KEY, JSON.stringify(lista));
  }

  useEffect(() => { carregar(); }, []);

  const relatoriosCliente = useMemo(
    () => relatorios.filter((r) => (r.tipo || "").toLowerCase() === "cliente"),
    [relatorios]
  );

  const resumo = useMemo(() => {
    const total = pacotes.reduce((acc, p) => acc + Number(p.valor || 0), 0);
    return {
      total,
      concluidos: pacotes.filter((p) => p.status === "Concluído").length,
      pendentes: pacotes.filter((p) => p.status !== "Concluído").length,
    };
  }, [pacotes]);

  function criarPacote() {
    const rel = relatorios.find((r) => String(r.id) === relatorioSelecionado);
    const cliente = rel?.cliente || clienteManual.trim();

    if (!cliente) {
      alert("Informe um cliente ou selecione um relatório.");
      return;
    }

    const novo: Pacote = {
      id: Date.now(),
      cliente,
      relatorioId: rel?.id,
      valor: rel?.valor || 0,
      status: "Pendente",
      criadoEm: new Date().toISOString(),
      pdfCliente: Boolean(rel),
      notaFiscal: false,
      comprovante: false,
      observacoes,
    };

    salvarPacotes([novo, ...pacotes]);
    setRelatorioSelecionado("");
    setClienteManual("");
    setObservacoes("");
  }

  function atualizarPacote(id: number, campo: keyof Pacote, valor: any) {
    salvarPacotes(pacotes.map((p) => (p.id === id ? { ...p, [campo]: valor } : p)));
  }

  function removerPacote(id: number) {
    if (!window.confirm("Deseja remover este pacote do cliente?")) return;
    salvarPacotes(pacotes.filter((p) => p.id !== id));
  }

  async function exportarPacote(p: Pacote) {
    try {
      if (!window.ytalsegAPI?.exportarPacote) {
        setExportStatus("Exportar pacote está disponível apenas no aplicativo instalado.");
        return;
      }

      const conteudoInfo = [
        `Cliente: ${p.cliente}`,
        `Valor: ${brl(p.valor)}`,
        `Status: ${p.status}`,
        `Criado em: ${dataBR(p.criadoEm)}`,
        `PDF Cliente: ${p.pdfCliente ? "Sim" : "Não"}`,
        `Nota Fiscal: ${p.notaFiscal ? "Sim" : "Não"}`,
        `Comprovante: ${p.comprovante ? "Sim" : "Não"}`,
        "",
        "Observações:",
        p.observacoes || "-"
      ].join("\n");

      const res = await window.ytalsegAPI.exportarPacote({
        cliente: p.cliente || "Cliente",
        arquivos: [
          {
            nome: "info_pacote_cliente.txt",
            conteudo: conteudoInfo,
          },
          {
            nome: "checklist_entrega.txt",
            conteudo: `Checklist de entrega\n\n[${p.pdfCliente ? "x" : " "}] PDF Cliente\n[${p.notaFiscal ? "x" : " "}] Nota Fiscal\n[${p.comprovante ? "x" : " "}] Comprovante\n`,
          },
        ],
      });

      if (res.ok) {
        setExportStatus(`Pacote exportado com sucesso: ${res.path || ""}`);
      } else if (res.erro !== "cancelado") {
        setExportStatus(res.erro || "Não foi possível exportar o pacote.");
      }
    } catch {
      setExportStatus("Erro ao exportar pacote.");
    }
  }

  return (
    <div className="pacote-page">
      <style>{`
        .pacote-page { display: grid; gap: 16px; }
        .pacote-head { display: flex; justify-content: space-between; align-items: end; gap: 14px; flex-wrap: wrap; }
        .pacote-title h1 { margin: 0; font-size: 30px; font-weight: 1000; color: #111827; }
        .pacote-title p { margin: 6px 0 0; color: #6b7280; font-weight: 800; }
        .pacote-cards { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 12px; }
        .pacote-card, .pacote-box, .pacote-item { background: white; border: 1px solid #e5e7eb; border-radius: 18px; padding: 16px; box-shadow: 0 10px 22px rgba(0,0,0,.05); }
        .pacote-card span { display: block; color: #6b7280; font-size: 12px; font-weight: 1000; text-transform: uppercase; }
        .pacote-card strong { display: block; margin-top: 6px; color: #00B050; font-size: 26px; font-weight: 1000; }
        .pacote-form { display: grid; grid-template-columns: 1.2fr 1fr; gap: 12px; }
        .pacote-form textarea { grid-column: 1 / -1; min-height: 74px; resize: vertical; }
        .pacote-input, .pacote-select, .pacote-textarea { width: 100%; border: 1px solid #d1d5db; border-radius: 10px; padding: 10px 12px; font-size: 13px; font-weight: 800; background: white; }
        .pacote-btn { border: 0; border-radius: 10px; padding: 10px 13px; font-weight: 900; cursor: pointer; background: #e5e7eb; color: #111; }
        .pacote-btn-green { background: #00B050; color: white; }
        .pacote-list { display: grid; gap: 12px; }
        .pacote-item-top { display: flex; justify-content: space-between; align-items: start; gap: 12px; flex-wrap: wrap; }
        .pacote-item h3 { margin: 0; color: #111827; font-size: 19px; font-weight: 1000; }
        .pacote-item small { display: block; margin-top: 4px; color: #6b7280; font-weight: 800; }
        .pacote-checks { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 10px; margin-top: 12px; }
        .pacote-check { display: flex; align-items: center; gap: 8px; padding: 10px; border-radius: 12px; background: #f9fafb; border: 1px solid #e5e7eb; font-weight: 900; font-size: 13px; }
        .pacote-check input { width: auto; }
        .pacote-obs { margin-top: 12px; color: #374151; font-size: 13px; font-weight: 750; white-space: pre-wrap; }
        .pacote-empty { color: #6b7280; font-weight: 900; padding: 12px 0; }
        .pacote-status { background: #ecfdf5; color: #166534; border: 1px solid rgba(0,176,80,.25); border-radius: 14px; padding: 12px; font-weight: 900; }
        @media (max-width: 900px) { .pacote-cards, .pacote-form, .pacote-checks { grid-template-columns: 1fr; } }
      `}</style>

      <div className="pacote-head">
        <div className="pacote-title">
          <h1>Pacote do Cliente</h1>
          <p>Organize a entrega final: PDF, nota fiscal, comprovante e status.</p>
        </div>
        <button className="pacote-btn pacote-btn-green" onClick={carregar}>Atualizar</button>
      </div>

      <div className="pacote-cards">
        <Card titulo="Valor em pacotes" valor={brl(resumo.total)} />
        <Card titulo="Concluídos" valor={String(resumo.concluidos)} />
        <Card titulo="Pendentes" valor={String(resumo.pendentes)} />
      </div>

      {exportStatus && <div className="pacote-status">{exportStatus}</div>}

      <div className="pacote-box">
        <h3 style={{ marginTop: 0 }}>Criar novo pacote</h3>
        <div className="pacote-form">
          <select className="pacote-select" value={relatorioSelecionado} onChange={(e) => setRelatorioSelecionado(e.target.value)}>
            <option value="">Selecionar relatório cliente...</option>
            {relatoriosCliente.map((r) => (
              <option key={r.id} value={String(r.id)}>{r.cliente || "Cliente"} — {brl(r.valor)} — {dataBR(r.criadoEm)}</option>
            ))}
          </select>
          <input className="pacote-input" placeholder="Ou informar cliente manualmente" value={clienteManual} onChange={(e) => setClienteManual(e.target.value)} />
          <textarea className="pacote-textarea" placeholder="Observações do pacote..." value={observacoes} onChange={(e) => setObservacoes(e.target.value)} />
          <button className="pacote-btn pacote-btn-green" onClick={criarPacote}>Criar pacote</button>
        </div>
      </div>

      <div className="pacote-list">
        {pacotes.length === 0 && <div className="pacote-box pacote-empty">Nenhum pacote criado ainda.</div>}
        {pacotes.map((p) => (
          <div className="pacote-item" key={p.id}>
            <div className="pacote-item-top">
              <div><h3>{p.cliente}</h3><small>{dataBR(p.criadoEm)} • {brl(p.valor)}</small></div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <select className="pacote-select" value={p.status} onChange={(e) => atualizarPacote(p.id, "status", e.target.value)}>
                  {STATUS.map((s) => <option key={s}>{s}</option>)}
                </select>
                <button className="pacote-btn" onClick={() => removerPacote(p.id)}>Remover</button>
              </div>
            </div>
            <div className="pacote-checks">
              <label className="pacote-check"><input type="checkbox" checked={p.pdfCliente} onChange={(e) => atualizarPacote(p.id, "pdfCliente", e.target.checked)} />PDF Cliente</label>
              <label className="pacote-check"><input type="checkbox" checked={p.notaFiscal} onChange={(e) => atualizarPacote(p.id, "notaFiscal", e.target.checked)} />Nota Fiscal</label>
              <label className="pacote-check"><input type="checkbox" checked={p.comprovante} onChange={(e) => atualizarPacote(p.id, "comprovante", e.target.checked)} />Comprovante</label>
            </div>
            {p.observacoes && <div className="pacote-obs">{p.observacoes}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}

function Card({ titulo, valor }: { titulo: string; valor: string }) {
  return <div className="pacote-card"><span>{titulo}</span><strong>{valor}</strong></div>;
}
