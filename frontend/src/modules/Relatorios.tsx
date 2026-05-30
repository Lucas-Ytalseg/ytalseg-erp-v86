import React, { useEffect, useMemo, useState } from "react";
import logo from "../assets/logo.png";
import { enviarRelatorioParaFinanceiro } from "./Automacao";

declare global {
  interface Window {
    ytalsegAPI?: {
      salvarPDF: (nomeArquivo: string) => Promise<{ ok: boolean; path?: string; erro?: string }>;
      visualizarPDF?: (nomeArquivo: string) => Promise<{ ok: boolean; path?: string; erro?: string }>;
      gerarBackup?: () => Promise<{ ok: boolean; pasta?: string; arquivo?: string; erro?: string }>;
    };
  }
}

const API_BASE = "/api";

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

type DiaDetectado = {
  data: string;
  semana: string;
  tipo?: string;
  tipo_dia?: string;
  valor?: number;
  periodo_diurno?: boolean;
  periodo_noturno?: boolean;
  adicional_noturno?: number;
  qtd_periodos?: number;
};

type DiaConferencia = {
  data: string;
  semana: string;
  tipo_dia: "diaria" | "sabado" | "domingo";
  feriado: boolean;
  diurna: boolean;
  noturna: boolean;
  extra20: boolean;
  extra50: boolean;
  extra100: boolean;
  adicional: boolean;
};

const VALORES_PADRAO = {
  diariaNormal: 560,
  diariaNoturna: 560,
  sabado: 400,
  domingoFeriado: 350,
  hora20: 672,
  hora50: 840,
  hora100: 1120,
  adicionalNoturno: 140,
};

type UploadResponse = {
  filename: string;
  status: string;
  texto_extraido_preview: string;
  calculo: {
    dias_detectados: DiaDetectado[];
    resumo: {
      dias_normais: number;
      sabados: number;
      domingos_feriados: number;
      total_diarias: number;
      total_sabados: number;
      total_domingos_feriados?: number;
      valor_total: number;
    };
  };
};

type ServicoDiverso = {
  data: string;
  descricao: string;
  valor: number;
};

function brl(v: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(v || 0);
}

function classeValorNota(valor: number) {
  const texto = brl(valor);
  if (texto.length >= 16) return "valor-nota valor-nota-gg";
  if (texto.length >= 14) return "valor-nota valor-nota-g";
  if (texto.length >= 12) return "valor-nota valor-nota-m";
  return "valor-nota";
}

function normalizarSemana(semana?: string) {
  if (!semana) return "-";
  const s = semana.toLowerCase();
  if (s.includes("seg")) return "Segunda-feira";
  if (s.includes("ter")) return "Terça-feira";
  if (s.includes("qua")) return "Quarta-feira";
  if (s.includes("qui")) return "Quinta-feira";
  if (s.includes("sex")) return "Sexta-feira";
  if (s.includes("sáb") || s.includes("sab")) return "Sábado";
  if (s.includes("dom")) return "Domingo";
  return semana;
}

function tipoDiaPorSemana(semana?: string): "diaria" | "sabado" | "domingo" {
  const s = normalizarSemana(semana).toLowerCase();
  if (s.includes("sáb") || s.includes("sab")) return "sabado";
  if (s.includes("dom")) return "domingo";
  return "diaria";
}

function diasNoMes(mes: number, ano: number) { return new Date(ano, mes, 0).getDate(); }
function nomeMes(mes: number) { const nomes = ["JANEIRO","FEVEREIRO","MARÇO","ABRIL","MAIO","JUNHO","JULHO","AGOSTO","SETEMBRO","OUTUBRO","NOVEMBRO","DEZEMBRO"]; return nomes[Math.max(0, Math.min(11, mes - 1))]; }
function referenciaMesAno(mes: number, ano: number) { return `${nomeMes(mes)} / ${ano}`; }
function semanaPorDataDinamica(dia: number, mes: number, ano: number) { const nomes = ["Domingo","Segunda-feira","Terça-feira","Quarta-feira","Quinta-feira","Sexta-feira","Sábado"]; return nomes[new Date(ano, mes - 1, dia).getDay()]; }

function valoresDaEmpresa(empresa?: Empresa | null) {
  return {
    diariaNormal: empresa?.diaria_diurna ?? VALORES_PADRAO.diariaNormal,
    diariaNoturna: empresa?.diaria_noturna ?? VALORES_PADRAO.diariaNoturna,
    sabado: empresa?.sabado ?? VALORES_PADRAO.sabado,
    domingoFeriado: empresa?.domingo_feriado ?? VALORES_PADRAO.domingoFeriado,
    hora20: empresa?.hora_20 ?? VALORES_PADRAO.hora20,
    hora50: empresa?.hora_50 ?? VALORES_PADRAO.hora50,
    hora100: empresa?.hora_100 ?? VALORES_PADRAO.hora100,
    adicionalNoturno: empresa?.adicional_noturno ?? VALORES_PADRAO.adicionalNoturno,
  };
}

function valorBase(
  tipo: "diaria" | "sabado" | "domingo",
  periodo: "diurna" | "noturna",
  feriado = false,
  valores = VALORES_PADRAO
) {
  if (feriado) return valores.domingoFeriado;
  if (tipo === "sabado") return valores.sabado;
  if (tipo === "domingo") return valores.domingoFeriado;
  return periodo === "noturna" ? valores.diariaNoturna : valores.diariaNormal;
}

function adicionalNoturno25(
  tipo: "diaria" | "sabado" | "domingo",
  feriado = false,
  valores = VALORES_PADRAO
) {
  return valorBase(tipo, "noturna", feriado, valores) * 0.25;
}

function montarDiasConferencia(diasApi: DiaDetectado[], mes = 3, ano = 2026): DiaConferencia[] {
  return Array.from({ length: diasNoMes(mes, ano) }).map((_, i) => {
    const numero = i + 1;
    const dd = String(numero).padStart(2, "0");
    const encontrado = diasApi.find((d) => d.data?.startsWith(`${dd}/`));
    const semana = normalizarSemana(encontrado?.semana || semanaPorDataDinamica(numero, mes, ano));
    const tipo_dia = (encontrado?.tipo_dia as any) || tipoDiaPorSemana(semana);
    const noturna = Boolean(encontrado?.periodo_noturno);

    return {
      data: encontrado?.data || `${dd}/${String(mes).padStart(2, "0")}/${ano}`,
      semana,
      tipo_dia,
      feriado: false,
      diurna: Boolean(encontrado?.periodo_diurno),
      noturna,
      extra20: false,
      extra50: false,
      extra100: false,
      adicional: noturna && (encontrado?.adicional_noturno ?? 0) > 0,
    };
  });
}

