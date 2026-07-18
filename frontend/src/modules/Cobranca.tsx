import React, { useEffect, useMemo, useState } from "react";

const API_BASE = "/api";
const VERDE = "#00B050";

/**
 * Fonte de verdade dos campos usados aqui (V10, confirmado direto no backend/outros módulos):
 * - GET /notas-fiscais -> notas (row_nota_fiscal, main.py): id, numeroNota, cliente,
 *   mesReferencia, anoReferencia, vencimento, valor, cancelada, dataRecebimento, e os
 *   3 campos novos da V10 (cobrancaStatus, cobrancaData, cobrancaObs) usados só quando
 *   a nota NÃO tem vínculo com o Financeiro.
 * - "Em atraso" nunca é um campo gravado - é sempre calculado (vencimento < hoje e a
 *   nota não está recebida/cancelada). Mesma regra de NotasFiscaisEmitidas.tsx.
 * - GET /vinculos -> cada item já vem com o objeto `lancamento` (Financeiro completo)
 *   embutido quando existe vínculo com aquela nota - basta filtrar por notaId, sem
 *   fetch extra.
 * - GET /empresas -> cadastro de clientes (Clientes.tsx), com o campo `telefone` novo
 *   da V10. Nota casa com cliente pelo nome (substring, igual ao backend).
 * - Registrar cobrança: nota vinculada -> POST /financeiro com o lançamento inteiro
 *   (mesmo upsert que o Financeiro.tsx já usa, que propaga sozinho pro vínculo);
 *   nota SEM vínculo -> PATCH /notas-fiscais/{id}/cobranca (campos aditivos, nunca
 *   mexe em cancelada/dataRecebimento).
 */

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
  cancelada: boolean;
  dataRecebimento: string;
  cobrancaStatus: string;
  cobrancaData: string;
  cobrancaObs: string;
};

type Lancamento = {
  id: string;
  cliente: string;
  referencia: string;
  descricao: string;
  valor: number;
  status: string;
  dataEmissao: string;
  dataRecebimento: string;
  vencimento: string;
  dataPromessaPagamento: string;
  notaEnviada: boolean;
  dataEnvioNota: string;
  observacao: string;
  nota: string;
  mesReferencia: number | null;
  anoReferencia: number | null;
};

type VinculoItem = {
  id: string;
  lancamentoId: string | null;
  notaId: string | null;
  historicoId: string | null;
  lancamento: Lancamento | null;
};

type Empresa = {
  id: string;
  nome: string;
  cnpj: string;
  telefone?: string;
};

const NOMES_MESES = ["", "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

const DESFECHOS = [
  { valor: "cobrado", label: "Cobrado" },
  { valor: "prometeu_pagar", label: "Prometeu pagar" },
  { valor: "negociacao", label: "Em negociação" },
];

function hojeISO() {
  return new Date().toISOString().slice(0, 10);
}

// Mesma lógica de NotasFiscaisEmitidas.tsx - "Em atraso" é sempre calculado, nunca gravado.
function statusNota(item: NotaFiscalItem): "aberta" | "recebida" | "cancelada" | "vencida" {
  if (item.cancelada) return "cancelada";
  if (item.dataRecebimento) return "recebida";
  if (item.vencimento && item.vencimento < hojeISO()) return "vencida";
  return "aberta";
}

function diasEntreHojeE(iso: string) {
  const hoje = new Date(`${hojeISO()}T00:00:00`);
  const alvo = new Date(`${iso}T00:00:00`);
  return Math.round((alvo.getTime() - hoje.getTime()) / 86400000);
}

function brl(v: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(v || 0));
}

function curta(iso?: string) {
  if (!iso) return "-";
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
}

function clienteBate(a: string, b: string) {
  const x = (a || "").trim().toLowerCase();
  const y = (b || "").trim().toLowerCase();
  if (!x || !y) return false;
  return x.includes(y) || y.includes(x);
}

function soDigitos(s: string) {
  return (s || "").replace(/\D/g, "");
}

