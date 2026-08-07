import React, { useEffect, useMemo, useRef, useState } from "react";
import ConflitoVinculoDialog, { ConflitoInfo } from "./shared/ConflitoVinculoDialog";

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
  dataRecebimento: string;
};

type StatusNota = "aberta" | "recebida" | "cancelada" | "vencida";

const STATUS_LABEL: Record<StatusNota, string> = {
  aberta: "Em aberto",
  recebida: "Recebida",
  cancelada: "Cancelada",
  vencida: "Em atraso",
};

function hojeISO() {
  return new Date().toISOString().slice(0, 10);
}

// "Em atraso" não é um status gravado - é sempre calculado (vencimento passou e a
// nota não está recebida nem cancelada), então nunca fica desatualizado.
function statusNota(item: NotaFiscalItem): StatusNota {
  if (item.cancelada) return "cancelada";
  if (item.dataRecebimento) return "recebida";
  if (item.vencimento && item.vencimento < hojeISO()) return "vencida";
  return "aberta";
}

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

export default function NotasFiscaisEmitidas({
  refrescarTick,
  onMudou,
}: {
  refrescarTick?: number;
  onMudou?: () => void;
} = {}) {
  const [lista, setLista] = useState<NotaFiscalItem[]>([]);
  const [financeiro, setFinanceiro] = useState<FinanceiroResumo[]>([]);
  const [busca, setBusca] = useState("");
  const [mesFiltro, setMesFiltro] = useState("Todos");
  const [anoFiltro, setAnoFiltro] = useState("Todos");
  const [clienteFiltro, setClienteFiltro] = useState("Todos");
  const [statusFiltro, setStatusFiltro] = useState("Todos");
  const [ordemAscendente, setOrdemAscendente] = useState(false);
  const [msg, setMsg] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [pendentes, setPendentes] = useState<NotaFiscalItem[]>([]);
  const [editando, setEditando] = useState<NotaFiscalItem | null>(null);
  const [selecionados, setSelecionados] = useState<Set<string>>(new Set());
  const [dataLote, setDataLote] = useState(hojeISO());
  const [marcandoLote, setMarcandoLote] = useState(false);
  const [conflito, setConflito] = useState<(ConflitoInfo & { _origem: { item: NotaFiscalItem; financeiroId: string; isPendente: boolean } }) | null>(null);
  const [vinculandoId, setVinculandoId] = useState<string | null>(null);
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

  // NotaFiscal.tsx renderiza este componente junto com sua própria lista de
  // financeiro/vínculos, cada um buscando os dados de forma independente. Isso
  // reflete aqui qualquer mudança feita do lado de fora (ex: vincular pela tela do
  // Financeiro) sem precisar clicar em "Atualizar" manualmente.
  useEffect(() => {
    if (refrescarTick) carregar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refrescarTick]);

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
      const okStatus = statusFiltro === "Todos" || STATUS_LABEL[statusNota(item)] === statusFiltro;
      const okBusca = !buscaMin || `${item.cliente} ${item.numeroNota}`.toLowerCase().includes(buscaMin);
      return okCliente && okMes && okAno && okStatus && okBusca;
    });
  }, [lista, busca, mesFiltro, anoFiltro, clienteFiltro, statusFiltro]);

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
        onMudou?.();
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
      onMudou?.();
    } catch (err) {
      setMsg(`Erro ao salvar: ${err}`);
    }
  }

  async function vincular(item: NotaFiscalItem, financeiroId: string, isPendente: boolean) {
    try {
      const res = await fetch(`${API_BASE}/vinculos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lancamentoId: financeiroId, notaId: item.id, origem: "sugerido-confirmado" }),
      });
      if (res.status === 409) {
        const corpo = await res.json();
        const detalhe = corpo?.detail?.conflito;
        if (detalhe) {
          setConflito({ ...detalhe, _origem: { item, financeiroId, isPendente } });
        } else {
          setMsg("Financeiro e nota têm status incompatíveis.");
        }
        return;
      }
      const data = await res.json();
      if (data.status !== "ok") {
        setMsg(data.erro || "Erro ao vincular nota ao lançamento.");
        return;
      }
      if (isPendente) {
        setPendentes((prev) => prev.filter((p) => p.id !== item.id));
      }
      setVinculandoId(null);
      await carregar();
      onMudou?.();
    } catch (err) {
      setMsg(`Erro ao vincular: ${err}`);
    }
  }

  async function resolverConflito(lado: "financeiro" | "nota") {
    if (!conflito) return;
    const { item, financeiroId, isPendente } = conflito._origem;
    try {
      const res = await fetch(`${API_BASE}/vinculos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lancamentoId: financeiroId,
          notaId: item.id,
          origem: "sugerido-confirmado",
          resolverConflito: lado,
        }),
      });
      const data = await res.json();
      if (data.status !== "ok") {
        setMsg(data.erro || "Erro ao resolver o conflito.");
        return;
      }
      if (isPendente) {
        setPendentes((prev) => prev.filter((p) => p.id !== item.id));
      }
      setConflito(null);
      setVinculandoId(null);
      await carregar();
      onMudou?.();
    } catch (err) {
      setMsg(`Erro ao resolver o conflito: ${err}`);
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
    onMudou?.();
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
      onMudou?.();
    } catch (err) {
      setMsg(`Erro ao atualizar o cancelamento: ${err}`);
    }
  }

  async function atualizarDataRecebimento(item: NotaFiscalItem, dataRecebimento: string) {
    try {
      const res = await fetch(`${API_BASE}/notas-fiscais/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dataRecebimento }),
      });
      const data = await res.json();
      if (data.status !== "ok") {
        setMsg("Erro ao atualizar o status de recebimento da nota.");
        return;
      }
      await carregar();
      onMudou?.();
    } catch (err) {
      setMsg(`Erro ao atualizar recebimento: ${err}`);
    }
  }

  async function marcarRecebida(item: NotaFiscalItem) {
    const data = window.prompt("Data de recebimento (AAAA-MM-DD):", item.dataRecebimento || hojeISO());
    if (data === null) return;
    await atualizarDataRecebimento(item, data || hojeISO());
  }

  async function desfazerRecebida(item: NotaFiscalItem) {
    await atualizarDataRecebimento(item, "");
  }

  function toggleSelecionado(id: string) {
    setSelecionados((prev) => {
      const novo = new Set(prev);
      if (novo.has(id)) novo.delete(id);
      else novo.add(id);
      return novo;
    });
  }

  const idsSelecionaveis = useMemo(() => {
    return [...gruposOrdenados.comReferencia, ...gruposOrdenados.semReferencia]
      .filter((i) => !i.cancelada)
      .map((i) => i.id);
  }, [gruposOrdenados]);

  const todosSelecionados = idsSelecionaveis.length > 0 && idsSelecionaveis.every((id) => selecionados.has(id));

  function toggleTodos() {
    setSelecionados(todosSelecionados ? new Set() : new Set(idsSelecionaveis));
  }

  async function marcarSelecionadasRecebidas() {
    if (selecionados.size === 0) return;
    setMarcandoLote(true);
    try {
      const res = await fetch(`${API_BASE}/notas-fiscais/marcar-recebidas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: Array.from(selecionados), dataRecebimento: dataLote || hojeISO() }),
      });
      const data = await res.json();
      if (data.status !== "ok") {
        setMsg("Erro ao marcar as notas selecionadas como recebidas.");
        return;
      }
      const qtdAtualizadas = (data.atualizadas || []).length;
      const qtdPuladas = (data.puladas || []).length;
      setMsg(
        qtdPuladas > 0
          ? `${qtdAtualizadas} nota(s) marcada(s) como recebida(s). ${qtdPuladas} pulada(s) por estarem canceladas.`
          : `${qtdAtualizadas} nota(s) marcada(s) como recebida(s).`
      );
      setSelecionados(new Set());
      await carregar();
      onMudou?.();
    } catch (err) {
      setMsg(`Erro ao marcar em lote: ${err}`);
    } finally {
      setMarcandoLote(false);
    }
  }

  function financeiroPorId(id?: string | null) {
    if (!id) return null;
    return financeiro.find((f) => f.id === id) || null;
  }

  const [candidatosVinculo, setCandidatosVinculo] = useState<FinanceiroResumo[]>([]);

  async function abrirPickerVinculo(item: NotaFiscalItem) {
    if (vinculandoId === item.id) {
      setVinculandoId(null);
      return;
    }
    setVinculandoId(item.id);
    setCandidatosVinculo([]);
    try {
      const res = await fetch(`${API_BASE}/vinculos/sugestoes?tipo=nota&id=${item.id}`);
      const data = await res.json();
      if (data.status === "ok") {
        setCandidatosVinculo(data.candidatosFinanceiro || []);
      }
    } catch {
      // silencioso - o select cai pro fallback (lista completa de financeiro)
    }
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
        .nfe-linha-vencida { background: #fef2f2; }
        .nfe-grupo-header td { background: #f9fafb; font-weight: 1000; color: #374151; padding: 8px 12px !important; }
        .nfe-badge-status { display: inline-flex; padding: 3px 9px; border-radius: 999px; font-size: 11px; font-weight: 1000; white-space: nowrap; }
        .nfe-badge-aberta { background: #e5e7eb; color: #374151; }
        .nfe-badge-recebida { background: #dcfce7; color: #166534; }
        .nfe-badge-vencida { background: #fee2e2; color: #991b1b; }
        .nfe-lote-bar { display: flex; gap: 10px; align-items: center; flex-wrap: wrap; background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 14px; padding: 10px 14px; }
        .nfe-lote-bar strong { color: #1e3a8a; }
        .nfe-picker-vinculo { display: flex; gap: 8px; align-items: center; margin-top: 8px; flex-wrap: wrap; }
        .nfe-picker-vinculo select { border: 1px solid #d1d5db; border-radius: 8px; padding: 8px; font-size: 12px; font-weight: 700; max-width: 320px; }

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

      {conflito && (
        <ConflitoVinculoDialog conflito={conflito} onResolver={resolverConflito} onFechar={() => setConflito(null)} />
      )}

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
        <select className="nfe-select" value={statusFiltro} onChange={(e) => setStatusFiltro(e.target.value)}>
          <option>Todos</option>
          <option>Em aberto</option>
          <option>Recebidas</option>
          <option>Em atraso</option>
          <option>Canceladas</option>
        </select>
        <button className="nfe-btn" onClick={() => setOrdemAscendente((v) => !v)}>
          {ordemAscendente ? "Mais antigas primeiro" : "Mais recentes primeiro"}
        </button>
      </div>

      <div className="nfe-total">Total filtrado: {brl(totalFiltrado)}</div>

      {selecionados.size > 0 && (
        <div className="nfe-lote-bar">
          <strong>{selecionados.size} nota(s) selecionada(s)</strong>
          <label style={{ display: "flex", alignItems: "center", gap: 6, fontWeight: 800, fontSize: 13 }}>
            Data de recebimento:
            <input
              className="nfe-input"
              type="date"
              value={dataLote}
              onChange={(e) => setDataLote(e.target.value)}
            />
          </label>
          <button className="nfe-btn nfe-btn-green" onClick={marcarSelecionadasRecebidas} disabled={marcandoLote}>
            {marcandoLote ? "Marcando..." : "Marcar selecionadas como recebidas"}
          </button>
          <button className="nfe-btn" onClick={() => setSelecionados(new Set())}>Limpar seleção</button>
        </div>
      )}

      <div className="nfe-card">
        <table className="nfe-table">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={todosSelecionados}
                  onChange={toggleTodos}
                  title="Selecionar todas as notas filtradas (exceto canceladas)"
                />
              </th>
              <th>Nº Nota</th>
              <th>Cliente</th>
              <th>Mês Referência</th>
              <th>Status</th>
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
                <td colSpan={9}>Sem referência</td>
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
    const status = statusNota(item);
    const linhaClasse = item.cancelada ? "nfe-linha-cancelada" : status === "vencida" ? "nfe-linha-vencida" : "";
    return (
      <tr key={item.id} className={linhaClasse}>
        <td data-label="Selecionar">
          {!item.cancelada && (
            <input
              type="checkbox"
              checked={selecionados.has(item.id)}
              onChange={() => toggleSelecionado(item.id)}
            />
          )}
        </td>
        <td data-label="Nº Nota">{item.numeroNota || "-"}</td>
        <td data-label="Cliente">
          {item.cliente || "-"}
          {item.cancelada && <span className="nfe-badge-cancelada">CANCELADA</span>}
        </td>
        <td data-label="Mês Referência">{referenciaLabel(item)}</td>
        <td data-label="Status">
          <span className={`nfe-badge-status nfe-badge-${status}`}>{STATUS_LABEL[status]}</span>
          {status === "recebida" && (
            <div style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", marginTop: 4 }}>
              em {dataCurtaBR(item.dataRecebimento)}
            </div>
          )}
        </td>
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
            {!item.cancelada && (
              status === "recebida" ? (
                <button className="nfe-btn" onClick={() => desfazerRecebida(item)}>Desfazer recebimento</button>
              ) : (
                <button className="nfe-btn nfe-btn-green" onClick={() => marcarRecebida(item)}>Marcar como recebida</button>
              )
            )}
            <button className="nfe-btn" onClick={() => alternarCancelada(item)}>
              {item.cancelada ? "Desfazer cancelamento" : "Marcar como cancelada"}
            </button>
            {!item.financeiroId && (
              <button className="nfe-btn" onClick={() => abrirPickerVinculo(item)}>Vincular a existente</button>
            )}
            <button className="nfe-btn nfe-btn-red" onClick={() => excluir(item)}>Excluir</button>
          </div>
          {vinculandoId === item.id && (
            <div className="nfe-picker-vinculo">
              <select
                defaultValue=""
                onChange={(e) => {
                  if (e.target.value) vincular(item, e.target.value, false);
                }}
              >
                <option value="">Escolher lançamento do Financeiro...</option>
                {(candidatosVinculo.length ? candidatosVinculo : financeiro).map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.cliente} — {brl(f.valor)} — {f.referencia || "-"}
                  </option>
                ))}
              </select>
              <button className="nfe-btn" onClick={() => setVinculandoId(null)}>Cancelar</button>
            </div>
          )}
        </td>
      </tr>
    );
  }
}
