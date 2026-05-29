import React, { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "ytalseg_equipe_v10_5";
const VERDE = "#00B050";

type Colaborador = {
  id: string;
  nome: string;
  funcao: string;
  telefone: string;
  admissao: string;
  ativo: boolean;
  diaria: number;
  comissao: number;
  documentos: string;
  validade: string;
};

const vazio: Colaborador = {
  id: "",
  nome: "",
  funcao: "",
  telefone: "",
  admissao: "",
  ativo: true,
  diaria: 0,
  comissao: 0,
  documentos: "",
  validade: "",
};

function brl(v: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number(v || 0));
}

export default function Equipe() {
  const [lista, setLista] = useState<Colaborador[]>([]);
  const [form, setForm] = useState<Colaborador>(vazio);
  const [editando, setEditando] = useState(false);

  useEffect(() => {
    const salvo = localStorage.getItem(STORAGE_KEY);
    if (salvo) {
      try {
        setLista(JSON.parse(salvo));
      } catch {
        setLista([]);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lista));
  }, [lista]);

  const resumo = useMemo(() => {
    const ativos = lista.filter((x) => x.ativo).length;
    const inativos = lista.filter((x) => !x.ativo).length;
    const docsVencendo = lista.filter((x) => x.validade).length;
    const diariaMedia =
      lista.length > 0
        ? lista.reduce((a, b) => a + Number(b.diaria || 0), 0) / lista.length
        : 0;

    return { ativos, inativos, docsVencendo, diariaMedia };
  }, [lista]);

  function novo() {
    setForm(vazio);
    setEditando(true);
  }

  function editar(item: Colaborador) {
    setForm(item);
    setEditando(true);
  }

  function atualizar(campo: keyof Colaborador, valor: any) {
    setForm((prev) => ({
      ...prev,
      [campo]:
        campo === "diaria" || campo === "comissao"
          ? Number(valor || 0)
          : campo === "ativo"
          ? Boolean(valor)
          : valor,
    }));
  }

  function salvar() {
    if (!form.nome.trim()) {
      alert("Informe o nome.");
      return;
    }

    const id = form.id || crypto.randomUUID();

    const payload = {
      ...form,
      id,
    };

    setLista((prev) => {
      const existe = prev.some((x) => x.id === id);
      if (existe) return prev.map((x) => (x.id === id ? payload : x));
      return [payload, ...prev];
    });

    setEditando(false);
    setForm(vazio);
  }

  function excluir(id: string) {
    if (!confirm("Excluir colaborador?")) return;
    setLista((prev) => prev.filter((x) => x.id !== id));
  }

  function toggleAtivo(id: string) {
    setLista((prev) =>
      prev.map((x) => (x.id === id ? { ...x, ativo: !x.ativo } : x))
    );
  }

  return (
    <div className="equipe-page">
      <style>{`
        .equipe-page { display:grid; gap:18px; }

        .head {
          display:flex;
          justify-content:space-between;
          gap:16px;
          align-items:center;
        }

        .head h1 {
          margin:0;
          font-size:30px;
          font-weight:1000;
          color:#111827;
        }

        .head p {
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

        .cards {
          display:grid;
          grid-template-columns:repeat(4,1fr);
          gap:14px;
        }

        .card {
          background:white;
          border:1px solid #e5e7eb;
          border-radius:22px;
          padding:18px;
          box-shadow:0 10px 24px rgba(0,0,0,.06);
        }

        .card span {
          display:block;
          color:#6b7280;
          font-size:12px;
          font-weight:1000;
          text-transform:uppercase;
        }

        .card strong {
          display:block;
          margin-top:8px;
          color:${VERDE};
          font-size:30px;
          font-weight:1000;
        }

        .form-box, .table-box {
          background:white;
          border:1px solid #e5e7eb;
          border-radius:22px;
          padding:18px;
          box-shadow:0 10px 24px rgba(0,0,0,.06);
        }

        .title {
          font-size:22px;
          font-weight:1000;
          margin-bottom:14px;
        }

        .grid {
          display:grid;
          grid-template-columns:repeat(4,1fr);
          gap:12px;
        }

        .field label {
          display:block;
          font-size:12px;
          font-weight:900;
          margin-bottom:5px;
          color:#374151;
        }

        .field input {
          width:100%;
          border:1px solid #d1d5db;
          border-radius:10px;
          padding:10px;
        }

        .check {
          display:flex;
          align-items:center;
          gap:8px;
          padding-top:22px;
          font-size:13px;
          font-weight:900;
        }

        .actions {
          display:flex;
          gap:10px;
          margin-top:16px;
        }

        table {
          width:100%;
          border-collapse:collapse;
          font-size:13px;
        }

        th {
          text-align:left;
          padding:12px;
          background:#f9fafb;
          border-bottom:1px solid #e5e7eb;
          font-weight:1000;
        }

        td {
          padding:12px;
          border-bottom:1px solid #edf0f2;
          font-weight:700;
        }

        tr:last-child td { border-bottom:0; }

        .status {
          padding:6px 10px;
          border-radius:999px;
          font-size:12px;
          font-weight:1000;
        }

        .ativo { background:#dcfce7; color:#166534; }
        .inativo { background:#fee2e2; color:#991b1b; }

        .row-actions {
          display:flex;
          gap:7px;
          flex-wrap:wrap;
        }

        @media(max-width:1050px){
          .cards,.grid{grid-template-columns:1fr 1fr;}
        }

        @media(max-width:650px){
          .cards,.grid{grid-template-columns:1fr;}
          .table-box{overflow:auto;}
        }
      `}</style>

      <div className="head">
        <div>
          <h1>Equipe</h1>
          <p>Controle de técnicos, diária, comissão e documentos.</p>
        </div>

        <button className="btn-primary" onClick={novo}>
          + Novo colaborador
        </button>
      </div>

      <div className="cards">
        <div className="card">
          <span>Ativos</span>
          <strong>{resumo.ativos}</strong>
        </div>
        <div className="card">
          <span>Inativos</span>
          <strong>{resumo.inativos}</strong>
        </div>
        <div className="card">
          <span>Docs cadastrados</span>
          <strong>{resumo.docsVencendo}</strong>
        </div>
        <div className="card">
          <span>Diária média</span>
          <strong>{brl(resumo.diariaMedia)}</strong>
        </div>
      </div>

      {editando && (
        <div className="form-box">
          <div className="title">{form.id ? "Editar colaborador" : "Novo colaborador"}</div>

          <div className="grid">
            <div className="field">
              <label>Nome</label>
              <input value={form.nome} onChange={(e) => atualizar("nome", e.target.value)} />
            </div>

            <div className="field">
              <label>Função</label>
              <input value={form.funcao} onChange={(e) => atualizar("funcao", e.target.value)} />
            </div>

            <div className="field">
              <label>Telefone</label>
              <input value={form.telefone} onChange={(e) => atualizar("telefone", e.target.value)} />
            </div>

            <div className="field">
              <label>Admissão</label>
              <input type="date" value={form.admissao} onChange={(e) => atualizar("admissao", e.target.value)} />
            </div>

            <div className="field">
              <label>Diária</label>
              <input type="number" value={form.diaria} onChange={(e) => atualizar("diaria", e.target.value)} />
            </div>

            <div className="field">
              <label>Comissão %</label>
              <input type="number" value={form.comissao} onChange={(e) => atualizar("comissao", e.target.value)} />
            </div>

            <div className="field">
              <label>Documento</label>
              <input value={form.documentos} placeholder="NR10 / ASO / etc" onChange={(e) => atualizar("documentos", e.target.value)} />
            </div>

            <div className="field">
              <label>Validade</label>
              <input type="date" value={form.validade} onChange={(e) => atualizar("validade", e.target.value)} />
            </div>

            <label className="check">
              <input type="checkbox" checked={form.ativo} onChange={(e) => atualizar("ativo", e.target.checked)} />
              Colaborador ativo
            </label>
          </div>

          <div className="actions">
            <button className="btn-primary" onClick={salvar}>Salvar</button>
            <button className="btn-gray" onClick={() => setEditando(false)}>Cancelar</button>
          </div>
        </div>
      )}

      <div className="table-box">
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Função</th>
              <th>Telefone</th>
              <th>Diária</th>
              <th>Comissão</th>
              <th>Documento</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>

          <tbody>
            {lista.length === 0 && (
              <tr>
                <td colSpan={8}>Nenhum colaborador cadastrado.</td>
              </tr>
            )}

            {lista.map((x) => (
              <tr key={x.id}>
                <td>{x.nome}</td>
                <td>{x.funcao || "-"}</td>
                <td>{x.telefone || "-"}</td>
                <td>{brl(x.diaria)}</td>
                <td>{x.comissao}%</td>
                <td>{x.documentos || "-"}</td>
                <td>
                  <span className={`status ${x.ativo ? "ativo" : "inativo"}`}>
                    {x.ativo ? "Ativo" : "Inativo"}
                  </span>
                </td>
                <td>
                  <div className="row-actions">
                    <button className="btn-gray" onClick={() => editar(x)}>Editar</button>
                    <button className="btn-gray" onClick={() => toggleAtivo(x.id)}>
                      {x.ativo ? "Inativar" : "Ativar"}
                    </button>
                    <button className="btn-red" onClick={() => excluir(x.id)}>Excluir</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
