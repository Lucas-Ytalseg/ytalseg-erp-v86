import { useEffect, useState } from "react";

type Perfil = "admin" | "operador" | "financeiro" | "consulta";
type Usuario = { id: number | string; user: string; senha: string; perfil: Perfil; ativo: boolean; };

const USUARIOS_KEY = "ytalseg_users_v33";
const SESSAO_KEY = "ytalseg_user_v20";
const AUTH_KEY = "ytalseg_auth";

function usuariosPadrao(): Usuario[] {
  return [
    { id: 1, user: "admin", senha: "123", perfil: "admin", ativo: true },
    { id: 2, user: "operador", senha: "123", perfil: "operador", ativo: true },
    { id: 3, user: "financeiro", senha: "123", perfil: "financeiro", ativo: true },
    { id: 4, user: "consulta", senha: "123", perfil: "consulta", ativo: true },
  ];
}

function salvarUsuarios(lista: Usuario[]) {
  localStorage.setItem(USUARIOS_KEY, JSON.stringify(lista));
}

function carregarUsuarios(): Usuario[] {
  const padrao = usuariosPadrao();

  try {
    const raw = localStorage.getItem(USUARIOS_KEY);
    const lista = raw ? JSON.parse(raw) : [];

    if (Array.isArray(lista) && lista.length > 0) {
      const normalizados: Usuario[] = lista.map((u: any, i: number) => ({
        id: u.id ?? Date.now() + i,
        user: String(u.user || u.nome || "").trim(),
        senha: String(u.senha || ""),
        perfil: (u.perfil || "consulta") as Perfil,
        ativo: u.ativo !== false,
      })).filter((u: Usuario) => u.user);

      const temAdminValido = normalizados.some(
        (u) => u.user.toLowerCase() === "admin" && u.senha === "123" && u.ativo !== false
      );

      if (!temAdminValido) {
        const semAdminDuplicado = normalizados.filter((u) => u.user.toLowerCase() !== "admin");
        const corrigidos = [padrao[0], ...semAdminDuplicado];
        salvarUsuarios(corrigidos);
        return corrigidos;
      }

      salvarUsuarios(normalizados);
      return normalizados;
    }
  } catch {}

  salvarUsuarios(padrao);
  return padrao;
}

export default function LoginSistema({ onLogin }: { onLogin: (user: string, perfil: Perfil) => void }) {
  const [user, setUser] = useState("");
  const [senha, setSenha] = useState("");
  const [msg, setMsg] = useState("");
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);

  useEffect(() => {
    setUsuarios(carregarUsuarios());
  }, []);

  function entrar() {
    const nome = user.trim().toLowerCase();
    const senhaDigitada = String(senha || "");

    if (!nome) return setMsg("Informe o usuário.");
    if (!senhaDigitada) return setMsg("Informe a senha.");

    let lista = usuarios.length ? usuarios : carregarUsuarios();

    let usuario = lista.find((u) =>
      String(u.user || "").trim().toLowerCase() === nome &&
      String(u.senha || "") === senhaDigitada &&
      u.ativo !== false
    );

    // Segurança de recuperação: se a base antiga estiver bagunçada, admin/123 recria o admin.
    if (!usuario && nome === "admin" && senhaDigitada === "123") {
      const padrao = usuariosPadrao();
      const semAdmin = lista.filter((u) => String(u.user || "").trim().toLowerCase() !== "admin");
      lista = [padrao[0], ...semAdmin];
      salvarUsuarios(lista);
      setUsuarios(lista);
      usuario = padrao[0];
    }

    if (!usuario) return setMsg("Usuário/senha inválidos ou usuário inativo.");

    const payload = {
      user: usuario.user,
      perfil: usuario.perfil || "consulta",
      loginEm: new Date().toISOString(),
    };

    localStorage.setItem(SESSAO_KEY, JSON.stringify(payload));
    localStorage.setItem(AUTH_KEY, JSON.stringify(payload));
    onLogin(usuario.user, usuario.perfil || "consulta");
  }

  return (
    <div className="login-page">
      <style>{`
        body { margin:0; font-family:Arial,sans-serif; background:#eef1f3; }
        .login-page { min-height:100vh; display:flex; align-items:center; justify-content:center; padding:24px; }
        .login-card { width:100%; max-width:440px; background:white; border:1px solid #e5e7eb; border-radius:24px; padding:28px; box-shadow:0 16px 38px rgba(0,0,0,.10); }
        .login-logo-row { display:flex; align-items:center; gap:12px; width:100%; max-width:380px; margin:0 auto 18px; }
        .login-icon { width:50px; height:50px; border-radius:14px; background:#00B050; color:white; display:flex; align-items:center; justify-content:center; font-size:25px; font-weight:1000; box-shadow:0 8px 18px rgba(0,176,80,.25); flex:0 0 auto; }
        .login-logo { color:#00B050; font-size:42px; font-weight:1000; letter-spacing:-1px; line-height:.9; }
        .login-sub { color:#6b7280; font-weight:800; margin-top:4px; }
        .login-form-inner { width:100%; max-width:380px; margin:0 auto; }
        .login-label { display:block; font-size:12px; font-weight:1000; color:#006b34; margin:12px 0 6px; text-transform:uppercase; }
        .login-input { width:100%; box-sizing:border-box; border:1px solid #d1d5db; border-radius:12px; padding:12px 14px; font-size:15px; font-weight:800; }
        .login-btn { width:100%; box-sizing:border-box; border:0; border-radius:12px; padding:12px 14px; font-size:15px; font-weight:1000; cursor:pointer; background:#00B050; color:white; margin-top:16px; }
        .login-msg { margin-top:12px; color:#b91c1c; font-weight:900; }
      `}</style>
      <div className="login-card">
        <div className="login-logo-row">
          <div className="login-icon">Y</div>
          <div>
            <div className="login-logo">YTALSEG</div>
            <div className="login-sub">ERP Interno Premium</div>
          </div>
        </div>

        <div className="login-form-inner">
          <label className="login-label">Usuário</label>
          <input
            className="login-input"
            placeholder="Digite seu usuário"
            value={user}
            onChange={(e) => setUser(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") entrar(); }}
            autoFocus
          />

          <label className="login-label">Senha</label>
          <input
            className="login-input"
            type="password"
            placeholder="Digite sua senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") entrar(); }}
          />

          <button className="login-btn" onClick={entrar}>Entrar</button>
          {msg && <div className="login-msg">{msg}</div>}
        </div>
      </div>
    </div>
  );
}
