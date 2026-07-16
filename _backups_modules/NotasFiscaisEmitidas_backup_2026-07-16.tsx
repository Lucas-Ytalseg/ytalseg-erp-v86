import React, { useEffect, useMemo, useRef, useState } from "react";

const API_BASE = "/api";
const TAMANHO_MAXIMO = 15 * 1024 * 1024;
const NOMES_MESES = ["", "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

type NotaFiscalItem = {
  id: string;
  numeroNota: string;
  cliente: string;
  cnpjTomador: string;
  mesReferencia: number | null;
  anoReferencia: number | null;
  dataEmissao: string;
  vencimento: string;
  valor: number;
  codigoVerificacao: string;
  arquivoNomeOriginal: string;
  temArquivo: boolean;
  criadoEm: string;
  financeiroId: string;
  sugestaoFinanceiroId?: string | null;
  cancelada: boolean;
};

type FinanceiroResumo = {
  id: string;
  cliente: string;
  valor: number;
  referencia: string;
};

function brl(v: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(v || 0));
}

function dataCurtaBR(iso?: string) {
  if (!iso) return "-";
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("pt-BR");
}

function referenciaLabel(item: NotaFiscalItem) {
  if (!item.mesReferencia || !item.anoReferencia) return "-";
  return `${NOMES_MESES[item.mesReferencia]} / ${item.anoReferencia}`;
}

function CardNotaEdicao({
  item,
  onMudar,
  onSalvar,
  onFechar,
  textoFechar,
  sugestao,
  onAceitarSugestao,
  onIgnorarSugestao,
}: {
  item: NotaFiscalItem;
  onMudar: (campo: keyof NotaFiscalItem, valor: any) => void;
  onSalvar: () => void;
  onFechar: () => void;
  textoFechar: string;
  sugestao?: FinanceiroResumo | null;
  onAceitarSugestao?: () => void;
  onIgnorarSugestao?: () => void;
}) {
  return (
    <div className="nfe-confirm-card">
      <div className="nfe-confirm-title">
        {item.arquivoNomeOriginal || "PDF enviado"}
        {!item.numeroNota && !item.cliente && (
          <span className="nfe-confirm-aviso"> — não consegui reconhecer os dados automaticamente. Preencha manualmente.</span>
        )}
      </div>
      <div className="nfe-confirm-grid">
        <div className="nfe-confirm-field">
          <label>Nº da Nota</label>
          <input value={item.numeroNota} onChange={(e) => onMudar("numeroNota", e.target.value)} />
        </div>
        <div className="nfe-confirm-field">
          <label>Cliente</label>
          <input value={item.cliente} onChange={(e) => onMudar("cliente", e.target.value)} />
        </div>
        <div className="nfe-confirm-field">
          <label>CNPJ</label>
          <input value={item.cnpjTomador} onChange={(e) => onMudar("cnpjTomador", e.target.value)} />
        </div>
        <div className="nfe-confirm-field">
          <label>Mês referência</label>
          <select
            value={item.mesReferencia || ""}
            onChange={(e) => onMudar("mesReferencia", e.target.value ? Number(e.target.value) : null)}
          >
            <option value="">-</option>
            {NOMES_MESES.slice(1).map((nome, i) => (
              <option key={nome} value={i + 1}>{nome}</option>
            ))}
          </select>
        </div>
        <div className="nfe-confirm-field">
          <label>Ano referência</label>
          <input
            type="number"
            value={item.anoReferencia || ""}
            onChange={(e) => onMudar("anoReferencia", e.target.value ? Number(e.target.value) : null)}
          />
        </div>
        <div className="nfe-confirm-field">
          <label>Emissão</label>
          <input type="date" value={item.dataEmissao} onChange={(e) => onMudar("dataEmissao", e.target.value)} />
        </div>
        <div className="nfe-confirm-field">
          <label>Vencimento</label>
          <input type="date" value={item.vencimento} onChange={(e) => onMudar("vencimento", e.target.value)} />
        </div>
        <div className="nfe-confirm-field">
          <label>Valor</label>
          <input type="number" value={item.valor} onChange={(e) => onMudar("valor", Number(e.target.value || 0))} />
        </div>
        <div className="nfe-confirm-field">
          <label>Código de verificação</label>
          <input value={item.codigoVerificacao} onChange={(e) => onMudar("codigoVerificacao", e.target.value)} />
        </div>
      </div>

      {sugestao && (
        <div className="nfe-sugestao">
          Encontrei um lançamento parecido no Financeiro: <strong>{sugestao.cliente} — {brl(sugestao.valor)} — {sugestao.referencia || "-"}</strong>.
          Vincular e marcar como nota enviada?
          <div className="nfe-actions" style={{ marginTop: 8 }}>
            <button className="nfe-btn nfe-btn-green" onClick={onAceitarSugestao}>Vincular</button>
            <button className="nfe-btn" onClick={onIgnorarSugestao}>Ignorar</button>
          </div>
        </div>
      )}

      <div className="nfe-actions">
        <button className="nfe-btn nfe-btn-green" onClick={onSalvar}>Salvar</button>
        <button className="nfe-btn" onClick={onFechar}>{textoFechar}</button>
      </div>
    </div>
  );
}

