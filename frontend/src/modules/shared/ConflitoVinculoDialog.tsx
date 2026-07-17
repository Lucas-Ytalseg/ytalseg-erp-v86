import React from "react";

export type ConflitoInfo = {
  lancamentoId: string;
  notaId: string;
  financeiro: { status: string; dataRecebimento: string };
  nota: { cancelada: boolean; dataRecebimento: string };
};

const STATUS_FINANCEIRO_LABEL: Record<string, string> = {
  pendente: "Pendente",
  nota_enviada: "Nota enviada",
  cobrado: "Cobrado",
  prometeu_pagar: "Prometeu pagar",
  negociacao: "Em negociação",
  aprovado: "Aprovado",
  recebido: "Recebido",
  nota_cancelada: "Nota cancelada",
};

function labelNota(nota: { cancelada: boolean; dataRecebimento: string }) {
  if (nota.cancelada) return "Cancelada";
  if (nota.dataRecebimento) return "Recebida";
  return "Em aberto";
}

// Usado sempre que o Financeiro e a Nota Fiscal, já vinculados (ou prestes a ser),
// têm status incompatíveis entre si (ex: um "recebido" e o outro "cancelado"). O
// backend nunca decide sozinho nesse caso - devolve os dois estados (HTTP 409) e
// quem escolhe qual manter é o usuário, aqui.
export default function ConflitoVinculoDialog({
  conflito,
  onResolver,
  onFechar,
}: {
  conflito: ConflitoInfo;
  onResolver: (lado: "financeiro" | "nota") => void;
  onFechar: () => void;
}) {
  return (
    <div className="conflito-vinculo-overlay">
      <div className="conflito-vinculo-card">
        <style>{`
          .conflito-vinculo-overlay { position: fixed; inset: 0; background: rgba(15,23,42,.55); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 16px; }
          .conflito-vinculo-card { background: white; border-radius: 18px; padding: 22px; max-width: 460px; width: 100%; box-shadow: 0 20px 50px rgba(0,0,0,.25); display: grid; gap: 14px; }
          .conflito-vinculo-card h3 { margin: 0; font-size: 18px; font-weight: 1000; color: #111827; }
          .conflito-vinculo-card p { margin: 0; color: #4b5563; font-weight: 700; font-size: 13px; }
          .conflito-vinculo-opcoes { display: grid; gap: 10px; }
          .conflito-vinculo-opcao { border: 1px solid #d1d5db; border-radius: 12px; padding: 12px 14px; text-align: left; cursor: pointer; background: #f9fafb; font-weight: 800; }
          .conflito-vinculo-opcao:hover { background: #eff6ff; border-color: #93c5fd; }
          .conflito-vinculo-opcao strong { display: block; font-size: 13px; color: #111827; }
          .conflito-vinculo-opcao span { font-size: 12px; color: #6b7280; }
          .conflito-vinculo-cancelar { border: 0; background: none; color: #6b7280; font-weight: 800; cursor: pointer; justify-self: start; padding: 0; }
        `}</style>
        <h3>Financeiro e Nota Fiscal estão diferentes</h3>
        <p>
          Esses dois registros já vinculados têm status incompatíveis. Qual você quer
          manter? A escolha será aplicada nos dois.
        </p>
        <div className="conflito-vinculo-opcoes">
          <button className="conflito-vinculo-opcao" onClick={() => onResolver("financeiro")}>
            <strong>Manter o status do Financeiro</strong>
            <span>
              {STATUS_FINANCEIRO_LABEL[conflito.financeiro.status] || conflito.financeiro.status}
              {conflito.financeiro.dataRecebimento ? ` — ${conflito.financeiro.dataRecebimento}` : ""}
            </span>
          </button>
          <button className="conflito-vinculo-opcao" onClick={() => onResolver("nota")}>
            <strong>Manter o status da Nota Fiscal</strong>
            <span>
              {labelNota(conflito.nota)}
              {conflito.nota.dataRecebimento ? ` — ${conflito.nota.dataRecebimento}` : ""}
            </span>
          </button>
        </div>
        <button className="conflito-vinculo-cancelar" onClick={onFechar}>Cancelar</button>
      </div>
    </div>
  );
}
