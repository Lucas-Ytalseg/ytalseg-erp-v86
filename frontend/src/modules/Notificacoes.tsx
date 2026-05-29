import { useEffect, useState } from "react";

const KEY = "ytalseg_notificacoes_v19";

type Notificacao = {
  id: number;
  titulo: string;
  descricao: string;
  tipo: "info" | "alerta" | "sucesso";
  criadoEm: string;
};

function dataBR(v?: string) {
  if (!v) return "-";
  try {
    return new Date(v).toLocaleString("pt-BR");
  } catch {
    return v;
  }
}

export default function Notificacoes() {
  const [lista, setLista] = useState<Notificacao[]>([]);
  const [msg, setMsg] = useState("");

  function carregar() {
    try {
      const data = JSON.parse(localStorage.getItem(KEY) || "[]");
      setLista(Array.isArray(data) ? data : []);
    } catch {
      setLista([]);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  function adicionar() {
    const titulo = window.prompt("Título da notificação:");
    if (!titulo) return;

    const descricao = window.prompt("Descrição:");
    if (!descricao) return;

    const nova: Notificacao = {
      id: Date.now(),
      titulo,
      descricao,
      tipo: "info",
      criadoEm: new Date().toISOString()
    };

    const novaLista = [nova, ...lista].slice(0, 100);
    setLista(novaLista);
    localStorage.setItem(KEY, JSON.stringify(novaLista));
    setMsg("Notificação adicionada.");
  }

  function limpar() {
    if (!window.confirm("Limpar todas notificações?")) return;
    localStorage.removeItem(KEY);
    setLista([]);
    setMsg("Notificações limpas.");
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Central de Notificações</h1>

      {msg && <p>{msg}</p>}

      <div style={{ marginTop: 10 }}>
        <button onClick={adicionar}>Nova notificação</button>
        <button onClick={limpar}>Limpar</button>
      </div>

      <div style={{ marginTop: 20 }}>
        {lista.length === 0 && <p>Nenhuma notificação.</p>}

        {lista.map((n) => (
          <div key={n.id} style={{ border: "1px solid #ddd", padding: 10, marginBottom: 10 }}>
            <strong>{n.titulo}</strong>
            <p>{n.descricao}</p>
            <small>{dataBR(n.criadoEm)}</small>
          </div>
        ))}
      </div>
    </div>
  );
}
