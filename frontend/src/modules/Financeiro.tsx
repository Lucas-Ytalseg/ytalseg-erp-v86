import React, { useEffect, useMemo, useState } from "react";

const API_BASE = "/api";

const VERDE = "#00B050";

type Lancamento = {
  id: string;
  cliente: string;
  referencia: string;
  descricao: string;
  valor: number;
  status: "pendente" | "recebido";
  dataEmissao: string;
  dataRecebimento?: string;
  vencimento?: string;
  observacao?: string;
  nota?: string;
  formaPagamento?: string;
  ultimoContato?: string;
  promessaPagamento?: string;
  statusCobranca?: string;
};

const vazio: Lancamento = {
  id:"", cliente:"", referencia:"", descricao:"", valor:0,
  status:"pendente", dataEmissao:"", dataRecebimento:"",
  vencimento:"", observacao:"", nota:"", formaPagamento:"PIX",
  ultimoContato:"", promessaPagamento:"", statusCobranca:"Sem contato"
};

function brl(v:number){
  return new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL"}).format(Number(v||0));
}
function hoje(){ return new Date().toISOString().slice(0,10); }

function atrasoDias(v?:string, status?:string){
  if(!v || status==="recebido") return 0;
  const h = new Date(hoje()).getTime();
  const d = new Date(v).getTime();
  return Math.max(0, Math.floor((h-d)/(1000*60*60*24)));
}

function prioridade(dias:number){
  if(dias >= 30) return "CRÍTICA";
  if(dias >= 8) return "ALTA";
  if(dias >= 1) return "MÉDIA";
  return "NORMAL";
}

function textoCobranca(l:Lancamento, tipo:string){
  const base = `Valor: ${brl(l.valor)}\nReferência: ${l.referencia}\nPIX: 18.315.702/0001-20`;
  if(tipo==="amigavel") return `Olá, tudo bem?\n\nSegue lembrete amigável referente à nota pendente.\n${base}\n\nYTALSEG`;
  if(tipo==="firme") return `Olá, identificamos pendência financeira vencida.\nPedimos verificar programação de pagamento.\n${base}\n\nYTALSEG`;
  return `Segue novamente nota fiscal e dados bancários.\n${base}\n\nYTALSEG`;
}

