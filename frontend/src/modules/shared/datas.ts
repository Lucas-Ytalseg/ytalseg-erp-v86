// O servidor (Railway) grava data/hora em UTC (horário de Londres, 3h à frente de
// Brasília) e sem a letra "Z" no fim, ex: "2026-11-04T23:52:10.123". O navegador lê um
// texto assim como se fosse hora LOCAL e mostrava 3 horas a mais. Aqui, quando não vem
// fuso no texto, ele é tratado como UTC - o navegador então converte pra hora do Brasil.
const SEM_FUSO = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}(\.\d+)?)?$/;

export function dataDoServidor(valor: string | null | undefined): Date | null {
  if (!valor) return null;
  const texto = String(valor).trim();
  const d = new Date(SEM_FUSO.test(texto) ? `${texto}Z` : texto);
  return isNaN(d.getTime()) ? null : d;
}

export function dataHoraBR(valor: string | null | undefined): string {
  const d = dataDoServidor(valor);
  return d ? d.toLocaleString("pt-BR") : String(valor || "-");
}