export default function NotasFiscaisEmitidas() {
  const [lista, setLista] = useState<NotaFiscalItem[]>([]);
  const [financeiro, setFinanceiro] = useState<FinanceiroResumo[]>([]);
  const [busca, setBusca] = useState("");
  const [mesFiltro, setMesFiltro] = useState("Todos");
  const [anoFiltro, setAnoFiltro] = useState("Todos");
  const [clienteFiltro, setClienteFiltro] = useState("Todos");
  const [ordemAscendente, setOrdemAscendente] = useState(false);
  const [msg, setMsg] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [pendentes, setPendentes] = useState<NotaFiscalItem[]>([]);
  const [editando, setEditando] = useState<NotaFiscalItem | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function carregar() {
    setCarregando(true);
    setMsg("");
    try {
      const [resNotas, resFin] = await Promise.all([
        fetch(`${API_BASE}/notas-fiscais`),
        fetch(`${API_BASE}/financeiro`).catch(() => null),
      ]);
      const dataNotas = await resNotas.json();
      if (dataNotas.status === "ok") {
        setLista(dataNotas.notas || []);
      } else {
        setMsg("Erro ao carregar notas fiscais.");
      }
      if (resFin) {
        const dataFin = await resFin.json();
        if (dataFin.status === "ok") {
          setFinanceiro(dataFin.lancamentos || []);
        }
      }
    } catch (err) {
      setMsg(`Erro ao carregar notas fiscais: ${err}`);
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  const clientesDisponiveis = useMemo(() => {
    const nomes = new Set<string>();
    lista.forEach((item) => {
      if (item.cliente) nomes.add(item.cliente);
    });
    return ["Todos", ...Array.from(nomes).sort((a, b) => a.localeCompare(b))];
  }, [lista]);

  const anosDisponiveis = useMemo(() => {
    const anos = new Set<string>();
    lista.forEach((item) => {
      if (item.anoReferencia) anos.add(String(item.anoReferencia));
    });
    return ["Todos", ...Array.from(anos).sort((a, b) => Number(b) - Number(a))];
  }, [lista]);

  const filtrados = useMemo(() => {
    const buscaMin = busca.trim().toLowerCase();
    return lista.filter((item) => {
      const okCliente = clienteFiltro === "Todos" || item.cliente === clienteFiltro;
      const okMes = mesFiltro === "Todos" || NOMES_MESES[item.mesReferencia || 0] === mesFiltro;
      const okAno = anoFiltro === "Todos" || String(item.anoReferencia || "") === anoFiltro;
      const okBusca = !buscaMin || `${item.cliente} ${item.numeroNota}`.toLowerCase().includes(buscaMin);
      return okCliente && okMes && okAno && okBusca;
    });
  }, [lista, busca, mesFiltro, anoFiltro, clienteFiltro]);

  // Ordena por referência (mês/ano) — decrescente por padrão, com desempate sempre
  // alfabético por cliente. Itens sem mês+ano referência vão numa seção separada
  // no final, ordenada só por cliente.
  const gruposOrdenados = useMemo(() => {
    const comReferencia = filtrados.filter((i) => i.mesReferencia && i.anoReferencia);
    const semReferencia = filtrados.filter((i) => !i.mesReferencia || !i.anoReferencia);
    const dir = ordemAscendente ? 1 : -1;

    comReferencia.sort((a, b) => {
      const anoA = a.anoReferencia || 0;
      const anoB = b.anoReferencia || 0;
      if (anoA !== anoB) return dir * (anoA - anoB);
      const mesA = a.mesReferencia || 0;
      const mesB = b.mesReferencia || 0;
      if (mesA !== mesB) return dir * (mesA - mesB);
      return a.cliente.localeCompare(b.cliente, "pt-BR");
    });

    semReferencia.sort((a, b) => a.cliente.localeCompare(b.cliente, "pt-BR"));

    return { comReferencia, semReferencia };
  }, [filtrados, ordemAscendente]);

  const totalFiltrado = useMemo(
    () => filtrados.filter((item) => !item.cancelada).reduce((soma, item) => soma + Number(item.valor || 0), 0),
    [filtrados]
  );

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
      const res = await fetch(`${API_BASE}/notas-fiscais/upload`, { method: "POST", body: form });
      const data = await res.json();
      if (data.status === "ok") {
        setPendentes((prev) => [...(data.itens || []), ...prev]);
        const errosServidor = (data.erros || []).map((er: any) => `${er.arquivo}: ${er.erro}`);
        setMsg([...avisos, ...errosServidor].filter(Boolean).join(" "));
        await carregar();
      } else {
        setMsg("Erro ao enviar notas fiscais.");
      }
    } catch (err) {
      setMsg(`Erro ao enviar notas fiscais: ${err}`);
    } finally {
      setEnviando(false);
    }
  }

  function mudarPendente(id: string, campo: keyof NotaFiscalItem, valor: any) {
    setPendentes((prev) => prev.map((p) => (p.id === id ? { ...p, [campo]: valor } : p)));
  }

  async function salvarItem(item: NotaFiscalItem, isPendente: boolean) {
    try {
      const res = await fetch(`${API_BASE}/notas-fiscais/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          numeroNota: item.numeroNota,
          cliente: item.cliente,
          cnpjTomador: item.cnpjTomador,
          mesReferencia: item.mesReferencia,
          anoReferencia: item.anoReferencia,
          dataEmissao: item.dataEmissao,
          vencimento: item.vencimento,
          valor: item.valor,
          codigoVerificacao: item.codigoVerificacao,
        }),
      });
      const data = await res.json();
      if (data.status !== "ok") {
        setMsg("Erro ao salvar os dados da nota.");
        return;
      }
      if (isPendente) {
        setPendentes((prev) => prev.filter((p) => p.id !== item.id));
      } else {
        setEditando(null);
      }
      await carregar();
    } catch (err) {
      setMsg(`Erro ao salvar: ${err}`);
    }
  }

  async function vincular(item: NotaFiscalItem, financeiroId: string, isPendente: boolean) {
    try {
      const res = await fetch(`${API_BASE}/notas-fiscais/${item.id}/vincular`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ financeiroId }),
      });
      const data = await res.json();
      if (data.status !== "ok") {
        setMsg("Erro ao vincular nota ao lançamento.");
        return;
      }
      if (isPendente) {
        setPendentes((prev) => prev.filter((p) => p.id !== item.id));
      }
      await carregar();
    } catch (err) {
      setMsg(`Erro ao vincular: ${err}`);
    }
  }

  function ignorarSugestao(id: string) {
    setPendentes((prev) => prev.map((p) => (p.id === id ? { ...p, sugestaoFinanceiroId: null } : p)));
  }

  function visualizar(item: NotaFiscalItem) {
    window.open(`${API_BASE}/notas-fiscais/${item.id}/arquivo`, "_blank");
  }

  async function excluir(item: NotaFiscalItem) {
    if (!confirm(`Excluir a nota fiscal ${item.numeroNota || ""} de "${item.cliente}"?`)) return;
    await fetch(`${API_BASE}/notas-fiscais/${item.id}`, { method: "DELETE" });
    setPendentes((prev) => prev.filter((p) => p.id !== item.id));
    if (editando?.id === item.id) setEditando(null);
    await carregar();
  }

  async function alternarCancelada(item: NotaFiscalItem) {
    try {
      const res = await fetch(`${API_BASE}/notas-fiscais/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cancelada: !item.cancelada }),
      });
      const data = await res.json();
      if (data.status !== "ok") {
        setMsg("Erro ao atualizar o cancelamento da nota.");
        return;
      }
      await carregar();
    } catch (err) {
      setMsg(`Erro ao atualizar o cancelamento: ${err}`);
    }
  }

  function financeiroPorId(id?: string | null) {
    if (!id) return null;
    return financeiro.find((f) => f.id === id) || null;
  }

  return (
    <div className="nfe-page">
      <style>{`
        .nfe-page { display: grid; gap: 16px; }
        .nfe-head { display: flex; justify-content: space-between; gap: 14px; align-items: end; flex-wrap: wrap; }
        .nfe-title h2 { margin: 0; font-size: 22px; font-weight: 1000; color: #111827; }
        .nfe-title p { margin: 6px 0 0; color: #6b7280; font-weight: 800; font-size: 13px; }
        .nfe-actions { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; }
        .nfe-input, .nfe-select { border: 1px solid #d1d5db; border-radius: 10px; padding: 10px 12px; font-size: 13px; font-weight: 800; background: white; }
        .nfe-btn { border: 0; border-radius: 10px; padding: 10px 13px; font-weight: 900; cursor: pointer; background: #e5e7eb; color: #111; text-decoration: none; display: inline-flex; align-items: center; }
        .nfe-btn-green { background: #00B050; color: white; }
        .nfe-btn-red { background: #fee2e2; color: #991b1b; }
        .nfe-btn[disabled] { opacity: .6; cursor: default; }
        .nfe-card { background: white; border: 1px solid #e5e7eb; border-radius: 22px; box-shadow: 0 10px 24px rgba(0,0,0,.06); overflow: hidden; overflow-x: auto; }
        .nfe-total { font-size: 22px; font-weight: 1000; color: #00B050; }
        .nfe-table { width: 100%; border-collapse: collapse; font-size: 13px; }
        .nfe-table th { text-align: left; background: #f9fafb; padding: 12px; border-bottom: 1px solid #e5e7eb; font-weight: 1000; color: #374151; white-space: nowrap; }
        .nfe-table td { padding: 12px; border-bottom: 1px solid #eef0f2; font-weight: 750; vertical-align: middle; }
        .nfe-empty { padding: 22px; color: #6b7280; font-weight: 900; }
        .nfe-msg { padding: 12px; border-radius: 14px; background: #fff7ed; border: 1px solid #fed7aa; color: #9a3412; font-weight: 900; }
        .nfe-confirm-card { background: #f8fafc; border: 1px dashed #94a3b8; border-radius: 18px; padding: 16px; display: grid; gap: 12px; }
        .nfe-confirm-title { font-weight: 1000; color: #111827; }
        .nfe-confirm-aviso { font-weight: 700; color: #b45309; }
        .nfe-confirm-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
        .nfe-confirm-field label { display: block; font-size: 11px; font-weight: 1000; color: #6b7280; margin-bottom: 4px; }
        .nfe-confirm-field input, .nfe-confirm-field select { width: 100%; border: 1px solid #d1d5db; border-radius: 8px; padding: 8px; font-size: 13px; box-sizing: border-box; }
        .nfe-sugestao { background: #eff6ff; border: 1px solid #bfdbfe; color: #1e3a8a; border-radius: 12px; padding: 10px 12px; font-size: 13px; font-weight: 700; }
        .nfe-badge-cancelada { display: inline-flex; margin-left: 8px; padding: 3px 9px; border-radius: 999px; background: #fee2e2; color: #991b1b; font-size: 11px; font-weight: 1000; }
        .nfe-linha-cancelada { opacity: .55; }
        .nfe-grupo-header td { background: #f9fafb; font-weight: 1000; color: #374151; padding: 8px 12px !important; }

        @media (max-width: 900px) {
          .nfe-confirm-grid { grid-template-columns: 1fr 1fr; }
        }

        @media (max-width: 800px) {
          .nfe-table thead { display: none; }
          .nfe-table, .nfe-table tbody, .nfe-table tr, .nfe-table td { display: block; width: 100%; }
          .nfe-table tr { border-bottom: 8px solid #f3f4f6; padding: 10px 0; }
          .nfe-table td { border-bottom: none; padding: 6px 12px; }
          .nfe-table td::before { content: attr(data-label); display: block; font-size: 11px; font-weight: 1000; color: #9ca3af; margin-bottom: 2px; }
          .nfe-confirm-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="nfe-head">
        <div className="nfe-title">
          <h2>Notas Fiscais Emitidas</h2>
          <p>Guarde aqui as notas fiscais (NFS-e) emitidas manualmente no portal da Prefeitura de SP.</p>
        </div>
        <div className="nfe-actions">
          <input
            ref={inputRef}
            type="file"
            accept="application/pdf"
            multiple
            style={{ display: "none" }}
            onChange={onArquivosSelecionados}
          />
          <button className="nfe-btn nfe-btn-green" onClick={abrirSeletor} disabled={enviando}>
            {enviando ? "Enviando..." : "Subir Nota Fiscal (PDF)"}
          </button>
          <button className="nfe-btn" onClick={carregar} disabled={carregando}>
            {carregando ? "Atualizando..." : "Atualizar"}
          </button>
        </div>
      </div>

      {msg && <div className="nfe-msg">{msg}</div>}

      {pendentes.map((item) => (
        <CardNotaEdicao
          key={item.id}
          item={item}
          onMudar={(campo, valor) => mudarPendente(item.id, campo, valor)}
          onSalvar={() => salvarItem(item, true)}
          onFechar={() => setPendentes((prev) => prev.filter((p) => p.id !== item.id))}
          textoFechar="Deixar para depois"
          sugestao={financeiroPorId(item.sugestaoFinanceiroId)}
          onAceitarSugestao={() => item.sugestaoFinanceiroId && vincular(item, item.sugestaoFinanceiroId, true)}
          onIgnorarSugestao={() => ignorarSugestao(item.id)}
        />
      ))}

      {editando && (
        <CardNotaEdicao
          item={editando}
          onMudar={(campo, valor) => setEditando((prev) => (prev ? { ...prev, [campo]: valor } : prev))}
          onSalvar={() => salvarItem(editando, false)}
          onFechar={() => setEditando(null)}
          textoFechar="Cancelar"
        />
      )}

      <div className="nfe-actions">
        <input
          className="nfe-input"
          placeholder="Buscar por cliente ou nº da nota..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
        <select className="nfe-select" value={clienteFiltro} onChange={(e) => setClienteFiltro(e.target.value)}>
          {clientesDisponiveis.map((c) => <option key={c}>{c}</option>)}
        </select>
        <select className="nfe-select" value={mesFiltro} onChange={(e) => setMesFiltro(e.target.value)}>
          <option>Todos</option>
          {NOMES_MESES.slice(1).map((m) => <option key={m}>{m}</option>)}
        </select>
        <select className="nfe-select" value={anoFiltro} onChange={(e) => setAnoFiltro(e.target.value)}>
          {anosDisponiveis.map((a) => <option key={a}>{a}</option>)}
        </select>
        <button className="nfe-btn" onClick={() => setOrdemAscendente((v) => !v)}>
          {ordemAscendente ? "Mais antigas primeiro" : "Mais recentes primeiro"}
        </button>
      </div>

      <div className="nfe-total">Total filtrado: {brl(totalFiltrado)}</div>

      <div className="nfe-card">
        <table className="nfe-table">
          <thead>
            <tr>
              <th>Nº Nota</th>
              <th>Cliente</th>
              <th>Mês Referência</th>
              <th>Emissão</th>
              <th>Vencimento</th>
              <th>Valor</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {gruposOrdenados.comReferencia.map((item) => renderLinhaNota(item))}
            {gruposOrdenados.semReferencia.length > 0 && (
              <tr className="nfe-grupo-header">
                <td colSpan={7}>Sem referência</td>
              </tr>
            )}
            {gruposOrdenados.semReferencia.map((item) => renderLinhaNota(item))}
          </tbody>
        </table>

        {filtrados.length === 0 && (
          <div className="nfe-empty">Nenhuma nota fiscal encontrada. Use "Subir Nota Fiscal (PDF)" para importar.</div>
        )}
      </div>
    </div>
  );

  function renderLinhaNota(item: NotaFiscalItem) {
    return (
      <tr key={item.id} className={item.cancelada ? "nfe-linha-cancelada" : ""}>
        <td data-label="Nº Nota">{item.numeroNota || "-"}</td>
        <td data-label="Cliente">
          {item.cliente || "-"}
          {item.cancelada && <span className="nfe-badge-cancelada">CANCELADA</span>}
        </td>
        <td data-label="Mês Referência">{referenciaLabel(item)}</td>
        <td data-label="Emissão">{dataCurtaBR(item.dataEmissao)}</td>
        <td data-label="Vencimento">{dataCurtaBR(item.vencimento)}</td>
        <td data-label="Valor">{brl(item.valor)}</td>
        <td data-label="Ações">
          <div className="nfe-actions">
            {item.temArquivo && (
              <>
                <button className="nfe-btn" onClick={() => visualizar(item)}>Visualizar</button>
                <a className="nfe-btn" href={`${API_BASE}/notas-fiscais/${item.id}/arquivo?baixar=1`} target="_blank" rel="noreferrer">
                  Baixar
                </a>
              </>
            )}
            <button className="nfe-btn" onClick={() => setEditando(item)}>Editar</button>
            <button className="nfe-btn" onClick={() => alternarCancelada(item)}>
              {item.cancelada ? "Desfazer cancelamento" : "Marcar como cancelada"}
            </button>
            <button className="nfe-btn nfe-btn-red" onClick={() => excluir(item)}>Excluir</button>
          </div>
        </td>
      </tr>
    );
  }
}
