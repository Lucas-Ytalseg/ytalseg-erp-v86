// V16: comparação de nomes de cliente tolerante a variações entre portais
// (acentos, maiúsculas, pontuação, espaços duplicados e sufixos LTDA/ME/EPP/S.A.).
// Mesma regra do backend (normalizar_nome_cliente / _cliente_bate em main.py).

const SUFIXOS = new Set(["LTDA", "ME", "EPP", "SA", "EIRELI", "MEI"]);

export function soDigitos(s: string | null | undefined) {
  return (s || "").replace(/\D/g, "");
}

export function normalizarNomeCliente(nome: string | null | undefined): string {
  let s = (nome || "").normalize("NFKD").replace(/[̀-ͯ]/g, "").toUpperCase();
  s = s.replace(/\bS\s*[/.]\s*A\b\.?/g, " SA ").replace(/SOCIEDADE ANONIMA/g, " SA ");
  s = s.replace(/[^A-Z0-9 ]+/g, " ");
  const palavras = s.split(/\s+/).filter(Boolean);
  while (palavras.length && SUFIXOS.has(palavras[palavras.length - 1])) palavras.pop();
  return palavras.join(" ");
}

// Mesmo cliente? CNPJ primeiro (quando os dois lados têm); senão nome normalizado,
// substring nos dois sentidos (como já era antes).
export function clienteBate(a: string, b: string, cnpjA = "", cnpjB = ""): boolean {
  const da = soDigitos(cnpjA);
  const db = soDigitos(cnpjB);
  if (da.length >= 11 && db.length >= 11) return da === db;
  const x = normalizarNomeCliente(a);
  const y = normalizarNomeCliente(b);
  if (!x || !y) return false;
  return x.includes(y) || y.includes(x);
}

// Chave pra agrupar notas do mesmo cliente: CNPJ quando existe, senão o nome normalizado.
export function chaveCliente(nome: string, cnpj?: string): string {
  const d = soDigitos(cnpj);
  return d.length >= 11 ? `cnpj:${d}` : `nome:${normalizarNomeCliente(nome)}`;
}
