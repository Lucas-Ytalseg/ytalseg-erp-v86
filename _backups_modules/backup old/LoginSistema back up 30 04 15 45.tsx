import { useState, useEffect } from "react";

const KEY = "ytalseg_user_v20";

export default function LoginSistema({ onLogin }: any) {
  const [user, setUser] = useState("");
  const [msg, setMsg] = useState("");

  function entrar() {
    if (!user.trim()) {
      setMsg("Informe o usuário");
      return;
    }

    localStorage.setItem(KEY, JSON.stringify({ user }));
    onLogin(user);
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>Login</h1>

      <input
        placeholder="Usuário"
        value={user}
        onChange={(e) => setUser(e.target.value)}
      />

      <button onClick={entrar}>Entrar</button>

      {msg && <p>{msg}</p>}
    </div>
  );
}
