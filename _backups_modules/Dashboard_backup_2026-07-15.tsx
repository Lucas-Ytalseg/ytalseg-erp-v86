import React, { useEffect, useMemo, useState } from "react";

const API_BASE = "/api";

const VERDE = "#00B050";
const AZUL = "#2563eb";
const VERMELHO = "#dc2626";
const AMARELO = "#b45309";

type Lancamento = {
  id: string;
  cliente: string;
  referencia: string;
  valor: number;
  status: string;
  dataEmissao: string;
  dataRecebimento: string;
  vencimento: string;
  dataPromessaPagamento: string;
  notaEnviada: boolean;
  dataEnvioNota: string;
  nota: string;
  observacao: string;
  mesReferencia: number | null;
  anoReferencia: number | null;
};

type Colaborador = {
  id: string;
  nome: string;
  ativo: boolean;
  validade: string;
};

const NOMES_MESES = ["", "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

const STATUS_LABEL: Record<string, string> = {
  pendente: "Pendente",
  nota_enviada: "Nota enviada",
  cobrado: "Cobrado",
  prometeu_pagar: "Prometeu pagar",
  negociacao: "Em negociação",
  aprovado: "Aprovado",
  recebido: "Recebido",
};

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
  const [financeiro, setFinanceiro] = useState<Lancamento[]>([]);
  const [equipe, setEquipe] = useState<Colaborador[]>([]);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  const [mesSelecionado, setMesSelecionado] = useState(agora.getMonth() + 1);
  const [anoSelecionado, setAnoSelecionado] = useState(agora.getFullYear());
  const [anoResumo, setAnoResumo] = useState(agora.getFullYear());
  const [clienteExpandido, setClienteExpandido] = useState("");

  async function carregarTudo() {
    setCarregando(true);
    try {
      setErro("");
      const [resFin, resEquipe] = await Promise.all([
        fetch(`${API_BASE}/financeiro`),
        fetch(`${API_BASE}/equipe`).catch(() => null),
      ]);

      const dataFin = await resFin.json();

      if (dataFin.status === "ok") setFinanceiro(dataFin.lancamentos || []);

      if (resEquipe) {
        const dataEquipe = await resEquipe.json();
        if (dataEquipe.status === "ok") setEquipe(dataEquipe.equipe || []);
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
    return financeiro
      .filter((l) => l.vencimento && l.vencimento < hoje && l.status !== "recebido")
      .map((l) => ({ ...l, diasAtraso: diasEntre(hoje, l.vencimento) }))
      .sort((a, b) => b.diasAtraso - a.diasAtraso);
  }, [financeiro, hoje]);

  const vencendoEm7 = useMemo(() => {
    const limite = new Date();
    limite.setDate(limite.getDate() + 7);
    const limiteISO = limite.toISOString().slice(0, 10);
    return financeiro
      .filter((l) => l.vencimento && l.vencimento >= hoje && l.vencimento <= limiteISO && l.status !== "recebido")
      .map((l) => ({ ...l, diasRestantes: diasEntre(l.vencimento, hoje) }))
      .sort((a, b) => a.diasRestantes - b.diasRestantes);
  }, [financeiro, hoje]);

  const totalVencidos = useMemo(() => vencidos.reduce((a, x) => a + Number(x.valor || 0), 0), [vencidos]);
  const totalVencendo7 = useMemo(() => vencendoEm7.reduce((a, x) => a + Number(x.valor || 0), 0), [vencendoEm7]);

  const numerosDoMes = useMemo(() => {
    const itensMes = financeiro.filter(
      (l) => Number(l.mesReferencia) === mesSelecionado && Number(l.anoReferencia) === anoSelecionado
    );
    const gerado = itensMes.reduce((a, x) => a + Number(x.valor || 0), 0);
    const recebido = itensMes
      .filter((x) => x.status === "recebido")
      .reduce((a, x) => a + Number(x.valor || 0), 0);
    const emAberto = gerado - recebido;
    const acumuladoAnterior = financeiro
      .filter((l) => {
        if (l.status === "recebido") return false;
        const ano = Number(l.anoReferencia) || 0;
        const mes = Number(l.mesReferencia) || 0;
        return ano < anoSelecionado || (ano === anoSelecionado && mes < mesSelecionado);
      })
      .reduce((a, x) => a + Number(x.valor || 0), 0);
    return { gerado, recebido, emAberto, acumuladoAnterior };
  }, [financeiro, mesSelecionado, anoSelecionado]);

  const evolucao12Meses = useMemo(() => {
    const meses: { mes: number; ano: number; label: string; gerado: number; recebido: number }[] = [];
    for (let i = 11; i >= 0; i--) {
      const d = new Date(agora.getFullYear(), agora.getMonth() - i, 1);
      const mes = d.getMonth() + 1;
      const ano = d.getFullYear();
      const itens = financeiro.filter((l) => Number(l.mesReferencia) === mes && Number(l.anoReferencia) === ano);
      const gerado = itens.reduce((a, x) => a + Number(x.valor || 0), 0);
      const recebido = itens
        .filter((x) => x.status === "recebido")
        .reduce((a, x) => a + Number(x.valor || 0), 0);
      meses.push({ mes, ano, label: `${NOMES_MESES[mes].slice(0, 3)}/${String(ano).slice(2)}`, gerado, recebido });
    }
    return meses;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [financeiro]);

  const anosDisponiveis = useMemo(() => {
    const anos = new Set<number>(financeiro.map((l) => Number(l.anoReferencia)).filter(Boolean) as number[]);
    anos.add(agora.getFullYear());
    return Array.from(anos).sort((a, b) => b - a);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [financeiro]);

  const resumoAnualClientes = useMemo(() => {
    const itensAno = financeiro.filter((l) => Number(l.anoReferencia) === anoResumo);
    const porCliente: Record<string, { gerado: number; recebido: number }> = {};
    itensAno.forEach((l) => {
      const nome = l.cliente || "Sem cliente";
      if (!porCliente[nome]) porCliente[nome] = { gerado: 0, recebido: 0 };
      porCliente[nome].gerado += Number(l.valor || 0);
      if (l.status === "recebido") porCliente[nome].recebido += Number(l.valor || 0);
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
  }, [financeiro, anoResumo]);

  const lancamentosClienteExpandido = useMemo(() => {
    if (!clienteExpandido) return [];
    return financeiro
      .filter((l) => l.cliente === clienteExpandido && Number(l.anoReferencia) === anoResumo)
      .sort((a, b) => (b.mesReferencia || 0) - (a.mesReferencia || 0));
  }, [financeiro, clienteExpandido, anoResumo]);

  const equipeAtiva = equipe.filter((e) => e.ativo).length;
  const documentosComValidade = equipe.filter((e) => e.validade);
  const docsVencendo = documentosComValidade.filter((e) => {
    const validade = new Date(e.validade);
    const diff = validade.getTime() - new Date().getTime();
    const dias = diff / (1000 * 60 * 60 * 24);
    return dias >= 0 && dias <= 30;
  }).length;
  const docsVencidos = documentosComValidade.filter((e) => new Date(e.validade) < new Date()).length;

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

        .fdash-secundaria { background:white; border:1px solid #e5e7eb; border-radius:24px; padding:20px; box-shadow:0 10px 24px rgba(0,0,0,.05); }
        .fdash-secundaria h2 { margin:0 0 14px; font-size:19px; font-weight:1000; color:#111827; }
        .fdash-mini-cards { display:grid; grid-template-columns:repeat(3,1fr); gap:14px; }

        @media(max-width: 1100px) { .fdash-cards { grid-template-columns: 1fr 1fr; } }
        @media(max-width: 900px) { .fdash-atencao { grid-template-columns:1fr; } .fdash-mini-cards{grid-template-columns:1fr 1fr;} }
        @media(max-width: 650px) { .fdash-cards { grid-template-columns:1fr; } .fdash-mini-cards{grid-template-columns:1fr;} }
      `}</style>

      <div className="fdash-head">
        <div>
          <h1>Dashboard Financeiro</h1>
          <p>Indicadores reais puxados do SQLite: Financeiro, Clientes e Equipe.</p>
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
                {vencidos.length > 6 && <div className="fdash-mais">+ {vencidos.length - 6} outros</div>}
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
                {vencendoEm7.length > 6 && <div className="fdash-mais">+ {vencendoEm7.length - 6} outros</div>}
              </>
            )}
          </div>
        </div>
      </div>

      <div className="fdash-secao">
        <div className="fdash-secao-head">
          <h2>Números do mês</h2>
          <div className="fdash-head-actions">
            <select className="fdash-select" value={mesSelecionado} onChange={(e) => setMesSelecionado(Number(e.target.value))}>
              {NOMES_MESES.slice(1).map((nome, i) => <option key={nome} value={i + 1}>{nome}</option>)}
            </select>
            <input className="fdash-input" type="number" style={{ width: 90 }} value={anoSelecionado} onChange={(e) => setAnoSelecionado(Number(e.target.value || agora.getFullYear()))} />
          </div>
        </div>
        <div className="fdash-cards">
          <Cartao titulo="Gerado no mês" valor={brl(numerosDoMes.gerado)} tipo="normal" />
          <Cartao titulo="Recebido no mês" valor={brl(numerosDoMes.recebido)} tipo="ok" />
          <Cartao titulo="Em aberto no mês" valor={brl(numerosDoMes.emAberto)} tipo={numerosDoMes.emAberto > 0 ? "alerta" : "ok"} />
          <Cartao titulo="Acumulado em aberto (meses anteriores)" valor={brl(numerosDoMes.acumuladoAnterior)} tipo={numerosDoMes.acumuladoAnterior > 0 ? "perigo" : "ok"} />
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
                                  <span className="tag">{STATUS_LABEL[l.status] || l.status}{l.vencimento ? ` · venc. ${curta(l.vencimento)}` : ""}</span>
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

      <div className="fdash-secundaria">
        <h2>Equipe e documentos</h2>
        <div className="fdash-mini-cards">
          <Cartao titulo="Equipe ativa" valor={String(equipeAtiva)} detalhe="Colaboradores ativos" tipo="info" />
          <Cartao titulo="Docs vencendo" valor={String(docsVencendo)} detalhe="Próximos 30 dias" tipo={docsVencendo > 0 ? "alerta" : "ok"} />
          <Cartao titulo="Docs vencidos" valor={String(docsVencidos)} detalhe="Requer atenção" tipo={docsVencidos > 0 ? "perigo" : "ok"} />
        </div>
      </div>
    </div>
  );
}