export default function Relatorios() {
  const [zoomRelatorio, setZoomRelatorio] = useState(0.9);
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [resultado, setResultado] = useState<UploadResponse | null>(null);
  
  // Ajusta zoom para celular
  useEffect(() => {
    const isMobile = window.innerWidth <= 768;
    setZoomRelatorio(isMobile ? 0.75 : 0.9);
  }, []);
  const hoje = new Date();
  const [mesAnalise, setMesAnalise] = useState(hoje.getMonth() + 1);
  const [anoAnalise, setAnoAnalise] = useState(hoje.getFullYear());
  const [diasEditaveis, setDiasEditaveis] = useState<DiaConferencia[]>(montarDiasConferencia([], hoje.getMonth() + 1, hoje.getFullYear()));
  const [servicos, setServicos] = useState<ServicoDiverso[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");
  const [rascunhoStatus, setRascunhoStatus] = useState("");
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [empresaId, setEmpresaId] = useState("geoambiental");
  const [mostrarCadastro, setMostrarCadastro] = useState(false);
  const [empresaForm, setEmpresaForm] = useState({
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
  });

  async function carregarEmpresas() {
    try {
      const res = await fetch(`${API_BASE}/empresas`);
      const data = await res.json();
      if (data.status === "ok") {
        setEmpresas(data.empresas || []);
        if (data.empresas?.[0]?.id && !data.empresas.find((e: Empresa) => e.id === empresaId)) {
          setEmpresaId(data.empresas[0].id);
        }
      }
    } catch {
      setEmpresas([]);
    }
  }

  useEffect(() => {
    carregarEmpresas();
  }, []);

  const empresaAtual = empresas.find((e) => e.id === empresaId) || null;
  const referenciaAtual = referenciaMesAno(mesAnalise, anoAnalise);
  const VALORES = valoresDaEmpresa(empresaAtual);

  function aplicarRegraEmpresaNosDias(lista: DiaConferencia[]) {
    const valores = valoresDaEmpresa(empresaAtual);
    const auto20EmNoturna = valores.hora20 > 0 && valores.adicionalNoturno === 0;

    return lista.map((dia) => ({
      ...dia,
      extra20: dia.extra20 || (auto20EmNoturna && dia.noturna),
      adicional: valores.adicionalNoturno > 0 ? dia.adicional : false,
    }));
  }

  const resumo = useMemo(() => {
    const periodos_diurnos = diasEditaveis.filter((d) => d.diurna).length;
    const periodos_noturnos = diasEditaveis.filter((d) => d.noturna).length;
    const total_adicional_noturno = diasEditaveis.reduce((acc, d) => {
      return acc + (d.adicional ? adicionalNoturno25(d.tipo_dia, d.feriado, VALORES) : 0);
    }, 0);
    const total_20 = diasEditaveis.filter((d) => d.extra20).length * VALORES.hora20;
    const total_50 = diasEditaveis.filter((d) => d.extra50).length * VALORES.hora50;
    const total_100 = diasEditaveis.filter((d) => d.extra100).length * VALORES.hora100;

    const total_diarias = diasEditaveis.reduce((acc, d) => {
      const diurna = d.diurna ? valorBase(d.tipo_dia, "diurna", d.feriado, VALORES) : 0;
      const noturna = d.noturna ? valorBase(d.tipo_dia, "noturna", d.feriado, VALORES) : 0;
      return acc + diurna + noturna;
    }, 0);

    const total_sabados = diasEditaveis
      .filter((d) => d.tipo_dia === "sabado")
      .reduce((acc, d) => acc + (d.diurna ? VALORES.sabado : 0) + (d.noturna ? VALORES.sabado : 0) + (d.adicional ? adicionalNoturno25(d.tipo_dia, d.feriado, VALORES) : 0), 0);

    const total_domingos_feriados = diasEditaveis
      .filter((d) => d.tipo_dia === "domingo" || d.feriado)
      .reduce((acc, d) => acc + (d.diurna ? VALORES.domingoFeriado : 0) + (d.noturna ? VALORES.domingoFeriado : 0) + (d.adicional ? adicionalNoturno25(d.tipo_dia, d.feriado, VALORES) : 0), 0);

    return {
      dias_normais: diasEditaveis.filter((d) => d.tipo_dia === "diaria" && !d.feriado && (d.diurna || d.noturna)).length,
      sabados: diasEditaveis.filter((d) => d.tipo_dia === "sabado" && (d.diurna || d.noturna)).length,
      domingos_feriados: diasEditaveis.filter((d) => (d.tipo_dia === "domingo" || d.feriado) && (d.diurna || d.noturna)).length,
      feriados: diasEditaveis.filter((d) => d.feriado).length,
      periodos_diurnos,
      periodos_noturnos,
      extras20: diasEditaveis.filter((d) => d.extra20).length,
      extras50: diasEditaveis.filter((d) => d.extra50).length,
      extras100: diasEditaveis.filter((d) => d.extra100).length,
      total_diarias,
      total_sabados,
      total_domingos_feriados,
      total_20,
      total_50,
      total_100,
      total_adicional_noturno,
      valor_total: total_diarias + total_20 + total_50 + total_100 + total_adicional_noturno,
    };
  }, [diasEditaveis, empresaAtual]);

  const dias = diasEditaveis;

  const totalServicosDiversos = useMemo(
    () => servicos.reduce((acc, s) => acc + Number(s.valor || 0), 0),
    [servicos]
  );

  const valorNota = (resumo.valor_total || 0) + totalServicosDiversos;

  const temDiasTrabalhados = diasEditaveis.some(
    (d) => d.diurna || d.noturna || d.feriado || d.extra20 || d.extra50 || d.extra100 || d.adicional
  );

  const exibirResumoCobranca = temDiasTrabalhados;


  const RASCUNHO_KEY = "ytalseg_relatorio_rascunho_v11";

  useEffect(() => {
    try {
      const salvo = localStorage.getItem(RASCUNHO_KEY);
      if (!salvo) return;

      const data = JSON.parse(salvo);

      if (Array.isArray(data.diasEditaveis)) setDiasEditaveis(data.diasEditaveis);
      if (Array.isArray(data.servicos)) setServicos(data.servicos);
      if (data.resultado) setResultado(data.resultado);
      if (data.empresaId) setEmpresaId(data.empresaId);

      if (data.salvoEm) {
        setRascunhoStatus(`Rascunho recuperado automaticamente (${new Date(data.salvoEm).toLocaleString("pt-BR")}).`);
      } else {
        setRascunhoStatus("Rascunho recuperado automaticamente.");
      }
    } catch {
      setRascunhoStatus("");
    }
  }, []);

  useEffect(() => {
    try {
      const payload = {
        salvoEm: new Date().toISOString(),
        empresaId,
        resultado,
        diasEditaveis,
        servicos,
      };

      localStorage.setItem(RASCUNHO_KEY, JSON.stringify(payload));
      setRascunhoStatus("Rascunho salvo automaticamente.");
    } catch {
      setRascunhoStatus("Não foi possível salvar o rascunho automático.");
    }
  }, [empresaId, resultado, diasEditaveis, servicos]);

  function limparRascunhoAutomatico() {
    const ok = window.confirm("Tem certeza que deseja apagar o rascunho automático?");
    if (!ok) return;

    localStorage.removeItem(RASCUNHO_KEY);
    setRascunhoStatus("Rascunho limpo.");
  }

  function limparTabelaToda() {
    if (!window.confirm("Limpar toda a tabela de dias, serviços e resultado atual?")) return;
    setArquivo(null); setResultado(null); setServicos([]); setErro("");
    setDiasEditaveis(montarDiasConferencia([], mesAnalise, anoAnalise));
    localStorage.removeItem(RASCUNHO_KEY);
    setRascunhoStatus("Tabela completa limpa. Novo relatório pronto.");
  }

  async function gerarBackupManual() {
    try {
      if (window.ytalsegAPI?.gerarBackup) {
        const res = await window.ytalsegAPI.gerarBackup();
        if (res.ok) setRascunhoStatus(`Backup gerado com sucesso: ${res.pasta || ""}`);
        else setRascunhoStatus(res.erro || "Não foi possível gerar backup.");
      } else {
        setRascunhoStatus("Backup manual disponível apenas no aplicativo instalado.");
      }
    } catch {
      setRascunhoStatus("Erro ao gerar backup.");
    }
  }

  function salvarVersaoRelatorioLocal(tipo: "cliente" | "interno") {
    try {
      const chave = "ytalseg_relatorios_versoes_v11_2";
      const lista = JSON.parse(localStorage.getItem(chave) || "[]");

      const item = {
        id: Date.now(),
        tipo,
        cliente: empresaAtual?.nome || "Cliente não informado",
        referencia: referenciaAtual,
        valor: valorNota,
        criadoEm: new Date().toISOString(),
        empresaId,
        resultado,
        diasEditaveis,
        servicos,
      };

      lista.unshift(item);
      localStorage.setItem(chave, JSON.stringify(lista.slice(0, 50)));
    } catch {
      // Não bloqueia geração do PDF se o histórico local falhar.
    }
  }


  function montarBackupRelatorioAtual() {
    return {
      origem: "YTALSEG-RELATORIO-V66",
      salvoEm: new Date().toISOString(),
      cliente: empresaAtual?.nome || "Cliente não informado",
      referencia: referenciaAtual,
      valor: valorNota,
      empresaId,
      mesAnalise,
      anoAnalise,
      resultado,
      diasEditaveis,
      servicos,
    };
  }

  function salvarBackupRelatorioAtual() {
    try {
      const payload = montarBackupRelatorioAtual();
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      const cliente = (empresaAtual?.nome || "cliente").replace(/[^a-z0-9]+/gi, "_");
      a.href = url;
      a.download = `relatorio-editavel-${cliente}-${referenciaAtual.replace(/[^a-z0-9]+/gi, "_")}.json`;
      a.click();
      URL.revokeObjectURL(url);
      setRascunhoStatus("Backup editável do relatório salvo. Você pode abrir esse arquivo depois e continuar a edição.");
    } catch {
      setRascunhoStatus("Não foi possível salvar o backup editável do relatório.");
    }
  }

  function aplicarBackupRelatorio(data: any) {
    const payload = data?.dados || data;
    if (!payload) throw new Error("Arquivo vazio.");
    if (payload.empresaId) setEmpresaId(payload.empresaId);
    if (payload.mesAnalise) setMesAnalise(Number(payload.mesAnalise));
    if (payload.anoAnalise) setAnoAnalise(Number(payload.anoAnalise));
    if (payload.resultado) setResultado(payload.resultado);
    if (Array.isArray(payload.diasEditaveis)) setDiasEditaveis(payload.diasEditaveis);
    else setDiasEditaveis(montarDiasConferencia([], Number(payload.mesAnalise || mesAnalise), Number(payload.anoAnalise || anoAnalise)));
    if (Array.isArray(payload.servicos)) setServicos(payload.servicos);
    setArquivo(null);
    setErro("");
    setRascunhoStatus(`Relatório carregado para edição${payload.referencia ? ` (${payload.referencia})` : ""}.`);
  }

  function abrirBackupRelatorioArquivo(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(String(reader.result || "{}"));
        aplicarBackupRelatorio(data);
      } catch (err: any) {
        setErro(err?.message || "Backup inválido. Selecione um JSON gerado pelo próprio relatório.");
      }
    };
    reader.readAsText(file, "utf-8");
  }

  function abrirUltimoRelatorioSalvo() {
    try {
      const lista = JSON.parse(localStorage.getItem("ytalseg_relatorios_versoes_v11_2") || "[]");
      if (!Array.isArray(lista) || lista.length === 0) {
        setRascunhoStatus("Nenhum relatório salvo no histórico local ainda.");
        return;
      }
      aplicarBackupRelatorio(lista[0]);
    } catch {
      setRascunhoStatus("Não foi possível abrir o último relatório salvo.");
    }
  }

  function validarRelatorioAntesDeGerar(tipo: "cliente" | "interno") {
    const avisos: string[] = [];

    if (!empresaAtual?.nome) avisos.push("cliente/empresa não selecionado");
    if (!valorNota || valorNota <= 0) avisos.push("valor da nota zerado");
    if (!temDiasTrabalhados && servicos.length === 0) avisos.push("sem dias trabalhados e sem serviços diversos");

    const servicosIncompletos = servicos.some(
      (s) => Number(s.valor || 0) > 0 && !String(s.descricao || "").trim()
    );

    if (servicosIncompletos) avisos.push("serviço diverso com valor, mas sem descrição");

    if (avisos.length === 0) return true;

    const continuar = window.confirm(
      `Atenção antes de gerar PDF ${tipo.toUpperCase()}:\n\n- ${avisos.join("\n- ")}\n\nDeseja continuar mesmo assim?`
    );

    return continuar;
  }


  async function processarPdf() {
    if (!arquivo) {
      setErro("Selecione um PDF.");
      return;
    }

    setCarregando(true);
    setErro("");
    setResultado(null);

    try {
      const form = new FormData();
      form.append("file", arquivo);
      form.append("empresa_id", empresaId);
      form.append("mes", String(mesAnalise));
      form.append("ano", String(anoAnalise));

      const res = await fetch(`${API_BASE}/upload-pdf`, {
        method: "POST",
        body: form,
      });

      const data = await res.json();

      if (data.status === "erro") {
        throw new Error(data.erro);
      }

      setResultado(data);
      setDiasEditaveis(aplicarRegraEmpresaNosDias(montarDiasConferencia(data.calculo?.dias_detectados || [])));
    } catch (e: any) {
      setErro(e.message || "Erro ao processar PDF.");
    } finally {
      setCarregando(false);
    }
  }

  function adicionarServico() {
    setServicos([...servicos, { data: "", descricao: "", valor: 0 }]);
  }

  function atualizarServico(index: number, campo: keyof ServicoDiverso, valor: string) {
    setServicos((prev) =>
      prev.map((s, i) =>
        i === index
          ? { ...s, [campo]: campo === "valor" ? Number(valor || 0) : valor }
          : s
      )
    );
  }

  function removerServico(index: number) {
    setServicos((prev) => prev.filter((_, i) => i !== index));
  }

  function atualizarDia(
    index: number,
    campo: "feriado" | "diurna" | "noturna" | "extra20" | "extra50" | "extra100" | "adicional",
    marcado: boolean
  ) {
    setDiasEditaveis((prev) =>
      prev.map((dia, i) => {
        if (i !== index) return dia;

        if (campo === "noturna") {
          const auto20EmNoturna = VALORES.hora20 > 0 && VALORES.adicionalNoturno === 0;
          return {
            ...dia,
            noturna: marcado,
            adicional: marcado && VALORES.adicionalNoturno > 0 ? true : false,
            extra20: marcado && auto20EmNoturna ? true : dia.extra20,
          };
        }

        if (campo === "adicional") {
          return { ...dia, adicional: marcado && dia.noturna };
        }

        return { ...dia, [campo]: marcado };
      })
    );
  }

  function abrirCadastroNovo() {
    setEmpresaForm({
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
    });
    setMostrarCadastro(true);
  }

  function abrirEditarEmpresa() {
    if (!empresaAtual) return;

    setEmpresaForm({
      id: empresaAtual.id,
      nome: empresaAtual.nome,
      cnpj: empresaAtual.cnpj || "",
      diaria_diurna: empresaAtual.diaria_diurna || 0,
      diaria_noturna: empresaAtual.diaria_noturna || 0,
      sabado: empresaAtual.sabado || 0,
      domingo_feriado: empresaAtual.domingo_feriado || 0,
      hora_20: empresaAtual.hora_20 || 0,
      hora_50: empresaAtual.hora_50 || 0,
      hora_100: empresaAtual.hora_100 || 0,
      adicional_noturno: empresaAtual.adicional_noturno || 0,
      usa_adicional_noturno: empresaAtual.usa_adicional_noturno ?? true,
      feriado_usa_valor_domingo: empresaAtual.feriado_usa_valor_domingo ?? true,
    });
    setMostrarCadastro(true);
  }

  function atualizarEmpresaForm(campo: string, valor: any) {
    setEmpresaForm((prev) => ({
      ...prev,
      [campo]: valor,
    }));
  }

  async function salvarEmpresa() {
    if (!empresaForm.nome.trim()) {
      setErro("Informe o nome da empresa.");
      return;
    }

    try {
      setErro("");

      const payload = {
        ...empresaForm,
        diaria_diurna: Number(empresaForm.diaria_diurna || 0),
        diaria_noturna: Number(empresaForm.diaria_noturna || 0),
        sabado: Number(empresaForm.sabado || 0),
        domingo_feriado: Number(empresaForm.domingo_feriado || 0),
        hora_20: Number(empresaForm.hora_20 || 0),
        hora_50: Number(empresaForm.hora_50 || 0),
        hora_100: Number(empresaForm.hora_100 || 0),
        adicional_noturno: Number(empresaForm.adicional_noturno || 0),
      };

      const res = await fetch(`${API_BASE}/empresas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.status === "erro") {
        throw new Error(data.erro);
      }

      await carregarEmpresas();
      setEmpresaId(data.id);
      setMostrarCadastro(false);
    } catch (e: any) {
      setErro(e.message || "Erro ao salvar empresa.");
    }
  }

  function aplicar20EmTodasNoturnas() {
    setDiasEditaveis((prev) =>
      prev.map((dia) => ({
        ...dia,
        extra20: dia.noturna ? true : dia.extra20,
      }))
    );
  }

  function limpar20() {
    setDiasEditaveis((prev) =>
      prev.map((dia) => ({
        ...dia,
        extra20: false,
      }))
    );
  }

  function criarRelatorioManual() {
    setErro("");
    setResultado({
      filename: "Relatório manual",
      status: "manual",
      texto_extraido_preview: "",
      calculo: {
        dias_detectados: [],
        resumo: {
          dias_normais: 0,
          sabados: 0,
          domingos_feriados: 0,
          total_diarias: 0,
          total_sabados: 0,
          total_domingos_feriados: 0,
          valor_total: 0,
        },
      },
    });

    setDiasEditaveis(montarDiasConferencia([], mesAnalise, anoAnalise));
  }

  async function imprimirCliente() {
    if (!validarRelatorioAntesDeGerar("cliente")) return;

    try {
      enviarRelatorioParaFinanceiro({
        cliente: empresaAtual?.nome || "Cliente não informado",
        referencia: referenciaAtual,
        valor: valorNota,
        descricao: "Relatório aprovado"
      });
    } catch {
      // Não bloqueia a geração do PDF se o envio ao financeiro falhar.
    }

    salvarVersaoRelatorioLocal("cliente");
    document.body.classList.add("modo-cliente");
    document.body.classList.remove("modo-interno");

    setRascunhoStatus("📄 Abrindo diálogo de impressão...");
    
    setTimeout(() => {
      if (window.ytalsegAPI?.salvarPDF) {
        // Modo Desktop (Electron)
        window.ytalsegAPI.salvarPDF(`Relatorio_Cliente_${empresaAtual?.nome || "cliente"}.pdf`)
          .then(res => {
            if (res?.ok) setRascunhoStatus(`✅ PDF cliente salvo: ${res.path || ""}`);
            else setRascunhoStatus(`❌ Erro ao salvar PDF cliente: ${res?.erro || "desconhecido"}`);
          })
          .catch(err => setRascunhoStatus(`❌ Erro: ${err}`));
      } else {
        // Modo Web/Mobile - abre print dialog
        window.print();
        setRascunhoStatus("✅ PDF cliente pronto! Escolha 'Salvar como PDF' no diálogo.");
      }
      
      setTimeout(() => {
        document.body.classList.remove("modo-cliente");
      }, 3000);
    }, 100);
  }



  function visualizarAntesDeSalvar(tipo: "cliente" | "interno") {
    if (!validarRelatorioAntesDeGerar(tipo)) return;

    if (tipo === "cliente") {
      document.body.classList.add("modo-cliente");
      document.body.classList.remove("modo-interno");
    } else {
      document.body.classList.add("modo-interno");
      document.body.classList.remove("modo-cliente");
    }

    setRascunhoStatus(`👁️ Abrindo visualização ${tipo}...`);
    
    setTimeout(() => {
      if (window.ytalsegAPI?.visualizarPDF) {
        // Modo Desktop (Electron)
        const nome = `Preview_${tipo}_${empresaAtual?.nome || "relatorio"}.pdf`;
        window.ytalsegAPI.visualizarPDF(nome)
          .then(res => {
            if (res?.ok) setRascunhoStatus(`✅ Visualização ${tipo} aberta.`);
            else setRascunhoStatus(`❌ Erro na visualização ${tipo}: ${res?.erro || "desconhecido"}`);
          })
          .catch(err => setRascunhoStatus(`❌ Erro: ${err}`));
      } else {
        // Modo Web/Mobile - abre preview
        window.print();
        setRascunhoStatus(`✅ Visualização ${tipo} aberta! Feche o diálogo quando terminar.`);
      }
      
      setTimeout(() => {
        document.body.classList.remove("modo-cliente");
        document.body.classList.remove("modo-interno");
      }, 3000);
    }, 100);
  }

async function imprimirInterno() {
  if (!validarRelatorioAntesDeGerar("interno")) return;

  salvarVersaoRelatorioLocal("interno");
  document.body.classList.add("modo-interno");
  document.body.classList.remove("modo-cliente");

  setRascunhoStatus("📄 Abrindo diálogo de impressão...");
  
  setTimeout(() => {
    if (window.ytalsegAPI?.salvarPDF) {
      // Modo Desktop (Electron)
      window.ytalsegAPI.salvarPDF(`Relatorio_Interno_${empresaAtual?.nome || "interno"}.pdf`)
        .then(res => {
          if (res?.ok) setRascunhoStatus(`✅ PDF interno salvo: ${res.path || ""}`);
          else setRascunhoStatus(`❌ Erro ao salvar PDF interno: ${res?.erro || "desconhecido"}`);
        })
        .catch(err => setRascunhoStatus(`❌ Erro: ${err}`));
    } else {
      // Modo Web/Mobile - abre print dialog
      window.print();
      setRascunhoStatus("✅ PDF interno pronto! Escolha 'Salvar como PDF' no diálogo.");
    }
    
    setTimeout(() => {
      document.body.classList.remove("modo-interno");
    }, 3000);
  }, 100);
}  

  return (
    <div className="page preview-mode">
      <style>{`
        * { box-sizing: border-box; }

        body {
          margin: 0;
          background: #f3f4f6;
          font-family: Arial, sans-serif;
          color: #111;
        }

        /* ===== RESPONSIVO PARA CELULAR ===== */
        @media (max-width: 768px) {
          body {
            font-size: 13px;
            -webkit-text-size-adjust: 100%;
          }
          
          .page {
            padding: 8px;
            background: #f3f4f6;
          }

          button, input, select, textarea {
            min-height: 44px;
            font-size: 13px !important;
            padding: 10px 12px !important;
          }

          input[type="text"],
          input[type="number"],
          select {
            width: 100%;
          }
        }

        .page {
          padding: 18px;
        }

        .sheet {
          position: relative;
          max-width: 1250px;
          margin: auto;
          background: white;
          border-radius: 18px;
          padding: 24px;
          box-shadow: 0 12px 35px rgba(0,0,0,.10);
          overflow: hidden;
        }
.logo-topo{
  width:100px;
  height:100px;
  object-fit:contain;
}

.logo-card{
  width:162px !important;
  height:162px !important;
  object-fit:contain !important;
}

.logo-watermark{
  width:100%;
  height:100%;
  object-fit:contain;
  opacity:.115;
}
.watermark{
  position:absolute;
  top:53%;
  left:50%;
  transform:translate(-50%,-50%);
  width:980px;
  height:980px;
  display:flex;
  align-items:center;
  justify-content:center;
  z-index:9;
  pointer-events:none;
}
       
       .content {
  position: relative;
  z-index: 1;
}

        .top {
          display: grid;
          grid-template-columns: 1fr 1.2fr 110px;
          gap: 22px;
          align-items: center;
          margin-bottom: 20px;
        }

        .brand {
          font-size: 64px;
          font-weight: 900;
          letter-spacing: -2px;
          color: ${VERDE};
          line-height: .9;
        }

        .brand-sub {
          font-size: 13px;
          font-weight: 800;
          margin-top: 8px;
        }

        .title {
          color: ${VERDE};
          font-size: 42px;
          font-weight: 900;
          border-left: 2px solid ${VERDE};
          padding-left: 28px;
        }

        .seal{
width:90px;
height:90px;
display:flex;
align-items:center;
justify-content:center;
overflow:hidden;
border:none;
background:none;
}

        .upload {
          background: #f8fafc;
          border: 1px solid #ddd;
          border-radius: 12px;
          padding: 10px 12px;
          margin-bottom: 12px;
        }

        .toolbar-grid {
          display:grid;
          grid-template-columns: 132px 104px minmax(210px, .85fr) minmax(230px, 1fr);
          gap:8px;
          align-items:end;
        }

        .toolbar-grid > div { min-width: 0; }

        .toolbar-action { width: 100%; min-height: 35px; padding: 8px 10px; font-size: 11.5px; }

        .toolbar-label {
          display:block;
          font-size:11px;
          font-weight:900;
          color:#006b34;
          margin-bottom:3px;
        }

        .empresa-select {
          width:100%;
          border:1px solid #ccc;
          border-radius:6px;
          padding:7px 8px;
          font-size:12px;
          font-weight:800;
          background:white;
          height:35px;
        }

        .cadastro-box {
          margin-top:12px;
          padding:12px;
          border:1px solid #cfd8d3;
          border-radius:12px;
          background:#ffffff;
        }

        .cadastro-title {
          color:#006b34;
          font-size:15px;
          font-weight:900;
          margin-bottom:10px;
        }

        .cadastro-grid {
          display:grid;
          grid-template-columns: repeat(4, 1fr);
          gap:10px;
        }

        .cadastro-grid label {
          display:block;
          font-size:11px;
          font-weight:900;
          color:#333;
          margin-bottom:4px;
        }

        .cadastro-grid input {
          width:100%;
          border:1px solid #ccc;
          border-radius:6px;
          padding:7px;
          font-size:12px;
        }

        .check-line {
          display:flex;
          align-items:center;
          gap:6px;
          font-size:12px;
          font-weight:800;
          margin-top:20px;
        }

        .check-line input {
          width:auto;
        }

        input {
          width: 100%;
          border: 1px solid #ccc;
          border-radius: 6px;
          padding: 7px 8px;
          font-size: 12px;
          height: 35px;
        }

        input[type="file"] {
          padding: 6px 8px;
          font-size: 11px;
        }

        button {
          border: 0;
          border-radius: 8px;
          padding: 9px 13px;
          font-weight: 800;
          cursor: pointer;
        }

        .btn-main,
        .btn-gray,
        .btn-red { background: ${VERDE}; color: white; }

        .actions {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(145px, 1fr));
          gap: 8px;
          margin: 10px 0 6px;
          align-items: stretch;
        }

        .actions button,
        .actions label {
          justify-content: center;
          min-height: 38px;
          font-size: 12px;
          text-align: center;
        }

        .action-group {
          position: relative;
        }

        .action-group summary {
          min-height: 38px;
          border-radius: 8px;
          padding: 9px 13px;
          font-size: 12px;
          font-weight: 900;
          text-align: center;
          cursor: pointer;
          list-style: none;
          background: ${VERDE};
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .action-group summary::-webkit-details-marker { display: none; }

        .action-group-menu {
          position: absolute;
          z-index: 30;
          left: 0;
          right: 0;
          top: calc(100% + 6px);
          display: grid;
          gap: 6px;
          background: #fff;
          border: 1px solid #d1d5db;
          border-radius: 12px;
          padding: 8px;
          box-shadow: 0 12px 28px rgba(0,0,0,.16);
        }

        .action-group-menu button,
        .action-group-menu label {
          width: 100%;
          min-height: 36px;
        }

        @media (max-width: 1280px) {
          .toolbar-grid {
            grid-template-columns: 120px 96px minmax(190px, .85fr) minmax(210px, 1fr);
          }
        }

        @media (max-width: 1050px) {
          .toolbar-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        .info {
          display: grid;
          grid-template-columns: 1.25fr 1fr 1.1fr 1.1fr;
          border: 1px solid #ccc;
          border-radius: 10px;
          overflow: hidden;
          margin-bottom: 18px;
        }

        .info div {
          padding: 14px;
          border-right: 1px solid #ccc;
        }

        .info div:last-child {
          border-right: none;
        }

        .label {
          color: ${VERDE};
          font-size: 13px;
          font-weight: 900;
          text-transform: uppercase;
        }

        .value {
          font-size: 17px;
          font-weight: 800;
          margin-top: 7px;
        }

        .grid {
          display: grid;
          grid-template-columns: 1.9fr 1fr;
          gap: 16px;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          font-size: 12px;
        }
        th {
          background: rgba(255,255,255,.52);
          color: #555;
          padding: 8px 5px;
          font-weight: 900;
        }

        td {
          border: 1px solid rgba(190,190,190,.55);
          padding: 6px 5px;
          text-align: center;
          background: rgba(255,255,255,.20);
        }

        .left { text-align: left; }
        .right { text-align: right; }

        .total-row td {
          background: ${VERDE};
          color: white;
          font-weight: 900;
        }

        .panel {
          border: 1px solid rgba(180,180,180,.55);
          border-radius: 10px;
          overflow: hidden;
          margin-bottom: 16px;
          background: rgba(255,255,255,.30);
          backdrop-filter: blur(1px);
        }

        .panel-title {
          background: rgba(255,255,255,.48);
          color: #00853d;
          font-size: 16px;
          font-weight: 900;
          padding: 11px;
          text-align: center;
        }

        .obs {
          border: 1px solid #ccc;
          border-radius: 10px;
          padding: 14px;
          margin-top: 16px;
          background: white;
        }

        .obs h3 {
          color: ${VERDE};
          margin: 0 0 6px;
        }

        .obs p {
          margin: 3px 0 10px;
        }

        .footer-final {
          display: grid;
          grid-template-columns: 1.05fr 1fr;
          gap: 18px;
          margin-top: 18px;
        }

        .ytalseg-card-final{
  display:grid;
  grid-template-columns: 165px 1fr;
  min-height:130px;
  border-radius:24px;
  overflow:hidden;
  background:rgba(255,255,255,.88);
  box-shadow:0 8px 24px rgba(0,0,0,.12);
  border:1px solid #d7d7d7;
}

        .logo-area-final{
  background:white;
  display:flex;
  align-items:center;
  justify-content:center;
  padding-left:8px;
}

.logo-circle-final{
  width:162px !important;
  height:162px !important;
  display:flex !important;
  align-items:center !important;
  justify-content:center !important;
}

        .info-area-final{
  padding:14px 18px;
  border-right:6px solid #00B050;
  border-top-right-radius:80px;
  border-bottom-right-radius:80px;
}

        .info-area-final h2{
  margin:0;
  color:#00B050;
  font-size:30px;
  font-weight:900;
}

.info-area-final p{
  margin:2px 0;
  font-size:13px;
  color:#111;
  font-weight:600;
}

.rep-line{
  display:grid;
  grid-template-columns:92px 1fr;
  max-width:360px;
  font-size:13px;
  margin-top:2px;
  color:#111;
  font-weight:700;
}

        .email-line {
          margin-top: 8px;
          font-size: 13px;
          font-weight: 700;
        }

        .nota-final {
          background: linear-gradient(135deg, #ffe76a, #ffc400);
          border: 1px solid #d8a900;
          border-radius: 18px;
          display: grid;
          grid-template-columns: 105px 1fr;
          align-items: center;
          padding: 18px;
          color: #06351d;
          box-shadow: 0 8px 24px rgba(0,0,0,.12);
        }

        .nota-icon {
          font-size: 58px;
          text-align: center;
        }

        .nota-final span {
          display: block;
          font-size: 24px;
          font-weight: 900;
        }

        .nota-final strong {
          display: block;
          font-size: 58px;
          font-weight: 900;
        }

        .print-only {
          display: none;
        }

        .checkbox-small {
          width:auto !important;
          transform:scale(.85);
          padding:0 !important;
          cursor:pointer;
        }

        .print-value {
          display:none;
        }

        .manual-hint{
          margin-top:6px;
          font-size:11px;
          color:#006b34;
          font-weight:800;
        }



        .rascunho-status {
          width: 202mm;
          max-width: calc(100vw - 32px);
          margin: 0 auto 10px auto;
          padding: 9px 12px;
          border-radius: 12px;
          background: #ecfdf5;
          color: #166534;
          border: 1px solid rgba(0,176,80,.25);
          font-size: 12px;
          font-weight: 900;
        }

        @media print {
          /* FORCA linhas de servico compactas na impressao (vence input height:35px global) */
          .obs tr.servico-row td,
          tr.servico-row td {
            height: 6mm !important;
            max-height: 6mm !important;
            padding: 0 4px !important;
            line-height: 1 !important;
            vertical-align: middle !important;
          }
          .obs tr.servico-row input,
          tr.servico-row input {
            height: 5mm !important;
            max-height: 5mm !important;
            min-height: 0 !important;
            padding: 0 3px !important;
            line-height: 1 !important;
            font-size: 9.5px !important;
            border: 1px solid #ccc !important;
            box-sizing: border-box !important;
            -webkit-appearance: none !important;
            appearance: none !important;
          }
          .rascunho-status {
            display: none !important;
          }
          .ytalseg-pdf-viewer-overlay {
            display: none !important;
          }
          /* Remove a barra de ferramentas (faixa cinza) na impressão */
          .screen-toolbar,
          .toolbar-grid,
          .action-group {
            display: none !important;
          }
          
          /* Evita quebras de página desnecessárias */
          .sheet {
            page-break-after: avoid !important;
            page-break-inside: avoid !important;
          }
          
          body {
            page-break-after: avoid !important;
          }
          
          /* Remove margin/padding excessivo na impressão */
          * {
            margin-top: 0 !important;
            margin-bottom: 0 !important;
            page-break-inside: avoid !important;
          }
        }

        .screen-toolbar{
          width:202mm;
          max-width: calc(100vw - 32px);
          margin:0 auto 14px auto;
        }

        /* PREVIEW A4: força a tela de edição a usar a mesma proporção da impressão */
        .preview-mode{
          padding:18px;
          background:#e5e7eb;
          display:flex;
          flex-direction:column;
          align-items:center;
        }

        .preview-mode .sheet{
          width:202mm;
          min-height:289mm;
          height:auto;
          padding:5mm;
          margin:0 auto;
          box-shadow:0 12px 35px rgba(0,0,0,.16);
          border-radius:0;
          max-width:none;
          overflow:hidden;
          background:rgba(255,255,255,.92) !important;
        }

        .preview-mode .top{
          grid-template-columns:1fr 1fr 55px;
          gap:8px;
          margin-bottom:6px;
        }

        .preview-mode .brand{font-size:30px; letter-spacing:-1px;}
        .preview-mode .brand-sub{font-size:7px; margin-top:3px;}
        .preview-mode .title{font-size:24px; padding-left:10px;}
        .preview-mode .seal{width:52px; height:52px; border:none;}
        .preview-mode .logo-topo{width:52px; height:52px;}

        .preview-mode .info{margin-bottom:7px; background-color:rgba(255,255,255,.65) !important;}
        .preview-mode .info div{padding:5px;}
        .preview-mode .label{font-size:7px;}
        .preview-mode .value{font-size:9px; margin-top:2px;}

        .preview-mode .grid{grid-template-columns:1.85fr 1fr; gap:7px;}
        .preview-mode table{font-size:6.6px; background-color:transparent !important;}
        .preview-mode tbody,
        .preview-mode tr,
        .preview-mode td{background-color:rgba(255,255,255,.42) !important;}
        .preview-mode th,
        .preview-mode .panel-title,
        .preview-mode .total-row td{background-color:#00B050 !important; color:white !important;}
        .preview-mode th,
        .preview-mode td{padding:2.35px;}

        .preview-mode .panel table,
        .preview-mode .panel tbody,
        .preview-mode .panel tr,
        .preview-mode .panel td{background-color:rgba(255,255,255,.28) !important;}
        .preview-mode .panel-title{background-color:rgba(0,176,80,.90) !important;}
        .preview-mode .panel,
        .preview-mode .obs,
        .preview-mode .ytalseg-card-final,
        .preview-mode .nota-final{background-color:rgba(255,255,255,.20) !important;}
        .preview-mode .panel{margin-bottom:5px;}
        .preview-mode .panel-title{font-size:9px; padding:4px;}

        .preview-mode .obs{margin-top:4px; padding:4px;}
        .preview-mode .obs h3{font-size:9px; margin-bottom:1px;}
        .preview-mode .obs p{font-size:7px; margin:1px 0 2px;}
        .preview-mode .obs input{border:none; padding:0 1px; font-size:7px; line-height:1.05; background:transparent !important;}
        .preview-mode .obs table{border-collapse:collapse; table-layout:fixed; width:100%;}
        .preview-mode .obs th, .preview-mode .obs td{padding:0 2px !important; height:9px !important; line-height:1 !important; font-size:6.5px !important; vertical-align:middle !important;}
        .preview-mode .obs input{height:9px !important; line-height:1 !important;}
        .preview-mode .obs th:nth-child(1), .preview-mode .obs td:nth-child(1){width:52px !important;}
        .preview-mode .obs th:nth-child(3), .preview-mode .obs td:nth-child(3){width:58px !important;}
        .preview-mode .obs th:last-child,
        .preview-mode .obs td:last-child{display:none;}

        .preview-mode .footer-final{margin-top:6px; grid-template-columns:1.05fr 1fr; gap:7px;}
        .preview-mode .ytalseg-card-final{min-height:95px; grid-template-columns:105px 1fr; border-radius:15px;}
        .preview-mode .logo-area-final{border-top-right-radius:45px; border-bottom-right-radius:45px;}
        .preview-mode .logo-circle-final{width:88px; height:88px; border-width:5px; font-size:9px;}
        .preview-mode .logo-card{width:88px; height:88px;}
        .preview-mode .info-area-final{padding:6px 10px; border-right-width:5px; border-top-right-radius:45px; border-bottom-right-radius:45px;}
        .preview-mode .info-area-final h2{font-size:16px;}
        .preview-mode .info-area-final p{font-size:7px; margin:1px 0;}
        .preview-mode .info-area-final strong{margin-top:3px; font-size:7px;}
        .preview-mode .rep-line{grid-template-columns:55px 1fr; font-size:7px; margin-top:1px;}
        .preview-mode .email-line{margin-top:2px; font-size:7px;}

        .preview-mode .nota-final{min-height:95px; padding:8px; border-radius:12px; grid-template-columns:55px 1fr;}
        .preview-mode .nota-icon{font-size:32px;}
        .preview-mode .nota-final span{font-size:13px;}
        .preview-mode .nota-final strong{font-size:42px;}

        .preview-mode .watermark{
          position:absolute !important;
          top:53% !important;
          left:50% !important;
          transform:translate(-50%,-50%) !important;
          width:980px !important;
          height:980px !important;
          z-index:9 !important;
        }
        .preview-mode .logo-watermark{width:100% !important; height:100% !important; object-fit:contain !important; opacity:.115 !important;}


        /* V10.13.4 VISUAL - recuperação sem mexer em cálculo */
        .screen-toolbar{
          position: sticky;
          top: 0;
          z-index: 50;
          background: #e5e7eb;
          padding-top: 8px;
          padding-bottom: 8px;
        }

        .preview-mode{
          min-height: 100vh;
          overflow: auto;
          align-items: center !important;
        }

        .preview-mode .sheet{
          transition: transform .15s ease;
        }

        .preview-mode .logo-topo{
          width: 72px !important;
          height: 72px !important;
        }

        .preview-mode .seal{
          width: 72px !important;
          height: 72px !important;
        }

        .preview-mode .logo-circle-final{
          width: 112px !important;
          height: 112px !important;
        }

        .preview-mode .logo-card{
          width: 112px !important;
          height: 112px !important;
        }

        .preview-mode .ytalseg-card-final{
          min-height: 112px !important;
          grid-template-columns: 125px 1fr !important;
        }

        .preview-mode .nota-final{
          min-height: 112px !important;
          grid-template-columns: 1fr !important;
          text-align: center !important;
          justify-content: center !important;
        }

        .preview-mode .nota-icon{
          display: none !important;
        }

        .preview-mode .nota-final strong{
          font-size: 44px !important;
          white-space: nowrap !important;
        }


        /* V10.13.4 AJUSTE LOGO + ZOOM */
        .preview-mode .top{
          grid-template-columns:1fr 1.15fr !important;
          gap:12px !important;
          margin-bottom:8px !important;
        }

        .preview-mode .brand{
          font-size:38px !important;
          letter-spacing:-1px !important;
        }

        .preview-mode .brand-sub{
          font-size:9px !important;
          margin-top:4px !important;
          max-width:280px !important;
        }

        .preview-mode .title{
          font-size:32px !important;
          padding-left:14px !important;
        }

        .preview-mode .seal,
        .preview-mode .logo-topo{
          display:none !important;
        }

        .preview-mode .ytalseg-card-final{
          min-height:126px !important;
          grid-template-columns:155px 1fr !important;
        }

        .preview-mode .logo-circle-final{
          width:140px !important;
          height:140px !important;
        }

        .preview-mode .logo-card{
          width:140px !important;
          height:140px !important;
        }

        .preview-mode .nota-final{
          grid-template-columns:1fr !important;
          text-align:center !important;
        }

        .preview-mode .nota-icon{
          display:none !important;
        }


        /* V10.13.5 FINAL LIMPO - cabeçalho sem logo pequena */
        .seal,
        .logo-topo {
          display: none !important;
        }

        .top {
          grid-template-columns: 1fr 1.15fr !important;
          gap: 14px !important;
        }

        .brand {
          font-size: 40px !important;
          letter-spacing: -1px !important;
        }

        .brand-sub {
          font-size: 10px !important;
          max-width: 320px !important;
        }

        .title {
          font-size: 34px !important;
          padding-left: 16px !important;
        }

        .preview-mode .top {
          grid-template-columns: 1fr 1.15fr !important;
          gap: 12px !important;
        }

        .preview-mode .brand {
          font-size: 38px !important;
        }

        .preview-mode .brand-sub {
          font-size: 9px !important;
          max-width: 300px !important;
        }

        .preview-mode .title {
          font-size: 32px !important;
          padding-left: 14px !important;
        }

        .nota-icon {
          display: none !important;
        }

        .nota-final {
          grid-template-columns: 1fr !important;
          text-align: center !important;
          justify-content: center !important;
        }

        .preview-mode .nota-final {
          grid-template-columns: 1fr !important;
          text-align: center !important;
          justify-content: center !important;
        }

        .preview-mode .nota-final strong {
          white-space: nowrap !important;
        }

        .preview-mode .logo-circle-final {
          width: 150px !important;
          height: 150px !important;
        }

        .preview-mode .logo-card {
          width: 150px !important;
          height: 150px !important;
        }

        .preview-mode .ytalseg-card-final {
          grid-template-columns: 165px 1fr !important;
        }


        /* V10.13.6 AJUSTE FINAL VISUAL - aplicado sem mexer em cálculo */
        .seal,
        .logo-topo {
          display: none !important;
        }

        .top {
          grid-template-columns: 1fr 1.2fr !important;
          gap: 14px !important;
        }

        .brand {
          font-size: 40px !important;
          letter-spacing: -1px !important;
        }

        .brand-sub {
          font-size: 10px !important;
          max-width: 330px !important;
          line-height: 1.25 !important;
        }

        .title {
          font-size: 34px !important;
          padding-left: 16px !important;
        }

        .ytalseg-card-final {
          grid-template-columns: 180px 1fr !important;
          min-height: 142px !important;
        }

        .logo-area-final {
          padding: 8px 10px !important;
        }

        .logo-circle-final,
        .logo-card {
          width: 160px !important;
          height: 160px !important;
        }

        .info-area-final {
          padding: 16px 20px !important;
          line-height: 1.35 !important;
        }

        .info-area-final h2 {
          margin-bottom: 6px !important;
        }

        .info-area-final p {
          margin: 3px 0 5px !important;
          line-height: 1.35 !important;
        }

        .info-area-final strong {
          display: block !important;
          margin-top: 6px !important;
          margin-bottom: 6px !important;
          line-height: 1.25 !important;
        }

        .rep-line {
          line-height: 1.35 !important;
          margin-top: 3px !important;
        }

        .email-line {
          margin-top: 7px !important;
          line-height: 1.3 !important;
        }

        .nota-icon {
          display: none !important;
        }

        .nota-final {
          display: flex !important;
          flex-direction: column !important;
          justify-content: center !important;
          align-items: center !important;
          text-align: center !important;
          grid-template-columns: 1fr !important;
          padding: 22px !important;
        }

        .nota-final strong {
          font-size: 46px !important;
          white-space: nowrap !important;
        }

        .preview-mode .ytalseg-card-final {
          grid-template-columns: 180px 1fr !important;
          min-height: 142px !important;
        }

        .preview-mode .logo-circle-final,
        .preview-mode .logo-card {
          width: 160px !important;
          height: 160px !important;
        }

        .preview-mode .info-area-final {
          padding: 16px 20px !important;
          line-height: 1.35 !important;
        }

        .preview-mode .info-area-final p,
        .preview-mode .rep-line,
        .preview-mode .email-line {
          line-height: 1.35 !important;
        }


        /* V10.13.7 CARD FINAL IGUAL + RESUMO CONDICIONAL */
        .footer-final {
          align-items: stretch !important;
        }

        .ytalseg-card-final {
          grid-template-columns: 185px 1fr !important;
          min-height: 150px !important;
          border-radius: 22px !important;
        }

        .logo-area-final {
          padding: 10px 14px !important;
        }

        .logo-circle-final,
        .logo-card {
          width: 165px !important;
          height: 165px !important;
        }

        .info-area-final {
          padding: 16px 20px !important;
          line-height: 1.38 !important;
        }

        .info-area-final h2 {
          font-size: 28px !important;
          margin: 0 0 6px !important;
          line-height: 1.05 !important;
        }

        .info-area-final p {
          font-size: 13px !important;
          margin: 2px 0 5px !important;
          line-height: 1.32 !important;
        }

        .info-area-final strong {
          display: block !important;
          font-size: 13px !important;
          margin: 7px 0 6px !important;
          line-height: 1.25 !important;
        }

        .rep-line {
          grid-template-columns: 88px 1fr !important;
          font-size: 13px !important;
          margin-top: 3px !important;
          line-height: 1.35 !important;
        }

        .email-line {
          font-size: 13px !important;
          margin-top: 7px !important;
          line-height: 1.3 !important;
        }

        .preview-mode .ytalseg-card-final {
          grid-template-columns: 150px 1fr !important;
          min-height: 118px !important;
        }

        .preview-mode .logo-circle-final,
        .preview-mode .logo-card {
          width: 132px !important;
          height: 132px !important;
        }

        .preview-mode .info-area-final {
          padding: 10px 14px !important;
          line-height: 1.34 !important;
        }

        .preview-mode .info-area-final h2 {
          font-size: 20px !important;
          margin-bottom: 4px !important;
        }

        .preview-mode .info-area-final p,
        .preview-mode .rep-line,
        .preview-mode .email-line {
          font-size: 8.5px !important;
          line-height: 1.32 !important;
        }

        .preview-mode .rep-line {
          grid-template-columns: 62px 1fr !important;
        }

        .preview-mode .info-area-final strong {
          font-size: 8.5px !important;
          margin: 4px 0 3px !important;
        }

        .nota-final {
          min-height: 150px !important;
        }

        .preview-mode .nota-final {
          min-height: 118px !important;
        }


        /* V10.13.8 VALOR DA NOTA RESPONSIVO */
        .footer-final {
          grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) !important;
        }

        .ytalseg-card-final,
        .nota-final {
          min-width: 0 !important;
          overflow: hidden !important;
        }

        .nota-final {
          box-sizing: border-box !important;
          padding: 18px 14px !important;
          max-width: 100% !important;
        }

        .nota-final span {
          white-space: nowrap !important;
        }

        .nota-final .valor-nota {
          display: block !important;
          max-width: 100% !important;
          width: 100% !important;
          box-sizing: border-box !important;
          overflow: hidden !important;
          white-space: nowrap !important;
          text-align: center !important;
          line-height: 1 !important;
          font-size: clamp(24px, 5vw, 46px) !important;
          letter-spacing: -1px !important;
        }

        .nota-final .valor-nota-m {
          font-size: clamp(23px, 4.5vw, 40px) !important;
        }

        .nota-final .valor-nota-g {
          font-size: clamp(21px, 4vw, 34px) !important;
          letter-spacing: -1.3px !important;
        }

        .nota-final .valor-nota-gg {
          font-size: clamp(19px, 3.5vw, 30px) !important;
          letter-spacing: -1.6px !important;
        }

        .preview-mode .nota-final {
          padding: 12px 10px !important;
        }

        .preview-mode .nota-final .valor-nota {
          font-size: clamp(22px, 4.5vw, 42px) !important;
        }

        .preview-mode .nota-final .valor-nota-m {
          font-size: clamp(20px, 4vw, 36px) !important;
        }

        .preview-mode .nota-final .valor-nota-g {
          font-size: clamp(18px, 3.5vw, 31px) !important;
        }

        .preview-mode .nota-final .valor-nota-gg {
          font-size: clamp(16px, 3vw, 27px) !important;
        }


        /* V10.13.9 CARD HARMÔNICO - logo maior + menos área branca */
        .footer-final {
          grid-template-columns: minmax(0, 1.05fr) minmax(0, .95fr) !important;
          gap: 14px !important;
        }

        .ytalseg-card-final {
          grid-template-columns: 245px 1fr !important;
          min-height: 180px !important;
          border-radius: 24px !important;
          overflow: hidden !important;
        }

        .logo-area-final {
          padding: 10px 18px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
        }

        .logo-circle-final,
        .logo-card {
          width: 220px !important;
          height: 220px !important;
          max-width: 100% !important;
          max-height: 100% !important;
          object-fit: contain !important;
        }

        .info-area-final {
          padding: 18px 22px !important;
          line-height: 1.34 !important;
          display: flex !important;
          flex-direction: column !important;
          justify-content: center !important;
        }

        .info-area-final h2 {
          font-size: 30px !important;
          margin: 0 0 8px !important;
          line-height: 1 !important;
        }

        .info-area-final p {
          font-size: 13px !important;
          margin: 2px 0 5px !important;
          line-height: 1.28 !important;
        }

        .info-area-final strong {
          font-size: 13px !important;
          margin: 7px 0 5px !important;
        }

        .rep-line {
          grid-template-columns: 92px 1fr !important;
          font-size: 13px !important;
          line-height: 1.28 !important;
          margin-top: 2px !important;
        }

        .email-line {
          font-size: 13px !important;
          margin-top: 6px !important;
          line-height: 1.25 !important;
        }

        .nota-final {
          min-height: 180px !important;
          padding: 18px 14px !important;
        }

        .preview-mode .footer-final {
          grid-template-columns: minmax(0, 1.05fr) minmax(0, .95fr) !important;
          gap: 8px !important;
        }

        .preview-mode .ytalseg-card-final {
          grid-template-columns: 145px 1fr !important;
          min-height: 118px !important;
          border-radius: 16px !important;
        }

        .preview-mode .logo-area-final {
          padding: 6px 10px !important;
        }

        .preview-mode .logo-circle-final,
        .preview-mode .logo-card {
          width: 132px !important;
          height: 132px !important;
        }

        .preview-mode .info-area-final {
          padding: 8px 12px !important;
          line-height: 1.24 !important;
        }

        .preview-mode .info-area-final h2 {
          font-size: 19px !important;
          margin-bottom: 4px !important;
        }

        .preview-mode .info-area-final p,
        .preview-mode .rep-line,
        .preview-mode .email-line,
        .preview-mode .info-area-final strong {
          font-size: 7.6px !important;
          line-height: 1.22 !important;
        }

        .preview-mode .rep-line {
          grid-template-columns: 56px 1fr !important;
          margin-top: 1px !important;
        }

        .preview-mode .email-line {
          margin-top: 3px !important;
        }

        .preview-mode .nota-final {
          min-height: 118px !important;
        }

       @page {
  size: A4 portrait;
  margin: 4mm;
}

@media print {

  /* V10.13.9 CARD HARMÔNICO PRINT */
  .footer-final,
  body.modo-cliente .footer-final,
  body.modo-interno .footer-final {
    grid-template-columns: minmax(0, 1.05fr) minmax(0, .95fr) !important;
    gap: 7px !important;
  }

  .ytalseg-card-final,
  body.modo-cliente .ytalseg-card-final,
  body.modo-interno .ytalseg-card-final {
    grid-template-columns: 39mm 1fr !important;
    min-height: 34mm !important;
    border-radius: 16px !important;
  }

  .logo-area-final,
  body.modo-cliente .logo-area-final,
  body.modo-interno .logo-area-final {
    padding: 3mm !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
  }

  .logo-circle-final,
  .logo-card,
  body.modo-cliente .logo-circle-final,
  body.modo-cliente .logo-card,
  body.modo-interno .logo-circle-final,
  body.modo-interno .logo-card {
    width: 35mm !important;
    height: 35mm !important;
    object-fit: contain !important;
  }

  .info-area-final,
  body.modo-cliente .info-area-final,
  body.modo-interno .info-area-final {
    padding: 5px 8px !important;
    line-height: 1.24 !important;
    display: flex !important;
    flex-direction: column !important;
    justify-content: center !important;
  }

  .info-area-final h2,
  body.modo-cliente .info-area-final h2,
  body.modo-interno .info-area-final h2 {
    font-size: 15px !important;
    margin: 0 0 2px !important;
  }

  .info-area-final p,
  .rep-line,
  .email-line,
  .info-area-final strong,
  body.modo-cliente .info-area-final p,
  body.modo-cliente .rep-line,
  body.modo-cliente .email-line,
  body.modo-cliente .info-area-final strong,
  body.modo-interno .info-area-final p,
  body.modo-interno .rep-line,
  body.modo-interno .email-line,
  body.modo-interno .info-area-final strong {
    font-size: 6.8px !important;
    line-height: 1.18 !important;
    margin-top: 1px !important;
  }

  .rep-line,
  body.modo-cliente .rep-line,
  body.modo-interno .rep-line {
    grid-template-columns: 47px 1fr !important;
  }

  .nota-final,
  body.modo-cliente .nota-final,
  body.modo-interno .nota-final {
    min-height: 34mm !important;
  }

  /* V10.13.8 VALOR DA NOTA RESPONSIVO PRINT */
  .footer-final {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) !important;
  }

  .ytalseg-card-final,
  .nota-final {
    min-width: 0 !important;
    overflow: hidden !important;
  }

  .nota-final {
    padding: 6px 5px !important;
    max-width: 100% !important;
  }

  .nota-final span {
    white-space: nowrap !important;
  }

  .nota-final .valor-nota {
    display: block !important;
    max-width: 100% !important;
    width: 100% !important;
    overflow: hidden !important;
    white-space: nowrap !important;
    text-align: center !important;
    line-height: 1 !important;
    font-size: 32px !important;
    letter-spacing: -1px !important;
  }

  .nota-final .valor-nota-m {
    font-size: 28px !important;
  }

  .nota-final .valor-nota-g {
    font-size: 24px !important;
    letter-spacing: -1.3px !important;
  }

  .nota-final .valor-nota-gg {
    font-size: 21px !important;
    letter-spacing: -1.6px !important;
  }

  body.modo-cliente .nota-final .valor-nota {
    font-size: 40px !important;
  }

  body.modo-cliente .nota-final .valor-nota-m {
    font-size: 35px !important;
  }

  body.modo-cliente .nota-final .valor-nota-g {
    font-size: 30px !important;
  }

  body.modo-cliente .nota-final .valor-nota-gg {
    font-size: 26px !important;
  }

  body.modo-cliente .obs {
    break-inside: avoid !important;
  }

  /* V10.13.7 CARD FINAL IGUAL PRINT */
  .ytalseg-card-final,
  body.modo-cliente .ytalseg-card-final,
  body.modo-interno .ytalseg-card-final {
    grid-template-columns: 34mm 1fr !important;
    min-height: 31mm !important;
    border-radius: 16px !important;
  }

  .logo-circle-final,
  .logo-card,
  body.modo-cliente .logo-circle-final,
  body.modo-cliente .logo-card,
  body.modo-interno .logo-circle-final,
  body.modo-interno .logo-card {
    width: 31mm !important;
    height: 31mm !important;
  }

  .info-area-final,
  body.modo-cliente .info-area-final,
  body.modo-interno .info-area-final {
    padding: 6px 9px !important;
    line-height: 1.3 !important;
  }

  .info-area-final h2,
  body.modo-cliente .info-area-final h2,
  body.modo-interno .info-area-final h2 {
    font-size: 16px !important;
    margin: 0 0 2px !important;
  }

  .info-area-final p,
  .rep-line,
  .email-line,
  body.modo-cliente .info-area-final p,
  body.modo-cliente .rep-line,
  body.modo-cliente .email-line,
  body.modo-interno .info-area-final p,
  body.modo-interno .rep-line,
  body.modo-interno .email-line {
    font-size: 7.2px !important;
    line-height: 1.28 !important;
    margin-top: 1px !important;
  }

  .info-area-final strong,
  body.modo-cliente .info-area-final strong,
  body.modo-interno .info-area-final strong {
    font-size: 7.2px !important;
    margin: 2px 0 2px !important;
  }

  .rep-line,
  body.modo-cliente .rep-line,
  body.modo-interno .rep-line {
    grid-template-columns: 50px 1fr !important;
  }

  .email-line,
  body.modo-cliente .email-line,
  body.modo-interno .email-line {
    margin-top: 2px !important;
  }

  .nota-final,
  body.modo-cliente .nota-final,
  body.modo-interno .nota-final {
    min-height: 31mm !important;
  }

  /* V10.13.6 AJUSTE FINAL VISUAL PRINT */
  .sheet {
    transform: none !important;
    margin-bottom: 0 !important;
  }

  .seal,
  .logo-topo {
    display: none !important;
  }

  .top {
    grid-template-columns: 1fr 1.2fr !important;
    gap: 10px !important;
  }

  .brand {
    font-size: 38px !important;
  }

  .brand-sub {
    font-size: 8.5px !important;
    max-width: 310px !important;
    line-height: 1.25 !important;
  }

  .title {
    font-size: 32px !important;
    padding-left: 14px !important;
  }

  .ytalseg-card-final {
    grid-template-columns: 38mm 1fr !important;
    min-height: 34mm !important;
  }

  .logo-circle-final,
  .logo-card {
    width: 36mm !important;
    height: 36mm !important;
  }

  .info-area-final {
    padding: 7px 11px !important;
    line-height: 1.35 !important;
  }

  .info-area-final h2 {
    margin-bottom: 3px !important;
  }

  .info-area-final p {
    margin: 1.5px 0 3px !important;
    line-height: 1.32 !important;
  }

  .info-area-final strong {
    display: block !important;
    margin-top: 3px !important;
    margin-bottom: 3px !important;
  }

  .rep-line {
    line-height: 1.32 !important;
    margin-top: 1.5px !important;
  }

  .email-line {
    margin-top: 3px !important;
    line-height: 1.3 !important;
  }

  .nota-icon {
    display: none !important;
  }

  .nota-final {
    display: flex !important;
    flex-direction: column !important;
    justify-content: center !important;
    align-items: center !important;
    text-align: center !important;
    grid-template-columns: 1fr !important;
    padding: 8px !important;
  }

  .nota-final strong {
    white-space: nowrap !important;
  }

  body.modo-cliente .ytalseg-card-final {
    grid-template-columns: 40mm 1fr !important;
    min-height: 35mm !important;
  }

  body.modo-cliente .logo-circle-final,
  body.modo-cliente .logo-card {
    width: 38mm !important;
    height: 38mm !important;
  }

  /* V10.13.5 FINAL LIMPO PRINT */
  .seal,
  .logo-topo {
    display: none !important;
  }

  .top {
    grid-template-columns: 1fr 1.15fr !important;
    gap: 10px !important;
  }

  .brand {
    font-size: 38px !important;
  }

  .brand-sub {
    font-size: 8.5px !important;
    max-width: 300px !important;
  }

  .title {
    font-size: 32px !important;
    padding-left: 14px !important;
  }

  .nota-icon {
    display: none !important;
  }

  .nota-final {
    grid-template-columns: 1fr !important;
    text-align: center !important;
    justify-content: center !important;
  }

  body.modo-cliente .brand {
    font-size: 42px !important;
  }

  body.modo-cliente .title {
    font-size: 34px !important;
  }

  body.modo-cliente .logo-circle-final,
  body.modo-cliente .logo-card {
    width: 38mm !important;
    height: 38mm !important;
  }

  /* V10.13.4 AJUSTE LOGO + ZOOM PRINT */
  .top{
    grid-template-columns:1fr 1.15fr !important;
    gap:10px !important;
    margin-bottom:7px !important;
  }

  .brand{
    font-size:36px !important;
  }

  .brand-sub{
    font-size:8px !important;
    max-width:280px !important;
  }

  .title{
    font-size:30px !important;
    padding-left:12px !important;
  }

  .seal,
  .logo-topo{
    display:none !important;
  }

  .nota-icon{
    display:none !important;
  }

  .nota-final{
    grid-template-columns:1fr !important;
    text-align:center !important;
  }

  body.modo-cliente .brand{
    font-size:42px !important;
  }

  body.modo-cliente .brand-sub{
    font-size:9px !important;
    max-width:290px !important;
  }

  body.modo-cliente .title{
    font-size:34px !important;
  }

  body.modo-cliente .ytalseg-card-final{
    min-height:34mm !important;
    grid-template-columns:40mm 1fr !important;
  }

  body.modo-cliente .logo-circle-final,
  body.modo-cliente .logo-card{
    width:38mm !important;
    height:38mm !important;
  }

  .sheet {
    transform: none !important;
    margin-bottom: 0 !important;
  }

  .nota-icon {
    display: none !important;
  }

  .nota-final {
    grid-template-columns: 1fr !important;
    text-align: center !important;
    justify-content: center !important;
  }
  html, body {
    width: 210mm;
    height: 297mm;
    background: white;
    overflow: hidden;
  }

  body {
    margin: 0;
  }

  .page {
    padding: 0;
    background: white;
  }

  .sheet {
    width: 202mm;
    min-height: 289mm;
    height: auto;
    padding: 5mm;
    margin: 0 auto;
    box-shadow: none;
    border-radius: 0;
    max-width: none;
    overflow: hidden;
    background: rgba(255, 255, 255, 0.92) !important;
  }

  .upload,
  .actions,
  .btn-red,
  button {
    display: none !important;
  }

  .checkbox-small {
    display: none !important;
  }

  .print-value {
    display: inline !important;
  }

  .checkbox-small {
    display:none !important;
  }

  .print-value {
    display:inline !important;
  }

  .manual-hint {
    display:none !important;
  }


  .top {
    grid-template-columns: 1fr 1fr 55px;
    gap: 8px;
    margin-bottom: 6px;
  }

  .brand {
    font-size: 30px;
    letter-spacing: -1px;
  }

  .brand-sub {
    font-size: 7px;
    margin-top: 3px;
  }

  .title {
    font-size: 24px;
    padding-left: 10px;
  }

 .seal {
  width:52px;
  height:52px;
  border:none;
}

  .info {
    margin-bottom: 7px;
    background-color: rgba(255, 255, 255, 0.65) !important;
  }

  .info div {
    padding: 5px;
  }

  .label {
    font-size: 7px;
  }

  .value {
    font-size: 9px;
    margin-top: 2px;
  }

  .grid {
    grid-template-columns: 1.85fr 1fr;
    gap: 7px;
  }

  table {
    font-size: 6.6px;
    background-color: transparent !important;
  }

  tbody,
  tr,
  td {
    background-color: rgba(255, 255, 255, 0.42) !important;
  }

  th {
    background-color: rgba(255,255,255,.45) !important;
    color: #555 !important;
  }

  .panel-title {
    background-color: rgba(255,255,255,.45) !important;
    color: #00853d !important;
  }

  .total-row td {
    background-color: #00B050 !important;
    color: white !important;
  }

  th,
  td {
    padding: 2.35px;
  }

  .panel table,
  .panel tbody,
  .panel tr,
  .panel td {
    background-color: rgba(255,255,255,.18) !important;
  }

  .panel-title {
    background-color: rgba(0,176,80,.90) !important;
  }

  .panel,
  .obs,
  .ytalseg-card-final,
  .nota-final {
    background-color: rgba(255,255,255,.20) !important;
  }

  .panel {
    margin-bottom: 5px;
  }

  .panel-title {
    font-size: 9px;
    padding: 4px;
  }

  .obs {
    margin-top: 4px;
    padding: 4px;
  }

  .obs h3 {
    font-size: 9px;
    margin-bottom: 1px;
  }

  .obs p {
    font-size: 7px;
    margin: 1px 0 2px;
  }

  .obs input {
    border: none;
    padding: 0 1px;
    font-size: 7px;
    line-height: 1.05;
    background: transparent !important;
  }

  /* Compacta as linhas da tabela de serviços (cabe até 6 linhas na A4) */
  .obs table {
    border-collapse: collapse;
    table-layout: fixed;
    width: 100%;
  }
  .obs th,
  .obs td {
    padding: 0 2px !important;
    height: 9px !important;
    line-height: 1 !important;
    font-size: 6.5px !important;
    vertical-align: middle !important;
  }
  .obs input {
    height: 9px !important;
    line-height: 1 !important;
  }
  /* Data e Valor bem estreitas; Descrição fica com todo o resto */
  .obs th:nth-child(1),
  .obs td:nth-child(1) { width: 30mm !important; }
  .obs th:nth-child(2),
  .obs td:nth-child(2) { width: auto !important; }
  .obs th:nth-child(3),
  .obs td:nth-child(3) { width: 30mm !important; }

  .obs th:last-child,
  .obs td:last-child {
    display: none;
  }

  .footer-final {
    margin-top: 6px;
    grid-template-columns: 1.05fr 1fr;
    gap: 7px;
  }

  .ytalseg-card-final {
    min-height: 70px;
    grid-template-columns: 82px 1fr;
    border-radius: 15px;
  }

  .logo-area-final {
    border-top-right-radius: 45px;
    border-bottom-right-radius: 45px;
  }

  .logo-area-final{
  background:white !important;
  border-top-right-radius:0 !important;
  border-bottom-right-radius:0 !important;
}

.logo-circle-final{
  width:142px !important;
  height:142px !important;
  background:transparent !important;
  padding:0 !important;
}

.logo-card{
  width:142px !important;
  height:142px !important;
}


  .info-area-final h2 {
    font-size: 13px;
  }

  .info-area-final p {
    font-size: 7px;
    margin: 1px 0;
  }

  .info-area-final strong {
    margin-top: 3px;
    font-size: 7px;
  }

  .rep-line {
    grid-template-columns: 55px 1fr;
    font-size: 7px;
    margin-top: 1px;
  }

  .email-line {
    margin-top: 2px;
    font-size: 7px;
  }

  .nota-final {
    min-height: 70px;
    padding: 8px;
    border-radius: 12px;
    grid-template-columns: 55px 1fr;
  }

  .nota-icon {
    font-size: 32px;
  }

  .nota-final span {
    font-size: 13px;
  }

  .nota-final strong {
    font-size: 31px;
  }


 .watermark{
  position:absolute !important;
  top:53% !important;
  left:50% !important;
  transform:translate(-50%,-50%) !important;
  width:980px !important;
  height:980px !important;
  z-index:9 !important;
}

.logo-watermark{
  width:100% !important;
  height:100% !important;
  object-fit:contain !important;
  opacity:.115 !important;
}

  .content {
  z-index: 1 !important;
}

  body.modo-cliente .grid {
    display: block;
  }

  body.modo-cliente .grid > .panel:first-child {
    display: none !important;
  }

  body.modo-cliente .obs {
    margin-top: 10px;
  }

  body.modo-cliente .footer-final {
    margin-top: 14px;
  }

  body.modo-cliente .ytalseg-card-final {
    min-height: 95px;
    grid-template-columns: 95px 1fr;
  }

  body.modo-cliente .logo-circle-final {
    width: 112px;
    height: 112px;
  }

  body.modo-cliente .nota-final {
    min-height: 105px;
  }

  body.modo-cliente .nota-final strong {
    font-size: 42px;
  }

  body.modo-cliente .watermark {
  top: 52% !important;
  left: 50% !important;
  transform: translate(-50%,-50%) !important;
  width: 980px !important;
  height: 980px !important;
  z-index: 9 !important;
}

body.modo-cliente .logo-watermark {
  opacity: 0.115 !important;
}

  body.modo-interno .grid > .panel:first-child {
    display: block;
  }

  /* ================================ */
  /* PDF CLIENTE PREMIUM - A4 EXECUTIVO */
  /* ================================ */

  body.modo-cliente .tabela-valores {
    display: none !important;
  }

  body.modo-cliente .sheet {
    min-height: 289mm !important;
    height: 289mm !important;
    display: flex !important;
    flex-direction: column !important;
  }

  body.modo-cliente .content {
    min-height: 279mm !important;
    display: flex !important;
    flex-direction: column !important;
  }

  body.modo-cliente .top {
    margin-bottom: 9mm !important;
  }

  body.modo-cliente .brand {
    font-size: 36px !important;
  }

  body.modo-cliente .brand-sub {
    font-size: 8px !important;
  }

  body.modo-cliente .title {
    font-size: 29px !important;
  }

  body.modo-cliente .info {
    margin-bottom: 10mm !important;
  }

  body.modo-cliente .info div {
    padding: 7px !important;
  }

  body.modo-cliente .label {
    font-size: 8px !important;
  }

  body.modo-cliente .value {
    font-size: 11px !important;
  }

  body.modo-cliente .grid {
    display: block !important;
    margin-top: 2mm !important;
  }

  body.modo-cliente .grid > .panel:first-child {
    display: none !important;
  }

  body.modo-cliente .grid > div:last-child {
    width: 100% !important;
  }

  body.modo-cliente .grid > div:last-child .panel {
    width: 100% !important;
  }

  body.modo-cliente .grid > div:last-child .panel:not(.tabela-valores) {
    margin-top: 0 !important;
    margin-bottom: 10mm !important;
    border-radius: 12px !important;
  }

  body.modo-cliente .grid > div:last-child .panel:not(.tabela-valores) .panel-title {
    font-size: 13px !important;
    padding: 7px !important;
    letter-spacing: .4px !important;
  }

  body.modo-cliente .grid > div:last-child .panel:not(.tabela-valores) table {
    font-size: 11px !important;
  }

  body.modo-cliente .grid > div:last-child .panel:not(.tabela-valores) td {
    padding: 7px 8px !important;
    height: 9.5mm !important;
  }

  body.modo-cliente .grid > div:last-child .panel:not(.tabela-valores) tr.total-row td {
    font-size: 12px !important;
    height: 10.5mm !important;
  }

  body.modo-cliente .obs {
    margin-top: 0 !important;
    margin-bottom: auto !important;
    padding: 5px !important;
    min-height: 0 !important;
    border-radius: 12px !important;
  }

  body.modo-cliente .obs h3 {
    font-size: 11px !important;
  }

  body.modo-cliente .obs p {
    font-size: 8px !important;
    margin-bottom: 3px !important;
  }

  body.modo-cliente .obs table {
    font-size: 7px !important;
    table-layout: fixed !important;
    width: 100% !important;
  }

  body.modo-cliente .obs tr {
    height: 5mm !important;
    max-height: 5mm !important;
  }

  body.modo-cliente .obs th,
  body.modo-cliente .obs td {
    padding: 0.5mm 2mm !important;
    height: 5mm !important;
    max-height: 5mm !important;
    line-height: 1 !important;
    vertical-align: middle !important;
    box-sizing: border-box !important;
  }
  body.modo-cliente .obs input {
    height: 4mm !important;
    max-height: 4mm !important;
    min-height: 0 !important;
    padding: 0 1px !important;
    line-height: 1 !important;
    font-size: 7px !important;
    box-sizing: border-box !important;
  }
  body.modo-cliente .obs th:nth-child(1),
  body.modo-cliente .obs td:nth-child(1) { width: 30mm !important; }
  body.modo-cliente .obs th:nth-child(3),
  body.modo-cliente .obs td:nth-child(3) { width: 30mm !important; }

  body.modo-cliente .footer-final {
    margin-top: auto !important;
    padding-top: 8mm !important;
    grid-template-columns: 1fr 1.05fr !important;
    gap: 8px !important;
    align-items: stretch !important;
  }

  body.modo-cliente .ytalseg-card-final {
    min-height: 32mm !important;
    grid-template-columns: 34mm 1fr !important;
    border-radius: 16px !important;
  }

  body.modo-cliente .logo-circle-final {
    width: 31mm !important;
    height: 31mm !important;
  }

  body.modo-cliente .logo-card {
    width: 31mm !important;
    height: 31mm !important;
  }

  body.modo-cliente .info-area-final {
    padding: 7px 10px !important;
  }

  body.modo-cliente .info-area-final h2 {
    font-size: 17px !important;
  }

  body.modo-cliente .info-area-final p,
  body.modo-cliente .rep-line,
  body.modo-cliente .email-line {
    font-size: 7.5px !important;
  }

  body.modo-cliente .nota-final {
    min-height: 32mm !important;
    border-radius: 16px !important;
    grid-template-columns: 28mm 1fr !important;
  }

  body.modo-cliente .nota-icon {
    font-size: 34px !important;
  }

  body.modo-cliente .nota-final span {
    font-size: 15px !important;
  }

  body.modo-cliente .nota-final strong {
    font-size: 45px !important;
  }

  body.modo-cliente .watermark {
    top: 58% !important;
    width: 980px !important;
    height: 980px !important;
    opacity: 1 !important;
  }

  body.modo-cliente .logo-watermark {
    opacity: 0.105 !important;
  }

}
           

        /* V10.13.9.2 - SOMENTE LOGO DO CARD AJUSTADO
           Fica no FINAL do CSS para vencer os overrides anteriores. */
        .logo-area-final {
          overflow: hidden !important;
        }

        .logo-circle-final {
          width: 100% !important;
          height: 100% !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          transform: scale(1.0) !important;
          transform-origin: center center !important;
        }

        .logo-card {
          width: 100% !important;
          height: 100% !important;
          object-fit: contain !important;
          transform: scale(1.0) !important;
          transform-origin: center center !important;
        }

        .preview-mode .logo-circle-final,
        .preview-mode .logo-card {
          transform: scale(1.0) !important;
        }

        @media print {
          .logo-area-final {
            overflow: hidden !important;
          }

          .logo-circle-final,
          .logo-card,
          body.modo-cliente .logo-circle-final,
          body.modo-cliente .logo-card,
          body.modo-interno .logo-circle-final,
          body.modo-interno .logo-card {
            width: 100% !important;
            height: 100% !important;
            object-fit: contain !important;
            transform: scale(1.0) !important;
            transform-origin: center center !important;
          }
        }


        /* V10.13.11 A4 COMPACTO + RESUMO VISÍVEL NA TELA */
        .preview-mode .panel {
          margin-bottom: 4px !important;
        }

        .preview-mode .grid {
          gap: 5px !important;
        }

        .preview-mode .obs {
          margin-top: 4px !important;
        }

        @page {
          size: A4 portrait;
          margin: 2mm !important;
        }

        @media print {
          html, body {
            width: 210mm !important;
            height: 297mm !important;
            overflow: hidden !important;
          }

          .sheet {
            width: 206mm !important;
            min-height: 293mm !important;
            height: 293mm !important;
            padding: 3mm !important;
            margin: 0 auto !important;
            transform: none !important;
          }

          .top {
            margin-bottom: 4px !important;
          }

          .info {
            margin-bottom: 4px !important;
          }

          .grid {
            gap: 5px !important;
          }

          .panel {
            margin-bottom: 4px !important;
            border-radius: 8px !important;
          }

          .panel-title {
            padding: 3px !important;
            font-size: 8px !important;
          }

          th,
          td {
            padding: 1.55px 2.2px !important;
          }

          table {
            font-size: 5.9px !important;
          }

          .obs {
            margin-top: 4px !important;
            padding: 4px !important;
          }

          .obs h3 {
            font-size: 8px !important;
          }

          .obs p {
            font-size: 6.5px !important;
            margin: 1px 0 2px !important;
          }

          .obs th,
          .obs td {
            padding: 1px 3px !important;
            height: 4mm !important;
            line-height: 1 !important;
          }

          .footer-final {
            margin-top: 4px !important;
            gap: 5px !important;
          }

          .watermark {
            width: 900px !important;
            height: 900px !important;
          }
        }




        /* V73.1 DEFINITIVO - PRINCIPAL USA O MESMO PADRÃO VISUAL DO INTERNO/CLIENTE
           Regra aplicada só na tela principal de edição (.preview-mode sem modo-cliente/interno).
           Não altera o PDF cliente nem o PDF interno. */
        body:not(.modo-cliente):not(.modo-interno) .preview-mode .footer-final {
          margin-top: 8px !important;
          grid-template-columns: minmax(0, 1fr) minmax(0, 1.05fr) !important;
          gap: 8px !important;
          align-items: stretch !important;
        }

        body:not(.modo-cliente):not(.modo-interno) .preview-mode .ytalseg-card-final {
          display: grid !important;
          grid-template-columns: 128px minmax(0, 1fr) !important;
          min-height: 118px !important;
          height: 118px !important;
          border-radius: 16px !important;
          overflow: hidden !important;
        }

        body:not(.modo-cliente):not(.modo-interno) .preview-mode .logo-area-final {
          padding: 6px 8px !important;
          overflow: hidden !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          background: white !important;
        }

        body:not(.modo-cliente):not(.modo-interno) .preview-mode .logo-circle-final,
        body:not(.modo-cliente):not(.modo-interno) .preview-mode .logo-card {
          width: 106px !important;
          height: 106px !important;
          max-width: 106px !important;
          max-height: 106px !important;
          transform: none !important;
          object-fit: contain !important;
        }

        body:not(.modo-cliente):not(.modo-interno) .preview-mode .info-area-final {
          min-width: 0 !important;
          overflow: hidden !important;
          padding: 8px 9px !important;
          line-height: 1.22 !important;
          display: flex !important;
          flex-direction: column !important;
          justify-content: center !important;
          border-top-right-radius: 45px !important;
          border-bottom-right-radius: 45px !important;
        }

        body:not(.modo-cliente):not(.modo-interno) .preview-mode .info-area-final h2 {
          font-size: 18px !important;
          line-height: 1 !important;
          margin: 0 0 3px !important;
          white-space: nowrap !important;
        }

        body:not(.modo-cliente):not(.modo-interno) .preview-mode .info-area-final p,
        body:not(.modo-cliente):not(.modo-interno) .preview-mode .info-area-final strong,
        body:not(.modo-cliente):not(.modo-interno) .preview-mode .rep-line,
        body:not(.modo-cliente):not(.modo-interno) .preview-mode .email-line {
          font-size: 7.2px !important;
          line-height: 1.18 !important;
          margin-top: 1px !important;
          margin-bottom: 1px !important;
          white-space: nowrap !important;
          font-weight: 700 !important;
        }

        body:not(.modo-cliente):not(.modo-interno) .preview-mode .info-area-final strong {
          display: block !important;
          margin: 2px 0 2px !important;
        }

        body:not(.modo-cliente):not(.modo-interno) .preview-mode .rep-line {
          display: grid !important;
          grid-template-columns: 54px minmax(0, 1fr) !important;
          gap: 2px !important;
          align-items: center !important;
        }

        body:not(.modo-cliente):not(.modo-interno) .preview-mode .email-line {
          margin-top: 2px !important;
          overflow: hidden !important;
          text-overflow: clip !important;
        }

        body:not(.modo-cliente):not(.modo-interno) .preview-mode .nota-final {
          min-height: 118px !important;
          height: 118px !important;
          padding: 8px 10px !important;
          border-radius: 16px !important;
          overflow: hidden !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          text-align: center !important;
        }

        body:not(.modo-cliente):not(.modo-interno) .preview-mode .nota-final span {
          display: block !important;
          font-size: 15px !important;
          line-height: 1.05 !important;
          margin-bottom: 4px !important;
          white-space: nowrap !important;
        }

        body:not(.modo-cliente):not(.modo-interno) .preview-mode .nota-final .valor-nota,
        body:not(.modo-cliente):not(.modo-interno) .preview-mode .nota-final .valor-nota-m,
        body:not(.modo-cliente):not(.modo-interno) .preview-mode .nota-final .valor-nota-g,
        body:not(.modo-cliente):not(.modo-interno) .preview-mode .nota-final .valor-nota-gg {
          display: block !important;
          width: 100% !important;
          max-width: 100% !important;
          overflow: hidden !important;
          white-space: nowrap !important;
          text-align: center !important;
          line-height: 1 !important;
          letter-spacing: -1px !important;
        }

        body:not(.modo-cliente):not(.modo-interno) .preview-mode .nota-final .valor-nota { font-size: 42px !important; }
        body:not(.modo-cliente):not(.modo-interno) .preview-mode .nota-final .valor-nota-m { font-size: 37px !important; }
        body:not(.modo-cliente):not(.modo-interno) .preview-mode .nota-final .valor-nota-g { font-size: 32px !important; }
        body:not(.modo-cliente):not(.modo-interno) .preview-mode .nota-final .valor-nota-gg { font-size: 27px !important; }

        /* V10.13.11.1 - OCULTAR RESUMO SOMENTE NO CLIENTE SEM DIAS */
        body.modo-cliente .sheet.sem-dias-trabalhados .resumo-cobranca-panel {
          display: none !important;
        }

        @media print {
          body.modo-cliente .sheet.sem-dias-trabalhados .resumo-cobranca-panel {
            display: none !important;
          }
        }


        /* V67 FINAL - A4 mais aproveitado, sem sombra, destaque nos nomes, CNPJ menor e preview antes de salvar */
        .preview-mode .sheet,
        .sheet { box-shadow: none !important; }

        .preview-mode .sheet {
          width: 206mm !important;
          min-height: 291mm !important;
          padding: 3.5mm !important;
        }

        .preview-mode .top { margin-bottom: 4px !important; }
        .preview-mode .info { margin-bottom: 5px !important; }
        .preview-mode .info div { padding: 4px 6px !important; }

        .info .value {
          font-size: 20px !important;
          font-weight: 1000 !important;
          color: #111827 !important;
          line-height: 1.15 !important;
          overflow-wrap: anywhere !important;
        }

        .cnpj-line {
          font-size: 14px !important;
          font-weight: 700 !important;
          line-height: 1.15 !important;
          margin-top: 6px !important;
          overflow-wrap: anywhere !important;
        }

        .preview-mode .info .value { font-size: 12px !important; font-weight: 1000 !important; }
        .preview-mode .cnpj-line { font-size: 10px !important; font-weight: 700 !important; margin-top: 3px !important; }
        .preview-mode .grid { gap: 5px !important; }
        .preview-mode .panel { margin-bottom: 3px !important; }
        .preview-mode .footer-final { margin-top: 4px !important; }

        @page { size: A4 portrait; margin: 3mm !important; }

        @media print {
          .page, .preview-mode { padding: 0 !important; background: #fff !important; }
          .sheet {
            width: 204mm !important;
            min-height: 291mm !important;
            padding: 3mm !important;
            margin: 0 auto !important;
            box-shadow: none !important;
            border-radius: 0 !important;
          }
          .top { margin-bottom: 4px !important; }
          .info { margin-bottom: 5px !important; }
          .info div { padding: 4px 6px !important; }
          .info .value { font-size: 12px !important; font-weight: 1000 !important; line-height: 1.15 !important; }
          .cnpj-line { font-size: 9.5px !important; font-weight: 700 !important; margin-top: 2px !important; }
          .grid { gap: 5px !important; }
          .panel { margin-bottom: 3px !important; }
          .footer-final { margin-top: 4px !important; }
        }



        /* V68 FIX: rodapé cliente/interno sem quebrar */
        .footer-final,
        .preview-mode .footer-final,
        body.modo-cliente .footer-final,
        body.modo-interno .footer-final {
          display:grid !important;
          grid-template-columns:minmax(0,1fr) minmax(0,1fr) !important;
          gap:12px !important;
          align-items:stretch !important;
          width:100% !important;
          max-width:100% !important;
          box-sizing:border-box !important;
        }
        .ytalseg-card-final,.nota-final,
        .preview-mode .ytalseg-card-final,.preview-mode .nota-final,
        body.modo-cliente .ytalseg-card-final,body.modo-cliente .nota-final,
        body.modo-interno .ytalseg-card-final,body.modo-interno .nota-final {
          min-width:0 !important; max-width:100% !important; width:100% !important;
          min-height:128px !important; box-sizing:border-box !important; overflow:hidden !important;
        }
        .ytalseg-card-final,.preview-mode .ytalseg-card-final,
        body.modo-cliente .ytalseg-card-final,body.modo-interno .ytalseg-card-final {
          grid-template-columns:150px minmax(0,1fr) !important;
        }
        .logo-area-final,.preview-mode .logo-area-final,
        body.modo-cliente .logo-area-final,body.modo-interno .logo-area-final { padding:6px 8px !important; }
        .logo-circle-final,.logo-card,.preview-mode .logo-circle-final,.preview-mode .logo-card,
        body.modo-cliente .logo-circle-final,body.modo-cliente .logo-card,
        body.modo-interno .logo-circle-final,body.modo-interno .logo-card {
          width:128px !important; height:128px !important; max-width:128px !important; max-height:128px !important; object-fit:contain !important;
        }
        .info-area-final,.preview-mode .info-area-final,
        body.modo-cliente .info-area-final,body.modo-interno .info-area-final {
          min-width:0 !important; padding:10px 14px !important; line-height:1.16 !important; justify-content:center !important;
        }
        .info-area-final h2,.preview-mode .info-area-final h2,
        body.modo-cliente .info-area-final h2,body.modo-interno .info-area-final h2 {
          font-size:22px !important; line-height:1 !important; margin:0 0 4px !important; font-weight:1000 !important;
        }
        .info-area-final p,.preview-mode .info-area-final p,
        body.modo-cliente .info-area-final p,body.modo-interno .info-area-final p {
          font-size:10.5px !important; line-height:1.15 !important; margin:1px 0 3px !important; font-weight:800 !important;
        }
        .info-area-final strong,.preview-mode .info-area-final strong,
        body.modo-cliente .info-area-final strong,body.modo-interno .info-area-final strong {
          font-size:10.5px !important; line-height:1.15 !important; margin:4px 0 3px !important; font-weight:1000 !important;
        }
        .rep-line,.preview-mode .rep-line,body.modo-cliente .rep-line,body.modo-interno .rep-line {
          display:grid !important; grid-template-columns:76px minmax(0,1fr) !important; column-gap:4px !important;
          max-width:100% !important; font-size:10.5px !important; line-height:1.15 !important; margin-top:2px !important;
          font-weight:900 !important; white-space:nowrap !important;
        }
        .rep-line span,.preview-mode .rep-line span,body.modo-cliente .rep-line span,body.modo-interno .rep-line span { white-space:nowrap !important; }
        .email-line,.preview-mode .email-line,body.modo-cliente .email-line,body.modo-interno .email-line {
          font-size:10px !important; line-height:1.12 !important; margin-top:4px !important; font-weight:900 !important; white-space:nowrap !important;
        }
        .nota-final,.preview-mode .nota-final,body.modo-cliente .nota-final,body.modo-interno .nota-final {
          display:flex !important; flex-direction:column !important; align-items:center !important; justify-content:center !important; text-align:center !important; padding:10px 12px !important;
        }
        .nota-final span,.preview-mode .nota-final span,body.modo-cliente .nota-final span,body.modo-interno .nota-final span {
          display:block !important; width:100% !important; font-size:17px !important; line-height:1 !important; margin-bottom:8px !important; white-space:nowrap !important;
        }
        .nota-final .valor-nota,.preview-mode .nota-final .valor-nota,body.modo-cliente .nota-final .valor-nota,body.modo-interno .nota-final .valor-nota {
          display:block !important; width:100% !important; max-width:100% !important; overflow:hidden !important; white-space:nowrap !important; text-align:center !important;
          line-height:.96 !important; font-size:clamp(26px,4.7vw,48px) !important; letter-spacing:-1.4px !important; transform:scaleX(.92) !important; transform-origin:center !important;
        }
        .nota-final .valor-nota-m,.preview-mode .nota-final .valor-nota-m,body.modo-cliente .nota-final .valor-nota-m,body.modo-interno .nota-final .valor-nota-m {
          font-size:clamp(24px,4.1vw,42px) !important; transform:scaleX(.88) !important;
        }
        .nota-final .valor-nota-g,.nota-final .valor-nota-gg,.preview-mode .nota-final .valor-nota-g,.preview-mode .nota-final .valor-nota-gg,
        body.modo-cliente .nota-final .valor-nota-g,body.modo-cliente .nota-final .valor-nota-gg,
        body.modo-interno .nota-final .valor-nota-g,body.modo-interno .nota-final .valor-nota-gg {
          font-size:clamp(21px,3.5vw,34px) !important; transform:scaleX(.82) !important;
        }
        @media print {
          .footer-final,body.modo-cliente .footer-final,body.modo-interno .footer-final { grid-template-columns:minmax(0,1fr) minmax(0,1fr) !important; gap:8px !important; }
          .ytalseg-card-final,.nota-final,body.modo-cliente .ytalseg-card-final,body.modo-cliente .nota-final,body.modo-interno .ytalseg-card-final,body.modo-interno .nota-final { min-height:30mm !important; max-height:34mm !important; }
          .ytalseg-card-final,body.modo-cliente .ytalseg-card-final,body.modo-interno .ytalseg-card-final { grid-template-columns:34mm minmax(0,1fr) !important; }
          .logo-circle-final,.logo-card,body.modo-cliente .logo-circle-final,body.modo-cliente .logo-card,body.modo-interno .logo-circle-final,body.modo-interno .logo-card { width:30mm !important; height:30mm !important; max-width:30mm !important; max-height:30mm !important; }
          .rep-line,body.modo-cliente .rep-line,body.modo-interno .rep-line { grid-template-columns:18mm minmax(0,1fr) !important; font-size:7.5px !important; white-space:nowrap !important; }
          .info-area-final h2,body.modo-cliente .info-area-final h2,body.modo-interno .info-area-final h2 { font-size:15px !important; }
          .info-area-final p,.info-area-final strong,.email-line,body.modo-cliente .info-area-final p,body.modo-cliente .info-area-final strong,body.modo-cliente .email-line,body.modo-interno .info-area-final p,body.modo-interno .info-area-final strong,body.modo-interno .email-line { font-size:7.5px !important; white-space:nowrap !important; }
          .nota-final .valor-nota,body.modo-cliente .nota-final .valor-nota,body.modo-interno .nota-final .valor-nota { font-size:31px !important; transform:scaleX(.86) !important; }
          .nota-final .valor-nota-m,body.modo-cliente .nota-final .valor-nota-m,body.modo-interno .nota-final .valor-nota-m { font-size:27px !important; transform:scaleX(.82) !important; }
          .nota-final .valor-nota-g,.nota-final .valor-nota-gg,body.modo-cliente .nota-final .valor-nota-g,body.modo-cliente .nota-final .valor-nota-gg,body.modo-interno .nota-final .valor-nota-g,body.modo-interno .nota-final .valor-nota-gg { font-size:23px !important; transform:scaleX(.76) !important; }
        }

        /* V70 CIRURGICO: padrão V66 aprovado + cards finais travados */
        .footer-final,
        .preview-mode .footer-final,
        body.modo-cliente .footer-final,
        body.modo-interno .footer-final {
          display: grid !important;
          grid-template-columns: calc(50% - 7px) calc(50% - 7px) !important;
          gap: 14px !important;
          width: 100% !important;
          max-width: 100% !important;
          align-items: stretch !important;
          margin-top: 14px !important;
          box-sizing: border-box !important;
        }

        .ytalseg-card-final,
        .nota-final,
        .preview-mode .ytalseg-card-final,
        .preview-mode .nota-final,
        body.modo-cliente .ytalseg-card-final,
        body.modo-cliente .nota-final,
        body.modo-interno .ytalseg-card-final,
        body.modo-interno .nota-final {
          width: 100% !important;
          min-width: 0 !important;
          max-width: 100% !important;
          height: 150px !important;
          min-height: 150px !important;
          max-height: 150px !important;
          box-sizing: border-box !important;
          overflow: hidden !important;
          flex: none !important;
        }

        .ytalseg-card-final,
        .preview-mode .ytalseg-card-final,
        body.modo-cliente .ytalseg-card-final,
        body.modo-interno .ytalseg-card-final {
          display: grid !important;
          grid-template-columns: 170px minmax(0, 1fr) !important;
          background: rgba(255,255,255,.88) !important;
          border: 1px solid #d7d7d7 !important;
          border-radius: 24px !important;
          box-shadow: none !important;
        }

        .logo-area-final,
        .preview-mode .logo-area-final,
        body.modo-cliente .logo-area-final,
        body.modo-interno .logo-area-final {
          padding: 8px 10px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          overflow: hidden !important;
          min-width: 0 !important;
        }

        .logo-circle-final,
        .logo-card,
        .preview-mode .logo-circle-final,
        .preview-mode .logo-card,
        body.modo-cliente .logo-circle-final,
        body.modo-cliente .logo-card,
        body.modo-interno .logo-circle-final,
        body.modo-interno .logo-card {
          width: 132px !important;
          height: 132px !important;
          max-width: 132px !important;
          max-height: 132px !important;
          object-fit: contain !important;
          flex: 0 0 auto !important;
        }

        .info-area-final,
        .preview-mode .info-area-final,
        body.modo-cliente .info-area-final,
        body.modo-interno .info-area-final {
          min-width: 0 !important;
          max-width: 100% !important;
          overflow: hidden !important;
          padding: 12px 16px !important;
          line-height: 1.16 !important;
          display: flex !important;
          flex-direction: column !important;
          justify-content: center !important;
          border-right: 6px solid #00B050 !important;
          border-top-right-radius: 72px !important;
          border-bottom-right-radius: 72px !important;
        }

        .info-area-final h2,
        .preview-mode .info-area-final h2,
        body.modo-cliente .info-area-final h2,
        body.modo-interno .info-area-final h2 {
          font-size: 24px !important;
          line-height: 1 !important;
          margin: 0 0 5px !important;
          font-weight: 900 !important;
          color: #00B050 !important;
          letter-spacing: -0.2px !important;
          white-space: nowrap !important;
        }

        .info-area-final p,
        .preview-mode .info-area-final p,
        body.modo-cliente .info-area-final p,
        body.modo-interno .info-area-final p {
          font-size: 11px !important;
          line-height: 1.14 !important;
          margin: 1px 0 3px !important;
          font-weight: 600 !important;
          color: #111 !important;
          white-space: normal !important;
          overflow: hidden !important;
        }

        .info-area-final strong,
        .preview-mode .info-area-final strong,
        body.modo-cliente .info-area-final strong,
        body.modo-interno .info-area-final strong {
          display: block !important;
          font-size: 11px !important;
          line-height: 1.08 !important;
          margin: 4px 0 3px !important;
          font-weight: 800 !important;
          color: #111 !important;
        }

        .rep-line,
        .preview-mode .rep-line,
        body.modo-cliente .rep-line,
        body.modo-interno .rep-line {
          display: grid !important;
          grid-template-columns: 74px minmax(0, 1fr) !important;
          column-gap: 4px !important;
          width: 100% !important;
          max-width: 100% !important;
          min-width: 0 !important;
          overflow: hidden !important;
          margin-top: 2px !important;
          font-size: 11px !important;
          line-height: 1.08 !important;
          font-weight: 600 !important;
          white-space: nowrap !important;
        }

        .rep-line span,
        .preview-mode .rep-line span,
        body.modo-cliente .rep-line span,
        body.modo-interno .rep-line span {
          min-width: 0 !important;
          white-space: nowrap !important;
          overflow: hidden !important;
          text-overflow: clip !important;
          font-weight: 600 !important;
        }

        .email-line,
        .preview-mode .email-line,
        body.modo-cliente .email-line,
        body.modo-interno .email-line {
          max-width: 100% !important;
          min-width: 0 !important;
          overflow: hidden !important;
          white-space: nowrap !important;
          text-overflow: clip !important;
          margin-top: 4px !important;
          font-size: 10.2px !important;
          line-height: 1.08 !important;
          font-weight: 600 !important;
          color: #111 !important;
        }

        .nota-final,
        .preview-mode .nota-final,
        body.modo-cliente .nota-final,
        body.modo-interno .nota-final {
          display: flex !important;
          flex-direction: column !important;
          align-items: center !important;
          justify-content: center !important;
          text-align: center !important;
          padding: 12px 16px !important;
          border-radius: 24px !important;
          border: 1px solid #b88716 !important;
          box-shadow: none !important;
          background: #fff !important;
        }

        .nota-icon,
        .preview-mode .nota-icon,
        body.modo-cliente .nota-icon,
        body.modo-interno .nota-icon { display: none !important; }

        .nota-final > div,
        .preview-mode .nota-final > div,
        body.modo-cliente .nota-final > div,
        body.modo-interno .nota-final > div {
          width: 100% !important;
          max-width: 100% !important;
          min-width: 0 !important;
          overflow: hidden !important;
        }

        .nota-final span,
        .preview-mode .nota-final span,
        body.modo-cliente .nota-final span,
        body.modo-interno .nota-final span {
          display: block !important;
          width: 100% !important;
          margin-bottom: 8px !important;
          font-size: 20px !important;
          line-height: 1 !important;
          font-weight: 900 !important;
          white-space: nowrap !important;
          overflow: hidden !important;
        }

        .nota-final .valor-nota,
        .preview-mode .nota-final .valor-nota,
        body.modo-cliente .nota-final .valor-nota,
        body.modo-interno .nota-final .valor-nota {
          display: block !important;
          width: 100% !important;
          max-width: 100% !important;
          min-width: 0 !important;
          overflow: hidden !important;
          white-space: nowrap !important;
          text-align: center !important;
          line-height: 0.95 !important;
          font-size: 46px !important;
          letter-spacing: -1px !important;
          transform: none !important;
          font-weight: 1000 !important;
        }

        .nota-final .valor-nota-m,
        .preview-mode .nota-final .valor-nota-m,
        body.modo-cliente .nota-final .valor-nota-m,
        body.modo-interno .nota-final .valor-nota-m { font-size: 42px !important; letter-spacing: -1.2px !important; }

        .nota-final .valor-nota-g,
        .preview-mode .nota-final .valor-nota-g,
        body.modo-cliente .nota-final .valor-nota-g,
        body.modo-interno .nota-final .valor-nota-g { font-size: 36px !important; letter-spacing: -1.6px !important; }

        .nota-final .valor-nota-gg,
        .preview-mode .nota-final .valor-nota-gg,
        body.modo-cliente .nota-final .valor-nota-gg,
        body.modo-interno .nota-final .valor-nota-gg { font-size: 31px !important; letter-spacing: -1.9px !important; }

        @media print {
          .footer-final,
          body.modo-cliente .footer-final,
          body.modo-interno .footer-final { grid-template-columns: calc(50% - 3mm) calc(50% - 3mm) !important; gap: 6mm !important; margin-top: 3mm !important; }
          .ytalseg-card-final,
          .nota-final,
          body.modo-cliente .ytalseg-card-final,
          body.modo-cliente .nota-final,
          body.modo-interno .ytalseg-card-final,
          body.modo-interno .nota-final { height: 36mm !important; min-height: 36mm !important; max-height: 36mm !important; overflow: hidden !important; }
          .ytalseg-card-final,
          body.modo-cliente .ytalseg-card-final,
          body.modo-interno .ytalseg-card-final { grid-template-columns: 34mm minmax(0, 1fr) !important; border-radius: 13px !important; }
          .logo-area-final,
          body.modo-cliente .logo-area-final,
          body.modo-interno .logo-area-final { padding: 2mm !important; }
          .logo-circle-final,
          .logo-card,
          body.modo-cliente .logo-circle-final,
          body.modo-cliente .logo-card,
          body.modo-interno .logo-circle-final,
          body.modo-interno .logo-card { width: 30mm !important; height: 30mm !important; max-width: 30mm !important; max-height: 30mm !important; }
          .info-area-final,
          body.modo-cliente .info-area-final,
          body.modo-interno .info-area-final { padding: 4px 7px !important; border-right-width: 3px !important; border-top-right-radius: 28px !important; border-bottom-right-radius: 28px !important; line-height: 1.1 !important; }
          .info-area-final h2,
          body.modo-cliente .info-area-final h2,
          body.modo-interno .info-area-final h2 { font-size: 14px !important; margin-bottom: 2px !important; }
          .info-area-final p,
          body.modo-cliente .info-area-final p,
          body.modo-interno .info-area-final p { font-size: 6.8px !important; line-height: 1.1 !important; margin: 0 0 1.5px !important; font-weight: 600 !important; }
          .info-area-final strong,
          body.modo-cliente .info-area-final strong,
          body.modo-interno .info-area-final strong { font-size: 6.9px !important; line-height: 1.05 !important; margin: 2px 0 1px !important; font-weight: 800 !important; }
          .rep-line,
          body.modo-cliente .rep-line,
          body.modo-interno .rep-line { grid-template-columns: 15mm minmax(0,1fr) !important; column-gap: 1mm !important; font-size: 6.8px !important; line-height: 1.05 !important; margin-top: 1px !important; font-weight: 600 !important; }
          .email-line,
          body.modo-cliente .email-line,
          body.modo-interno .email-line { font-size: 6.2px !important; line-height: 1.05 !important; margin-top: 1.5px !important; font-weight: 600 !important; }
          .nota-final,
          body.modo-cliente .nota-final,
          body.modo-interno .nota-final { padding: 4px 7px !important; border-radius: 13px !important; }
          .nota-final span,
          body.modo-cliente .nota-final span,
          body.modo-interno .nota-final span { font-size: 12px !important; margin-bottom: 3px !important; }
          .nota-final .valor-nota,
          body.modo-cliente .nota-final .valor-nota,
          body.modo-interno .nota-final .valor-nota { font-size: 31px !important; letter-spacing: -0.8px !important; transform: none !important; }
          .nota-final .valor-nota-m,
          body.modo-cliente .nota-final .valor-nota-m,
          body.modo-interno .nota-final .valor-nota-m { font-size: 28px !important; }
          .nota-final .valor-nota-g,
          body.modo-cliente .nota-final .valor-nota-g,
          body.modo-interno .nota-final .valor-nota-g { font-size: 24px !important; }
          .nota-final .valor-nota-gg,
          body.modo-cliente .nota-final .valor-nota-gg,
          body.modo-interno .nota-final .valor-nota-gg { font-size: 21px !important; }
        }



        /* V72 FINAL LIMPO - padrão aprovado V66 com proteção contra esticar/quebrar cards
           Regra: não muda cálculo nem funções; só trava o rodapé visual dos relatórios. */
        .footer-final,
        .preview-mode .footer-final,
        body.modo-cliente .footer-final,
        body.modo-interno .footer-final {
          display: grid !important;
          grid-template-columns: minmax(0, 1.05fr) minmax(0, 1fr) !important;
          gap: 18px !important;
          margin-top: 18px !important;
          align-items: stretch !important;
          width: 100% !important;
          max-width: 100% !important;
          box-sizing: border-box !important;
        }

        .ytalseg-card-final,
        .preview-mode .ytalseg-card-final,
        body.modo-cliente .ytalseg-card-final,
        body.modo-interno .ytalseg-card-final {
          display: grid !important;
          grid-template-columns: 165px minmax(0, 1fr) !important;
          min-height: 130px !important;
          height: 130px !important;
          max-height: 130px !important;
          min-width: 0 !important;
          max-width: 100% !important;
          overflow: hidden !important;
          border-radius: 24px !important;
          background: rgba(255,255,255,.88) !important;
          box-shadow: none !important;
          border: 1px solid #d7d7d7 !important;
          box-sizing: border-box !important;
        }

        .logo-area-final,
        .preview-mode .logo-area-final,
        body.modo-cliente .logo-area-final,
        body.modo-interno .logo-area-final {
          background: white !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          padding-left: 8px !important;
          min-width: 0 !important;
          overflow: hidden !important;
        }

        .logo-circle-final,
        .logo-card,
        .preview-mode .logo-circle-final,
        .preview-mode .logo-card,
        body.modo-cliente .logo-circle-final,
        body.modo-cliente .logo-card,
        body.modo-interno .logo-circle-final,
        body.modo-interno .logo-card {
          width: 132px !important;
          height: 132px !important;
          max-width: 132px !important;
          max-height: 132px !important;
          object-fit: contain !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          flex: 0 0 auto !important;
        }

        .info-area-final,
        .preview-mode .info-area-final,
        body.modo-cliente .info-area-final,
        body.modo-interno .info-area-final {
          padding: 14px 18px !important;
          min-width: 0 !important;
          max-width: 100% !important;
          overflow: hidden !important;
          border-right: 6px solid #00B050 !important;
          border-top-right-radius: 80px !important;
          border-bottom-right-radius: 80px !important;
          display: flex !important;
          flex-direction: column !important;
          justify-content: center !important;
          box-sizing: border-box !important;
        }

        .info-area-final h2,
        .preview-mode .info-area-final h2,
        body.modo-cliente .info-area-final h2,
        body.modo-interno .info-area-final h2 {
          margin: 0 0 2px 0 !important;
          color: #00B050 !important;
          font-size: 30px !important;
          line-height: 1 !important;
          font-weight: 900 !important;
          white-space: nowrap !important;
        }

        .info-area-final p,
        .preview-mode .info-area-final p,
        body.modo-cliente .info-area-final p,
        body.modo-interno .info-area-final p {
          margin: 1px 0 !important;
          font-size: 13px !important;
          line-height: 1.12 !important;
          color: #111 !important;
          font-weight: 600 !important;
          white-space: normal !important;
          overflow: hidden !important;
        }

        .info-area-final strong,
        .preview-mode .info-area-final strong,
        body.modo-cliente .info-area-final strong,
        body.modo-interno .info-area-final strong {
          display: block !important;
          margin: 4px 0 2px !important;
          font-size: 13px !important;
          line-height: 1.06 !important;
          color: #111 !important;
          font-weight: 800 !important;
          white-space: nowrap !important;
          overflow: hidden !important;
        }

        .rep-line,
        .preview-mode .rep-line,
        body.modo-cliente .rep-line,
        body.modo-interno .rep-line {
          display: grid !important;
          grid-template-columns: 92px minmax(0, 1fr) !important;
          column-gap: 4px !important;
          width: 100% !important;
          max-width: 360px !important;
          min-width: 0 !important;
          overflow: hidden !important;
          font-size: 13px !important;
          line-height: 1.08 !important;
          margin-top: 1px !important;
          color: #111 !important;
          font-weight: 700 !important;
          white-space: nowrap !important;
        }

        .rep-line span,
        .preview-mode .rep-line span,
        body.modo-cliente .rep-line span,
        body.modo-interno .rep-line span {
          min-width: 0 !important;
          white-space: nowrap !important;
          overflow: hidden !important;
          text-overflow: clip !important;
          font-weight: 700 !important;
        }

        .email-line,
        .preview-mode .email-line,
        body.modo-cliente .email-line,
        body.modo-interno .email-line {
          margin-top: 5px !important;
          font-size: 12.5px !important;
          line-height: 1.05 !important;
          font-weight: 700 !important;
          white-space: nowrap !important;
          overflow: hidden !important;
          text-overflow: clip !important;
          color: #111 !important;
        }

        .nota-final,
        .preview-mode .nota-final,
        body.modo-cliente .nota-final,
        body.modo-interno .nota-final {
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          text-align: center !important;
          min-height: 130px !important;
          height: 130px !important;
          max-height: 130px !important;
          min-width: 0 !important;
          max-width: 100% !important;
          overflow: hidden !important;
          padding: 18px !important;
          color: #111 !important;
          background: rgba(255,255,255,.88) !important;
          border: 1px solid #b88716 !important;
          border-radius: 24px !important;
          box-shadow: none !important;
          box-sizing: border-box !important;
        }

        .nota-icon,
        .preview-mode .nota-icon,
        body.modo-cliente .nota-icon,
        body.modo-interno .nota-icon { display: none !important; }

        .nota-final > div,
        .preview-mode .nota-final > div,
        body.modo-cliente .nota-final > div,
        body.modo-interno .nota-final > div {
          width: 100% !important;
          max-width: 100% !important;
          min-width: 0 !important;
          overflow: hidden !important;
        }

        .nota-final span,
        .preview-mode .nota-final span,
        body.modo-cliente .nota-final span,
        body.modo-interno .nota-final span {
          display: block !important;
          width: 100% !important;
          font-size: 24px !important;
          line-height: 1 !important;
          font-weight: 900 !important;
          margin-bottom: 8px !important;
          white-space: nowrap !important;
          overflow: hidden !important;
        }

        .nota-final .valor-nota,
        .preview-mode .nota-final .valor-nota,
        body.modo-cliente .nota-final .valor-nota,
        body.modo-interno .nota-final .valor-nota {
          display: block !important;
          width: 100% !important;
          max-width: 100% !important;
          min-width: 0 !important;
          overflow: hidden !important;
          white-space: nowrap !important;
          text-align: center !important;
          line-height: .95 !important;
          font-size: clamp(36px, 4.2vw, 58px) !important;
          letter-spacing: -1.2px !important;
          transform: none !important;
          font-weight: 900 !important;
        }

        .nota-final .valor-nota-m,
        .preview-mode .nota-final .valor-nota-m,
        body.modo-cliente .nota-final .valor-nota-m,
        body.modo-interno .nota-final .valor-nota-m { font-size: clamp(34px, 3.8vw, 50px) !important; }

        .nota-final .valor-nota-g,
        .preview-mode .nota-final .valor-nota-g,
        body.modo-cliente .nota-final .valor-nota-g,
        body.modo-interno .nota-final .valor-nota-g { font-size: clamp(30px, 3.3vw, 44px) !important; letter-spacing: -1.5px !important; }

        .nota-final .valor-nota-gg,
        .preview-mode .nota-final .valor-nota-gg,
        body.modo-cliente .nota-final .valor-nota-gg,
        body.modo-interno .nota-final .valor-nota-gg { font-size: clamp(26px, 2.9vw, 38px) !important; letter-spacing: -1.8px !important; }

        @media print {
          .footer-final,
          body.modo-cliente .footer-final,
          body.modo-interno .footer-final {
            grid-template-columns: minmax(0, 1.05fr) minmax(0, 1fr) !important;
            gap: 5mm !important;
            margin-top: 3mm !important;
          }
          .ytalseg-card-final,
          .nota-final,
          body.modo-cliente .ytalseg-card-final,
          body.modo-cliente .nota-final,
          body.modo-interno .ytalseg-card-final,
          body.modo-interno .nota-final {
            height: 34mm !important;
            min-height: 34mm !important;
            max-height: 34mm !important;
            overflow: hidden !important;
          }
          .ytalseg-card-final,
          body.modo-cliente .ytalseg-card-final,
          body.modo-interno .ytalseg-card-final { grid-template-columns: 32mm minmax(0, 1fr) !important; border-radius: 13px !important; }
          .logo-area-final,
          body.modo-cliente .logo-area-final,
          body.modo-interno .logo-area-final { padding-left: 1.5mm !important; }
          .logo-circle-final,
          .logo-card,
          body.modo-cliente .logo-circle-final,
          body.modo-cliente .logo-card,
          body.modo-interno .logo-circle-final,
          body.modo-interno .logo-card { width: 29mm !important; height: 29mm !important; max-width: 29mm !important; max-height: 29mm !important; }
          .info-area-final,
          body.modo-cliente .info-area-final,
          body.modo-interno .info-area-final { padding: 3.5px 7px !important; border-right-width: 3px !important; border-top-right-radius: 28px !important; border-bottom-right-radius: 28px !important; }
          .info-area-final h2,
          body.modo-cliente .info-area-final h2,
          body.modo-interno .info-area-final h2 { font-size: 14px !important; margin-bottom: 1.5px !important; }
          .info-area-final p,
          body.modo-cliente .info-area-final p,
          body.modo-interno .info-area-final p { font-size: 6.8px !important; line-height: 1.08 !important; margin: 0 0 1px !important; font-weight: 600 !important; }
          .info-area-final strong,
          body.modo-cliente .info-area-final strong,
          body.modo-interno .info-area-final strong { font-size: 6.8px !important; line-height: 1.04 !important; margin: 1.5px 0 1px !important; font-weight: 800 !important; }
          .rep-line,
          body.modo-cliente .rep-line,
          body.modo-interno .rep-line { grid-template-columns: 15mm minmax(0, 1fr) !important; column-gap: 1mm !important; font-size: 6.7px !important; line-height: 1.04 !important; margin-top: 0.6px !important; font-weight: 700 !important; }
          .email-line,
          body.modo-cliente .email-line,
          body.modo-interno .email-line { font-size: 6.15px !important; line-height: 1.02 !important; margin-top: 1px !important; font-weight: 700 !important; }
          .nota-final,
          body.modo-cliente .nota-final,
          body.modo-interno .nota-final { padding: 3mm 4mm !important; border-radius: 13px !important; }
          .nota-final span,
          body.modo-cliente .nota-final span,
          body.modo-interno .nota-final span { font-size: 12px !important; margin-bottom: 2.5px !important; }
          .nota-final .valor-nota,
          body.modo-cliente .nota-final .valor-nota,
          body.modo-interno .nota-final .valor-nota { font-size: 31px !important; letter-spacing: -0.8px !important; }
          .nota-final .valor-nota-m,
          body.modo-cliente .nota-final .valor-nota-m,
          body.modo-interno .nota-final .valor-nota-m { font-size: 28px !important; }
          .nota-final .valor-nota-g,
          body.modo-cliente .nota-final .valor-nota-g,
          body.modo-interno .nota-final .valor-nota-g { font-size: 24px !important; }
          .nota-final .valor-nota-gg,
          body.modo-cliente .nota-final .valor-nota-gg,
          body.modo-interno .nota-final .valor-nota-gg { font-size: 21px !important; }
        }


        /* V73 CORREÇÃO FINAL: PRINCIPAL SOMENTE.
           Cliente e Interno continuam como estão. Esta regra só vale quando NÃO estiver em modo cliente/interno. */
        body:not(.modo-cliente):not(.modo-interno) .preview-mode .footer-final {
          display: grid !important;
          grid-template-columns: minmax(0, 1.05fr) minmax(0, 1fr) !important;
          gap: 18px !important;
          margin-top: 18px !important;
          width: 100% !important;
          max-width: 100% !important;
          align-items: stretch !important;
          overflow: visible !important;
        }
        body:not(.modo-cliente):not(.modo-interno) .preview-mode .ytalseg-card-final,
        body:not(.modo-cliente):not(.modo-interno) .preview-mode .nota-final {
          height: 130px !important;
          min-height: 130px !important;
          max-height: 130px !important;
          width: 100% !important;
          min-width: 0 !important;
          max-width: 100% !important;
          overflow: hidden !important;
          box-sizing: border-box !important;
        }
        body:not(.modo-cliente):not(.modo-interno) .preview-mode .ytalseg-card-final {
          display: grid !important;
          grid-template-columns: 150px minmax(0, 1fr) !important;
          border-radius: 24px !important;
        }
        body:not(.modo-cliente):not(.modo-interno) .preview-mode .logo-area-final {
          padding: 6px 8px !important;
          overflow: hidden !important;
        }
        body:not(.modo-cliente):not(.modo-interno) .preview-mode .logo-circle-final,
        body:not(.modo-cliente):not(.modo-interno) .preview-mode .logo-card {
          width: 118px !important;
          height: 118px !important;
          max-width: 118px !important;
          max-height: 118px !important;
          object-fit: contain !important;
        }
        body:not(.modo-cliente):not(.modo-interno) .preview-mode .info-area-final {
          padding: 8px 12px !important;
          border-right: 5px solid #00B050 !important;
          border-top-right-radius: 65px !important;
          border-bottom-right-radius: 65px !important;
          overflow: hidden !important;
          justify-content: center !important;
        }
        body:not(.modo-cliente):not(.modo-interno) .preview-mode .info-area-final h2 {
          font-size: 24px !important;
          line-height: 1 !important;
          margin: 0 0 3px !important;
          font-weight: 900 !important;
          white-space: nowrap !important;
        }
        body:not(.modo-cliente):not(.modo-interno) .preview-mode .info-area-final p {
          font-size: 10.2px !important;
          line-height: 1.12 !important;
          margin: 0 0 2px !important;
          font-weight: 600 !important;
          white-space: normal !important;
        }
        body:not(.modo-cliente):not(.modo-interno) .preview-mode .info-area-final strong {
          display: block !important;
          font-size: 10.2px !important;
          line-height: 1.05 !important;
          margin: 3px 0 2px !important;
          font-weight: 800 !important;
          white-space: nowrap !important;
        }
        body:not(.modo-cliente):not(.modo-interno) .preview-mode .rep-line {
          display: grid !important;
          grid-template-columns: 76px minmax(0, 1fr) !important;
          column-gap: 4px !important;
          max-width: 100% !important;
          font-size: 10.2px !important;
          line-height: 1.06 !important;
          margin-top: 1px !important;
          font-weight: 600 !important;
          white-space: nowrap !important;
          overflow: hidden !important;
        }
        body:not(.modo-cliente):not(.modo-interno) .preview-mode .rep-line span {
          white-space: nowrap !important;
          overflow: hidden !important;
          text-overflow: clip !important;
          font-weight: 600 !important;
        }
        body:not(.modo-cliente):not(.modo-interno) .preview-mode .email-line {
          font-size: 9.6px !important;
          line-height: 1.02 !important;
          margin-top: 3px !important;
          font-weight: 600 !important;
          white-space: nowrap !important;
          overflow: hidden !important;
          text-overflow: clip !important;
        }
        body:not(.modo-cliente):not(.modo-interno) .preview-mode .nota-final {
          display: flex !important;
          flex-direction: column !important;
          align-items: center !important;
          justify-content: center !important;
          text-align: center !important;
          padding: 12px 16px !important;
          border-radius: 24px !important;
          background: rgba(255,255,255,.88) !important;
          box-shadow: none !important;
        }
        body:not(.modo-cliente):not(.modo-interno) .preview-mode .nota-final span {
          font-size: 20px !important;
          line-height: 1 !important;
          margin-bottom: 7px !important;
          font-weight: 900 !important;
          white-space: nowrap !important;
        }
        body:not(.modo-cliente):not(.modo-interno) .preview-mode .nota-final .valor-nota {
          font-size: 44px !important;
          line-height: .95 !important;
          letter-spacing: -1px !important;
          white-space: nowrap !important;
          overflow: hidden !important;
          text-align: center !important;
          transform: none !important;
          max-width: 100% !important;
        }
        body:not(.modo-cliente):not(.modo-interno) .preview-mode .nota-final .valor-nota-m { font-size: 40px !important; }
        body:not(.modo-cliente):not(.modo-interno) .preview-mode .nota-final .valor-nota-g { font-size: 35px !important; letter-spacing: -1.3px !important; }
        body:not(.modo-cliente):not(.modo-interno) .preview-mode .nota-final .valor-nota-gg { font-size: 31px !important; letter-spacing: -1.6px !important; }

        @media print {
          body:not(.modo-cliente):not(.modo-interno) .footer-final {
            grid-template-columns: minmax(0, 1.05fr) minmax(0, 1fr) !important;
            gap: 5mm !important;
            margin-top: 3mm !important;
          }
          body:not(.modo-cliente):not(.modo-interno) .ytalseg-card-final,
          body:not(.modo-cliente):not(.modo-interno) .nota-final {
            height: 34mm !important;
            min-height: 34mm !important;
            max-height: 34mm !important;
            overflow: hidden !important;
          }
          body:not(.modo-cliente):not(.modo-interno) .ytalseg-card-final {
            grid-template-columns: 32mm minmax(0, 1fr) !important;
            border-radius: 13px !important;
          }
          body:not(.modo-cliente):not(.modo-interno) .logo-circle-final,
          body:not(.modo-cliente):not(.modo-interno) .logo-card {
            width: 29mm !important;
            height: 29mm !important;
            max-width: 29mm !important;
            max-height: 29mm !important;
            object-fit: contain !important;
          }
          body:not(.modo-cliente):not(.modo-interno) .info-area-final {
            padding: 3.5px 7px !important;
            border-right-width: 3px !important;
            border-top-right-radius: 28px !important;
            border-bottom-right-radius: 28px !important;
          }
          body:not(.modo-cliente):not(.modo-interno) .info-area-final h2 {
            font-size: 14px !important;
            line-height: 1 !important;
            margin-bottom: 1.5px !important;
          }
          body:not(.modo-cliente):not(.modo-interno) .info-area-final p {
            font-size: 6.8px !important;
            line-height: 1.08 !important;
            margin: 0 0 1px !important;
          }
          body:not(.modo-cliente):not(.modo-interno) .info-area-final strong {
            font-size: 6.8px !important;
            line-height: 1.04 !important;
            margin: 1.5px 0 1px !important;
          }
          body:not(.modo-cliente):not(.modo-interno) .rep-line {
            grid-template-columns: 15mm minmax(0, 1fr) !important;
            column-gap: 1mm !important;
            font-size: 6.7px !important;
            line-height: 1.04 !important;
            margin-top: 0.6px !important;
          }
          body:not(.modo-cliente):not(.modo-interno) .email-line {
            font-size: 6.15px !important;
            line-height: 1.02 !important;
            margin-top: 1px !important;
          }
          body:not(.modo-cliente):not(.modo-interno) .nota-final {
            padding: 3mm 4mm !important;
            border-radius: 13px !important;
          }
          body:not(.modo-cliente):not(.modo-interno) .nota-final span {
            font-size: 12px !important;
            margin-bottom: 2.5px !important;
          }
          body:not(.modo-cliente):not(.modo-interno) .nota-final .valor-nota { font-size: 31px !important; letter-spacing: -0.8px !important; }
          body:not(.modo-cliente):not(.modo-interno) .nota-final .valor-nota-m { font-size: 28px !important; }
          body:not(.modo-cliente):not(.modo-interno) .nota-final .valor-nota-g { font-size: 24px !important; }
          body:not(.modo-cliente):not(.modo-interno) .nota-final .valor-nota-gg { font-size: 21px !important; }
        }


        /* V73 DEFINITIVO - CORRECAO CIRURGICA DO PRINCIPAL
           Cliente e Interno permanecem intactos. Estas regras so aplicam no relatorio principal. */
        body:not(.modo-cliente):not(.modo-interno) .preview-mode .footer-final {
          display: grid !important;
          grid-template-columns: minmax(0, 1.05fr) minmax(0, 1fr) !important;
          gap: 10px !important;
          margin-top: 8px !important;
          width: 100% !important;
          max-width: 100% !important;
          align-items: stretch !important;
          overflow: visible !important;
          box-sizing: border-box !important;
        }
        body:not(.modo-cliente):not(.modo-interno) .preview-mode .ytalseg-card-final,
        body:not(.modo-cliente):not(.modo-interno) .preview-mode .nota-final {
          height: 105px !important;
          min-height: 105px !important;
          max-height: 105px !important;
          width: 100% !important;
          min-width: 0 !important;
          max-width: 100% !important;
          overflow: hidden !important;
          box-sizing: border-box !important;
          box-shadow: none !important;
        }
        body:not(.modo-cliente):not(.modo-interno) .preview-mode .ytalseg-card-final {
          display: grid !important;
          grid-template-columns: 120px minmax(0, 1fr) !important;
          border-radius: 16px !important;
        }
        body:not(.modo-cliente):not(.modo-interno) .preview-mode .logo-area-final {
          padding: 6px 8px !important;
          overflow: hidden !important;
        }
        body:not(.modo-cliente):not(.modo-interno) .preview-mode .logo-circle-final,
        body:not(.modo-cliente):not(.modo-interno) .preview-mode .logo-card {
          width: 94px !important;
          height: 94px !important;
          max-width: 94px !important;
          max-height: 94px !important;
          object-fit: contain !important;
        }
        body:not(.modo-cliente):not(.modo-interno) .preview-mode .info-area-final {
          padding: 6px 9px !important;
          border-right: 4px solid #00B050 !important;
          border-top-right-radius: 46px !important;
          border-bottom-right-radius: 46px !important;
          overflow: hidden !important;
          display: flex !important;
          flex-direction: column !important;
          justify-content: center !important;
          box-sizing: border-box !important;
          min-width: 0 !important;
        }
        body:not(.modo-cliente):not(.modo-interno) .preview-mode .info-area-final h2 {
          font-size: 17px !important;
          line-height: 1 !important;
          margin: 0 0 2px !important;
          font-weight: 900 !important;
          white-space: nowrap !important;
        }
        body:not(.modo-cliente):not(.modo-interno) .preview-mode .info-area-final p {
          font-size: 7.3px !important;
          line-height: 1.12 !important;
          margin: 0 0 1px !important;
          font-weight: 600 !important;
          white-space: normal !important;
        }
        body:not(.modo-cliente):not(.modo-interno) .preview-mode .info-area-final strong {
          display: block !important;
          font-size: 7.2px !important;
          line-height: 1.05 !important;
          margin: 2px 0 1px !important;
          font-weight: 800 !important;
          white-space: nowrap !important;
        }
        body:not(.modo-cliente):not(.modo-interno) .preview-mode .rep-line {
          display: grid !important;
          grid-template-columns: 54px minmax(0, 1fr) !important;
          column-gap: 3px !important;
          max-width: 100% !important;
          font-size: 7.2px !important;
          line-height: 1.06 !important;
          margin-top: .5px !important;
          font-weight: 600 !important;
          white-space: nowrap !important;
          overflow: hidden !important;
        }
        body:not(.modo-cliente):not(.modo-interno) .preview-mode .rep-line span {
          white-space: nowrap !important;
          overflow: hidden !important;
          text-overflow: clip !important;
          font-weight: 600 !important;
        }
        body:not(.modo-cliente):not(.modo-interno) .preview-mode .email-line {
          font-size: 6.7px !important;
          line-height: 1.02 !important;
          margin-top: 1.5px !important;
          font-weight: 600 !important;
          white-space: nowrap !important;
          overflow: hidden !important;
          text-overflow: clip !important;
        }
        body:not(.modo-cliente):not(.modo-interno) .preview-mode .nota-final {
          display: flex !important;
          flex-direction: column !important;
          align-items: center !important;
          justify-content: center !important;
          text-align: center !important;
          padding: 7px 10px !important;
          border-radius: 16px !important;
          background: rgba(255,255,255,.88) !important;
          min-width: 0 !important;
          max-width: 100% !important;
        }
        body:not(.modo-cliente):not(.modo-interno) .preview-mode .nota-final span {
          font-size: 14px !important;
          line-height: 1 !important;
          margin-bottom: 4px !important;
          font-weight: 900 !important;
          white-space: nowrap !important;
        }
        body:not(.modo-cliente):not(.modo-interno) .preview-mode .nota-final .valor-nota {
          display: block !important;
          width: 100% !important;
          max-width: 100% !important;
          font-size: 33px !important;
          line-height: .95 !important;
          letter-spacing: -1px !important;
          white-space: nowrap !important;
          overflow: hidden !important;
          text-overflow: clip !important;
          text-align: center !important;
          transform: none !important;
        }
        body:not(.modo-cliente):not(.modo-interno) .preview-mode .nota-final .valor-nota-m { font-size: 30px !important; }
        body:not(.modo-cliente):not(.modo-interno) .preview-mode .nota-final .valor-nota-g { font-size: 27px !important; letter-spacing: -1.2px !important; }
        body:not(.modo-cliente):not(.modo-interno) .preview-mode .nota-final .valor-nota-gg { font-size: 24px !important; letter-spacing: -1.4px !important; }

        @media print {
          body:not(.modo-cliente):not(.modo-interno) .footer-final {
            grid-template-columns: minmax(0, 1.05fr) minmax(0, 1fr) !important;
            gap: 5mm !important;
            margin-top: 3mm !important;
          }
          body:not(.modo-cliente):not(.modo-interno) .ytalseg-card-final,
          body:not(.modo-cliente):not(.modo-interno) .nota-final {
            height: 34mm !important;
            min-height: 34mm !important;
            max-height: 34mm !important;
            overflow: hidden !important;
            box-shadow: none !important;
          }
          body:not(.modo-cliente):not(.modo-interno) .ytalseg-card-final {
            grid-template-columns: 34mm minmax(0, 1fr) !important;
            border-radius: 13px !important;
          }
          body:not(.modo-cliente):not(.modo-interno) .logo-circle-final,
          body:not(.modo-cliente):not(.modo-interno) .logo-card {
            width: 31mm !important;
            height: 31mm !important;
            max-width: 31mm !important;
            max-height: 31mm !important;
            object-fit: contain !important;
          }
          body:not(.modo-cliente):not(.modo-interno) .info-area-final {
            padding: 5px 8px !important;
            border-right-width: 4px !important;
            border-top-right-radius: 34px !important;
            border-bottom-right-radius: 34px !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: center !important;
            overflow: hidden !important;
          }
          body:not(.modo-cliente):not(.modo-interno) .info-area-final h2 {
            font-size: 16px !important;
            line-height: 1 !important;
            margin: 0 0 2px !important;
          }
          body:not(.modo-cliente):not(.modo-interno) .info-area-final p,
          body:not(.modo-cliente):not(.modo-interno) .info-area-final strong,
          body:not(.modo-cliente):not(.modo-interno) .rep-line,
          body:not(.modo-cliente):not(.modo-interno) .email-line {
            font-size: 7.1px !important;
            line-height: 1.18 !important;
            margin-top: 1px !important;
          }
          body:not(.modo-cliente):not(.modo-interno) .rep-line {
            grid-template-columns: 50px minmax(0,1fr) !important;
            column-gap: 3px !important;
            white-space: nowrap !important;
            overflow: hidden !important;
          }
          body:not(.modo-cliente):not(.modo-interno) .email-line {
            font-size: 6.5px !important;
            white-space: nowrap !important;
            overflow: hidden !important;
          }
          body:not(.modo-cliente):not(.modo-interno) .nota-final {
            display: flex !important;
            flex-direction: column !important;
            justify-content: center !important;
            align-items: center !important;
            padding: 3mm 4mm !important;
            border-radius: 13px !important;
          }
          body:not(.modo-cliente):not(.modo-interno) .nota-final span {
            font-size: 12px !important;
            margin-bottom: 2.5px !important;
          }
          body:not(.modo-cliente):not(.modo-interno) .nota-final .valor-nota { font-size: 31px !important; letter-spacing: -0.8px !important; }
          body:not(.modo-cliente):not(.modo-interno) .nota-final .valor-nota-m { font-size: 28px !important; }
          body:not(.modo-cliente):not(.modo-interno) .nota-final .valor-nota-g { font-size: 24px !important; }
          body:not(.modo-cliente):not(.modo-interno) .nota-final .valor-nota-gg { font-size: 21px !important; }
        }


        /* V75 DEFINITIVO - CORRECAO REAL DA TELA PRINCIPAL
           Cliente e interno ficam intocados. Essas regras vencem todos os ajustes antigos somente quando NÃO está em modo cliente/interno. */
        body:not(.modo-cliente):not(.modo-interno) .preview-mode .footer-final {
          display: grid !important;
          grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) !important;
          gap: 18px !important;
          margin-top: 16px !important;
          width: 100% !important;
          align-items: stretch !important;
          overflow: visible !important;
        }

        body:not(.modo-cliente):not(.modo-interno) .preview-mode .ytalseg-card-final,
        body:not(.modo-cliente):not(.modo-interno) .preview-mode .nota-final {
          height: 150px !important;
          min-height: 150px !important;
          max-height: 150px !important;
          width: 100% !important;
          min-width: 0 !important;
          max-width: 100% !important;
          overflow: hidden !important;
          box-sizing: border-box !important;
          box-shadow: none !important;
          background: rgba(255,255,255,.88) !important;
        }

        body:not(.modo-cliente):not(.modo-interno) .preview-mode .ytalseg-card-final {
          display: grid !important;
          grid-template-columns: 175px minmax(0, 1fr) !important;
          border-radius: 22px !important;
          border: 1px solid #d7d7d7 !important;
        }

        body:not(.modo-cliente):not(.modo-interno) .preview-mode .logo-area-final {
          padding: 8px 12px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          overflow: hidden !important;
        }

        body:not(.modo-cliente):not(.modo-interno) .preview-mode .logo-circle-final,
        body:not(.modo-cliente):not(.modo-interno) .preview-mode .logo-card {
          width: 138px !important;
          height: 138px !important;
          max-width: 138px !important;
          max-height: 138px !important;
          object-fit: contain !important;
          flex: 0 0 auto !important;
        }

        body:not(.modo-cliente):not(.modo-interno) .preview-mode .info-area-final {
          padding: 11px 14px !important;
          border-right: 6px solid #00B050 !important;
          border-top-right-radius: 70px !important;
          border-bottom-right-radius: 70px !important;
          overflow: hidden !important;
          display: flex !important;
          flex-direction: column !important;
          justify-content: center !important;
          box-sizing: border-box !important;
          min-width: 0 !important;
          color: #111 !important;
        }

        body:not(.modo-cliente):not(.modo-interno) .preview-mode .info-area-final h2 {
          color: #00B050 !important;
          font-size: 28px !important;
          line-height: 1 !important;
          margin: 0 0 4px !important;
          font-weight: 900 !important;
          white-space: nowrap !important;
        }

        body:not(.modo-cliente):not(.modo-interno) .preview-mode .info-area-final p {
          font-size: 11.4px !important;
          line-height: 1.18 !important;
          margin: 1px 0 2px !important;
          font-weight: 600 !important;
          white-space: normal !important;
          overflow: visible !important;
        }

        body:not(.modo-cliente):not(.modo-interno) .preview-mode .info-area-final strong {
          display: block !important;
          font-size: 11.3px !important;
          line-height: 1.1 !important;
          margin: 4px 0 3px !important;
          font-weight: 800 !important;
          white-space: nowrap !important;
          overflow: hidden !important;
          text-overflow: clip !important;
        }

        body:not(.modo-cliente):not(.modo-interno) .preview-mode .rep-line {
          display: grid !important;
          grid-template-columns: 82px minmax(0, 1fr) !important;
          column-gap: 6px !important;
          max-width: 100% !important;
          font-size: 11.2px !important;
          line-height: 1.12 !important;
          margin-top: 1px !important;
          font-weight: 600 !important;
          white-space: nowrap !important;
          overflow: visible !important;
        }

        body:not(.modo-cliente):not(.modo-interno) .preview-mode .rep-line span {
          white-space: nowrap !important;
          overflow: visible !important;
          text-overflow: clip !important;
          font-weight: 600 !important;
        }

        body:not(.modo-cliente):not(.modo-interno) .preview-mode .email-line {
          font-size: 10.6px !important;
          line-height: 1.1 !important;
          margin-top: 3px !important;
          font-weight: 600 !important;
          white-space: nowrap !important;
          overflow: hidden !important;
          text-overflow: clip !important;
        }

        body:not(.modo-cliente):not(.modo-interno) .preview-mode .nota-final {
          display: flex !important;
          flex-direction: column !important;
          align-items: center !important;
          justify-content: center !important;
          text-align: center !important;
          padding: 14px 18px !important;
          border-radius: 22px !important;
          border: 1px solid #d8a900 !important;
          background: rgba(255,255,255,.88) !important;
        }

        body:not(.modo-cliente):not(.modo-interno) .preview-mode .nota-icon {
          display: none !important;
        }

        body:not(.modo-cliente):not(.modo-interno) .preview-mode .nota-final span {
          font-size: 24px !important;
          line-height: 1 !important;
          margin-bottom: 8px !important;
          font-weight: 900 !important;
          white-space: nowrap !important;
        }

        body:not(.modo-cliente):not(.modo-interno) .preview-mode .nota-final .valor-nota {
          display: block !important;
          width: 100% !important;
          max-width: 100% !important;
          font-size: 54px !important;
          line-height: .96 !important;
          letter-spacing: -1px !important;
          white-space: nowrap !important;
          overflow: hidden !important;
          text-overflow: clip !important;
          text-align: center !important;
          transform: none !important;
        }
        body:not(.modo-cliente):not(.modo-interno) .preview-mode .nota-final .valor-nota-m { font-size: 50px !important; }
        body:not(.modo-cliente):not(.modo-interno) .preview-mode .nota-final .valor-nota-g { font-size: 44px !important; letter-spacing: -1.2px !important; }
        body:not(.modo-cliente):not(.modo-interno) .preview-mode .nota-final .valor-nota-gg { font-size: 38px !important; letter-spacing: -1.4px !important; }



        /* V77 LIMPO: remover somente os cards YTALSEG/VALOR da tela principal.
           Cliente e interno continuam intactos porque usam body.modo-cliente/body.modo-interno. */
        body:not(.modo-cliente):not(.modo-interno) .preview-mode .footer-final {
          display: none !important;
        }
        @media print {
          body:not(.modo-cliente):not(.modo-interno) .footer-final {
            display: none !important;
          }
        }

        /* V78: somente tela principal - garantir total do relatório visível no RESUMO DE COBRANÇA.
           Não altera cliente/interno e não toca nos cards removidos da principal. */
        body:not(.modo-cliente):not(.modo-interno) .preview-mode .resumo-cobranca-panel tr.total-row,
        body:not(.modo-cliente):not(.modo-interno) .resumo-cobranca-panel tr.total-row {
          display: table-row !important;
          visibility: visible !important;
        }
        body:not(.modo-cliente):not(.modo-interno) .preview-mode .resumo-cobranca-panel tr.total-row td,
        body:not(.modo-cliente):not(.modo-interno) .resumo-cobranca-panel tr.total-row td {
          background: rgba(0,176,80,.12) !important;
          color: #111827 !important;
          font-weight: 1000 !important;
          font-size: 12px !important;
          border-top: 2px solid #00B050 !important;
          white-space: nowrap !important;
        }
        body:not(.modo-cliente):not(.modo-interno) .preview-mode .resumo-cobranca-panel tr.total-row td:last-child,
        body:not(.modo-cliente):not(.modo-interno) .resumo-cobranca-panel tr.total-row td:last-child {
          text-align: center !important;
          font-size: 13px !important;
        }
        @media print {
          body:not(.modo-cliente):not(.modo-interno) .resumo-cobranca-panel tr.total-row {
            display: table-row !important;
            visibility: visible !important;
          }
          body:not(.modo-cliente):not(.modo-interno) .resumo-cobranca-panel tr.total-row td {
            background: rgba(0,176,80,.10) !important;
            color: #111827 !important;
            font-weight: 1000 !important;
            font-size: 8px !important;
            border-top: 1px solid #00B050 !important;
          }
        }

/* V81 PREMIUM: ajuste fino SOMENTE do texto do card YTALSEG em Cliente e Interno.
   Não altera largura, altura, logo, card valor ou tela principal. */
body.modo-cliente .ytalseg-card-final .info-area-final,
body.modo-interno .ytalseg-card-final .info-area-final{
  padding: 7px 12px !important;
  justify-content: center !important;
}
body.modo-cliente .ytalseg-card-final .info-area-final h2,
body.modo-interno .ytalseg-card-final .info-area-final h2{
  font-size: 24px !important;
  line-height: .96 !important;
  margin: 0 0 3px !important;
  letter-spacing: .2px !important;
  font-weight: 900 !important;
  white-space: nowrap !important;
}
body.modo-cliente .ytalseg-card-final .info-area-final p,
body.modo-interno .ytalseg-card-final .info-area-final p{
  font-size: 9.6px !important;
  line-height: 1.12 !important;
  margin: 0 0 1.5px !important;
  font-weight: 650 !important;
}
body.modo-cliente .ytalseg-card-final .info-area-final strong,
body.modo-interno .ytalseg-card-final .info-area-final strong{
  display: block !important;
  font-size: 9.3px !important;
  line-height: 1.06 !important;
  margin: 2.5px 0 1.5px !important;
  font-weight: 900 !important;
  white-space: nowrap !important;
}
body.modo-cliente .ytalseg-card-final .rep-line,
body.modo-interno .ytalseg-card-final .rep-line{
  display: grid !important;
  grid-template-columns: 74px minmax(0, 1fr) !important;
  column-gap: 5px !important;
  font-size: 9.3px !important;
  line-height: 1.08 !important;
  margin-top: 1px !important;
  font-weight: 700 !important;
  white-space: nowrap !important;
}
body.modo-cliente .ytalseg-card-final .email-line,
body.modo-interno .ytalseg-card-final .email-line{
  font-size: 8.4px !important;
  line-height: 1.05 !important;
  margin-top: 2px !important;
  font-weight: 700 !important;
  white-space: nowrap !important;
}
@media print{
  body.modo-cliente .ytalseg-card-final .info-area-final,
  body.modo-interno .ytalseg-card-final .info-area-final{
    padding: 4px 8px !important;
    justify-content: center !important;
  }
  body.modo-cliente .ytalseg-card-final .info-area-final h2,
  body.modo-interno .ytalseg-card-final .info-area-final h2{
    font-size: 17px !important;
    line-height: .96 !important;
    margin: 0 0 2px !important;
  }
  body.modo-cliente .ytalseg-card-final .info-area-final p,
  body.modo-interno .ytalseg-card-final .info-area-final p{
    font-size: 7.8px !important;
    line-height: 1.08 !important;
    margin: 0 0 1px !important;
    font-weight: 650 !important;
  }
  body.modo-cliente .ytalseg-card-final .info-area-final strong,
  body.modo-interno .ytalseg-card-final .info-area-final strong{
    font-size: 7.6px !important;
    line-height: 1.04 !important;
    margin: 1.5px 0 1px !important;
    font-weight: 900 !important;
    white-space: nowrap !important;
  }
  body.modo-cliente .ytalseg-card-final .rep-line,
  body.modo-interno .ytalseg-card-final .rep-line{
    grid-template-columns: 15.5mm minmax(0, 1fr) !important;
    column-gap: 1mm !important;
    font-size: 7.35px !important;
    line-height: 1.04 !important;
    margin-top: .5px !important;
    font-weight: 700 !important;
  }
  body.modo-cliente .ytalseg-card-final .email-line,
  body.modo-interno .ytalseg-card-final .email-line{
    font-size: 6.7px !important;
    line-height: 1.02 !important;
    margin-top: 1px !important;
    font-weight: 700 !important;
  }
}

      `}</style>

      <div className="screen-toolbar">
        <div className="upload">
            <div className="toolbar-grid">
          <div className="toolbar-mes">
            <label className="toolbar-label">Mês da análise</label>
            <select className="empresa-select" value={mesAnalise} onChange={(e) => { const novoMes = Number(e.target.value); setMesAnalise(novoMes); setDiasEditaveis(montarDiasConferencia([], novoMes, anoAnalise)); }}>
              {Array.from({ length: 12 }).map((_, i) => (<option key={i + 1} value={i + 1}>{nomeMes(i + 1)}</option>))}
            </select>
          </div>
          <div className="toolbar-ano">
            <label className="toolbar-label">Ano da análise</label>
            <input value={anoAnalise} type="number" onChange={(e) => { const novoAno = Number(e.target.value || new Date().getFullYear()); setAnoAnalise(novoAno); setDiasEditaveis(montarDiasConferencia([], mesAnalise, novoAno)); }} />
          </div>
              <div>
                <label className="toolbar-label">PDF da folha</label>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => setArquivo(e.target.files?.[0] || null)}
                />
              </div>

              <div>
                <label className="toolbar-label">Empresa / Cliente</label>
                <select
                  className="empresa-select"
                  value={empresaId}
                  onChange={(e) => setEmpresaId(e.target.value)}
                >
                  {empresas.map((empresa) => (
                    <option key={empresa.id} value={empresa.id}>
                      {empresa.nome}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="actions">
              <button className="btn-main" onClick={processarPdf}>
                {carregando ? "Processando..." : "Processar PDF"}
              </button>
              <button className="btn-main" onClick={criarRelatorioManual}>
                + Relatório manual
              </button>
              <button className="btn-main" onClick={adicionarServico}>
                + Adicionar serviços
              </button>

              <details className="action-group">
                <summary>🏢 Empresas</summary>
                <div className="action-group-menu">
                  <button className="btn-gray" onClick={abrirCadastroNovo}>+ Cadastrar empresa</button>
                  <button className="btn-gray" onClick={abrirEditarEmpresa} disabled={!empresaAtual}>✏️ Editar empresa</button>
                  <button className="btn-gray" onClick={aplicar20EmTodasNoturnas}>🌙 Aplicar 20% nas noturnas</button>
                </div>
              </details>

              <details className="action-group">
                <summary>👁️ Visualizar / Salvar</summary>
                <div className="action-group-menu">
                  <button className="btn-gray" onClick={() => visualizarAntesDeSalvar("cliente")}>👁️ Visualizar cliente</button>
                  <button className="btn-gray" onClick={() => visualizarAntesDeSalvar("interno")}>👁️ Visualizar interno</button>
                  <button className="btn-gray" onClick={imprimirCliente}>📄 Salvar PDF Cliente</button>
                  <button className="btn-gray" onClick={imprimirInterno}>📊 Salvar PDF Interno</button>
                </div>
              </details>

              <details className="action-group">
                <summary>💾 Editar / Backup</summary>
                <div className="action-group-menu">
                  <button className="btn-gray" onClick={gerarBackupManual}>Backup agora</button>
                  <button className="btn-main" onClick={salvarBackupRelatorioAtual}>Salvar relatório editável</button>
                  <label className="btn-gray" style={{ display: "inline-flex", alignItems: "center", cursor: "pointer" }}>
                    Abrir backup/relatório
                    <input type="file" accept="application/json,.json" onChange={abrirBackupRelatorioArquivo} style={{ display: "none" }} />
                  </label>
                  <button className="btn-gray" onClick={abrirUltimoRelatorioSalvo}>Editar último relatório</button>
                </div>
              </details>

              <details className="action-group">
                <summary>🔎 Zoom</summary>
                <div className="action-group-menu">
                  <button className="btn-gray" onClick={() => setZoomRelatorio(1.0)}>Zoom 100%</button>
                  <button className="btn-gray" onClick={() => setZoomRelatorio(1.1)}>Zoom 110%</button>
                  <button className="btn-gray" onClick={() => setZoomRelatorio(1.2)}>Zoom 120%</button>
                </div>
              </details>

              <details className="action-group">
                <summary>🧹 Limpar</summary>
                <div className="action-group-menu">
                  <button className="btn-red" onClick={limparTabelaToda}>Limpar tabela</button>
                  <button className="btn-gray" onClick={limparRascunhoAutomatico}>Limpar rascunho</button>
                  <button className="btn-gray" onClick={limpar20}>Limpar 20%</button>
                </div>
              </details>

            </div>
            {resultado && (
              <div className="manual-hint">
                Conferência: use o PDF processado ou crie relatório manual, marque os dias/valores e gere o PDF.
              </div>
            )}
            {mostrarCadastro && (
              <div className="cadastro-box">
                <div className="cadastro-title">
                  {empresaForm.id ? "Editar empresa" : "Cadastrar nova empresa"}
                </div>

                <div className="cadastro-grid">
                  <div>
                    <label>ID interno</label>
                    <input
                      value={empresaForm.id}
                      placeholder="ex: geoambiental"
                      onChange={(e) => atualizarEmpresaForm("id", e.target.value)}
                    />
                  </div>
                  <div>
                    <label>Nome da empresa</label>
                    <input
                      value={empresaForm.nome}
                      placeholder="Nome do cliente"
                      onChange={(e) => atualizarEmpresaForm("nome", e.target.value)}
                    />
                  </div>
                  <div>
                    <label>CNPJ</label>
                    <input
                      value={empresaForm.cnpj}
                      placeholder="00.000.000/0000-00"
                      onChange={(e) => atualizarEmpresaForm("cnpj", e.target.value)}
                    />
                  </div>
                  <div>
                    <label>Diária diurna</label>
                    <input
                      type="number"
                      value={empresaForm.diaria_diurna}
                      onChange={(e) => atualizarEmpresaForm("diaria_diurna", e.target.value)}
                    />
                  </div>
                  <div>
                    <label>Diária noturna</label>
                    <input
                      type="number"
                      value={empresaForm.diaria_noturna}
                      onChange={(e) => atualizarEmpresaForm("diaria_noturna", e.target.value)}
                    />
                  </div>
                  <div>
                    <label>Sábado</label>
                    <input
                      type="number"
                      value={empresaForm.sabado}
                      onChange={(e) => atualizarEmpresaForm("sabado", e.target.value)}
                    />
                  </div>
                  <div>
                    <label>Domingo/Feriado</label>
                    <input
                      type="number"
                      value={empresaForm.domingo_feriado}
                      onChange={(e) => atualizarEmpresaForm("domingo_feriado", e.target.value)}
                    />
                  </div>
                  <div>
                    <label>Adic. noturno 25% (auto por tipo de dia)</label>
                    <input
                      type="number"
                      value={empresaForm.adicional_noturno}
                      onChange={(e) => atualizarEmpresaForm("adicional_noturno", e.target.value)}
                    />
                  </div>
                  <div>
                    <label>Hora 20%</label>
                    <input
                      type="number"
                      value={empresaForm.hora_20}
                      onChange={(e) => atualizarEmpresaForm("hora_20", e.target.value)}
                    />
                  </div>
                  <div>
                    <label>Hora 50%</label>
                    <input
                      type="number"
                      value={empresaForm.hora_50}
                      onChange={(e) => atualizarEmpresaForm("hora_50", e.target.value)}
                    />
                  </div>
                  <div>
                    <label>Hora 100%</label>
                    <input
                      type="number"
                      value={empresaForm.hora_100}
                      onChange={(e) => atualizarEmpresaForm("hora_100", e.target.value)}
                    />
                  </div>
                  <div className="check-line">
                    <input
                      type="checkbox"
                      checked={empresaForm.usa_adicional_noturno}
                      onChange={(e) => atualizarEmpresaForm("usa_adicional_noturno", e.target.checked)}
                    />
                    Usa adicional noturno
                  </div>
                  <div className="check-line">
                    <input
                      type="checkbox"
                      checked={empresaForm.feriado_usa_valor_domingo}
                      onChange={(e) => atualizarEmpresaForm("feriado_usa_valor_domingo", e.target.checked)}
                    />
                    Feriado usa valor domingo
                  </div>
                </div>

                <div className="actions">
                  <button className="btn-main" onClick={salvarEmpresa}>
                    Salvar empresa
                  </button>
                  <button className="btn-gray" onClick={() => setMostrarCadastro(false)}>
                    Cancelar
                  </button>
                </div>
              </div>
            )}

            {erro && <strong style={{ color: "red" }}>{erro}</strong>}
          </div>
      </div>

      {rascunhoStatus && <div className="rascunho-status">{rascunhoStatus}</div>}

      <div className={`sheet ${!temDiasTrabalhados ? "sem-dias-trabalhados" : ""}`} style={{ transform: `scale(${zoomRelatorio})`, transformOrigin: "top center" }}>
        <div className="watermark">
  <img src={logo} className="logo-watermark" />
</div>

        <div className="content">
          <div className="top">
            <div>
              <div className="brand">YTALSEG</div>
              <div className="brand-sub">
                ASSESSORIA E CONSULTORIA EM SEGURANÇA DO TRABALHO
              </div>
            </div>
            <div className="title">RELATÓRIO DE HORAS</div>
            <div className="seal">
 <img src={logo} className="logo-topo" />
</div>
</div>



          <div className="info">
            <div>
              <div className="label">Empresa / Cliente</div>
              <div className="value">{empresaAtual?.nome || "GEOAMBIENTAL"}</div>
              <div className="cnpj-line">CNPJ: {empresaAtual?.cnpj || "05.453.862/0001-93"}</div>
            </div>
            <div>
              <div className="label">Mês / Referência</div>
              <div className="value">{referenciaAtual}</div>
            </div>
            <div>
              <div className="label">Responsáveis técnicos</div>
              <div className="value">Yatta, Valdemir e Darlan</div>
            </div>
            <div>
              <div className="label">Arquivo processado</div>
              <div className="value">{resultado?.filename || "-"}</div>
            </div>
          </div>

          <div className="grid">
            <div className="panel">
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Dias da Semana</th>
                    <th>Feriado</th>
                    <th>Diurna</th>
                    <th>Noturna</th>
                    <th>20%</th>
                    <th>50%</th>
                    <th>100%</th>
                    <th>Adic. 25%</th>
                  </tr>
                </thead>
                <tbody>
                  {dias.map((dia, i) => {
                    return (
                      <tr key={dia.data}>
                        <td>{i + 1}</td>
                        <td>{normalizarSemana(dia.semana)}</td>
                        <td>
                          <input
                            className="checkbox-small"
                            type="checkbox"
                            checked={dia.feriado}
                            onChange={(e) => atualizarDia(i, "feriado", e.target.checked)}
                          />
                          <span className="print-value">{dia.feriado ? "F" : "-"}</span>
                        </td>
                        <td>
                          <input
                            className="checkbox-small"
                            type="checkbox"
                            checked={dia.diurna}
                            onChange={(e) => atualizarDia(i, "diurna", e.target.checked)}
                          />
                          <span className="print-value">{dia.diurna ? "1" : "-"}</span>
                        </td>
                        <td>
                          <input
                            className="checkbox-small"
                            type="checkbox"
                            checked={dia.noturna}
                            onChange={(e) => atualizarDia(i, "noturna", e.target.checked)}
                          />
                          <span className="print-value">{dia.noturna ? "1" : "-"}</span>
                        </td>
                        <td>
                          <input
                            className="checkbox-small"
                            type="checkbox"
                            checked={dia.extra20}
                            onChange={(e) => atualizarDia(i, "extra20", e.target.checked)}
                          />
                          <span className="print-value">{dia.extra20 ? "1" : "-"}</span>
                        </td>
                        <td>
                          <input
                            className="checkbox-small"
                            type="checkbox"
                            checked={dia.extra50}
                            onChange={(e) => atualizarDia(i, "extra50", e.target.checked)}
                          />
                          <span className="print-value">{dia.extra50 ? "1" : "-"}</span>
                        </td>
                        <td>
                          <input
                            className="checkbox-small"
                            type="checkbox"
                            checked={dia.extra100}
                            onChange={(e) => atualizarDia(i, "extra100", e.target.checked)}
                          />
                          <span className="print-value">{dia.extra100 ? "1" : "-"}</span>
                        </td>
                        <td>
                          <input
                            className="checkbox-small"
                            type="checkbox"
                            checked={dia.adicional}
                            disabled={!dia.noturna}
                            onChange={(e) => atualizarDia(i, "adicional", e.target.checked)}
                          />
                          <span className="print-value">{dia.adicional ? brl(VALORES.adicionalNoturno) : "-"}</span>
                        </td>
                      </tr>
                    );
                  })}
                  <tr className="total-row">
                    <td colSpan={2}>TOTAL</td>
                    <td>{resumo?.feriados || 0}</td>
                    <td>{resumo?.periodos_diurnos || 0}</td>
                    <td>{resumo?.periodos_noturnos || 0}</td>
                    <td>{resumo?.extras20 || 0}</td>
                    <td>{resumo?.extras50 || 0}</td>
                    <td>{resumo?.extras100 || 0}</td>
                    <td>{brl(resumo.total_adicional_noturno || 0)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div>
              <div className="panel tabela-valores">
                <div className="panel-title">TABELA DE VALORES</div>
                <table>
                  <tbody>
                    {[
                      ["Diária Diurno (07:00 às 19:00)", VALORES.diariaNormal],
                      ["Diária Noturna (19:00 às 07:00)", VALORES.diariaNoturna],
                      ["Hora Extra 20%", VALORES.hora20],
                      ["Hora Extra 50%", VALORES.hora50],
                      ["Hora Extra 100%", VALORES.hora100],
                      ["Adicional Noturno 25%", VALORES.adicionalNoturno],
                      ["Sábado", VALORES.sabado],
                      ["Domingo / Feriado", VALORES.domingoFeriado],
                    ].map(([nome, valor]) => (
                      <tr key={String(nome)}>
                        <td className="left">{nome}</td>
                        <td>{brl(Number(valor))}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="panel resumo-cobranca-panel">
                <div className="panel-title">RESUMO DE COBRANÇA</div>
                <table>
                  <tbody>
                    <tr>
                      <td className="left">Diárias Normais</td>
                      <td>{resumo?.dias_normais || 0}</td>
                      <td>{brl(resumo?.total_diarias || 0)}</td>
                    </tr>
                    <tr>
                      <td className="left">Sábados</td>
                      <td>{resumo?.sabados || 0}</td>
                      <td>{brl(resumo?.total_sabados || 0)}</td>
                    </tr>
                    <tr>
                      <td className="left">Domingos/Feriados</td>
                      <td>{resumo?.domingos_feriados || 0}</td>
                      <td>{brl(resumo?.total_domingos_feriados || 0)}</td>
                    </tr>
                    <tr>
                      <td className="left">Extras 20%</td>
                      <td>{resumo?.extras20 || 0}</td>
                      <td>{brl(resumo?.total_20 || 0)}</td>
                    </tr>
                    <tr>
                      <td className="left">Extras 50%</td>
                      <td>{resumo?.extras50 || 0}</td>
                      <td>{brl(resumo?.total_50 || 0)}</td>
                    </tr>
                    <tr>
                      <td className="left">Extras 100%</td>
                      <td>{resumo?.extras100 || 0}</td>
                      <td>{brl(resumo?.total_100 || 0)}</td>
                    </tr>
                    <tr>
                      <td className="left">Adic. Noturno</td>
                      <td>{diasEditaveis.filter((d) => d.adicional).length}</td>
                      <td>{brl(resumo?.total_adicional_noturno || 0)}</td>
                    </tr>
                    <tr>
                      <td className="left">Serviços Diversos</td>
                      <td>{servicos.length}</td>
                      <td>{brl(totalServicosDiversos)}</td>
                    </tr>
                    <tr className="total-row">
                      <td className="left">VALOR DA NOTA</td>
                      <td colSpan={2}>{brl(valorNota)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="obs">
            <h3>OBSERVAÇÕES / SERVIÇOS DIVERSOS:</h3>
            <p> Serviços e valores a somar na nota.</p>

            <table>
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Descrição do Serviço</th>
                  <th>Valor (R$)</th>
                  <th>Ação</th>
                </tr>
              </thead>
              <tbody>
                {servicos.length === 0 && (
                  <tr>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                  </tr>
                )}

                {servicos.map((s, i) => (
                  <tr key={i} className="servico-row">
                    <td style={{ padding: "0 4px", verticalAlign: "middle", width: "90px", minWidth: "90px" }}>
                      <input
                        style={{ height: "22px", width: "100%", padding: "0 4px", fontSize: "11px", boxSizing: "border-box", border: "1px solid #ccc", borderRadius: "4px", background: "transparent" }}
                        value={s.data}
                        onChange={(e) => atualizarServico(i, "data", e.target.value)}
                      />
                    </td>
                    <td style={{ padding: "0 4px", verticalAlign: "middle" }}>
                      <input
                        style={{ height: "22px", width: "100%", padding: "0 5px", fontSize: "12px", boxSizing: "border-box", border: "1px solid #ccc", borderRadius: "4px", background: "transparent" }}
                        value={s.descricao}
                        onChange={(e) => atualizarServico(i, "descricao", e.target.value)}
                      />
                    </td>
                    <td style={{ padding: "0 4px", verticalAlign: "middle", width: "75px", minWidth: "75px" }}>
                      <input
                        type="number"
                        style={{ height: "22px", width: "100%", padding: "0 4px", fontSize: "11px", boxSizing: "border-box", border: "1px solid #ccc", borderRadius: "4px", background: "transparent" }}
                        value={s.valor}
                        onChange={(e) => atualizarServico(i, "valor", e.target.value)}
                      />
                    </td>
                    <td className="acao-col" style={{ padding: "0 4px", verticalAlign: "middle" }}>
                      <button className="btn-red" onClick={() => removerServico(i)}>
                        Remover
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={{ marginTop: 8, fontWeight: 800 }}>
              Total serviços diversos: {brl(totalServicosDiversos)}
            </div>
          </div>

          <div className="footer-final">
            <div className="ytalseg-card-final">
              <div className="logo-area-final">
                <div className="logo-circle-final">
<img src={logo} className="logo-card" />
</div>
</div>

<div className="info-area-final">
                <h2>YTALSEG</h2>
                <p>Assessoria e Consultoria em Segurança do Trabalho</p>
                <p>CNPJ:18.315.702/0001-20</p>

                <strong>REPRESENTANTES RESPONSÁVEIS:</strong>

                <div className="rep-line">
                  <span>📞 Yatta </span>
                  <span>(11) 9 5789-8196 </span>
                </div>
                <div className="rep-line">
                  <span>📞 Valdemir  </span>
                  <span>(11) 9 94711-9488 </span>
                </div>
                <div className="rep-line">
                  <span>📞 Darlan </span>
                  <span>(11) 9 8407-7772 </span>
                </div>

                <div className="email-line">✉ Email: financeiro.ytalseg@gmail.com</div>
              </div>
            </div>

            <div className="nota-final">
              <div className="nota-icon">📄💲</div>
              <div>
                <span>VALOR DA NOTA</span>
                <strong className={classeValorNota(valorNota)}>{brl(valorNota)}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}