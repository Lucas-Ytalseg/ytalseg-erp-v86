import React, { useEffect, useMemo, useRef, useState } from "react";
import { abrirArquivoAutenticado, baixarArquivoAutenticado } from "../services/auth";

const API_BASE = "/api";
const CHAVE_REABRIR = "ytalseg_reabrir_relatorio_pendente";
const TAMANHO_MAXIMO = 15 * 1024 * 1024;

type HistoricoItem = {
  id: string;
  tipo: "Cliente" | "Interno" | string;
  cliente: string;
  referencia: string;
  valor: number;
  criadoEm: string;
  temArquivo: boolean;
  temDados: boolean;
  origem: "auto" | "importado" | string;
  dataDocumento: string;
  arquivoNomeOriginal: string;
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

function dataParaFiltro(item: HistoricoItem) {
  if (item.dataDocumento) return new Date(`${item.dataDocumento}T00:00:00`);
  return new Date(item.criadoEm);
}

const MESES = ["Todos", "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

function CardEdicao({
  item,
  onMudar,
  onSalvar,
  onFechar,
  textoFechar,
}: {
  item: HistoricoItem;
  onMudar: (campo: keyof HistoricoItem, valor: any) => void;
  onSalvar: () => void;
  onFechar: () => void;
  textoFechar: string;
}) {
  return (
    <div className="hist-confirm-card">
      <div className="hist-confirm-title">
        {item.arquivoNomeOriginal || "PDF enviado"}
        {item.origem === "importado" && !item.cliente && !item.referencia && (
          <span className="hist-confirm-aviso"> — não consegui reconhecer os dados automaticamente. Preencha manualmente.</span>
        )}
      </div>
      <div className="hist-confirm-grid">
        <div className="hist-confirm-field">
          <label>Cliente</label>
          <input value={item.cliente} onChange={(e) => onMudar("cliente", e.target.value)} />
        </div>
        <div className="hist-confirm-field">
          <label>Tipo</label>
          <select value={item.tipo} onChange={(e) => onMudar("tipo", e.target.value)}>
            <option>Cliente</option>
            <option>Interno</option>
            <option>Outro</option>
          </select>
        </div>
        <div className="hist-confirm-field">
          <label>Referência</label>
          <input value={item.referencia} onChange={(e) => onMudar("referencia", e.target.value)} placeholder="Ex: JULHO / 2026" />
        </div>
        <div className="hist-confirm-field">
          <label>Valor</label>
          <input type="number" value={item.valor} onChange={(e) => onMudar("valor", Number(e.target.value || 0))} />
        </div>
        <div className="hist-confirm-field">
          <label>Data</label>
          <input type="date" value={item.dataDocumento} onChange={(e) => onMudar("dataDocumento", e.target.value)} />
        </div>
      </div>
      <div className="hist-actions">
        <button className="hist-btn hist-btn-green" onClick={onSalvar}>Salvar</button>
        <button className="hist-btn" onClick={onFechar}>{textoFechar}</button>
      </div>
    </div>
  );
}

export default function HistoricoPDFs({ onAbrirRelatorio }: { onAbrirRelatorio?: () => void }) {
  const [lista, setLista] = useState<HistoricoItem[]>([]);
  const [busca, setBusca] = useState("");
  const [tipo, setTipo] = useState("Todos");
  const [mes, setMes] = useState("Todos");
  const [ano, setAno] = useState("Todos");
  const [clienteFiltro, setClienteFiltro] = useState("Todos");
  const [ordem, setOrdem] = useState<"recente" | "antigo">("recente");
  const [msg, setMsg] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [pendentes, setPendentes] = useState<HistoricoItem[]>([]);
  const [editando, setEditando] = useState<HistoricoItem | null>(null);
  const [carregandoArquivo, setCarregandoArquivo] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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
      const a = dataParaFiltro(item).getFullYear();
      if (!Number.isNaN(a)) anos.add(String(a));
    });
    return ["Todos", ...Array.from(anos).sort((a, b) => Number(b) - Number(a))];
  }, [lista]);

  const clientesDisponiveis = useMemo(() => {
    const nomes = new Set<string>();
    lista.forEach((item) => {
      if (item.cliente) nomes.add(item.cliente);
    });
    return ["Todos", ...Array.from(nomes).sort((a, b) => a.localeCompare(b))];
  }, [lista]);

  const filtrados = useMemo(() => {
    const buscaMin = busca.trim().toLowerCase();
    let itens = lista.filter((item) => {
      const okTipo = tipo === "Todos" || item.tipo === tipo;
      const okCliente = clienteFiltro === "Todos" || item.cliente === clienteFiltro;
      const okBusca = !buscaMin || `${item.cliente} ${item.referencia}`.toLowerCase().includes(buscaMin);
      const dataItem = dataParaFiltro(item);
      const okMes = mes === "Todos" || MESES[dataItem.getMonth() + 1] === mes;
      const okAno = ano === "Todos" || String(dataItem.getFullYear()) === ano;
      return okTipo && okCliente && okBusca && okMes && okAno;
    });

    itens = itens.slice().sort((a, b) => {
      const da = dataParaFiltro(a).getTime();
      const db = dataParaFiltro(b).getTime();
      return ordem === "recente" ? db - da : da - db;
    });

    return itens;
  }, [lista, busca, tipo, clienteFiltro, mes, ano, ordem]);

  function abrirSeletor() {
    inputRef.current?.click();
  }

  async function onArquivosSelecionados(e: React.ChangeEvent<HTMLInputElement>) {
    const arquivos = Array.from(e.target.files || []);
    e.target.value = "";
    if (arquivos.length === 0) return;

    const validos: File[] = [];
    const avisos: string[] = [];
    for (const arq of arquivos) {
      if (!arq.name.toLowerCase().endsWith(".pdf")) {
        avisos.push(`${arq.name}: envie apenas arquivos PDF.`);
        continue;
      }
      if (arq.size > TAMANHO_MAXIMO) {
        avisos.push(`${arq.name}: maior que 15MB.`);
        continue;
      }
      validos.push(arq);
    }

    if (validos.length === 0) {
      setMsg(avisos.join(" "));
      return;
    }

    setEnviando(true);
    setMsg(avisos.join(" "));
    try {
      const form = new FormData();
      validos.forEach((arq) => form.append("files", arq));
      const res = await fetch(`${API_BASE}/historico-pdfs/upload`, { method: "POST", body: form });
      const data = await res.json();
      if (data.status === "ok") {
        setPendentes((prev) => [...(data.itens || []), ...prev]);
        const errosServidor = (data.erros || []).map((er: any) => `${er.arquivo}: ${er.erro}`);
        setMsg([...avisos, ...errosServidor].filter(Boolean).join(" "));
        await carregar();
      } else {
        setMsg("Erro ao enviar PDFs.");
      }
    } catch (err) {
      setMsg(`Erro ao enviar PDFs: ${err}`);
    } finally {
      setEnviando(false);
    }
  }

  function mudarPendente(id: string, campo: keyof HistoricoItem, valor: any) {
    setPendentes((prev) => prev.map((p) => (p.id === id ? { ...p, [campo]: valor } : p)));
  }

  async function salvarItem(item: HistoricoItem) {
    try {
      const res = await fetch(`${API_BASE}/historico-pdfs/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cliente: item.cliente,
          tipo: item.tipo,
          referencia: item.referencia,
          valor: item.valor,
          dataDocumento: item.dataDocumento,
        }),
      });
      const data = await res.json();
      if (data.status !== "ok") {
        setMsg("Erro ao salvar os dados do PDF.");
        return;
      }
      setPendentes((prev) => prev.filter((p) => p.id !== item.id));
      setEditando(null);
      await carregar();
    } catch (err) {
      setMsg(`Erro ao salvar: ${err}`);
    }
  }

  async function visualizar(item: HistoricoItem) {
    const chave = `ver-${item.id}`;
    setCarregandoArquivo(chave);
    setMsg("");
    try {
      await abrirArquivoAutenticado(`${API_BASE}/historico-pdfs/${item.id}/arquivo`);
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Erro ao abrir o arquivo.");
    } finally {
      setCarregandoArquivo(null);
    }
  }

  async function baixar(item: HistoricoItem) {
    const chave = `baixar-${item.id}`;
    setCarregandoArquivo(chave);
    setMsg("");
    try {
      await baixarArquivoAutenticado(
        `${API_BASE}/historico-pdfs/${item.id}/arquivo?baixar=1`,
        item.arquivoNomeOriginal || `relatorio-${item.id}.pdf`
      );
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Erro ao baixar o arquivo.");
    } finally {
      setCarregandoArquivo(null);
    }
  }

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
    setPendentes((prev) => prev.filter((p) => p.id !== item.id));
    if (editando?.id === item.id) setEditando(null);
    await carregar();
  }

  async function limparTudo() {
    if (!confirm("Excluir TODO o histórico de PDFs? Esta ação não pode ser desfeita.")) return;
    await fetch(`${API_BASE}/historico-pdfs`, { method: "DELETE" });
    setPendentes([]);
    setEditando(null);
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
        .hist-btn { border: 0; border-radius: 10px; padding: 10px 13px; font-weight: 900; cursor: pointer; background: #e5e7eb; color: #111; text-decoration: none; display: inline-flex; align-items: center; }
        .hist-btn-green { background: #00B050; color: white; }
        .hist-btn-red { background: #fee2e2; color: #991b1b; }
        .hist-btn[disabled] { opacity: .6; cursor: default; }
        .hist-card { background: white; border: 1px solid #e5e7eb; border-radius: 22px; box-shadow: 0 10px 24px rgba(0,0,0,.06); overflow: hidden; overflow-x: auto; }
        .hist-table { width: 100%; border-collapse: collapse; font-size: 13px; }
        .hist-table th { text-align: left; background: #f9fafb; padding: 12px; border-bottom: 1px solid #e5e7eb; font-weight: 1000; color: #374151; white-space: nowrap; }
        .hist-table td { padding: 12px; border-bottom: 1px solid #eef0f2; font-weight: 750; vertical-align: middle; }
        .hist-badge { display: inline-flex; padding: 5px 9px; border-radius: 999px; background: #ecfdf5; color: #166534; font-size: 12px; font-weight: 1000; }
        .hist-badge.interno { background: #eff6ff; color: #1d4ed8; }
        .hist-badge.importado { background: #f3f4f6; color: #4b5563; margin-left: 6px; }
        .hist-empty { padding: 22px; color: #6b7280; font-weight: 900; }
        .hist-msg { padding: 12px; border-radius: 14px; background: #fff7ed; border: 1px solid #fed7aa; color: #9a3412; font-weight: 900; }
        .hist-confirm-card { background: #f8fafc; border: 1px dashed #94a3b8; border-radius: 18px; padding: 16px; display: grid; gap: 12px; }
        .hist-confirm-title { font-weight: 1000; color: #111827; }
        .hist-confirm-aviso { font-weight: 700; color: #b45309; }
        .hist-confirm-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 10px; }
        .hist-confirm-field label { display: block; font-size: 11px; font-weight: 1000; color: #6b7280; margin-bottom: 4px; }
        .hist-confirm-field input, .hist-confirm-field select { width: 100%; border: 1px solid #d1d5db; border-radius: 8px; padding: 8px; font-size: 13px; box-sizing: border-box; }

        @media (max-width: 900px) {
          .hist-confirm-grid { grid-template-columns: 1fr 1fr; }
        }

        @media (max-width: 800px) {
          .hist-table thead { display: none; }
          .hist-table, .hist-table tbody, .hist-table tr, .hist-table td { display: block; width: 100%; }
          .hist-table tr { border-bottom: 8px solid #f3f4f6; padding: 10px 0; }
          .hist-table td { border-bottom: none; padding: 6px 12px; }
          .hist-table td::before { content: attr(data-label); display: block; font-size: 11px; font-weight: 1000; color: #9ca3af; margin-bottom: 2px; }
          .hist-confirm-grid { grid-template-columns: 1fr; }
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
          <select className="hist-select" value={clienteFiltro} onChange={(e) => setClienteFiltro(e.target.value)}>
            {clientesDisponiveis.map((c) => <option key={c}>{c}</option>)}
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
          <input
            ref={inputRef}
            type="file"
            accept="application/pdf"
            multiple
            style={{ display: "none" }}
            onChange={onArquivosSelecionados}
          />
          <button className="hist-btn hist-btn-green" onClick={abrirSeletor} disabled={enviando}>
            {enviando ? "Enviando..." : "Subir PDFs antigos"}
          </button>
          <button className="hist-btn hist-btn-red" onClick={limparTudo}>Limpar tudo</button>
        </div>
      </div>

      {msg && <div className="hist-msg">{msg}</div>}

      {pendentes.length > 0 && (
        <div style={{ display: "grid", gap: 12 }}>
          {pendentes.map((item) => (
            <CardEdicao
              key={item.id}
              item={item}
              onMudar={(campo, valor) => mudarPendente(item.id, campo, valor)}
              onSalvar={() => salvarItem(item)}
              onFechar={() => setPendentes((prev) => prev.filter((p) => p.id !== item.id))}
              textoFechar="Deixar para depois"
            />
          ))}
        </div>
      )}

      {editando && (
        <CardEdicao
          item={editando}
          onMudar={(campo, valor) => setEditando((prev) => (prev ? { ...prev, [campo]: valor } : prev))}
          onSalvar={() => salvarItem(editando)}
          onFechar={() => setEditando(null)}
          textoFechar="Cancelar"
        />
      )}

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
                  {item.origem === "importado" && <span className="hist-badge importado">importado</span>}
                </td>
                <td data-label="Cliente">{item.cliente || "-"}</td>
                <td data-label="Referência">{item.referencia || "-"}</td>
                <td data-label="Valor">{brl(item.valor)}</td>
                <td data-label="Gerado em">{dataBR(item.dataDocumento ? `${item.dataDocumento}T00:00:00` : item.criadoEm)}</td>
                <td data-label="Ações">
                  <div className="hist-actions">
                    {item.temDados && (
                      <button className="hist-btn hist-btn-green" onClick={() => reabrir(item)}>
                        Reabrir/Reimprimir
                      </button>
                    )}
                    {item.temArquivo && (
                      <>
                        <button className="hist-btn" onClick={() => visualizar(item)} disabled={carregandoArquivo === `ver-${item.id}`}>
                          {carregandoArquivo === `ver-${item.id}` ? "Abrindo..." : "Visualizar"}
                        </button>
                        <button className="hist-btn" onClick={() => baixar(item)} disabled={carregandoArquivo === `baixar-${item.id}`}>
                          {carregandoArquivo === `baixar-${item.id}` ? "Baixando..." : "Baixar"}
                        </button>
                      </>
                    )}
                    {item.origem === "importado" && (
                      <button className="hist-btn" onClick={() => setEditando(item)}>Editar</button>
                    )}
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
            Nenhum PDF encontrado ainda. Gere um PDF Cliente ou Interno na aba Relatórios, ou use "Subir PDFs antigos" para importar relatórios salvos no seu computador.
          </div>
        )}
      </div>
    </div>
  );
}