export default function Cobranca() {
  const [notas, setNotas] = useState<NotaFiscalItem[]>([]);
  const [vinculos, setVinculos] = useState<VinculoItem[]>([]);
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [janela, setJanela] = useState<7 | 15 | 30>(15);
  const [busca, setBusca] = useState("");

  const [whatsapp, setWhatsapp] = useState<null | { cliente: string; texto: string; telefone: string }>(null);
  const [registrar, setRegistrar] = useState<null | { nota: NotaFiscalItem; vinculo: VinculoItem | null }>(null);
  const [desfecho, setDesfecho] = useState("cobrado");
  const [dataPrometida, setDataPrometida] = useState("");

  async function carregar() {
    setCarregando(true);
    setErro("");
    try {
      const [resNotas, resVinculos, resEmpresas] = await Promise.all([
        fetch(`${API_BASE}/notas-fiscais`),
        fetch(`${API_BASE}/vinculos`),
        fetch(`${API_BASE}/empresas`),
      ]);
      const dNotas = await resNotas.json();
      const dVinculos = await resVinculos.json();
      const dEmpresas = await resEmpresas.json();
      if (dNotas.status === "ok") setNotas(dNotas.notas || []);
      if (dVinculos.status === "ok") setVinculos(dVinculos.vinculos || []);
      if (dEmpresas.status === "ok") setEmpresas(dEmpresas.empresas || []);
    } catch {
      setErro("Não consegui conectar no backend.");
    }
    setCarregando(false);
  }

  useEffect(() => {
    carregar();
  }, []);

  function vinculoDaNota(notaId: string): VinculoItem | null {
    return vinculos.find((v) => v.notaId === notaId) || null;
  }

  function telefoneDoCliente(nomeCliente: string): string {
    const emp = empresas.find((e) => clienteBate(e.nome, nomeCliente));
    return emp?.telefone || "";
  }

  const cobraveis = useMemo(() => notas.filter((n) => !n.cancelada && !n.dataRecebimento), [notas]);

  const filtradas = useMemo(() => {
    if (!busca.trim()) return cobraveis;
    const b = busca.trim().toLowerCase();
    return cobraveis.filter((n) => (n.cliente || "").toLowerCase().includes(b));
  }, [cobraveis, busca]);

  type Grupo = { cliente: string; notas: NotaFiscalItem[]; total: number; diasMaisUrgente: number };

  const grupos = useMemo(() => {
    const mapa = new Map<string, Grupo>();
    for (const n of filtradas) {
      const st = statusNota(n);
      const dias = n.vencimento ? diasEntreHojeE(n.vencimento) : null;
      const dentroJanela = st === "vencida" || dias === null || dias <= janela;
      if (!dentroJanela) continue;
      const chave = (n.cliente || "Sem cliente").trim() || "Sem cliente";
      if (!mapa.has(chave)) mapa.set(chave, { cliente: chave, notas: [], total: 0, diasMaisUrgente: 999999 });
      const g = mapa.get(chave)!;
      g.notas.push(n);
      g.total += n.valor || 0;
      if (dias !== null && dias < g.diasMaisUrgente) g.diasMaisUrgente = dias;
    }
    for (const g of mapa.values()) {
      g.notas.sort((a, b) => {
        const da = a.vencimento ? diasEntreHojeE(a.vencimento) : 999999;
        const db = b.vencimento ? diasEntreHojeE(b.vencimento) : 999999;
        return da - db;
      });
    }
    return Array.from(mapa.values()).sort((a, b) => a.diasMaisUrgente - b.diasMaisUrgente);
  }, [filtradas, janela]);

  function montarTextoWhatsapp(cliente: string, notasCliente: NotaFiscalItem[]) {
    const total = notasCliente.reduce((s, n) => s + (n.valor || 0), 0);
    const linhas = notasCliente
      .map((n) => {
        const ref = n.mesReferencia && n.anoReferencia ? `${NOMES_MESES[n.mesReferencia]} / ${n.anoReferencia}` : "-";
        return `• Nota ${n.numeroNota || "-"} (${ref}) — ${brl(n.valor)} — vencimento ${curta(n.vencimento)}`;
      })
      .join("\n");
    return (
      `Olá, ${cliente}! Tudo bem?\n\n` +
      `Passando para lembrar da${notasCliente.length > 1 ? "s notas fiscais" : " nota fiscal"} em aberto:\n\n${linhas}\n\n` +
      `Total: ${brl(total)}\n\n` +
      `Qualquer dúvida estou à disposição. Obrigado!\n— YTALSEG`
    );
  }

  function abrirWhatsappCliente(g: Grupo) {
    setWhatsapp({ cliente: g.cliente, texto: montarTextoWhatsapp(g.cliente, g.notas), telefone: telefoneDoCliente(g.cliente) });
  }

  function abrirWhatsappNota(n: NotaFiscalItem) {
    setWhatsapp({ cliente: n.cliente, texto: montarTextoWhatsapp(n.cliente, [n]), telefone: telefoneDoCliente(n.cliente) });
  }

  function enviarWhatsapp() {
    if (!whatsapp) return;
    const numero = soDigitos(whatsapp.telefone);
    if (!numero) {
      alert("Informe um telefone (com DDD) antes de enviar.");
      return;
    }
    const url = `https://wa.me/55${numero}?text=${encodeURIComponent(whatsapp.texto)}`;
    window.open(url, "_blank");
  }

  function abrirRegistrar(nota: NotaFiscalItem) {
    setRegistrar({ nota, vinculo: vinculoDaNota(nota.id) });
    setDesfecho("cobrado");
    setDataPrometida("");
  }

  async function confirmarRegistro() {
    if (!registrar) return;
    const { nota, vinculo } = registrar;
    const hojeFmt = curta(hojeISO());
    const labelDesfecho = DESFECHOS.find((d) => d.valor === desfecho)?.label || desfecho;

    if (vinculo && vinculo.lancamento) {
      const l = vinculo.lancamento;
      const notaObs = `[Cobrança ${hojeFmt}] ${labelDesfecho} - registrado via aba Cobrança.`;
      const observacao = l.observacao ? `${l.observacao}\n${notaObs}` : notaObs;
      const atualizado: Lancamento = {
        ...l,
        status: desfecho,
        dataPromessaPagamento: desfecho === "prometeu_pagar" ? dataPrometida || hojeISO() : l.dataPromessaPagamento,
        observacao,
      };
      const res = await fetch(`${API_BASE}/financeiro`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(atualizado),
      });
      const data = await res.json();
      if (data.status !== "ok") {
        alert("Erro ao registrar cobrança no lançamento vinculado.");
        return;
      }
    } else {
      const res = await fetch(`${API_BASE}/notas-fiscais/${nota.id}/cobranca`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: desfecho,
          data: desfecho === "prometeu_pagar" ? dataPrometida || hojeISO() : hojeISO(),
        }),
      });
      const data = await res.json();
      if (data.status !== "ok") {
        alert("Erro ao registrar cobrança na nota.");
        return;
      }
    }
    setRegistrar(null);
    await carregar();
  }

  async function desfazerRegistro(nota: NotaFiscalItem, vinculo: VinculoItem | null) {
    if (!confirm(`Desfazer o registro de cobrança da nota ${nota.numeroNota || nota.id}?`)) return;
    if (vinculo && vinculo.lancamento) {
      const l = vinculo.lancamento;
      const observacao = l.observacao ? `${l.observacao}\n[Cobrança desfeita]` : "[Cobrança desfeita]";
      await fetch(`${API_BASE}/financeiro`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...l, status: "pendente", observacao }),
      });
    } else {
      await fetch(`${API_BASE}/notas-fiscais/${nota.id}/cobranca`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "" }),
      });
    }
    await carregar();
  }

  function seloUltimaCobranca(nota: NotaFiscalItem, vinculo: VinculoItem | null): string | null {
    if (vinculo && vinculo.lancamento) {
      const l = vinculo.lancamento;
      const info = DESFECHOS.find((d) => d.valor === l.status);
      if (!info) return null;
      const dataTxt = l.status === "prometeu_pagar" && l.dataPromessaPagamento ? ` (prometido p/ ${curta(l.dataPromessaPagamento)})` : "";
      return `${info.label}${dataTxt}`;
    }
    if (nota.cobrancaStatus) {
      const info = DESFECHOS.find((d) => d.valor === nota.cobrancaStatus);
      const label = info?.label || nota.cobrancaStatus;
      return `${label}${nota.cobrancaData ? ` em ${curta(nota.cobrancaData)}` : ""}`;
    }
    return null;
  }

  const totalGeral = grupos.reduce((s, g) => s + g.total, 0);
  const totalNotas = grupos.reduce((s, g) => s + g.notas.length, 0);

  return (
    <div className="cobranca-root">
      <style>{`
        .cobranca-root { max-width: 1100px; }
        .cobranca-topo { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 14px; margin-bottom: 18px; }
        .cobranca-titulo { font-size: 26px; font-weight: 1000; color: #111827; margin: 0; }
        .cobranca-resumo { color: #6b7280; font-weight: 700; margin-top: 4px; }
        .cobranca-controles { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
        .janela-btn { border: 1px solid #e5e7eb; background: #fff; padding: 8px 14px; border-radius: 999px; font-weight: 900; cursor: pointer; color: #374151; }
        .janela-btn.ativo { background: ${VERDE}; border-color: ${VERDE}; color: #fff; }
        .cobranca-busca { padding: 8px 14px; border-radius: 999px; border: 1px solid #e5e7eb; min-width: 220px; }
        .cobranca-erro { color: #b91c1c; font-weight: 800; margin-bottom: 12px; }
        .grupo-card { background: #fff; border: 1px solid #e5e7eb; border-radius: 20px; padding: 18px 20px; margin-bottom: 16px; box-shadow: 0 10px 24px rgba(0,0,0,.05); }
        .grupo-topo { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px; margin-bottom: 12px; }
        .grupo-cliente { font-size: 18px; font-weight: 1000; color: #111827; }
        .grupo-total { color: #b45309; font-weight: 1000; }
        .btn-whatsapp { background: #16a34a; color: #fff; border: 0; border-radius: 10px; padding: 9px 14px; font-weight: 900; cursor: pointer; }
        .nota-linha { display: flex; align-items: center; justify-content: space-between; gap: 10px; flex-wrap: wrap; padding: 10px 0; border-top: 1px solid #f1f5f9; }
        .nota-info { display: flex; flex-direction: column; gap: 2px; }
        .nota-num { font-weight: 900; color: #111827; }
        .nota-detalhe { color: #6b7280; font-size: 13px; font-weight: 700; }
        .badge { display: inline-block; padding: 3px 10px; border-radius: 999px; font-size: 12px; font-weight: 900; }
        .badge-vencida { background: #fee2e2; color: #b91c1c; }
        .badge-avencer { background: #fef3c7; color: #b45309; }
        .badge-semvenc { background: #f1f5f9; color: #6b7280; }
        .badge-cobranca { background: #ecfeff; color: #0e7490; }
        .nota-acoes { display: flex; gap: 8px; flex-wrap: wrap; }
        .btn-mini { border: 1px solid #e5e7eb; background: #fff; padding: 6px 10px; border-radius: 8px; font-weight: 800; cursor: pointer; font-size: 13px; }
        .btn-mini-desfazer { color: #b91c1c; }
        .modal-fundo { position: fixed; inset: 0; background: rgba(17,24,39,.5); display: flex; align-items: center; justify-content: center; z-index: 100; padding: 20px; }
        .modal-caixa { background: #fff; border-radius: 18px; padding: 22px; max-width: 480px; width: 100%; box-shadow: 0 20px 50px rgba(0,0,0,.25); }
        .modal-caixa h3 { margin: 0 0 12px; }
        .modal-caixa textarea { width: 100%; min-height: 220px; border: 1px solid #e5e7eb; border-radius: 10px; padding: 10px; font-family: inherit; font-size: 14px; }
        .modal-caixa input { width: 100%; border: 1px solid #e5e7eb; border-radius: 10px; padding: 8px 10px; margin-top: 4px; }
        .modal-campo { margin-bottom: 12px; }
        .modal-campo label { font-size: 13px; font-weight: 800; color: #374151; }
        .modal-acoes { display: flex; gap: 10px; justify-content: flex-end; margin-top: 16px; }
        .btn-primario { background: ${VERDE}; color: #fff; border: 0; border-radius: 10px; padding: 9px 16px; font-weight: 900; cursor: pointer; }
        .btn-secundario { background: #e5e7eb; color: #111827; border: 0; border-radius: 10px; padding: 9px 16px; font-weight: 900; cursor: pointer; }
        .desfecho-opcoes { display: flex; flex-direction: column; gap: 8px; }
        .desfecho-opcoes label { display: flex; align-items: center; gap: 8px; font-weight: 800; color: #374151; }
        .vazio { color: #6b7280; font-weight: 700; padding: 30px; text-align: center; }
      `}</style>

      <div className="cobranca-topo">
        <div>
          <h1 className="cobranca-titulo">Cobrança</h1>
          <div className="cobranca-resumo">
            {carregando ? "Carregando..." : `${totalNotas} nota(s) para cobrar • Total: ${brl(totalGeral)}`}
          </div>
        </div>
        <div className="cobranca-controles">
          <input
            className="cobranca-busca"
            placeholder="Buscar cliente..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
          {[7, 15, 30].map((dias) => (
            <button
              key={dias}
              className={`janela-btn ${janela === dias ? "ativo" : ""}`}
              onClick={() => setJanela(dias as 7 | 15 | 30)}
            >
              {dias} dias
            </button>
          ))}
        </div>
      </div>

      {erro && <div className="cobranca-erro">{erro}</div>}

      {!carregando && grupos.length === 0 && (
        <div className="vazio">Nenhuma nota em aberto ou em atraso dentro da janela selecionada.</div>
      )}

      {grupos.map((g) => (
        <div className="grupo-card" key={g.cliente}>
          <div className="grupo-topo">
            <div className="grupo-cliente">{g.cliente}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div className="grupo-total">Total devido: {brl(g.total)}</div>
              <button className="btn-whatsapp" onClick={() => abrirWhatsappCliente(g)}>
                💬 Cobrar no WhatsApp
              </button>
            </div>
          </div>

          {g.notas.map((n) => {
            const st = statusNota(n);
            const dias = n.vencimento ? diasEntreHojeE(n.vencimento) : null;
            const ref = n.mesReferencia && n.anoReferencia ? `${NOMES_MESES[n.mesReferencia]} / ${n.anoReferencia}` : "-";
            const vinculo = vinculoDaNota(n.id);
            const selo = seloUltimaCobranca(n, vinculo);
            return (
              <div className="nota-linha" key={n.id}>
                <div className="nota-info">
                  <div className="nota-num">
                    Nota {n.numeroNota || "-"} • {ref} • {brl(n.valor)}
                    {" "}
                    {st === "vencida" && dias !== null && (
                      <span className="badge badge-vencida">Vencida há {Math.abs(dias)} dia(s)</span>
                    )}
                    {st === "aberta" && dias !== null && (
                      <span className="badge badge-avencer">Vence em {dias} dia(s)</span>
                    )}
                    {dias === null && <span className="badge badge-semvenc">Sem vencimento</span>}
                  </div>
                  <div className="nota-detalhe">
                    Vencimento: {curta(n.vencimento)}
                    {selo && <span className="badge badge-cobranca" style={{ marginLeft: 8 }}>Última cobrança: {selo}</span>}
                  </div>
                </div>
                <div className="nota-acoes">
                  <button className="btn-mini" onClick={() => abrirWhatsappNota(n)}>💬 Cobrar</button>
                  <button className="btn-mini" onClick={() => abrirRegistrar(n)}>Registrar cobrança</button>
                  {selo && (
                    <button className="btn-mini btn-mini-desfazer" onClick={() => desfazerRegistro(n, vinculo)}>
                      Desfazer
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ))}

      {whatsapp && (
        <div className="modal-fundo" onClick={() => setWhatsapp(null)}>
          <div className="modal-caixa" onClick={(e) => e.stopPropagation()}>
            <h3>Cobrar {whatsapp.cliente} no WhatsApp</h3>
            <div className="modal-campo">
              <label>Telefone (com DDD)</label>
              <input
                value={whatsapp.telefone}
                placeholder="11999999999"
                onChange={(e) => setWhatsapp({ ...whatsapp, telefone: e.target.value })}
              />
            </div>
            <div className="modal-campo">
              <label>Mensagem (editável)</label>
              <textarea value={whatsapp.texto} onChange={(e) => setWhatsapp({ ...whatsapp, texto: e.target.value })} />
            </div>
            <div className="modal-acoes">
              <button className="btn-secundario" onClick={() => setWhatsapp(null)}>Cancelar</button>
              <button className="btn-primario" onClick={enviarWhatsapp}>Abrir WhatsApp</button>
            </div>
          </div>
        </div>
      )}

      {registrar && (
        <div className="modal-fundo" onClick={() => setRegistrar(null)}>
          <div className="modal-caixa" onClick={(e) => e.stopPropagation()}>
            <h3>Registrar cobrança — Nota {registrar.nota.numeroNota || registrar.nota.id}</h3>
            <div className="modal-campo">
              <div className="desfecho-opcoes">
                {DESFECHOS.map((d) => (
                  <label key={d.valor}>
                    <input
                      type="radio"
                      name="desfecho"
                      checked={desfecho === d.valor}
                      onChange={() => setDesfecho(d.valor)}
                    />
                    {d.label}
                  </label>
                ))}
              </div>
            </div>
            {desfecho === "prometeu_pagar" && (
              <div className="modal-campo">
                <label>Data prometida</label>
                <input type="date" value={dataPrometida} onChange={(e) => setDataPrometida(e.target.value)} />
              </div>
            )}
            <div className="modal-acoes">
              <button className="btn-secundario" onClick={() => setRegistrar(null)}>Cancelar</button>
              <button className="btn-primario" onClick={confirmarRegistro}>Confirmar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
