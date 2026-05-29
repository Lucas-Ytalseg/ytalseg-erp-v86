import { useEffect, useState } from "react";

type Item = {
  id: number;
  tipo: "cliente" | "interno";
  cliente: string;
  valor: number;
  status: string;
  criadoEm: string;
};

const STATUS = [
  "Rascunho",
  "Enviado",
  "Aprovado",
  "Nota emitida",
  "Pago",
];

export default function HistoricoRelatorios() {
  const [lista, setLista] = useState<Item[]>([]);

  function carregar() {
    const data = JSON.parse(
      localStorage.getItem("ytalseg_relatorios_versoes_v11_2") || "[]"
    );
    setLista(data);
  }

  function atualizarStatus(id: number, novo: string) {
    const nova = lista.map((i) =>
      i.id === id ? { ...i, status: novo } : i
    );

    setLista(nova);
    localStorage.setItem(
      "ytalseg_relatorios_versoes_v11_2",
      JSON.stringify(nova)
    );
  }

  function remover(id: number) {
    const nova = lista.filter((i) => i.id !== id);
    setLista(nova);
    localStorage.setItem(
      "ytalseg_relatorios_versoes_v11_2",
      JSON.stringify(nova)
    );
  }

  useEffect(() => {
    carregar();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Histórico de Relatórios</h2>

      {lista.length === 0 && <p>Nenhum relatório salvo ainda.</p>}

      {lista.map((item) => (
        <div
          key={item.id}
          style={{
            border: "1px solid #ddd",
            padding: 12,
            marginBottom: 10,
            borderRadius: 10,
          }}
        >
          <b>{item.cliente}</b> — R$ {item.valor}

          <div style={{ marginTop: 6 }}>
            {new Date(item.criadoEm).toLocaleString("pt-BR")}
          </div>

          <div style={{ marginTop: 8 }}>
            <select
              value={item.status || "Rascunho"}
              onChange={(e) =>
                atualizarStatus(item.id, e.target.value)
              }
            >
              {STATUS.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>

          <button
            style={{ marginTop: 8 }}
            onClick={() => remover(item.id)}
          >
            Remover
          </button>
        </div>
      ))}
    </div>
  );
}