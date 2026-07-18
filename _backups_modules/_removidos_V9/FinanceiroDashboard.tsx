import { useEffect, useMemo, useState } from "react";

const REL_KEY = "ytalseg_relatorios_versoes_v11_2";

type Rel = {
  id: number;
  cliente?: string;
  valor?: number;
  status?: string;
  criadoEm?: string;
};

function brl(v?: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number(v || 0));
}

export default function FinanceiroDashboard() {
  const [dados, setDados] = useState<Rel[]>([]);

  useEffect(() => {
    try {
      const r = JSON.parse(localStorage.getItem(REL_KEY) || "[]");
      setDados(Array.isArray(r) ? r : []);
    } catch {
      setDados([]);
    }
  }, []);

  const resumo = useMemo(() => {
    const total = dados.reduce((acc, d) => acc + Number(d.valor || 0), 0);
    const pagos = dados.filter(d => d.status === "Pago").reduce((a,b)=>a+Number(b.valor||0),0);
    const pendente = total - pagos;

    return {
      total,
      pagos,
      pendente
    };
  }, [dados]);

  return (
    <div style={{padding:20}}>
      <h1>Financeiro</h1>

      <div style={{display:"flex", gap:20, marginTop:20}}>
        <Card titulo="Total faturado" valor={brl(resumo.total)} />
        <Card titulo="Recebido" valor={brl(resumo.pagos)} />
        <Card titulo="Pendente" valor={brl(resumo.pendente)} />
      </div>
    </div>
  );
}

function Card({titulo, valor}:{titulo:string, valor:string}){
  return(
    <div style={{
      background:"#fff",
      padding:20,
      borderRadius:12,
      border:"1px solid #ddd"
    }}>
      <small>{titulo}</small>
      <h2>{valor}</h2>
    </div>
  )
}
