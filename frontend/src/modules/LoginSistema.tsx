import { useState } from "react";
import { login, recuperarAdmin, type Perfil } from "../services/auth";

export default function LoginSistema({ onLogin }: { onLogin: (user: string, perfil: Perfil) => void }) {
  const [user, setUser] = useState("");
  const [senha, setSenha] = useState("");
  const [msg, setMsg] = useState("");
  const [entrando, setEntrando] = useState(false);

  const [modoRecuperacao, setModoRecuperacao] = useState(false);
  const [recUsuario, setRecUsuario] = useState("");
  const [recCodigo, setRecCodigo] = useState("");
  const [recNovaSenha, setRecNovaSenha] = useState("");
  const [recMsg, setRecMsg] = useState("");
  const [recOk, setRecOk] = useState(false);
  const [recEnviando, setRecEnviando] = useState(false);

  async function entrar() {
    const nome = user.trim().toLowerCase();
    const senhaDigitada = String(senha || "");

    if (!nome) return setMsg("Informe o usuário.");
    if (!senhaDigitada) return setMsg("Informe a senha.");

    setMsg("");
    setEntrando(true);
    try {
      const sessao = await login(nome, senhaDigitada);
      onLogin(sessao.usuario, sessao.perfil);
    } catch (e: any) {
      setMsg(e.message || "Usuário ou senha inválidos.");
    } finally {
      setEntrando(false);
    }
  }

  async function recuperar() {
    setRecMsg("");
    if (!recUsuario.trim()) return setRecMsg("Informe o usuário admin.");
    if (!recCodigo.trim()) return setRecMsg("Informe o código mestre.");
    if (recNovaSenha.length < 8) return setRecMsg("A nova senha precisa ter pelo menos 8 caracteres.");

    setRecEnviando(true);
    try {
      await recuperarAdmin(recUsuario.trim().toLowerCase(), recCodigo.trim(), recNovaSenha);
      setRecOk(true);
      setRecMsg("Senha redefinida com sucesso. Você já pode entrar com a nova senha.");
    } catch (e: any) {
      setRecMsg(e.message || "Não foi possível recuperar o acesso.");
    } finally {
      setRecEnviando(false);
    }
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
        .login-btn:disabled { opacity:.6; cursor:default; }
        .login-msg { margin-top:12px; color:#b91c1c; font-weight:900; }
        .login-msg-ok { margin-top:12px; color:#006b34; font-weight:900; }
        .login-link { display:block; text-align:center; margin-top:14px; background:none; border:0; color:#006b34; font-weight:900; font-size:13px; cursor:pointer; text-decoration:underline; }
      `}</style>
      <div className="login-card">
        <div className="login-logo-row">
          <div className="login-icon">Y</div>
          <div>
            <div className="login-logo">YTALSEG</div>
            <div className="login-sub">ERP Interno Premium</div>
          </div>
        </div>

        {!modoRecuperacao ? (
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

            <button className="login-btn" onClick={entrar} disabled={entrando}>
              {entrando ? "Entrando..." : "Entrar"}
            </button>
            {msg && <div className="login-msg">{msg}</div>}

            <button
              className="login-link"
              onClick={() => { setModoRecuperacao(true); setMsg(""); setRecMsg(""); setRecOk(false); }}
            >
              Esqueci a senha do admin (código mestre)
            </button>
          </div>
        ) : (
          <div className="login-form-inner">
            <label className="login-label">Usuário admin</label>
            <input
              className="login-input"
              placeholder="ex: lucas"
              value={recUsuario}
              onChange={(e) => setRecUsuario(e.target.value)}
            />

            <label className="login-label">Código mestre</label>
            <input
              className="login-input"
              placeholder="XXXXX-XXXXX-XXXXX"
              value={recCodigo}
              onChange={(e) => setRecCodigo(e.target.value)}
            />

            <label className="login-label">Nova senha</label>
            <input
              className="login-input"
              type="password"
              placeholder="mínimo 8 caracteres"
              value={recNovaSenha}
              onChange={(e) => setRecNovaSenha(e.target.value)}
            />

            <button className="login-btn" onClick={recuperar} disabled={recEnviando || recOk}>
              {recEnviando ? "Enviando..." : "Redefinir senha"}
            </button>
            {recMsg && <div className={recOk ? "login-msg-ok" : "login-msg"}>{recMsg}</div>}

            <button
              className="login-link"
              onClick={() => { setModoRecuperacao(false); setRecUsuario(""); setRecCodigo(""); setRecNovaSenha(""); setRecMsg(""); setRecOk(false); }}
            >
              Voltar para o login
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
