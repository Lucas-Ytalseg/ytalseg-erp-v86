import { useState } from "react";

export default function EnvioReal() {
  const [status, setStatus] = useState("");

  async function enviarEmailReal() {
    setStatus("Preparando envio real de email...");
    setTimeout(() => {
      setStatus("Envio de email configurado (integração futura SMTP).");
    }, 800);
  }

  async function enviarWhatsReal() {
    setStatus("Preparando envio WhatsApp...");
    setTimeout(() => {
      setStatus("WhatsApp preparado (link automático gerado).");
    }, 800);
  }

  function gerarLinkWhats() {
    const msg = encodeURIComponent("Olá, segue seu relatório YTALSEG.");
    const link = `https://wa.me/?text=${msg}`;
    window.open(link, "_blank");
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Envio Real (Base Profissional)</h1>

      <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
        <button onClick={enviarEmailReal}>Email (base)</button>
        <button onClick={enviarWhatsReal}>WhatsApp (base)</button>
        <button onClick={gerarLinkWhats}>Abrir WhatsApp</button>
      </div>

      {status && <p style={{ marginTop: 20 }}>{status}</p>}
    </div>
  );
}
