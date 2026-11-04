import React, { useEffect, useMemo, useState } from "react";

const API_BASE = "/api";

const VERDE = "#00B050";
const AZUL = "#2563eb";
const VERMELHO = "#dc2626";
const AMARELO = "#b45309";

// Nota fiscal emitida. A partir da v87 o Dashboard usa a própria nota como fonte da
// verdade do faturamento (status calculado de cancelada/dataRecebimento/vencimento,
// sem cruzar com o financeiro) — o app é novo e muita nota de 2026 ainda não tem
// lançamento correspondente, então depender do financeiro deixava o Dashboard cego
// pra essas notas.
type NotaDashboard = {
  id: string;
  numeroNota: string;
  cliente: string;
  valor: number;
  mesReferencia: number | null;
  anoReferencia: number | null;
  vencimento: string;
  dataRecebimento: string;
};

type SemNotaItem = {
  id: string;
  cliente: string;
  valor: number;
  referencia: string;
};

type StatusNota = "recebida" | "aberta" | "vencida";

const NOMES_MESES = ["", "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

const STATUS_NOTA_LABEL: Record<StatusNota, string> = {
  recebida: "Recebido",
  aberta: "Em aberto",
  vencida: "Vencido",
};

// "Vencida" nunca é gravada - é sempre calculada (vencimento passou e a nota não
// está recebida), então nunca fica desatualizada.
function statusNota(n: { dataRecebimento: string; vencimento: string }, hoje: string): StatusNota {
  if (n.dataRecebimento) return "recebida";
  if (n.vencimento && n.vencimento < hoje) return "vencida";
  return "aberta";
}

function referenciaLabel(n: { mesReferencia: number | null; anoReferencia: number | null }) {
  if (!n.mesReferencia || !n.anoReferencia) return "-";
  return `${NOMES_MESES[n.mesReferencia]}/${n.anoReferencia}`;
}

function brl(v: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(v || 0));
}