export default function Financeiro(){
  const [lista,setLista] = useState<Lancamento[]>([]);
  const [erro,setErro] = useState("");

  async function carregar(){
    try{
      const res = await fetch(`${API_BASE}/financeiro`);
      const data = await res.json();
      if(data.status==="ok"){
        setLista((data.lancamentos||[]).map((x:any)=>({
          ...x,
          vencimento:x.vencimento||"",
          observacao:x.observacao||"",
          nota:x.nota||"",
          formaPagamento:x.formaPagamento||"PIX",
          ultimoContato:x.ultimoContato||"",
          promessaPagamento:x.promessaPagamento||"",
          statusCobranca:x.statusCobranca||"Sem contato"
        })));
      }
    }catch{
      setErro("Erro ao conectar backend.");
    }
  }

  useEffect(()=>{carregar();},[]);

  const resumo = useMemo(()=>{
    const pend = lista.filter(x=>x.status==="pendente");
    const hojeCount = pend.filter(x=>x.vencimento===hoje()).length;
    const a7 = pend.filter(x=>{const d=atrasoDias(x.vencimento,x.status); return d>=1 && d<=7;}).length;
    const a30 = pend.filter(x=>atrasoDias(x.vencimento,x.status)>=30).length;
    const total = pend.reduce((a,b)=>a+Number(b.valor||0),0);
    return {hojeCount,a7,a30,total};
  },[lista]);

  async function copiar(msg:string){
    await navigator.clipboard.writeText(msg);
    alert("Mensagem copiada.");
  }

  function abrirShareGrupo(msg:string){
    const nav:any = navigator;
    if(nav.share){
      nav.share({ text: msg }).catch(()=>{});
    }else{
      navigator.clipboard.writeText(msg);
      alert("Resumo copiado para colar no grupo do WhatsApp.");
    }
  }

  function resumoGrupoHoje(){
    const pend = lista.filter(x=>x.status==="pendente");
    const linhas = pend.slice(0,15).map(x=>`• ${x.cliente} - ${brl(x.valor)} - Venc.: ${x.vencimento || "sem venc."}`);
    abrirShareGrupo(`🔔 COBRANÇAS DE HOJE\n\n${linhas.join("\n") || "Nenhuma pendência."}\n\nChecar pagamentos e retornos.`);
  }

  function resumoCriticos(){
    const crit = lista.filter(x=>x.status==="pendente" && atrasoDias(x.vencimento,x.status)>=30);
    const linhas = crit.map(x=>`• ${x.cliente} - ${brl(x.valor)} - ${atrasoDias(x.vencimento,x.status)} dias`);
    abrirShareGrupo(`🚨 ATRASADOS +30 DIAS\n\n${linhas.join("\n") || "Nenhum crítico."}`);
  }

  function resumoFinanceiro(){
    const total = lista.reduce((a,x)=>a+Number(x.valor||0),0);
    const recebido = lista.filter(x=>x.status==="recebido").reduce((a,x)=>a+Number(x.valor||0),0);
    const pendente = lista.filter(x=>x.status==="pendente").reduce((a,x)=>a+Number(x.valor||0),0);
    abrirShareGrupo(`📊 RESUMO FINANCEIRO\n\nFaturado: ${brl(total)}\nRecebido: ${brl(recebido)}\nPendente: ${brl(pendente)}\n\nYTALSEG`);
  }

  function abrirWhatsApp(l:Lancamento, tipo:string){
    const msg = textoCobranca(l,tipo);
    const url = `https://wa.me/?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
  }

  async function salvarCampos(l:Lancamento){
    await fetch(`${API_BASE}/financeiro`,{
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body:JSON.stringify(l)
    });
    await carregar();
  }

  async function receber(l:Lancamento){
    await fetch(`${API_BASE}/financeiro/${l.id}/status`,{
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body:JSON.stringify({status:"recebido",dataRecebimento:hoje()})
    });
    await carregar();
  }

  return (
    <div className="page">
      <style>{`
        .page{display:grid;gap:18px}
        .head{display:flex;justify-content:space-between;align-items:center}
        .head h1{margin:0;font-size:30px;font-weight:1000}
        .cards{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}
        .card,.box{background:#fff;border:1px solid #e5e7eb;border-radius:22px;padding:18px}
        .card span{display:block;font-size:12px;color:#6b7280;font-weight:1000}
        .card strong{display:block;margin-top:8px;font-size:28px;color:${VERDE};font-weight:1000}
        table{width:100%;border-collapse:collapse;font-size:13px}
        th{background:#f9fafb;text-align:left;padding:10px;border-bottom:1px solid #e5e7eb}
        td{padding:10px;border-bottom:1px solid #edf0f2;vertical-align:top}
        .btn{border:0;padding:8px 10px;border-radius:10px;cursor:pointer;font-weight:900;background:#e5e7eb}
        .btn-green{background:${VERDE};color:#fff}
        .btn-red{background:#fee2e2;color:#991b1b}
        .actions{display:flex;gap:6px;flex-wrap:wrap}
        .pill{padding:4px 8px;border-radius:999px;font-size:11px;font-weight:1000}
        .p0{background:#ecfccb;color:#365314}.p1{background:#fef3c7;color:#92400e}.p2{background:#fee2e2;color:#991b1b}
        input,select{width:100%;border:1px solid #d1d5db;border-radius:8px;padding:6px;font-size:12px}
      `}</style>

      <div className="head">
        <h1>Financeiro Histórico PRO</h1>
        <div className="actions">
          <button className="btn" onClick={resumoGrupoHoje}>Grupo Hoje</button>
          <button className="btn" onClick={resumoCriticos}>Críticos</button>
          <button className="btn" onClick={resumoFinanceiro}>Resumo Grupo</button>
          <button className="btn" onClick={()=>{
            const hojeStr = new Date().toISOString().slice(0,10);
            const pend = lista.filter(x=>x.status==="pendente");
            const venceHoje = pend.filter(x=>x.vencimento===hojeStr);
            const prometeuHoje = pend.filter(x=>x.promessaPagamento===hojeStr);
            const linhas = [
              ...venceHoje.map(x=>`• VENCE HOJE: ${x.cliente} - ${brl(x.valor)}`),
              ...prometeuHoje.map(x=>`• PROMETEU PAGAR: ${x.cliente} - ${brl(x.valor)}`),
              ...pend.slice(0,8).map(x=>`• COBRAR: ${x.cliente} - ${brl(x.valor)} - Venc.: ${x.vencimento || "sem venc."}`)
            ];
            abrirShareGrupo(`📌 AGENDA DE COBRANÇA DE HOJE\n\n${linhas.join("\n") || "Nenhuma ação para hoje."}\n\nChecar pagamentos e retornos.`);
          }}>Agenda Hoje</button>
          <button className="btn btn-green" onClick={carregar}>Atualizar</button>
        </div>
      </div>

      {erro && <div>{erro}</div>}

      <div className="cards">
        <div className="card"><span>Vencendo hoje</span><strong>{resumo.hojeCount}</strong></div>
        <div className="card"><span>Atrasadas 1-7 dias</span><strong>{resumo.a7}</strong></div>
        <div className="card"><span>Atrasadas +30 dias</span><strong>{resumo.a30}</strong></div>
        <div className="card"><span>Total a receber</span><strong>{brl(resumo.total)}</strong></div>
      </div>

      <div className="cards">
        <div className="card"><span>Faturado mês</span><strong>{brl(lista.reduce((a,x)=>a+Number(x.valor||0),0))}</strong></div>
        <div className="card"><span>Recebido mês</span><strong>{brl(lista.filter(x=>x.status==="recebido").reduce((a,x)=>a+Number(x.valor||0),0))}</strong></div>
        <div className="card"><span>Pendente mês</span><strong>{brl(lista.filter(x=>x.status==="pendente").reduce((a,x)=>a+Number(x.valor||0),0))}</strong></div>
        <div className="card"><span>Taxa recebimento</span><strong>{lista.length? Math.round((lista.filter(x=>x.status==="recebido").length/lista.length)*100):0}%</strong></div>
      </div>

      <div className="box">
        <h2 style={{marginTop:0}}>Agenda de Cobrança</h2>
        <table>
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Ação</th>
              <th>Valor</th>
              <th>Vencimento</th>
              <th>Promessa</th>
            </tr>
          </thead>
          <tbody>
            {lista.filter(x=>x.status==="pendente").slice(0,10).map((x)=> {
              const hojeStr = new Date().toISOString().slice(0,10);
              const acao = x.promessaPagamento===hojeStr ? "Prometeu pagar hoje" : x.vencimento===hojeStr ? "Vence hoje" : atrasoDias(x.vencimento,x.status)>0 ? "Cobrar atraso" : "Acompanhar";
              return (
                <tr key={`agenda-${x.id}`}>
                  <td>{x.cliente}</td>
                  <td>{acao}</td>
                  <td>{brl(x.valor)}</td>
                  <td>{x.vencimento || "-"}</td>
                  <td>{x.promessaPagamento || "-"}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="box">
        <table>
          <thead>
            <tr>
              <th>Cliente</th><th>Valor</th><th>Venc.</th><th>Atraso</th><th>Prioridade</th><th>Cobrança</th><th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {lista.filter(x=>x.status==="pendente").map(l=>{
              const dias = atrasoDias(l.vencimento,l.status);
              const pr = prioridade(dias);
              const cls = dias>=30 ? "p2" : dias>=1 ? "p1":"p0";
              return (
                <tr key={l.id}>
                  <td>
                    <div style={{fontWeight:900}}>{l.cliente}</div>
                    <div>{l.referencia}</div>
                  </td>
                  <td>{brl(l.valor)}</td>
                  <td>{l.vencimento||"-"}</td>
                  <td>{dias>0 ? `${dias} dias` : "-"}</td>
                  <td><span className={`pill ${cls}`}>{pr}</span></td>
                  <td style={{minWidth:220}}>
                    <select value={l.statusCobranca||"Sem contato"} onChange={e=>salvarCampos({...l,statusCobranca:e.target.value})}>
                      <option>Sem contato</option>
                      <option>Cobrado</option>
                      <option>Prometeu pagar</option>
                      <option>Negociação</option>
                    </select>
                    <input type="date" value={l.ultimoContato||""} onChange={e=>salvarCampos({...l,ultimoContato:e.target.value})} />
                    <input type="date" value={l.promessaPagamento||""} onChange={e=>salvarCampos({...l,promessaPagamento:e.target.value})} />
                  </td>
                  <td>
                    <div className="actions">
                      <button className="btn btn-green" onClick={()=>abrirWhatsApp(l,"amigavel")}>WhatsApp</button>
                      <button className="btn" onClick={()=>abrirWhatsApp(l,"firme")}>Firme</button>
                      <button className="btn" onClick={()=>abrirWhatsApp(l,"reenvio")}>Reenviar</button>
                      <button className="btn" onClick={()=>copiar(textoCobranca(l,"amigavel"))}>Copiar</button>
                      <button className="btn btn-green" onClick={()=>receber(l)}>Receber</button>
                    </div>
                  </td>
                </tr>
              )
            })}
            {lista.filter(x=>x.status==="pendente").length===0 && (
              <tr><td colSpan={7}>Nenhuma pendência.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
