import { useState } from "react";

export default function EnvioRealV24() {
  const [cliente, setCliente] = useState("");
  const [mensagem, setMensagem] = useState("");

  function montarMensagem() {
    const msg = `Olá ${cliente}, segue o material conforme combinado.`;
    setMensagem(msg);
  }

  function abrirWhatsApp() {
    const url = `https://wa.me/?text=${encodeURIComponent(mensagem)}`;
    window.open(url, "_blank");
  }

  function abrirEmail() {
    const url = `mailto:?subject=Envio YTALSEG&body=${encodeURIComponent(mensagem)}`;
    window.open(url);
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Envio Real</h1>

      <input
        placeholder="Cliente"
        value={cliente}
        onChange={(e) => setCliente(e.target.value)}
        style={{ display: "block", marginBottom: 10 }}
      />

      <textarea
        placeholder="Mensagem"
        value={mensagem}
        onChange={(e) => setMensagem(e.target.value)}
        style={{ display: "block", width: "100%", height: 100, marginBottom: 10 }}
      />

      <button onClick={montarMensagem}>Gerar mensagem</button>
      <button onClick={abrirWhatsApp}>Enviar WhatsApp</button>
      <button onClick={abrirEmail}>Enviar E-mail</button>
    </div>
  );
}
