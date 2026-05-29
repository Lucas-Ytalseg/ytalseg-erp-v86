import React, { useEffect, useState } from "react";

const API_BASE = "/api";

const VERDE = "#00B050";
const STORAGE_KEY = "ytalseg_config_pro";

type Lancamento = {
  id: string;
  cliente: string;
  referencia: string;
  valor: number;
  status: string;
  nota?: string;
};

const padrao = {
  empresa: "YTALSEG",
  cnpj: "18.315.702/0001-20",
  email: "financeiro.ytalseg@gmail.com",
  banco: "Banco Itaú",
  agencia: "8078",
  conta: "Conta Corrente 23126-6",
  pix: "18.315.702/0001-20",
  vencimentoPadrao: 15,
  mensagemCobranca:
    "Olá, tudo bem?\n\nSegue lembrete referente à pendência financeira.\n\nYTALSEG",
  descricaoNota:
    "REFERENTE A SERVIÇOS PRESTADOS EM ASSESSORIA E CONSULTORIA EM SEGURANÇA DO TRABALHO.",
};

function brl(v: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(v || 0));
}

export default function Configuracoes() {
  const [cfg, setCfg] = useState<any>(padrao);
  const [lista, setLista] = useState<Lancamento[]>([]);
  const [msg, setMsg] = useState("");
  const [erro, setErro] = useState("");

  useEffect(() => {
    const salvo = localStorage.getItem(STORAGE_KEY);
    if (salvo) {
      try { setCfg({ ...padrao, ...JSON.parse(salvo) }); } catch {}
    }
    carregar();
  }, []);

  function set(campo: string, valor: any) {
    setCfg((p: any) => ({ ...p, [campo]: valor }));
  }

  function salvar() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cfg));
    setMsg("Configurações salvas.");
    setTimeout(() => setMsg(""), 2500);
  }

  function restaurar() {
    if (!confirm("Restaurar padrão?")) return;
    setCfg(padrao);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(padrao));
  }

  async function carregar() {
    try {
      setErro("");
      const res = await fetch(`${API_BASE}/financeiro`);
      const data = await res.json();
      if (data.status === "ok") setLista(data.lancamentos || []);
    } catch {
      setErro("Não consegui carregar notas/lançamentos.");
    }
  }

  async function excluir(id: string) {
    if (!confirm("Excluir esta nota/lançamento de teste?")) return;
    await fetch(`${API_BASE}/financeiro/${id}`, { method: "DELETE" });
    setMsg("Nota/lançamento excluído.");
    await carregar();
  }

  async function backup() {
    try {
      const res = await fetch(`${API_BASE}/backup`, { method: "POST" });
      const data = await res.json();
      setMsg(data.status === "ok" ? `Backup criado: ${data.arquivo}` : data.erro || "Erro no backup.");
    } catch {
      setErro("Backend sem rota /backup ou fora do ar.");
    }
  }

  return (
    <div className="config">
      <style>{`
        .config{display:grid;gap:18px}
        .head{display:flex;justify-content:space-between;align-items:center;gap:12px}
        h1{margin:0;font-size:30px;font-weight:1000}
        .sub{color:#6b7280;font-weight:700;margin-top:5px}
        .actions{display:flex;gap:10px;flex-wrap:wrap}
        .btn{border:0;background:#e5e7eb;color:#111;font-weight:900;padding:10px 13px;border-radius:10px;cursor:pointer}
        .green{background:${VERDE};color:white}.red{background:#fee2e2;color:#991b1b}
        .grid{display:grid;grid-template-columns:1fr 1fr;gap:18px}
        .box{background:white;border:1px solid #e5e7eb;border-radius:22px;padding:18px;box-shadow:0 10px 24px rgba(0,0,0,.06)}
        .box h2{margin:0 0 14px;font-size:21px}
        .form{display:grid;grid-template-columns:1fr 1fr;gap:12px}
        label{display:block;font-size:12px;font-weight:1000;color:#374151;margin-bottom:5px}
        input,textarea{width:100%;border:1px solid #d1d5db;border-radius:10px;padding:10px;font-size:13px}
        textarea{min-height:95px;resize:vertical}
        table{width:100%;border-collapse:collapse;font-size:13px}
        th{text-align:left;background:#f9fafb;padding:10px;border-bottom:1px solid #e5e7eb}
        td{padding:10px;border-bottom:1px solid #edf0f2;font-weight:700}
        .ok{background:#ecfdf5;color:#166534;border:1px solid #bbf7d0;border-radius:14px;padding:12px;font-weight:1000}
        .erro{background:#fef2f2;color:#991b1b;border:1px solid #fecaca;border-radius:14px;padding:12px;font-weight:1000}
        @media(max-width:900px){.grid,.form{grid-template-columns:1fr}}
      `}</style>

      <div className="head">
        <div>
          <h1>Configurações PRO</h1>
          <div className="sub">Empresa, financeiro, nota fiscal, backup e manutenção.</div>
        </div>
        <div className="actions">
          <button className="btn green" onClick={salvar}>Salvar</button>
          <button className="btn" onClick={restaurar}>Restaurar</button>
          <button className="btn" onClick={backup}>Backup agora</button>
        </div>
      </div>

      {msg && <div className="ok">{msg}</div>}
      {erro && <div className="erro">{erro}</div>}

      <div className="grid">
        <div className="box">
          <h2>Dados da empresa</h2>
          <div className="form">
            <div><label>Empresa</label><input value={cfg.empresa} onChange={e=>set("empresa",e.target.value)} /></div>
            <div><label>CNPJ</label><input value={cfg.cnpj} onChange={e=>set("cnpj",e.target.value)} /></div>
            <div><label>E-mail</label><input value={cfg.email} onChange={e=>set("email",e.target.value)} /></div>
            <div><label>Vencimento padrão em dias</label><input type="number" value={cfg.vencimentoPadrao} onChange={e=>set("vencimentoPadrao",Number(e.target.value||0))} /></div>
          </div>
        </div>

        <div className="box">
          <h2>Dados bancários</h2>
          <div className="form">
            <div><label>Banco</label><input value={cfg.banco} onChange={e=>set("banco",e.target.value)} /></div>
            <div><label>Agência</label><input value={cfg.agencia} onChange={e=>set("agencia",e.target.value)} /></div>
            <div><label>Conta</label><input value={cfg.conta} onChange={e=>set("conta",e.target.value)} /></div>
            <div><label>PIX</label><input value={cfg.pix} onChange={e=>set("pix",e.target.value)} /></div>
          </div>
        </div>
      </div>

      <div className="grid">
        <div className="box">
          <h2>Mensagem de cobrança</h2>
          <textarea value={cfg.mensagemCobranca} onChange={e=>set("mensagemCobranca",e.target.value)} />
        </div>
        <div className="box">
          <h2>Descrição padrão da nota</h2>
          <textarea value={cfg.descricaoNota} onChange={e=>set("descricaoNota",e.target.value)} />
          <p style={{fontWeight:800,color:"#6b7280"}}>Pedido de compra continua manual na descrição quando existir.</p>
        </div>
      </div>

      <div className="box">
        <div className="head" style={{marginBottom:12}}>
          <div>
            <h2 style={{margin:0}}>Excluir nota / lançamento de teste</h2>
            <div className="sub">Use para apagar nota teste que entrou no financeiro.</div>
          </div>
          <button className="btn" onClick={carregar}>Atualizar lista</button>
        </div>

        <table>
          <thead>
            <tr><th>Cliente</th><th>Referência</th><th>Valor</th><th>Nota</th><th>Status</th><th>Ação</th></tr>
          </thead>
          <tbody>
            {lista.length === 0 && <tr><td colSpan={6}>Nenhum lançamento encontrado.</td></tr>}
            {lista.map(l => (
              <tr key={l.id}>
                <td>{l.cliente}</td>
                <td>{l.referencia || "-"}</td>
                <td>{brl(l.valor)}</td>
                <td>{l.nota || "-"}</td>
                <td>{l.status}</td>
                <td><button className="btn red" onClick={()=>excluir(l.id)}>Excluir</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
