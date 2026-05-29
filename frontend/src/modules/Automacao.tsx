const API_BASE = "/api";

export async function enviarRelatorioParaFinanceiro({
  cliente,
  referencia,
  valor,
  descricao = "Relatório aprovado",
}: {
  cliente: string;
  referencia: string;
  valor: number;
  descricao?: string;
}) {
  const payload = {
    cliente,
    referencia,
    descricao,
    valor: Number(valor || 0),
    status: "pendente",
    dataEmissao: new Date().toISOString().slice(0, 10),
    dataRecebimento: "",
  };

  const res = await fetch(`${API_BASE}/financeiro`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (data.status === "erro") {
    throw new Error(data.erro || "Erro ao enviar para financeiro.");
  }

  return true;
}