function hojeISO() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function curta(iso?: string) {
  if (!iso) return "-";
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function diasEntre(a: string, b: string) {
  const da = new Date(`${a}T00:00:00`).getTime();
  const db = new Date(`${b}T00:00:00`).getTime();
  return Math.round((da - db) / 86400000);
}

function Cartao({
  titulo,
  valor,
  detalhe,
  tipo = "normal",
}: {
  titulo: string;
  valor: string;
  detalhe?: string;
  tipo?: "normal" | "alerta" | "ok" | "perigo" | "info";
}) {
  return (
    <div className={`fdash-card fdash-${tipo}`}>
      <span>{titulo}</span>
      <strong>{valor}</strong>
      {detalhe && <p>{detalhe}</p>}
    </div>
  );
}

export default function Dashboard() {
  const agora = new Date();
  const [notas, setNotas] = useState<NotaDashboard[]>([]);
  const [semNotaEmitida, setSemNotaEmitida] = useState<SemNotaItem[]>([]);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  const [mesSelecionado, setMesSelecionado] = useState(agora.getMonth() + 1);
  const [anoSelecionado, setAnoSelecionado] = useState(agora.getFullYear());
  const [anoResumo, setAnoResumo] = useState(agora.getFullYear());
  const [clienteExpandido, setClienteExpandido] = useState("");
  const [modalAberto, setModalAberto] = useState<"vencidos" | "vencendo" | null>(null);

  async function carregarTudo() {
    setCarregando(true);
    try {
      setErro("");
      const resDash = await fetch(`${API_BASE}/dashboard/financeiro-notas`);
      const dataDash = await resDash.json();

      if (dataDash.status === "ok") {
        setNotas(dataDash.notas || []);
        setSemNotaEmitida(dataDash.semNotaEmitida || []);
      }
    } catch {
      setErro("Não consegui carregar dados do backend SQLite. Confira se o backend está rodando.");
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarTudo();
  }, []);

  const hoje = hojeISO();

  const vencidos = useMemo(() => {
    return notas
      .filter((n) => statusNota(n, hoje) === "vencida")
      .map((n) => ({ ...n, diasAtraso: diasEntre(hoje, n.vencimento) }))
      .sort((a, b) => b.diasAtraso - a.diasAtraso);
  }, [notas, hoje]);

  const vencendoEm7 = useMemo(() => {
    const limite = new Date();
    limite.setDate(limite.getDate() + 7);
    const limiteISO = limite.toISOString().slice(0, 10);
    return notas
      .filter((n) => statusNota(n, hoje) === "aberta" && n.vencimento && n.vencimento >= hoje && n.vencimento <= limiteISO)
      .map((n) => ({ ...n, diasRestantes: diasEntre(n.vencimento, hoje) }))
      .sort((a, b) => a.diasRestantes - b.diasRestantes);
  }, [notas, hoje]);

  const totalVencidos = useMemo(() => vencidos.reduce((a, x) => a + Number(x.valor || 0), 0), [vencidos]);
  const totalVencendo7 = useMemo(() => vencendoEm7.reduce((a, x) => a + Number(x.valor || 0), 0), [vencendoEm7]);

  const totalSemNotaEmitida = useMemo(
    () => semNotaEmitida.reduce((a, x) => a + Number(x.valor || 0), 0),
    [semNotaEmitida]
  );

  const todosOsMeses = mesSelecionado === 0;

  const numerosDoMes = useMemo(() => {
    const itensMes = notas.filter((n) => {
      if (Number(n.anoReferencia) !== anoSelecionado) return false;
      return todosOsMeses || Number(n.mesReferencia) === mesSelecionado;
    });
    const gerado = itensMes.reduce((a, x) => a + Number(x.valor || 0), 0);
    const recebido = itensMes
      .filter((x) => statusNota(x, hoje) === "recebida")
      .reduce((a, x) => a + Number(x.valor || 0), 0);
    const vencido = itensMes
      .filter((x) => statusNota(x, hoje) === "vencida")
      .reduce((a, x) => a + Number(x.valor || 0), 0);
    const emAberto = itensMes
      .filter((x) => statusNota(x, hoje) === "aberta")
      .reduce((a, x) => a + Number(x.valor || 0), 0);
    const acumuladoAnterior = todosOsMeses
      ? 0
      : notas
          .filter((n) => {
            if (statusNota(n, hoje) === "recebida") return false;
            const ano = Number(n.anoReferencia) || 0;
            const mes = Number(n.mesReferencia) || 0;
            return ano < anoSelecionado || (ano === anoSelecionado && mes < mesSelecionado);
          })
          .reduce((a, x) => a + Number(x.valor || 0), 0);
    return { gerado, recebido, emAberto, vencido, acumuladoAnterior };
  }, [notas, mesSelecionado, anoSelecionado, todosOsMeses, hoje]);

  const evolucao12Meses = useMemo(() => {
    const meses: { mes: number; ano: number; label: string; gerado: number; recebido: number }[] = [];
    for (let i = 11; i >= 0; i--) {
      const d = new Date(agora.getFullYear(), agora.getMonth() - i, 1);
      const mes = d.getMonth() + 1;
      const ano = d.getFullYear();
      const itens = notas.filter((n) => Number(n.mesReferencia) === mes && Number(n.anoReferencia) === ano);
      const gerado = itens.reduce((a, x) => a + Number(x.valor || 0), 0);
      const recebido = itens
        .filter((x) => statusNota(x, hoje) === "recebida")
        .reduce((a, x) => a + Number(x.valor || 0), 0);
      meses.push({ mes, ano, label: `${NOMES_MESES[mes].slice(0, 3)}/${String(ano).slice(2)}`, gerado, recebido });
    }
    return meses;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notas, hoje]);

  const anosDisponiveis = useMemo(() => {
    const anos = new Set<number>(notas.map((n) => Number(n.anoReferencia)).filter(Boolean) as number[]);
    anos.add(agora.getFullYear());
    return Array.from(anos).sort((a, b) => b - a);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notas]);

  const resumoAnualClientes = useMemo(() => {
    const itensAno = notas.filter((n) => Number(n.anoReferencia) === anoResumo);
    const porCliente: Record<string, { gerado: number; recebido: number }> = {};
    itensAno.forEach((n) => {
      const nome = n.cliente || "Sem cliente";
      if (!porCliente[nome]) porCliente[nome] = { gerado: 0, recebido: 0 };
      porCliente[nome].gerado += Number(n.valor || 0);
      if (statusNota(n, hoje) === "recebida") porCliente[nome].recebido += Number(n.valor || 0);
    });
    return Object.entries(porCliente)
      .map(([cliente, v]) => ({
        cliente,
        gerado: v.gerado,
        recebido: v.recebido,
        emAberto: v.gerado - v.recebido,
        pctPago: v.gerado > 0 ? (v.recebido / v.gerado) * 100 : 0,
      }))
      .sort((a, b) => b.gerado - a.gerado);
  }, [notas, anoResumo, hoje]);

  const lancamentosClienteExpandido = useMemo(() => {
    if (!clienteExpandido) return [];
    return notas
      .filter((n) => n.cliente === clienteExpandido && Number(n.anoReferencia) === anoResumo)
      .sort((a, b) => (b.mesReferencia || 0) - (a.mesReferencia || 0));
  }, [notas, clienteExpandido, anoResumo]);

  const maiorValorGrafico = Math.max(1, ...evolucao12Meses.flatMap((m) => [m.gerado, m.recebido]));

  const chartAltura = 190;
  const barGroupWidth = 54;
  const barWidth = 18;
  const chartLargura = evolucao12Meses.length * barGroupWidth;

  return (
    <div className="fdash">
      <style>{`
        .fdash { display:grid; gap:18px; }
        .fdash-head { display:flex; justify-content:space-between; align-items:flex-start; gap:16px; flex-wrap:wrap; }
        .fdash-head h1 { margin:0; font-size:32px; font-weight:1000; color:#111827; }
        .fdash-head p { margin:6px 0 0; color:#6b7280; font-weight:700; }
        .fdash-head-actions { display:flex; gap:10px; align-items:center; }
        .fdash-live-pill { background:#eafff2; color:#006b34; border:1px solid rgba(0,176,80,.25); padding:9px 13px; border-radius:999px; font-size:12px; font-weight:1000; }
        .fdash-btn { border:0; background:${VERDE}; color:white; font-weight:900; padding:10px 14px; border-radius:12px; cursor:pointer; font-size:13px; }
        .fdash-btn-secundario { background:#e5e7eb; color:#111827; }
        .fdash-erro { background:#fff7ed; color:#9a3412; border:1px solid #fed7aa; border-radius:16px; padding:12px; font-weight:900; }

        .fdash-select, .fdash-input { border:1px solid #d1d5db; border-radius:8px; padding:8px 10px; font-size:13px; font-family:inherit; font-weight:700; }

        .fdash-secao { display:grid; gap:12px; }
        .fdash-secao h2 { margin:0; font-size:19px; font-weight:1000; color:#111827; }
        .fdash-secao-head { display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; }

        .fdash-atencao { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
        .fdash-painel { background:#fff; border:1px solid #e5e7eb; border-radius:22px; padding:18px; box-shadow:0 10px 24px rgba(0,0,0,.05); }
        .fdash-painel.vermelho { border-color:#fecaca; background:#fff5f5; }
        .fdash-painel.amarelo { border-color:#fde68a; background:#fffbeb; }
        .fdash-painel-titulo { display:flex; justify-content:space-between; align-items:baseline; margin-bottom:8px; }
        .fdash-painel-titulo strong { font-size:16px; font-weight:1000; }
        .fdash-painel-titulo span { font-size:13px; font-weight:900; color:#4b5563; }
        .fdash-lista-item { display:flex; justify-content:space-between; gap:8px; padding:7px 0; border-bottom:1px solid rgba(0,0,0,.06); font-size:13px; font-weight:700; }
        .fdash-lista-item:last-child { border-bottom:0; }
        .fdash-lista-item .nome { color:#111827; font-weight:900; }
        .fdash-lista-item .tag { font-size:11px; font-weight:1000; white-space:nowrap; }
        .fdash-ok-msg { color:#166534; font-weight:900; padding:8px 0; }
        .fdash-mais { font-size:12px; color:#6b7280; font-weight:800; padding-top:6px; }
        .fdash-mais-btn { background:none; border:0; color:${AZUL}; font-weight:900; cursor:pointer; padding:6px 0 0; text-decoration:underline; font-size:12px; }

        .fdash-modal-backdrop { position:fixed; inset:0; background:rgba(0,0,0,.45); display:flex; align-items:center; justify-content:center; z-index:1000; padding:20px; }
        .fdash-modal { background:white; border-radius:20px; max-width:720px; width:100%; max-height:82vh; display:flex; flex-direction:column; box-shadow:0 20px 60px rgba(0,0,0,.3); }
        .fdash-modal-head { display:flex; justify-content:space-between; align-items:center; gap:10px; padding:16px 20px; border-bottom:1px solid #e5e7eb; }
        .fdash-modal-head strong { font-size:16px; font-weight:1000; color:#111827; }
        .fdash-modal-body { padding:8px 20px 20px; overflow-y:auto; }
        @media(max-width:480px) { .fdash-modal { max-height:88vh; } }

        .fdash-cards { display:grid; grid-template-columns: repeat(4, minmax(0,1fr)); gap:14px; }
        .fdash-card { background:white; border:1px solid #e5e7eb; border-radius:22px; padding:18px; box-shadow:0 10px 24px rgba(0,0,0,.06); }
        .fdash-card span { display:block; color:#6b7280; font-size:12px; font-weight:1000; text-transform:uppercase; }
        .fdash-card strong { display:block; margin-top:8px; font-size:26px; font-weight:1000; color:#111827; }
        .fdash-card p { margin:6px 0 0; color:#6b7280; font-size:12px; font-weight:700; }
        .fdash-card.fdash-ok strong { color:${VERDE}; }
        .fdash-card.fdash-alerta strong { color:${AMARELO}; }
        .fdash-card.fdash-perigo strong { color:${VERMELHO}; }
        .fdash-card.fdash-info strong { color:${AZUL}; }

        .fdash-grafico-legenda { display:flex; gap:16px; font-size:12px; font-weight:900; color:#374151; margin-bottom:8px; }
        .fdash-legenda-item { display:flex; align-items:center; gap:6px; }
        .fdash-legenda-cor { width:11px; height:11px; border-radius:3px; display:inline-block; }
        .fdash-grafico-wrap { overflow-x:auto; }

        .fdash-tabela-wrap { overflow-x:auto; }
        .fdash-tabela { width:100%; border-collapse:collapse; font-size:13px; }
        .fdash-tabela th { text-align:left; background:#f9fafb; padding:10px; color:#374151; font-weight:1000; border-bottom:1px solid #e5e7eb; white-space:nowrap; }
        .fdash-tabela td { padding:10px; border-bottom:1px solid #edf0f2; font-weight:700; }
        .fdash-tabela tr:last-child td { border-bottom:0; }
        .fdash-tabela tbody tr.fdash-clicavel { cursor:pointer; }
        .fdash-tabela tbody tr.fdash-clicavel:hover { background:#f9fafb; }
        .fdash-barra-pct { background:#e5e7eb; border-radius:999px; height:8px; width:100%; overflow:hidden; margin-top:4px; }
        .fdash-barra-pct-fill { background:${VERDE}; height:100%; }
        .fdash-empty { color:#6b7280; font-weight:700; padding:12px 0; }
        .fdash-sub-linha td { background:#f9fafb; padding:14px; }

        @media(max-width: 1100px) { .fdash-cards { grid-template-columns: 1fr 1fr; } }
        @media(max-width: 900px) { .fdash-atencao { grid-template-columns:1fr; } }
        @media(max-width: 650px) { .fdash-cards { grid-template-columns:1fr; } }
      `}</style>

      <div className="fdash-head">
        <div>
          <h1>Dashboard Financeiro</h1>
          <p>Indicadores calculados a partir das notas fiscais emitidas.</p>
        </div>
        <div className="fdash-head-actions">
          <button className="fdash-btn" onClick={carregarTudo}>{carregando ? "Atualizando..." : "Atualizar"}</button>
          <div className="fdash-live-pill">SQLite conectado</div>
        </div>
      </div>

      {erro && <div className="fdash-erro">{erro}</div>}

      <div className="fdash-secao">
        <h2>Atenção</h2>
        <div className="fdash-atencao">
          <div className="fdash-painel vermelho">
            <div className="fdash-painel-titulo">
              <strong>🔴 Vencidos</strong>
              <span>{vencidos.length} · {brl(totalVencidos)}</span>
            </div>
            {vencidos.length === 0 ? (
              <div className="fdash-ok-msg">Nenhum vencido 🎉</div>
            ) : (
              <>
                {vencidos.slice(0, 6).map((l) => (
                  <div className="fdash-lista-item" key={l.id}>
                    <span className="nome">{l.cliente} — {brl(l.valor)}</span>
                    <span className="tag" style={{ color: VERMELHO }}>há {l.diasAtraso} {l.diasAtraso === 1 ? "dia" : "dias"}</span>
                  </div>
                ))}
                <button className="fdash-mais-btn" onClick={() => setModalAberto("vencidos")}>
                  Ver todos ({vencidos.length})
                </button>
              </>
            )}
          </div>

          <div className="fdash-painel amarelo">
            <div className="fdash-painel-titulo">
              <strong>🟡 Vencem nos próximos 7 dias</strong>
              <span>{vencendoEm7.length} · {brl(totalVencendo7)}</span>
            </div>
            {vencendoEm7.length === 0 ? (
              <div className="fdash-ok-msg">Nada vencendo nos próximos 7 dias 🎉</div>
            ) : (
              <>
                {vencendoEm7.slice(0, 6).map((l) => (
                  <div className="fdash-lista-item" key={l.id}>
                    <span className="nome">{l.cliente} — {brl(l.valor)}</span>
                    <span className="tag" style={{ color: AMARELO }}>
                      {l.diasRestantes === 0 ? "vence hoje" : `vence em ${l.diasRestantes} ${l.diasRestantes === 1 ? "dia" : "dias"}`}
                    </span>
                  </div>
                ))}
                <button className="fdash-mais-btn" onClick={() => setModalAberto("vencendo")}>
                  Ver todos ({vencendoEm7.length})
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {modalAberto && (
        <div className="fdash-modal-backdrop" onClick={() => setModalAberto(null)}>
          <div className="fdash-modal" onClick={(e) => e.stopPropagation()}>
            <div className="fdash-modal-head">
              <strong>
                {modalAberto === "vencidos"
                  ? `Vencidos (${vencidos.length})`
                  : `Vencem nos próximos 7 dias (${vencendoEm7.length})`}
              </strong>
              <button className="fdash-btn fdash-btn-secundario" onClick={() => setModalAberto(null)}>Fechar</button>
            </div>
            <div className="fdash-modal-body">
              <div className="fdash-tabela-wrap">
                <table className="fdash-tabela">
                  <thead>
                    <tr>
                      <th>Cliente</th>
                      <th>Referência</th>
                      <th>Vencimento</th>
                      <th>Valor</th>
                      <th>{modalAberto === "vencidos" ? "Dias em atraso" : "Dias restantes"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(modalAberto === "vencidos" ? vencidos : vencendoEm7).map((n: any) => (
                      <tr key={n.id}>
                        <td>{n.cliente}</td>
                        <td>{referenciaLabel(n)}</td>
                        <td>{curta(n.vencimento)}</td>
                        <td>{brl(n.valor)}</td>
                        <td style={{ color: modalAberto === "vencidos" ? VERMELHO : AMARELO, fontWeight: 900 }}>
                          {modalAberto === "vencidos"
                            ? `${n.diasAtraso} ${n.diasAtraso === 1 ? "dia" : "dias"}`
                            : n.diasRestantes === 0
                            ? "hoje"
                            : `${n.diasRestantes} ${n.diasRestantes === 1 ? "dia" : "dias"}`}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="fdash-secao">
        <div className="fdash-secao-head">
          <h2>Números do {todosOsMeses ? "ano" : "mês"}</h2>
          <div className="fdash-head-actions">
            <select className="fdash-select" value={mesSelecionado} onChange={(e) => setMesSelecionado(Number(e.target.value))}>
              <option value={0}>Todos os meses (ano inteiro)</option>
              {NOMES_MESES.slice(1).map((nome, i) => <option key={nome} value={i + 1}>{nome}</option>)}
            </select>
            <input className="fdash-input" type="number" style={{ width: 90 }} value={anoSelecionado} onChange={(e) => setAnoSelecionado(Number(e.target.value || agora.getFullYear()))} />
          </div>
        </div>
        <div className="fdash-cards">
          <Cartao titulo={todosOsMeses ? "Gerado no ano" : "Gerado no mês"} valor={brl(numerosDoMes.gerado)} tipo="normal" />
          <Cartao titulo={todosOsMeses ? "Recebido no ano" : "Recebido no mês"} valor={brl(numerosDoMes.recebido)} tipo="ok" />
          <Cartao titulo={todosOsMeses ? "Em aberto no ano" : "Em aberto no mês"} valor={brl(numerosDoMes.emAberto)} tipo={numerosDoMes.emAberto > 0 ? "alerta" : "ok"} />
          <Cartao titulo={todosOsMeses ? "Vencido no ano" : "Vencido no mês"} valor={brl(numerosDoMes.vencido)} tipo={numerosDoMes.vencido > 0 ? "perigo" : "ok"} />
          {!todosOsMeses && (
            <Cartao titulo="Acumulado em aberto (meses anteriores)" valor={brl(numerosDoMes.acumuladoAnterior)} tipo={numerosDoMes.acumuladoAnterior > 0 ? "perigo" : "ok"} />
          )}
          <Cartao
            titulo="Sem nota emitida"
            valor={brl(totalSemNotaEmitida)}
            detalhe={`${semNotaEmitida.length} lançamento(s) do Financeiro sem nota fiscal correspondente`}
            tipo={semNotaEmitida.length > 0 ? "alerta" : "ok"}
          />
        </div>
      </div>

      <div className="fdash-secao">
        <h2>Evolução — últimos 12 meses</h2>
        <div className="fdash-painel">
          <div className="fdash-grafico-legenda">
            <span className="fdash-legenda-item"><span className="fdash-legenda-cor" style={{ background: VERDE }} /> Gerado</span>
            <span className="fdash-legenda-item"><span className="fdash-legenda-cor" style={{ background: AZUL }} /> Recebido</span>
          </div>
          <div className="fdash-grafico-wrap">
            <svg viewBox={`0 0 ${chartLargura} ${chartAltura + 34}`} width={chartLargura} height={chartAltura + 34} style={{ minWidth: "100%" }}>
              {evolucao12Meses.map((m, i) => {
                const x = i * barGroupWidth + 6;
                const alturaGerado = (m.gerado / maiorValorGrafico) * chartAltura;
                const alturaRecebido = (m.recebido / maiorValorGrafico) * chartAltura;
                return (
                  <g key={`${m.ano}-${m.mes}`}>
                    <title>{`${m.label}: gerado ${brl(m.gerado)} · recebido ${brl(m.recebido)}`}</title>
                    <rect x={x} y={chartAltura - alturaGerado} width={barWidth} height={alturaGerado} fill={VERDE} rx={3} />
                    <rect x={x + barWidth + 4} y={chartAltura - alturaRecebido} width={barWidth} height={alturaRecebido} fill={AZUL} rx={3} />
                    <text x={x + barWidth} y={chartAltura + 16} fontSize="9" fontWeight={800} fill="#6b7280" textAnchor="middle">{m.label}</text>
                  </g>
                );
              })}
              <line x1={0} y1={chartAltura} x2={chartLargura} y2={chartAltura} stroke="#e5e7eb" strokeWidth={1} />
            </svg>
          </div>
        </div>
      </div>

      <div className="fdash-secao">
        <div className="fdash-secao-head">
          <h2>Resumo anual por cliente</h2>
          <select className="fdash-select" value={anoResumo} onChange={(e) => { setAnoResumo(Number(e.target.value)); setClienteExpandido(""); }}>
            {anosDisponiveis.map((a) => <option key={a} value={a}>{a}</option>)}
          </select>
        </div>
        <div className="fdash-painel">
          {resumoAnualClientes.length === 0 ? (
            <div className="fdash-empty">Nenhum lançamento em {anoResumo}.</div>
          ) : (
            <div className="fdash-tabela-wrap">
              <table className="fdash-tabela">
                <thead>
                  <tr>
                    <th>Cliente</th>
                    <th>Total gerado</th>
                    <th>Total recebido</th>
                    <th>Em aberto</th>
                    <th>% pago</th>
                  </tr>
                </thead>
                <tbody>
                  {resumoAnualClientes.map((c) => (
                    <React.Fragment key={c.cliente}>
                      <tr
                        className="fdash-clicavel"
                        onClick={() => setClienteExpandido(clienteExpandido === c.cliente ? "" : c.cliente)}
                      >
                        <td>{c.cliente}</td>
                        <td>{brl(c.gerado)}</td>
                        <td>{brl(c.recebido)}</td>
                        <td>{brl(c.emAberto)}</td>
                        <td>
                          {c.pctPago.toFixed(0)}%
                          <div className="fdash-barra-pct"><div className="fdash-barra-pct-fill" style={{ width: `${Math.min(100, c.pctPago)}%` }} /></div>
                        </td>
                      </tr>
                      {clienteExpandido === c.cliente && (
                        <tr className="fdash-sub-linha">
                          <td colSpan={5}>
                            {lancamentosClienteExpandido.length === 0 ? (
                              <div className="fdash-empty">Sem lançamentos.</div>
                            ) : (
                              lancamentosClienteExpandido.map((l) => (
                                <div className="fdash-lista-item" key={l.id}>
                                  <span className="nome">{NOMES_MESES[l.mesReferencia || 0]} — {brl(l.valor)}</span>
                                  <span className="tag">{STATUS_NOTA_LABEL[statusNota(l, hoje)]}{l.vencimento ? ` · venc. ${curta(l.vencimento)}` : ""}</span>
                                </div>
                              ))
                            )}
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
