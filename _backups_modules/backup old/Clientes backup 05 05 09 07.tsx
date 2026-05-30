import React, { useEffect, useState } from "react";

const API_BASE = "http://127.0.0.1:8000";
const VERDE = "#00B050";

type Empresa = {
  id: string;
  nome: string;
  cnpj: string;
  diaria_diurna: number;
  diaria_noturna: number;
  sabado: number;
  domingo_feriado: number;
  hora_20: number;
  hora_50: number;
  hora_100: number;
  adicional_noturno: number;
  usa_adicional_noturno?: boolean;
  feriado_usa_valor_domingo?: boolean;
};

const vazio = {
  id: "",
  nome: "",
  cnpj: "",
  diaria_diurna: 0,
  diaria_noturna: 0,
  sabado: 0,
  domingo_feriado: 0,
  hora_20: 0,
  hora_50: 0,
  hora_100: 0,
  adicional_noturno: 0,
  usa_adicional_noturno: true,
  feriado_usa_valor_domingo: true,
};

function brl(v: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number(v || 0));
}

export default function Clientes() {
  const [clientes, setClientes] = useState<Empresa[]>([]);
  const [form, setForm] = useState<any>(vazio);
  const [editando, setEditando] = useState(false);
  const [erro, setErro] = useState("");
  const [ok, setOk] = useState("");

  async function carregar() {
    try {
      const res = await fetch(`${API_BASE}/empresas`);
      const data = await res.json();
      if (data.status === "ok") {
        setClientes(data.empresas || []);
      }
    } catch {
      setErro("Não consegui conectar no backend.");
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  function novoCliente() {
    setForm(vazio);
    setEditando(true);
    setErro("");
    setOk("");
  }

  function editar(cliente: Empresa) {
    setForm({
      id: cliente.id,
      nome: cliente.nome || "",
      cnpj: cliente.cnpj || "",
      diaria_diurna: cliente.diaria_diurna || 0,
      diaria_noturna: cliente.diaria_noturna || 0,
      sabado: cliente.sabado || 0,
      domingo_feriado: cliente.domingo_feriado || 0,
      hora_20: cliente.hora_20 || 0,
      hora_50: cliente.hora_50 || 0,
      hora_100: cliente.hora_100 || 0,
      adicional_noturno: cliente.adicional_noturno || 0,
      usa_adicional_noturno: cliente.usa_adicional_noturno ?? true,
      feriado_usa_valor_domingo: cliente.feriado_usa_valor_domingo ?? true,
    });
    setEditando(true);
    setErro("");
    setOk("");
  }

  function atualizar(campo: string, valor: any) {
    setForm((prev: any) => ({
      ...prev,
      [campo]: valor,
    }));
  }

  async function salvar() {
    if (!form.nome.trim()) {
      setErro("Informe o nome do cliente.");
      return;
    }

    try {
      setErro("");
      setOk("");

      const payload = {
        ...form,
        diaria_diurna: Number(form.diaria_diurna || 0),
        diaria_noturna: Number(form.diaria_noturna || 0),
        sabado: Number(form.sabado || 0),
        domingo_feriado: Number(form.domingo_feriado || 0),
        hora_20: Number(form.hora_20 || 0),
        hora_50: Number(form.hora_50 || 0),
        hora_100: Number(form.hora_100 || 0),
        adicional_noturno: Number(form.adicional_noturno || 0),
      };

      const res = await fetch(`${API_BASE}/empresas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.status === "erro") {
        throw new Error(data.erro || "Erro ao salvar cliente.");
      }

      setOk("Cliente salvo com sucesso.");
      setEditando(false);
      await carregar();
    } catch (e: any) {
      setErro(e.message || "Erro ao salvar cliente.");
    }
  }

  async function excluir(id: string) {
    if (!confirm("Deseja excluir este cliente?")) return;

    try {
      const res = await fetch(`${API_BASE}/empresas/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (data.status === "erro") {
        throw new Error(data.erro || "Erro ao excluir.");
      }

      setOk("Cliente excluído.");
      await carregar();
    } catch (e: any) {
      setErro(e.message || "Erro ao excluir cliente.");
    }
  }

  return (
    <div className="clientes-page">
      <style>{`
        .clientes-page {
          display: grid;
          grid-template-columns: 1fr;
          gap: 18px;
        }

        .clientes-header {
          display:flex;
          justify-content:space-between;
          align-items:center;
          gap:16px;
        }

        .clientes-header h1 {
          margin:0;
          font-size:30px;
          font-weight:1000;
          color:#111827;
        }

        .clientes-header p {
          margin:5px 0 0;
          color:#6b7280;
          font-weight:700;
        }

        .btn-primary {
          border:0;
          background:${VERDE};
          color:white;
          font-weight:900;
          padding:12px 16px;
          border-radius:12px;
          cursor:pointer;
          box-shadow:0 8px 18px rgba(0,176,80,.22);
        }

        .btn-gray {
          border:0;
          background:#e5e7eb;
          color:#111;
          font-weight:900;
          padding:10px 13px;
          border-radius:10px;
          cursor:pointer;
        }

        .btn-red {
          border:0;
          background:#fee2e2;
          color:#991b1b;
          font-weight:900;
          padding:10px 13px;
          border-radius:10px;
          cursor:pointer;
        }

        .clientes-grid {
          display:grid;
          grid-template-columns: repeat(auto-fill, minmax(310px, 1fr));
          gap:14px;
        }

        .cliente-card {
          background:white;
          border:1px solid #e5e7eb;
          border-radius:20px;
          padding:18px;
          box-shadow:0 10px 24px rgba(0,0,0,.06);
        }

        .cliente-top {
          display:flex;
          justify-content:space-between;
          gap:12px;
          align-items:flex-start;
        }

        .cliente-nome {
          font-size:20px;
          font-weight:1000;
          color:#00B050;
        }

        .cliente-cnpj {
          color:#6b7280;
          font-size:13px;
          font-weight:800;
          margin-top:4px;
        }

        .valores-mini {
          display:grid;
          grid-template-columns:1fr 1fr;
          gap:8px;
          margin-top:14px;
        }

        .valor-box {
          background:#f9fafb;
          border:1px solid #edf0f2;
          border-radius:12px;
          padding:9px;
        }

        .valor-box span {
          display:block;
          color:#6b7280;
          font-size:11px;
          font-weight:900;
          text-transform:uppercase;
        }

        .valor-box strong {
          display:block;
          color:#111827;
          margin-top:3px;
        }

        .card-actions {
          display:flex;
          gap:8px;
          margin-top:14px;
        }

        .form-box {
          background:white;
          border:1px solid #d9dde1;
          border-radius:22px;
          padding:18px;
          box-shadow:0 12px 26px rgba(0,0,0,.07);
        }

        .form-title {
          font-size:22px;
          font-weight:1000;
          color:#111827;
          margin-bottom:14px;
        }

        .form-grid {
          display:grid;
          grid-template-columns: repeat(4, 1fr);
          gap:12px;
        }

        .field label {
          display:block;
          font-size:12px;
          font-weight:900;
          color:#374151;
          margin-bottom:5px;
        }

        .field input {
          width:100%;
          border:1px solid #d1d5db;
          border-radius:10px;
          padding:10px;
          font-size:13px;
        }

        .check-field {
          display:flex;
          align-items:center;
          gap:8px;
          font-size:13px;
          font-weight:900;
          color:#374151;
          padding-top:22px;
        }

        .check-field input {
          width:auto;
        }

        .form-actions {
          display:flex;
          gap:10px;
          margin-top:16px;
        }

        .msg-ok {
          color:#006b34;
          font-weight:900;
        }

        .msg-erro {
          color:#b91c1c;
          font-weight:900;
        }

        @media(max-width: 950px) {
          .form-grid {
            grid-template-columns: 1fr 1fr;
          }
        }

        @media(max-width: 620px) {
          .form-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="clientes-header">
        <div>
          <h1>Clientes</h1>
          <p>Cadastre empresas, CNPJ, valores por contrato e regras de cobrança.</p>
        </div>
        <button className="btn-primary" onClick={novoCliente}>
          + Novo cliente
        </button>
      </div>

      {erro && <div className="msg-erro">{erro}</div>}
      {ok && <div className="msg-ok">{ok}</div>}

      {editando && (
        <div className="form-box">
          <div className="form-title">{form.id ? "Editar cliente" : "Novo cliente"}</div>

          <div className="form-grid">
            <div className="field">
              <label>ID interno</label>
              <input value={form.id} placeholder="ex: enprin" onChange={(e) => atualizar("id", e.target.value)} />
            </div>
            <div className="field">
              <label>Nome</label>
              <input value={form.nome} placeholder="Nome da empresa" onChange={(e) => atualizar("nome", e.target.value)} />
            </div>
            <div className="field">
              <label>CNPJ</label>
              <input value={form.cnpj} placeholder="00.000.000/0000-00" onChange={(e) => atualizar("cnpj", e.target.value)} />
            </div>
            <div className="field">
              <label>Diária diurna</label>
              <input type="number" value={form.diaria_diurna} onChange={(e) => atualizar("diaria_diurna", e.target.value)} />
            </div>
            <div className="field">
              <label>Diária noturna</label>
              <input type="number" value={form.diaria_noturna} onChange={(e) => atualizar("diaria_noturna", e.target.value)} />
            </div>
            <div className="field">
              <label>Sábado</label>
              <input type="number" value={form.sabado} onChange={(e) => atualizar("sabado", e.target.value)} />
            </div>
            <div className="field">
              <label>Domingo/Feriado</label>
              <input type="number" value={form.domingo_feriado} onChange={(e) => atualizar("domingo_feriado", e.target.value)} />
            </div>
            <div className="field">
              <label>Adic. noturno</label>
              <input type="number" value={form.adicional_noturno} onChange={(e) => atualizar("adicional_noturno", e.target.value)} />
            </div>
            <div className="field">
              <label>Hora 20%</label>
              <input type="number" value={form.hora_20} onChange={(e) => atualizar("hora_20", e.target.value)} />
            </div>
            <div className="field">
              <label>Hora 50%</label>
              <input type="number" value={form.hora_50} onChange={(e) => atualizar("hora_50", e.target.value)} />
            </div>
            <div className="field">
              <label>Hora 100%</label>
              <input type="number" value={form.hora_100} onChange={(e) => atualizar("hora_100", e.target.value)} />
            </div>
            <label className="check-field">
              <input
                type="checkbox"
                checked={form.usa_adicional_noturno}
                onChange={(e) => atualizar("usa_adicional_noturno", e.target.checked)}
              />
              Usa adicional noturno
            </label>
            <label className="check-field">
              <input
                type="checkbox"
                checked={form.feriado_usa_valor_domingo}
                onChange={(e) => atualizar("feriado_usa_valor_domingo", e.target.checked)}
              />
              Feriado usa valor domingo
            </label>
          </div>

          <div className="form-actions">
            <button className="btn-primary" onClick={salvar}>Salvar cliente</button>
            <button className="btn-gray" onClick={() => setEditando(false)}>Cancelar</button>
          </div>
        </div>
      )}

      <div className="clientes-grid">
        {clientes.map((cliente) => (
          <div className="cliente-card" key={cliente.id}>
            <div className="cliente-top">
              <div>
                <div className="cliente-nome">{cliente.nome}</div>
                <div className="cliente-cnpj">CNPJ: {cliente.cnpj || "-"}</div>
              </div>
            </div>

            <div className="valores-mini">
              <div className="valor-box"><span>Diurna</span><strong>{brl(cliente.diaria_diurna)}</strong></div>
              <div className="valor-box"><span>Noturna</span><strong>{brl(cliente.diaria_noturna)}</strong></div>
              <div className="valor-box"><span>Sábado</span><strong>{brl(cliente.sabado)}</strong></div>
              <div className="valor-box"><span>Dom/Feriado</span><strong>{brl(cliente.domingo_feriado)}</strong></div>
              <div className="valor-box"><span>20%</span><strong>{brl(cliente.hora_20)}</strong></div>
              <div className="valor-box"><span>Adic. Noturno</span><strong>{brl(cliente.adicional_noturno)}</strong></div>
            </div>

            <div className="card-actions">
              <button className="btn-gray" onClick={() => editar(cliente)}>Editar</button>
              <button className="btn-red" onClick={() => excluir(cliente.id)}>Excluir</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
