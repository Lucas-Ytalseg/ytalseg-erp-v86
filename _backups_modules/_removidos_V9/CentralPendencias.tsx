import { useEffect, useMemo, useState } from "react";

const REL_KEY = "ytalseg_relatorios_versoes_v11_2";
const PACOTE_KEY = "ytalseg_pacotes_cliente_v11_6";

type Relatorio = {
  id: number;
  tipo?: string;
  cliente?: string;
  valor?: number;
  status?: string;
  criadoEm?: string;
};

type Pacote = {
  id: number;
  cliente: string;
  valor?: number;
  status: string;
  criadoEm: string;
  pdfCliente: boolean;
  notaFiscal: boolean;
  comprovante: boolean;
  observacoes?: string;
};

type Pendencia = {
  id: string;
  origem: "Relatório" | "Pacote";
  cliente: string;
  valor: number;
  status: string;
  tipo: string;
  criadoEm?: string;
  motivo: string;
};

function brl(v?: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number(v || 0));
}

function dataBR(v?: string) {
  if (!v) return "-";
  try {
    return new Date(v).toLocaleString("pt-BR");
  } catch {
    return v;
  }
}

export default function CentralPendencias() {
  const [relatorios, setRelatorios] = useState<Relatorio[]>([]);
  const [pacotes, setPacotes] = useState<Pacote[]>([]);
  const [filtro, setFiltro] = useState("Todas");

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

  useEffect(() => {
    carregar();
  }, []);

  function excluirPendencia(pendenciaId: string) {
    const ok = window.confirm("Tem certeza que deseja excluir esta pendência? Esta ação não pode ser desfeita.");
    if (!ok) return;

    try {
      if (pendenciaId.startsWith("rel-")) {
        const realId = pendenciaId.replace("rel-", "");
        const lista = JSON.parse(localStorage.getItem(REL_KEY) || "[]");
        const nova = (Array.isArray(lista) ? lista : []).filter((r: Relatorio) => String(r.id) !== realId);
        localStorage.setItem(REL_KEY, JSON.stringify(nova));
      } else if (pendenciaId.startsWith("pac-")) {
        const realId = pendenciaId.replace("pac-", "");
        const lista = JSON.parse(localStorage.getItem(PACOTE_KEY) || "[]");
        const nova = (Array.isArray(lista) ? lista : []).filter((p: Pacote) => String(p.id) !== realId);
        localStorage.setItem(PACOTE_KEY, JSON.stringify(nova));
      }
      carregar();
    } catch {
      window.alert("Não foi possível excluir a pendência.");
    }
  }

  function limparTodas() {
    const ok = window.confirm(
      `Tem certeza que deseja EXCLUIR TODAS as ${filtradas.length} pendências listadas? Esta ação não pode ser desfeita.`
    );
    if (!ok) return;

    try {
      // Remove apenas os relatorios/pacotes que estao pendentes (mantem os "Pago"/"Concluido")
      const idsParaRemover = new Set(filtradas.map((p) => p.id));

      const listaRel = JSON.parse(localStorage.getItem(REL_KEY) || "[]");
      const novaRel = (Array.isArray(listaRel) ? listaRel : []).filter(
        (r: Relatorio) => !idsParaRemover.has(`rel-${r.id}`)
      );
      localStorage.setItem(REL_KEY, JSON.stringify(novaRel));

      const listaPac = JSON.parse(localStorage.getItem(PACOTE_KEY) || "[]");
      const novaPac = (Array.isArray(listaPac) ? listaPac : []).filter(
        (p: Pacote) => !idsParaRemover.has(`pac-${p.id}`)
      );
      localStorage.setItem(PACOTE_KEY, JSON.stringify(novaPac));

      carregar();
    } catch {
      window.alert("Não foi possível limpar as pendências.");
    }
  }

  const pendencias = useMemo<Pendencia[]>(() => {
    const lista: Pendencia[] = [];

    relatorios.forEach((r) => {
      const status = r.status || "Rascunho";

      if (status !== "Pago") {
        lista.push({
          id: `rel-${r.id}`,
          origem: "Relatório",
          cliente: r.cliente || "Cliente não informado",
          valor: Number(r.valor || 0),
          status,
          tipo: r.tipo || "-",
          criadoEm: r.criadoEm,
          motivo:
            status === "Rascunho"
              ? "Relatório ainda em rascunho"
              : status === "Enviado"
              ? "Aguardando aprovação do cliente"
              : status === "Aprovado"
              ? "Aprovado, falta nota ou cobrança"
              : status === "Nota emitida"
              ? "Nota emitida, falta pagamento"
              : status === "Cobrado"
              ? "Cobrado, aguardando pagamento"
              : "Pendente de conclusão",
        });
      }
    });

    pacotes.forEach((p) => {
      if (p.status !== "Concluído") {
        const faltando = [
          !p.pdfCliente ? "PDF cliente" : "",
          !p.notaFiscal ? "nota fiscal" : "",
          !p.comprovante ? "comprovante" : "",
        ].filter(Boolean);

        lista.push({
          id: `pac-${p.id}`,
          origem: "Pacote",
          cliente: p.cliente || "Cliente não informado",
          valor: Number(p.valor || 0),
          status: p.status || "Pendente",
          tipo: "pacote",
          criadoEm: p.criadoEm,
          motivo: faltando.length
            ? `Faltando: ${faltando.join(", ")}`
            : "Pacote ainda não concluído",
        });
      }
    });

    return lista.sort((a, b) => String(b.criadoEm || "").localeCompare(String(a.criadoEm || "")));
  }, [relatorios, pacotes]);

  const filtradas = useMemo(() => {
    if (filtro === "Todas") return pendencias;
    return pendencias.filter((p) => p.origem === filtro);
  }, [pendencias, filtro]);

  const resumo = useMemo(() => {
    const total = filtradas.reduce((acc, p) => acc + Number(p.valor || 0), 0);
    return {
      quantidade: filtradas.length,
      total,
      relatorios: pendencias.filter((p) => p.origem === "Relatório").length,
      pacotes: pendencias.filter((p) => p.origem === "Pacote").length,
    };
  }, [filtradas, pendencias]);

  return (
    <div className="pend-page">
      <style>{`
        .pend-page { display: grid; gap: 16px; }
        .pend-head { display: flex; justify-content: space-between; align-items: end; gap: 14px; flex-wrap: wrap; }
        .pend-title h1 { margin: 0; font-size: 30px; font-weight: 1000; color: #111827; }
        .pend-title p { margin: 6px 0 0; color: #6b7280; font-weight: 800; }
        .pend-actions { display: flex; gap: 8px; flex-wrap: wrap; }
        .pend-select, .pend-btn { border: 1px solid #d1d5db; border-radius: 10px; padding: 10px 12px; font-size: 13px; font-weight: 900; background: white; }
        .pend-btn { border: 0; cursor: pointer; background: #00B050; color: white; }
        .pend-btn-danger { border: 0; cursor: pointer; background: #dc2626; color: white; border-radius: 10px; padding: 10px 12px; font-size: 13px; font-weight: 900; }
        .pend-cards { display: grid; grid-template-columns: repeat(4, minmax(0,1fr)); gap: 12px; }
        .pend-card, .pend-box { background: white; border: 1px solid #e5e7eb; border-radius: 18px; padding: 16px; box-shadow: 0 10px 22px rgba(0,0,0,.05); }
        .pend-card span { display: block; color: #6b7280; font-size: 12px; font-weight: 1000; text-transform: uppercase; }
        .pend-card strong { display: block; margin-top: 6px; color: #00B050; font-size: 26px; font-weight: 1000; }
        .pend-list { display: grid; gap: 10px; }
        .pend-item { background: white; border: 1px solid #e5e7eb; border-radius: 18px; padding: 16px; box-shadow: 0 10px 22px rgba(0,0,0,.05); display: grid; grid-template-columns: 1.4fr .7fr .7fr 1.2fr auto; gap: 12px; align-items: center; }
        .pend-item h3 { margin: 0; color: #111827; font-size: 17px; font-weight: 1000; }
        .pend-item small { display: block; margin-top: 4px; color: #6b7280; font-weight: 800; }
        .pend-badge { display: inline-flex; justify-content: center; padding: 6px 10px; border-radius: 999px; background: #fff7ed; color: #9a3412; font-size: 12px; font-weight: 1000; }
        .pend-del { border: 0; cursor: pointer; background: #fee2e2; color: #b91c1c; border-radius: 10px; padding: 8px 14px; font-size: 12px; font-weight: 1000; white-space: nowrap; }
        .pend-del:hover { background: #fecaca; }
        .pend-empty { color: #6b7280; font-weight: 900; padding: 16px; }
        @media (max-width: 1000px) {
          .pend-cards { grid-template-columns: 1fr 1fr; }
          .pend-item { grid-template-columns: 1fr; }
        }
        @media (max-width: 700px) {
          .pend-cards { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="pend-head">
        <div className="pend-title">
          <h1>Central de Pendências</h1>
          <p>Lista automática do que falta concluir em relatórios e pacotes.</p>
        </div>
        <div className="pend-actions">
          <select className="pend-select" value={filtro} onChange={(e) => setFiltro(e.target.value)}>
            <option>Todas</option>
            <option>Relatório</option>
            <option>Pacote</option>
          </select>
          <button className="pend-btn" onClick={carregar}>Atualizar</button>
          {filtradas.length > 0 && (
            <button className="pend-btn-danger" onClick={limparTodas}>Limpar todas</button>
          )}
        </div>
      </div>

      <div className="pend-cards">
        <Card titulo="Pendências" valor={String(resumo.quantidade)} />
        <Card titulo="Valor pendente" valor={brl(resumo.total)} />
        <Card titulo="Relatórios" valor={String(resumo.relatorios)} />
        <Card titulo="Pacotes" valor={String(resumo.pacotes)} />
      </div>

      <div className="pend-list">
        {filtradas.length === 0 && (
          <div className="pend-box pend-empty">Nenhuma pendência encontrada. Tudo certo por aqui.</div>
        )}

        {filtradas.map((p) => (
          <div className="pend-item" key={p.id}>
            <div>
              <h3>{p.cliente}</h3>
              <small>{p.origem} • {p.tipo} • {dataBR(p.criadoEm)}</small>
            </div>
            <div>{brl(p.valor)}</div>
            <div><span className="pend-badge">{p.status}</span></div>
            <div>{p.motivo}</div>
            <div>
              <button className="pend-del" onClick={() => excluirPendencia(p.id)}>Excluir</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Card({ titulo, valor }: { titulo: string; valor: string }) {
  return (
    <div className="pend-card">
      <span>{titulo}</span>
      <strong>{valor}</strong>
    </div>
  );
}
