import { useState } from "react";

type Perfil = "admin" | "operador" | "financeiro" | "consulta";

export default function LoginSistema({
  onLogin,
}: {
  onLogin: (user: string, perfil: Perfil) => void;
}) {
  const [user, setUser] = useState("");
  const [perfil, setPerfil] = useState<Perfil>("admin");
  const [msg, setMsg] = useState("");

  function entrar() {
    const nome = user.trim();

    if (!nome) {
      setMsg("Informe o usuário para entrar.");
      return;
    }

    localStorage.setItem("ytalseg_user_v20", JSON.stringify({ user: nome, perfil }));
    onLogin(nome, perfil);
  }

  return (
    <div className="login-page">
      <style>{`
        body {
          margin: 0;
          font-family: Arial, sans-serif;
          background: #eef1f3;
        }

        .login-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
        }

        .login-card {
          width: 100%;
          max-width: 440px;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 24px;
          padding: 28px;
          box-shadow: 0 16px 38px rgba(0,0,0,.10);
        }

        .login-logo-row { display:flex; align-items:center; gap:12px; margin-bottom:10px; }
        .login-icon { width:48px; height:48px; border-radius:14px; background:#00B050; color:white; display:flex; align-items:center; justify-content:center; font-size:24px; font-weight:1000; box-shadow:0 8px 18px rgba(0,176,80,.25); }
        .login-logo {
          color: #00B050;
          font-size: 42px;
          font-weight: 1000;
          letter-spacing: -1px;
          line-height: .9;
          margin-bottom: 8px;
        }

        .login-sub {
          color: #6b7280;
          font-weight: 800;
          margin-bottom: 22px;
        }

        .login-label {
          display: block;
          font-size: 12px;
          font-weight: 1000;
          color: #006b34;
          margin: 12px 0 6px;
          text-transform: uppercase;
        }

        .login-input,
        .login-select {
          width: 100%;
          border: 1px solid #d1d5db;
          border-radius: 12px;
          padding: 12px 14px;
          font-size: 15px;
          font-weight: 800;
        }

        .login-btn { max-width: 380px; display:block; margin-left:auto; margin-right:auto;
          width: 100%;
          border: 0;
          border-radius: 12px;
          padding: 12px 14px;
          font-size: 15px;
          font-weight: 1000;
          cursor: pointer;
          background: #00B050;
          color: white;
          margin-top: 16px;
        }

        .login-msg {
          margin-top: 12px;
          color: #b91c1c;
          font-weight: 900;
        }

        .login-help {
          margin-top: 14px;
          padding: 12px;
          border-radius: 14px;
          background: #f9fafb;
          color: #374151;
          font-size: 12px;
          font-weight: 800;
          line-height: 1.45;
        }
      `}</style>

      <div className="login-card">
        <div className="login-logo-row"><div className="login-icon">Y</div><div><div className="login-logo">YTALSEG</div><div className="login-sub">ERP Interno Premium</div></div></div>

        <div className="login-form-inner">
        <label className="login-label">Usuário</label>
        <input
          className="login-input"
          placeholder="Digite seu usuário"
          value={user}
          onChange={(e) => setUser(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") entrar();
          }}
          autoFocus
        />

        <label className="login-label">Perfil de acesso</label>
        <select
          className="login-select"
          value={perfil}
          onChange={(e) => setPerfil(e.target.value as Perfil)}
        >
          <option value="admin">Admin — acesso total</option>
          <option value="operador">Operador — operação e relatórios</option>
          <option value="financeiro">Financeiro — valores e cobranças</option>
          <option value="consulta">Consulta — somente visualização</option>
        </select>

        <button className="login-btn" onClick={entrar}>
          Entrar
        </button>

        {msg && <div className="login-msg">{msg}</div>}

        <div className="login-help">
          V21 permissões: escolha um perfil para testar os acessos sem quebrar o sistema.
        </div>
        </div>
      </div>
    </div>
  );
}
