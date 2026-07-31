const API_BASE = "/api";
const TOKEN_KEY = "ytalseg_auth_token";

export type Perfil = "admin" | "visualizacao";
export type Sessao = { usuario: string; perfil: Perfil };

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export async function login(usuario: string, senha: string): Promise<Sessao> {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ usuario, senha }),
  });
  if (!res.ok) {
    const erro = await res.json().catch(() => ({}));
    throw new Error(erro.detail || "Usuário ou senha inválidos.");
  }
  const dados = await res.json();
  setToken(dados.token);
  return { usuario: dados.usuario, perfil: dados.perfil };
}

export async function logout() {
  const token = getToken();
  clearToken();
  if (token) {
    fetch(`${API_BASE}/auth/logout`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    }).catch(() => {});
  }
}

export async function obterSessaoAtual(): Promise<Sessao | null> {
  const token = getToken();
  if (!token) return null;
  const res = await fetch(`${API_BASE}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    clearToken();
    return null;
  }
  return res.json();
}

export async function recuperarAdmin(usuario: string, codigoMestre: string, novaSenha: string) {
  const res = await fetch(`${API_BASE}/auth/recuperar-admin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ usuario, codigo_mestre: codigoMestre, nova_senha: novaSenha }),
  });
  if (!res.ok) {
    const erro = await res.json().catch(() => ({}));
    throw new Error(erro.detail || "Não foi possível recuperar o acesso.");
  }
  return res.json();
}

// Injeta "Authorization: Bearer <token>" automaticamente em toda chamada
// fetch(`${API_BASE}/...`) já existente nos módulos, sem precisar editar
// cada um deles um por um.
let interceptorInstalado = false;
export function instalarInterceptorFetch() {
  if (interceptorInstalado) return;
  interceptorInstalado = true;
  const fetchOriginal = window.fetch.bind(window);
  window.fetch = (input: RequestInfo | URL, init: RequestInit = {}) => {
    const url = typeof input === "string" ? input : input instanceof URL ? input.toString() : (input as Request).url;
    if (!url.startsWith(`${API_BASE}/`)) return fetchOriginal(input, init);
    const token = getToken();
    if (!token) return fetchOriginal(input, init);
    const headers = new Headers(init.headers ?? (input instanceof Request ? input.headers : undefined));
    if (!headers.has("Authorization")) headers.set("Authorization", `Bearer ${token}`);
    return fetchOriginal(input, { ...init, headers });
  };
}
