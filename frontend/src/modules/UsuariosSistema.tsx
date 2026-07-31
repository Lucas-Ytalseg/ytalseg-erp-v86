import React, { useEffect, useState } from "react";

const API_BASE = "/api";
const VERDE = "#00B050";

type Usuario = {
  id: string;
  usuario: string;
  perfil: "admin" | "visualizacao";
  ativo: number;
  criado_em: string;
};

export default function UsuariosSistema() {
  const [lista, setLista] = useState<Usuario[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  const [novoUsuario, setNovoUsuario] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [novoPerfil, setNovoPerfil] = useState<"admin" | "visualizacao">("visualizacao");
  const [criando, setCriando] = useState(false);

  const [redefinindoId, setRedefinindoId] = useState<string | null>(null);
  const [senhaRedefinicao, setSenhaRedefinicao] = useState("");

  async function carregar() {
    setCarregando(true);
    setErro("");
    try {
      const res = await fetch(`${API_BASE}/usuarios`);
      if (!res.ok) throw new Error("Não foi possível carregar os usuários.");
      const dados = await res.json();
      setLista(dados.usuarios || []);
    } catch (e: any) {
      setErro(e.message || "Erro ao carregar usuários.");
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  async function criarUsuario() {
    setErro("");
    if (!novoUsuario.trim()) return setErro("Informe o nome de usuário.");
    if (novaSenha.length < 8) return setErro("A senha precisa ter pelo menos 8 caracteres.");

    setCriando(true);
    try {
      const res = await fetch(`${API_BASE}/usuarios`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario: novoUsuario.trim(), senha: novaSenha, perfil: novoPerfil }),
      });
      if (!res.ok) {
        const dados = await res.json().catch(() => ({}));
        throw new Error(dados.detail || "Não foi possível criar o usuário.");
      }
      setNovoUsuario("");
      setNovaSenha("");
      setNovoPerfil("visualizacao");
      await carregar();
    } catch (e: any) {
      setErro(e.message || "Erro ao criar usuário.");
    } finally {
      setCriando(false);
    }
  }

  async function excluirUsuario(item: Usuario) {
    if (!confirm(`Excluir o usuário "${item.usuario}"? Essa ação não pode ser desfeita.`)) return;
    setErro("");
    try {
      const res = await fetch(`${API_BASE}/usuarios/${item.id}`, { method: "DELETE" });
      if (!res.ok) {
        const dados = await res.json().catch(() => ({}));
        throw new Error(dados.detail || "Não foi possível excluir o usuário.");
      }
      await carregar();
    } catch (e: any) {
      setErro(e.message || "Erro ao excluir usuário.");
    }
  }

  async function confirmarRedefinicao(item: Usuario) {
    if (senhaRedefinicao.length < 8) return setErro("A nova senha precisa ter pelo menos 8 caracteres.");
    setErro("");
    try {
      const res = await fetch(`${API_BASE}/usuarios/${item.id}/senha`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nova_senha: senhaRedefinicao }),
      });
      if (!res.ok) {
        const dados = await res.json().catch(() => ({}));
        throw new Error(dados.detail || "Não foi possível redefinir a senha.");
      }
      setRedefinindoId(null);
      setSenhaRedefinicao("");
      alert(`Senha de "${item.usuario}" redefinida com sucesso.`);
    } catch (e: any) {
      setErro(e.message || "Erro ao redefinir senha.");
    }
  }

  return (
    <div className="usuarios-page">
      <style>{`
        .usuarios-page { display:grid; gap:18px; }
        .head h1 { margin:0; font-size:30px; font-weight:1000; color:#111827; }
        .head p { margin:5px 0 0; color:#6b7280; font-weight:700; }

        .form-box, .table-box {
          background:white; border:1px solid #e5e7eb; border-radius:22px;
          padding:18px; box-shadow:0 10px 24px rgba(0,0,0,.06);
        }
        .title { font-size:20px; font-weight:1000; margin-bottom:14px; }

        .grid { display:grid; grid-template-columns:repeat(3,1fr) auto; gap:12px; align-items:end; }
        .field label { display:block; font-size:12px; font-weight:900; margin-bottom:5px; color:#374151; }
        .field input, .field select {
          width:100%; border:1px solid #d1d5db; border-radius:10px; padding:10px; box-sizing:border-box;
        }

        .btn-primary {
          border:0; background:${VERDE}; color:white; font-weight:900;
          padding:12px 16px; border-radius:12px; cursor:pointer;
          box-shadow:0 8px 18px rgba(0,176,80,.22);
        }
        .btn-gray { border:0; background:#e5e7eb; color:#111; font-weight:900; padding:10px 13px; border-radius:10px; cursor:pointer; }
        .btn-red { border:0; background:#fee2e2; color:#991b1b; font-weight:900; padding:10px 13px; border-radius:10px; cursor:pointer; }

        .erro { color:#b91c1c; font-weight:800; margin-top:10px; }

        table { width:100%; border-collapse:collapse; font-size:13px; }
        th { text-align:left; padding:12px; background:#f9fafb; border-bottom:1px solid #e5e7eb; font-weight:1000; }
        td { padding:12px; border-bottom:1px solid #edf0f2; font-weight:700; }
        tr:last-child td { border-bottom:0; }

        .badge { padding:6px 10px; border-radius:999px; font-size:12px; font-weight:1000; }
        .badge-admin { background:#eafff2; color:#006b34; }
        .badge-view { background:#eef2ff; color:#3730a3; }

        .row-actions { display:flex; gap:7px; flex-wrap:wrap; align-items:center; }
        .redef-box { display:flex; gap:8px; align-items:center; }
        .redef-box input { border:1px solid #d1d5db; border-radius:8px; padding:8px; }

        @media(max-width:900px){ .grid{grid-template-columns:1fr 1fr;} }
        @media(max-width:600px){ .grid{grid-template-columns:1fr;} .table-box{overflow:auto;} }
      `}</style>

      <div className="head">
        <h1>Usuários</h1>
        <p>Cadastre, exclua e redefina senhas dos usuários que acessam o sistema. Só o admin vê essa tela.</p>
      </div>

      <div className="form-box">
        <div className="title">Novo usuário</div>
        <div className="grid">
          <div className="field">
            <label>Usuário</label>
            <input value={novoUsuario} onChange={(e) => setNovoUsuario(e.target.value)} placeholder="ex: maria" />
          </div>
          <div className="field">
            <label>Senha inicial</label>
            <input
              type="password"
              value={novaSenha}
              onChange={(e) => setNovaSenha(e.target.value)}
              placeholder="mínimo 8 caracteres"
            />
          </div>
          <div className="field">
            <label>Perfil</label>
            <select value={novoPerfil} onChange={(e) => setNovoPerfil(e.target.value as "admin" | "visualizacao")}>
              <option value="visualizacao">Visualização (só lê)</option>
              <option value="admin">Admin (edita tudo)</option>
            </select>
          </div>
          <button className="btn-primary" onClick={criarUsuario} disabled={criando}>
            {criando ? "Criando..." : "+ Criar usuário"}
          </button>
        </div>
        {erro && <div className="erro">{erro}</div>}
      </div>

      <div className="table-box">
        <table>
          <thead>
            <tr>
              <th>Usuário</th>
              <th>Perfil</th>
              <th>Criado em</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {carregando && (
              <tr><td colSpan={4}>Carregando...</td></tr>
            )}
            {!carregando && lista.length === 0 && (
              <tr><td colSpan={4}>Nenhum usuário cadastrado.</td></tr>
            )}
            {!carregando && lista.map((item) => (
              <tr key={item.id}>
                <td>{item.usuario}</td>
                <td>
                  <span className={`badge ${item.perfil === "admin" ? "badge-admin" : "badge-view"}`}>
                    {item.perfil === "admin" ? "Admin" : "Visualização"}
                  </span>
                </td>
                <td>{item.criado_em ? new Date(item.criado_em).toLocaleString("pt-BR") : "-"}</td>
                <td>
                  {redefinindoId === item.id ? (
                    <div className="redef-box">
                      <input
                        type="password"
                        placeholder="nova senha"
                        value={senhaRedefinicao}
                        onChange={(e) => setSenhaRedefinicao(e.target.value)}
                        autoFocus
                      />
                      <button className="btn-primary" onClick={() => confirmarRedefinicao(item)}>Salvar</button>
                      <button className="btn-gray" onClick={() => { setRedefinindoId(null); setSenhaRedefinicao(""); }}>Cancelar</button>
                    </div>
                  ) : (
                    <div className="row-actions">
                      <button className="btn-gray" onClick={() => { setRedefinindoId(item.id); setSenhaRedefinicao(""); setErro(""); }}>
                        Redefinir senha
                      </button>
                      <button className="btn-red" onClick={() => excluirUsuario(item)}>Excluir</button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
