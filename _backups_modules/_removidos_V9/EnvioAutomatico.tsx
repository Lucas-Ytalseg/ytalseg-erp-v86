import { useState } from "react";

export default function EnvioAutomatico() {
  const [msg, setMsg] = useState("");

  function enviarEmail() {
    setMsg("Simulação: E-mail enviado com sucesso.");
  }

  function enviarWhatsApp() {
    setMsg("Simulação: WhatsApp enviado com sucesso.");
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Envio Automático</h2>

      <div style={{ display: "flex", gap: 10 }}>
        <button onClick={enviarEmail}>Enviar por Email</button>
        <button onClick={enviarWhatsApp}>Enviar por WhatsApp</button>
      </div>

      {msg && <p style={{ marginTop: 20 }}>{msg}</p>}
    </div>
  );
}
