import { useState } from "react";

export default function LoginSistema({ onLogin }: { onLogin: (user: string) => void }) {
  const [user, setUser] = useState("");
  const [msg, setMsg] = useState("");

  function entrar() {
    const nome = user.trim();

    if (!nome) {
      setMsg("Informe o usuário para entrar.");
      return;
    }

    localStorage.setItem("ytalseg_user_v20", JSON.stringify({ user: nome }));
    onLogin(nome);
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
          max-width: 420px;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 24px;
          padding: 28px;
          box-shadow: 0 16px 38px rgba(0,0,0,.10);
        }

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

        .login-input {
          width: 100%;
          border: 1px solid #d1d5db;
          border-radius: 12px;
          padding: 12px 14px;
          font-size: 15px;
          font-weight: 800;
          margin-bottom: 12px;
        }

        .login-btn {
          width: 100%;
          border: 0;
          border-radius: 12px;
          padding: 12px 14px;
          font-size: 15px;
          font-weight: 1000;
          cursor: pointer;
          background: #00B050;
          color: white;
        }

        .login-msg {
          margin-top: 12px;
          color: #b91c1c;
          font-weight: 900;
        }
      `}</style>

      <div className="login-card">
        <div className="login-logo">YTALSEG</div>
        <div className="login-sub">ERP Interno Premium</div>

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

        <button className="login-btn" onClick={entrar}>
          Entrar
        </button>

        {msg && <div className="login-msg">{msg}</div>}
      </div>
    </div>
  );
}
