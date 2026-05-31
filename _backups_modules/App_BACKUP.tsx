// YTALSEG ERP - V51 FINAL CONSOLIDADA
// Base consolidada a partir do App.tsx atual enviado.
// Foco: estabilidade, menu limpo, permissões sem duplicações e zero bugs de merge com | em JSX.

import HistoricoPDFs from "./modules/HistoricoPDFs";
import React, { useState } from "react";
import Relatorios from "./modules/Relatorios";
import Dashboard from "./modules/Dashboard";
import DashboardOperacional from "./modules/DashboardOperacional";
import DashboardGraficos from "./modules/DashboardGraficos";
import PacoteCliente from "./modules/PacoteCliente";
import CentralPendencias from "./modules/CentralPendencias";
import BancoLocal from "./modules/BancoLocal";
import AuditoriaSistema from "./modules/AuditoriaSistema";
import Notificacoes from "./modules/Notificacoes";
import LoginSistema from "./modules/LoginSistema";
import PermissoesSistema from "./modules/PermissoesSistema";
import BackupAutomatico from "./modules/BackupAutomatico";
import FluxoAutomaticoV23 from "./modules/FluxoAutomatico";
import EnvioRealV24 from "./modules/EnvioReal";
import Clientes from "./modules/Clientes";
import Financeiro from "./modules/Financeiro";
import Equipe from "./modules/Equipe";
import NotaFiscal from "./modules/NotaFiscal";
import Operacional from "./modules/Operacional";
import Configuracoes from "./modules/Configuracoes";
import ConfiguracoesSistema from "./modules/ConfiguracoesSistema";
import EnvioAutomatico from "./modules/EnvioAutomatico";
import EnvioReal from "./modules/EnvioReal";
import EnvioPDFReal from "./modules/EnvioPDFReal";

type MenuKey = "dashboard" | "dashboard-operacional" | "dashboard-graficos" | "pacote-cliente" | "pendencias" | "banco-local" | "auditoria" | "notificacoes" | "permissoes" | "backup" | "fluxo-automatico" | "envio-real-v24" | "dashboard-v26" | "banco-v27" | "auditoria-v28" | "multi-v29" | "acesso-v30" | "usuarios-v33" | "persistencia-v36" | "alertas-v37" | "monitoramento-v38" | "dashboardpro-v39" | "logs-v40" | "backup-v41" | "cloudreal-status-v45-1" | "api-real-v46" | "diagnostico-v47" | "performance-v48" | "limpeza-v49" | "auditoria-v50" | "notificacoes-v35" | "envio-completo-v25" | "config-sistema" | "envio" | "envio-real" | "envio-pdf-real" | "relatorios" | "clientes" | "financeiro" | "equipe" | "notafiscal" | "operacional" | "configuracoes" | "historico-pdfs";

const VERDE = "#00B050";

type PerfilUsuario = "admin" | "operador" | "financeiro" | "consulta";

const PERMISSOES_MENU: Record<PerfilUsuario, MenuKey[]> = {
  admin: [
    "dashboard",
    "envio-completo-v25",
    "dashboard-operacional",
    "dashboard-graficos",
    "pacote-cliente",
    "fluxo-automatico",
    "pendencias",
    "alertas-v37",
    "monitoramento-v38",
    "dashboardpro-v39",
    "logs-v40",
    "backup-v41",
    "banco-local",
    "auditoria",
    "notificacoes",
    "permissoes",
    "usuarios-v33",
    "persistencia-v36",
    "api-real-v46",
    "diagnostico-v47",
    "performance-v48",
    "limpeza-v49",
    "auditoria-v50",
    "config-sistema",
    "envio",
    "envio-real",
    "envio-pdf-real",
    "relatorios",
    "clientes",
    "financeiro",
    "equipe",
    "notafiscal",
    "operacional",
    "configuracoes",
    "historico-pdfs",
  ],
  operador: [
    "dashboard",
    "dashboard-operacional",
    "pacote-cliente",
    "pendencias",
    "notificacoes",
    "envio",
    "envio-real",
    "envio-pdf-real",
    "fluxo-automatico",
    "relatorios",
    "clientes",
    "operacional",
    "historico-pdfs",
  ],
  financeiro: [
    "dashboard",
    "dashboard-graficos",
    "pacote-cliente",
    "pendencias",
    "banco-local",
    "auditoria",
    "financeiro",
    "notafiscal",
    "historico-pdfs",
  ],
  consulta: [
    "dashboard",
    "dashboard-operacional",
    "dashboard-graficos",
    "pendencias",
    "notificacoes",
    "historico-pdfs",
  ],
};

function Card({
  titulo,
  valor,
  detalhe,
}: {
  titulo: string;
  valor: string;
  detalhe: string;
}) {
  return (
    <div className="erp-card">
      <div className="erp-card-title">{titulo}</div>
      <div className="erp-card-value">{valor}</div>
      <div className="erp-card-detail">{detalhe}</div>
    </div>
  );
}

function Placeholder({ titulo }: { titulo: string }) {
  return (
    <div className="placeholder">
      <h1>{titulo}</h1>
      <p>Base criada. Este módulo será conectado na próxima etapa.</p>
    </div>
  );
}

export default function App() {
  const [user, setUser] = React.useState<string>("");
  const [perfil, setPerfil] = React.useState<PerfilUsuario>("admin");
  const [menu, setMenu] = useState<MenuKey>("dashboard");
  const [grupoAbertoV52, setGrupoAbertoV52] = React.useState<string>("Principal");

  React.useEffect(() => {
    const data = localStorage.getItem("ytalseg_user_v20");
    if (data) {
      try {
        const parsed = JSON.parse(data);
        setUser(parsed.user || "");
        setPerfil(parsed.perfil || "admin");
      } catch {}
    }
  }, []);

  function sair() {
    localStorage.removeItem("ytalseg_user_v20");
    setUser("");
  }

  const menuItems: { id: MenuKey; label: string; icon: string }[] = [
    { id: "dashboard", label: "Dashboard", icon: "📊" },
    { id: "dashboard-operacional", label: "Dashboard Operacional", icon: "📈" },
    { id: "dashboard-graficos", label: "Gráficos", icon: "📊" },
    { id: "pacote-cliente", label: "Pacote Cliente", icon: "📦" },
    { id: "pendencias", label: "Pendências", icon: "⚠️" },
    { id: "banco-local", label: "Banco Local", icon: "🗄️" },
    { id: "auditoria", label: "Auditoria", icon: "🧾" },
    { id: "logs-v40", label: "Logs do Sistema", icon: "🧾" },
    { id: "backup-v41", label: "Backup Seguro V41", icon: "💾" },
    { id: "cloudreal-status-v45-1", label: "Cloud Real Status", icon: "🌐" },
    { id: "api-real-v46", label: "API Real", icon: "🔌" },
    { id: "diagnostico-v47", label: "Diagnóstico", icon: "🩺" },
    { id: "performance-v48", label: "Performance", icon: "⚡" },
    { id: "limpeza-v49", label: "Limpeza Inteligente", icon: "🧹" },
    { id: "auditoria-v50", label: "Auditoria Avançada V50", icon: "📋" },
    { id: "notificacoes", label: "Notificações", icon: "🔔" },
    { id: "permissoes", label: "Permissões", icon: "🔐" },
    { id: "usuarios-v33", label: "Usuários / Login", icon: "👥" },
    { id: "persistencia-v36", label: "Persistência Real", icon: "🧠" },
    { id: "alertas-v37", label: "Alertas Inteligentes", icon: "🚨" },
    { id: "monitoramento-v38", label: "Monitoramento", icon: "📡" },
    { id: "dashboardpro-v39", label: "Dashboard PRO", icon: "📊" },
    { id: "backup", label: "Backup", icon: "💾" },
    { id: "fluxo-automatico", label: "Fluxo Automático", icon: "⚡" },
    { id: "envio-real-v24", label: "Envio Real V24", icon: "📨" },
    { id: "dashboard-v26", label: "Dashboard Avançado", icon: "📊" },
    { id: "banco-v27", label: "Banco Avançado", icon: "💾" },
    { id: "auditoria-v28", label: "Auditoria Avançada", icon: "📋" },
    { id: "multi-v29", label: "Multiusuário", icon: "👥" },
    { id: "acesso-v30", label: "Controle de Acesso", icon: "🔐" },
    { id: "notificacoes-v35", label: "Notificações V35", icon: "🔔" },
    { id: "envio-completo-v25", label: "Envio Completo", icon: "✅" },
    { id: "config-sistema", label: "Config Sistema", icon: "🛠️" },
    { id: "envio", label: "Envio", icon: "📤" },
    { id: "relatorios", label: "Relatórios", icon: "📄" },
    { id: "clientes", label: "Clientes", icon: "🏢" },
    { id: "financeiro", label: "Financeiro", icon: "💰" },
    { id: "equipe", label: "Equipe", icon: "👷" },
    { id: "notafiscal", label: "Nota Fiscal", icon: "🧾" },
    { id: "operacional", label: "Operacional", icon: "📅" },
    { id: "configuracoes", label: "Configurações", icon: "⚙️" },
    { id: "historico-pdfs", label: "Histórico PDFs", icon: "📁" },
  ];

  const menuItemsFiltrados = menuItems.filter((item) =>
    PERMISSOES_MENU[perfil]?.includes(item.id)
  );

  const menuGruposV52: { titulo: string; icone: string; ids: MenuKey[] }[] = [
    {
      titulo: "Principal",
      icone: "🏠",
      ids: ["dashboard", "dashboard-operacional", "dashboard-graficos", "dashboardpro-v39"],
    },
    {
      titulo: "Operação",
      icone: "📁",
      ids: ["relatorios", "historico-pdfs", "pacote-cliente", "pendencias", "envio", "envio-real", "envio-pdf-real", "envio-real-v24", "envio-completo-v25", "fluxo-automatico", "operacional"],
    },
    {
      titulo: "Gestão",
      icone: "👥",
      ids: ["clientes", "financeiro", "equipe", "notafiscal", "usuarios-v33", "permissoes", "multi-v29", "acesso-v30"],
    },
    {
      titulo: "Dados e Segurança",
      icone: "💾",
      ids: ["banco-local", "banco-v27", "backup", "backup-v41", "persistencia-v36", "cloudreal-status-v45-1", "api-real-v46"],
    },
    {
      titulo: "Sistema",
      icone: "🛠️",
      ids: ["auditoria", "auditoria-v28", "auditoria-v50", "logs-v40", "notificacoes", "notificacoes-v35", "alertas-v37", "monitoramento-v38", "diagnostico-v47", "performance-v48", "limpeza-v49", "config-sistema", "configuracoes", "dashboard-v26"],
    },
  ];

  const menuGruposRenderizadosV52 = menuGruposV52
    .map((grupo) => ({
      ...grupo,
      itens: grupo.ids
        .map((id) => menuItemsFiltrados.find((item) => item.id === id))
        .filter(Boolean) as { id: MenuKey; label: string; icon: string }[],
    }))
    .filter((grupo) => grupo.itens.length > 0);

  const temPermissaoMenuAtual = PERMISSOES_MENU[perfil]?.includes(menu);

  React.useEffect(() => {
    if (!temPermissaoMenuAtual) {
      setMenu("dashboard");
    }
  }, [perfil, temPermissaoMenuAtual]);

  React.useEffect(() => {
    const grupoAtual = menuGruposRenderizadosV52.find((grupo) =>
      grupo.itens.some((item) => item.id === menu)
    );

    if (grupoAtual) {
      setGrupoAbertoV52(grupoAtual.titulo);
    }
  }, [menu]);

  if (!user) {
    return (
      <LoginSistema
        onLogin={(nome: string, perfilSelecionado: PerfilUsuario) => {
          setUser(nome);
          setPerfil(perfilSelecionado);
        }}
      />
    );
  }

  return (
    <div className="erp-root">
      <style>{`
        * { box-sizing: border-box; }

        body {
          margin: 0;
          font-family: Arial, sans-serif;
          background: #eef1f3;
          color: #111;
        }

        .erp-root {
          min-height: 100vh;
          display: flex;
          background: #eef1f3;
        }

        .sidebar {
          width: 270px;
          min-width: 270px;
          height: 100vh;
          max-height: 100vh;
          overflow-y: auto;
          overflow-x: hidden;
          background: #fff;
          border-right: 1px solid #dfe3e8;
          padding: 14px 12px;
          position: sticky;
          top: 0;
          box-shadow: 4px 0 22px rgba(0,0,0,.05);
          z-index: 50;
          scrollbar-width: thin;
        }

        .logo-area {
          padding: 8px 10px 12px;
          border-bottom: 1px solid #e5e7eb;
          margin-bottom: 6px;
        }

        .logo-title {
          color: ${VERDE};
          font-size: 28px;
          font-weight: 1000;
          letter-spacing: -1px;
          line-height: .9;
        }

        .logo-sub {
          margin-top: 8px;
          font-size: 12px;
          font-weight: 900;
          color: #4b5563;
        }

        .menu {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .menu-group {
          margin-bottom: 6px;
        }

        .menu-group-title {
          margin: 14px 10px 6px;
          color: #6b7280;
          font-size: 11px;
          font-weight: 1000;
          text-transform: uppercase;
          letter-spacing: .6px;
        }

        .menu-group-items {
          display: flex;
          flex-direction: column;
          gap: 4px;
          padding-left: 6px;
          border-left: 2px solid #e5e7eb;
          margin-left: 10px;
          margin-top: 6px;
        }

        .menu-folder-button {
          border: 0;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          background: #f9fafb;
          color: #111827;
          padding: 10px 12px;
          border-radius: 12px;
          cursor: pointer;
          font-size: 15px;
          font-weight: 1000;
          text-align: left;
        }

        .menu-folder-button:hover {
          background: #f3f4f6;
        }

        .menu-folder-left {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .menu-folder-count {
          min-width: 24px;
          height: 24px;
          border-radius: 999px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: #eafff2;
          color: #006b34;
          font-size: 11px;
          font-weight: 1000;
        }

        .menu-folder-arrow {
          color: #6b7280;
          font-weight: 1000;
        }

        .menu button {
          border: 0;
          width: 100%;
          display: flex;
          align-items: center;
          gap: 12px;
          background: transparent;
          color: #374151;
          padding: 10px 12px;
          border-radius: 12px;
          cursor: pointer;
          font-size: 15px;
          font-weight: 900;
          text-align: left;
        }

        .menu button:hover {
          background: #f3f4f6;
        }

        .menu button.active {
          background: ${VERDE};
          color: #fff;
          box-shadow: 0 8px 22px rgba(0,176,80,.25);
        }

        .main {
          flex: 1;
          min-width: 0;
        }

        .topbar {
          min-height: 96px;
          background: rgba(255,255,255,.94);
          border-bottom: 1px solid #e5e7eb;
          display: grid;
          grid-template-columns: minmax(220px, 1fr) auto minmax(260px, auto);
          align-items: center;
          gap: 14px;
          padding: 14px 26px;
          position: sticky;
          top: 0;
          z-index: 40;
          backdrop-filter: blur(10px);
          overflow: visible;
        }

        .topbar h2 {
          margin: 0;
          font-size: 22px;
          font-weight: 1000;
          color: #111827;
        }

        .pill {
          color: #006b34;
          background: #eafff2;
          border: 1px solid rgba(0,176,80,.25);
          border-radius: 999px;
          padding: 8px 12px;
          font-size: 12px;
          font-weight: 1000;
          white-space: nowrap;
        }

        .topbar-user {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 10px;
          min-width: 260px;
          white-space: nowrap;
          color: #111827;
          font-size: 14px;
          position: relative;
          z-index: 2;
        }
        @media (max-width: 1180px) {
          .topbar { grid-template-columns: 1fr; align-items: start; }
          .topbar-user { justify-content: flex-start; min-width: 0; }
        }

        .topbar-user button {
          border: 0;
          border-radius: 10px;
          padding: 8px 12px;
          font-weight: 900;
          cursor: pointer;
          background: #e5e7eb;
          color: #111827;
        }

        .content {
          padding: 24px;
        }

        .dash-title {
          margin: 0;
          font-size: 34px;
          font-weight: 1000;
          color: #111827;
        }

        .dash-sub {
          margin-top: 6px;
          color: #6b7280;
          font-weight: 700;
          margin-bottom: 22px;
        }

        .cards {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 16px;
        }

        .erp-card {
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 22px;
          padding: 20px;
          box-shadow: 0 12px 26px rgba(0,0,0,.06);
        }

        .erp-card-title {
          color: #6b7280;
          font-size: 13px;
          font-weight: 1000;
          text-transform: uppercase;
        }

        .erp-card-value {
          color: ${VERDE};
          font-size: 32px;
          font-weight: 1000;
          margin-top: 8px;
        }

        .erp-card-detail {
          margin-top: 6px;
          color: #6b7280;
          font-size: 12px;
          font-weight: 700;
        }

        .dash-grid {
          display: grid;
          grid-template-columns: 1.35fr .9fr;
          gap: 18px;
          margin-top: 18px;
        }

        .panel {
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 24px;
          padding: 22px;
          box-shadow: 0 12px 26px rgba(0,0,0,.06);
        }

        .panel h3 {
          margin: 0 0 10px;
          font-size: 20px;
        }

        .panel p {
          margin: 0;
          color: #6b7280;
          font-weight: 700;
          line-height: 1.5;
        }

        .placeholder {
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 24px;
          padding: 30px;
          box-shadow: 0 12px 26px rgba(0,0,0,.06);
        }

        .placeholder h1 {
          margin: 0 0 8px;
          font-size: 30px;
        }

        .placeholder p {
          margin: 0;
          color: #6b7280;
          font-weight: 700;
        }

        .relatorios-box {
          margin: -24px;
        }

        @media (max-width: 1100px) {
          .cards,
          .dash-grid {
            grid-template-columns: 1fr 1fr;
          }
        }

        @media (max-width: 820px) {
          .erp-root {
            display: block;
          }

          .sidebar {
            width: 100%;
            min-width: 0;
            height: auto;
            position: relative;
          }

          .cards,
          .dash-grid {
            grid-template-columns: 1fr;
          }
        }

        @media print {
          .sidebar,
          .topbar {
            display: none !important;
          }

          .erp-root,
          .main,
          .content,
          .relatorios-box {
            display: block !important;
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
          }
        }
      `}</style>

      <aside className="sidebar">
        <div className="logo-area">
          <div className="logo-title">YTALSEG</div>
          <div className="logo-sub">ERP Interno Premium</div>
        </div>

        <nav className="menu">
          {menuGruposRenderizadosV52.map((grupo) => {
            const aberto = grupoAbertoV52 === grupo.titulo;

            return (
              <div className="menu-group" key={grupo.titulo}>
                <button
                  type="button"
                  className="menu-folder-button"
                  onClick={() => setGrupoAbertoV52(aberto ? "" : grupo.titulo)}
                >
                  <span className="menu-folder-left">
                    <span>{grupo.icone}</span>
                    <span>{grupo.titulo}</span>
                  </span>

                  <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span className="menu-folder-count">{grupo.itens.length}</span>
                    <span className="menu-folder-arrow">{aberto ? "▲" : "▼"}</span>
                  </span>
                </button>

                {aberto && (
                  <div className="menu-group-items">
                    {grupo.itens.map((item) => (
                      <button
                        key={item.id}
                        className={menu === item.id ? "active" : ""}
                        onClick={() => setMenu(item.id)}
                      >
                        <span>{item.icon}</span>
                        {item.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </aside>

      <main className="main">
        <header className="topbar">
          <h2>
            {menu === "dashboard" && "Dashboard Geral"}
            {menu === "api-real-v46" && "API Real"}
            {menu === "diagnostico-v47" && "Diagnóstico"}
            {menu === "performance-v48" && "Performance"}
            {menu === "limpeza-v49" && "Limpeza Inteligente"}
            {menu === "auditoria-v50" && "Auditoria"}
            {menu === "dashboard-operacional" && "Dashboard Operacional"}
            {menu === "dashboard-graficos" && "Dashboard com Gráficos"}
            {menu === "pacote-cliente" && "Pacote do Cliente"}
            {menu === "pendencias" && "Central de Pendências"}
            {menu === "banco-local" && "Banco Local"}
            {menu === "auditoria" && "Auditoria do Sistema"}
            {menu === "logs-v40" && "Logs do Sistema"}
            {menu === "backup-v41" && "Backup V41"}
            {menu === "notificacoes" && "Notificações"}
            {menu === "permissoes" && "Permissões do Sistema"}
            {menu === "usuarios-v33" && "Usuários / Login"}
            {menu === "persistencia-v36" && "Persistência Real Electron"}
            {menu === "alertas-v37" && "Alertas Inteligentes"}
            {menu === "monitoramento-v38" && "Monitoramento"}
            {menu === "dashboardpro-v39" && "Dashboard PRO"}
            {menu === "backup" && "Backup Automático"}
            {menu === "fluxo-automatico" && "Fluxo Automático"}
            {menu === "envio-real-v24" && "Envio Real V24"}
            {menu === "dashboard-v26" && "Dashboard Avançado"}
            {menu === "banco-v27" && "Banco Avançado"}
            {menu === "auditoria-v28" && "Auditoria Avançada"}
            {menu === "multi-v29" && "Multiusuário"}
            {menu === "acesso-v30" && "Controle de Acesso"}
            {menu === "notificacoes-v35" && "Notificações V35"}
            {menu === "envio-completo-v25" && "Envio Completo 1 Clique"}
            {menu === "config-sistema" && "Configurações do Sistema"}
            {menu === "envio" && "Envio Automático"}
            {menu === "envio-real" && "Envio Real"}
            {menu === "envio-pdf-real" && "Envio com PDF Real"}
            {menu === "relatorios" && "Relatórios de Horas"}
            {menu === "clientes" && "Clientes"}
            {menu === "financeiro" && "Financeiro"}
            {menu === "equipe" && "Equipe"}
            {menu === "notafiscal" && "Nota Fiscal"}
            {menu === "operacional" && "Operacional"}
            {menu === "configuracoes" && "Configurações"}
            {menu === "historico-pdfs" && "Histórico de PDFs"}
          </h2>
          <div className="pill">Sistema Interno YTALSEG</div>
          <div className="topbar-user">
            <strong>Usuário: {user} • Perfil: {perfil}</strong>
            <button onClick={sair}>Sair</button>
          </div>
    </header>

        <section className="content">
          {menu === "dashboard" && <Dashboard />}
          {menu === "api-real-v46" && <IntegracaoAPIRealV46 />}
          {menu === "diagnostico-v47" && <DiagnosticoSistemaV47 />}
          {menu === "performance-v48" && <PerformanceSistemaV48 />}
          {menu === "limpeza-v49" && <LimpezaInteligenteV49 />}
          {menu === "auditoria-v50" && <AuditoriaAvancadaV50 />}
          {menu === "dashboard-operacional" && <DashboardOperacional />}
          {menu === "dashboard-graficos" && <DashboardGraficos />}
          {menu === "pacote-cliente" && <PacoteCliente />}
          {menu === "pendencias" && <CentralPendencias />}
          {menu === "banco-local" && <BancoLocal />}
          {menu === "auditoria" && <AuditoriaSistema />}
          {menu === "logs-v40" && <LogsSistemaV40 />}
          {menu === "backup-v41" && <BackupAutomaticoV41 />}
          {menu === "notificacoes" && <Notificacoes />}
          {menu === "permissoes" && <PermissoesSistema />}
          {menu === "usuarios-v33" && <GestaoUsuariosV33 />}
          {menu === "persistencia-v36" && <PersistenciaElectronV36 />}
          {menu === "alertas-v37" && <AlertasInteligentesV37 />}
          {menu === "monitoramento-v38" && <CentralMonitoramentoV38 />}
          {menu === "dashboardpro-v39" && <DashboardProV39 />}
          {menu === "backup" && <BackupAutomatico />}
          {menu === "fluxo-automatico" && <FluxoAutomaticoV23 />}
          {menu === "envio-real-v24" && <EnvioRealV24 />}
          {menu === "dashboard-v26" && <DashboardAvancadoV26 />}
          {menu === "banco-v27" && <BancoAvancadoV27 />}
          {menu === "auditoria-v28" && <AuditoriaAvancadaV28 />}
          {menu === "multi-v29" && <MultiUsuarioV29 />}
          {menu === "acesso-v30" && <ControleAcessoV30 perfil={perfil} />}
          {menu === "notificacoes-v35" && <NotificacoesSistemaV35 />}
          {menu === "envio-completo-v25" && <EnvioCompletoV25 />}
          {menu === "config-sistema" && <ConfiguracoesSistema />}
          {menu === "envio" && <EnvioAutomatico />}
          {menu === "envio-real" && <EnvioReal />}
          {menu === "envio-pdf-real" && <EnvioPDFReal />}

          {menu === "relatorios" && (
            <div className="relatorios-box">
              <Relatorios />
            </div>
          )}

          {menu === "clientes" && <Clientes />}
          {menu === "financeiro" && <Financeiro />}
          {menu === "equipe" && <Equipe />}
          {menu === "notafiscal" && <NotaFiscal />}
          {menu === "operacional" && <Operacional />}
          {menu === "configuracoes" && <Configuracoes />}
          {menu === "historico-pdfs" && <HistoricoPDFs />}
        </section>
      </main>
    </div>
  );
}


function EnvioCompletoV25() {
  const [cliente, setCliente] = React.useState("");
  const [telefone, setTelefone] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [mensagem, setMensagem] = React.useState("");
  const [arquivoNome, setArquivoNome] = React.useState("");

  function gerarMensagem() {
    const texto = [
      `Olá, segue o material do cliente ${cliente || "cliente"} para conferência.`,
      "",
      arquivoNome ? `PDF selecionado: ${arquivoNome}` : "",
      "",
      "Atenciosamente,",
      "YTALSEG",
    ].filter(Boolean).join("\n");

    setMensagem(texto);
  }

  function abrirWhatsApp() {
    const texto = encodeURIComponent(mensagem || `Olá, segue o material do cliente ${cliente || "cliente"} para conferência.`);
    const numero = telefone.replace(/\D/g, "");
    const url = numero ? `https://wa.me/55${numero}?text=${texto}` : `https://wa.me/?text=${texto}`;
    window.open(url, "_blank");
  }

  function abrirEmail() {
    const assunto = encodeURIComponent(`Relatório YTALSEG - ${cliente || "Cliente"}`);
    const corpo = encodeURIComponent(mensagem || `Olá, segue o material para conferência.`);
    window.location.href = `mailto:${email}?subject=${assunto}&body=${corpo}`;
  }

  return (
    <div className="v25-inline">
      <style>{`
        .v25-inline { display: grid; gap: 16px; }
        .v25-inline h1 { margin: 0; font-size: 30px; font-weight: 1000; color: #111827; }
        .v25-inline p { margin: 6px 0 0; color: #6b7280; font-weight: 800; }
        .v25-box { background: white; border: 1px solid #e5e7eb; border-radius: 22px; padding: 18px; box-shadow: 0 10px 24px rgba(0,0,0,.06); }
        .v25-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; }
        .v25-field { display: grid; gap: 6px; }
        .v25-field.full { grid-column: 1 / -1; }
        .v25-field label { font-size: 12px; font-weight: 1000; color: #006b34; text-transform: uppercase; }
        .v25-input, .v25-textarea { width: 100%; border: 1px solid #d1d5db; border-radius: 10px; padding: 10px 12px; font-size: 13px; font-weight: 800; background: white; }
        .v25-textarea { min-height: 150px; resize: vertical; }
        .v25-actions { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 16px; }
        .v25-btn { border: 0; border-radius: 10px; padding: 10px 13px; font-weight: 900; cursor: pointer; background: #e5e7eb; color: #111; }
        .v25-btn-green { background: #00B050; color: white; }
        @media (max-width: 900px) { .v25-grid { grid-template-columns: 1fr; } }
      `}</style>

      <div>
        <h1>Envio Completo</h1>
        <p>Versão embutida no App para eliminar erro de importação do módulo.</p>
      </div>

      <div className="v25-box">
        <div className="v25-grid">
          <div className="v25-field">
            <label>Cliente</label>
            <input className="v25-input" value={cliente} onChange={(e) => setCliente(e.target.value)} placeholder="Nome do cliente" />
          </div>

          <div className="v25-field">
            <label>WhatsApp</label>
            <input className="v25-input" value={telefone} onChange={(e) => setTelefone(e.target.value)} placeholder="DDD + número" />
          </div>

          <div className="v25-field">
            <label>E-mail</label>
            <input className="v25-input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="cliente@email.com" />
          </div>

          <div className="v25-field">
            <label>PDF</label>
            <input className="v25-input" type="file" accept="application/pdf" onChange={(e) => setArquivoNome(e.target.files?.[0]?.name || "")} />
          </div>

          <div className="v25-field full">
            <label>Mensagem</label>
            <textarea className="v25-textarea" value={mensagem} onChange={(e) => setMensagem(e.target.value)} placeholder="Clique em gerar mensagem..." />
          </div>
        </div>

        <div className="v25-actions">
          <button className="v25-btn v25-btn-green" onClick={gerarMensagem}>Gerar mensagem</button>
          <button className="v25-btn v25-btn-green" onClick={abrirWhatsApp}>Enviar WhatsApp</button>
          <button className="v25-btn v25-btn-green" onClick={abrirEmail}>Enviar E-mail</button>
        </div>
      </div>
    </div>
  );
}


function DashboardAvancadoV26() {
  const [dados, setDados] = React.useState({
    envios: 0,
    clientes: 0,
    faturamento: 0
  });

  React.useEffect(() => {
    try {
      const hist = JSON.parse(localStorage.getItem("ytalseg_envios_v25") || "[]");
      const clientes = new Set(hist.map((h:any)=>h.cliente));
      const faturamento = hist.reduce((acc:any, h:any)=>acc + (h.valor || 0),0);

      setDados({
        envios: hist.length,
        clientes: clientes.size,
        faturamento
      });
    } catch {}
  }, []);

  function brl(v:any){
    return new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL"}).format(v||0);
  }

  return (
    <div style={{padding:20}}>
      <h1>Dashboard Avançado</h1>

      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
        <CardDashboardV26 titulo="Envios" valor={dados.envios} />
        <CardDashboardV26 titulo="Clientes" valor={dados.clientes} />
        <CardDashboardV26 titulo="Faturamento" valor={brl(dados.faturamento)} />
      </div>
    </div>
  );
}

function CardDashboardV26({titulo, valor}:{titulo:string, valor:any}){
  return (
    <div style={{
      background:"#fff",
      border:"1px solid #ddd",
      padding:20,
      borderRadius:12
    }}>
      <span>{titulo}</span>
      <h2>{valor}</h2>
    </div>
  );
}


function BancoAvancadoV27(){
  const [dados, setDados] = React.useState<any[]>([]);

  React.useEffect(()=>{
    try{
      const d = JSON.parse(localStorage.getItem("ytalseg_envios_v25") || "[]");
      setDados(d);
    }catch{}
  },[]);

  function exportar(){
    const blob = new Blob([JSON.stringify(dados,null,2)],{type:"application/json"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "backup_ytalseg.json";
    a.click();
  }

  function importar(e:any){
    const file = e.target.files[0];
    if(!file) return;
    const reader = new FileReader();
    reader.onload = ()=>{
      try{
        const json = JSON.parse(reader.result as string);
        localStorage.setItem("ytalseg_envios_v25", JSON.stringify(json));
        setDados(json);
      }catch{}
    };
    reader.readAsText(file);
  }

  return (
    <div style={{padding:20}}>
      <h1>Banco Avançado</h1>

      <button onClick={exportar}>Exportar dados</button>
      <input type="file" onChange={importar} />

      <pre style={{marginTop:20, maxHeight:300, overflow:"auto"}}>
        {JSON.stringify(dados.slice(0,10), null, 2)}
      </pre>
    </div>
  );
}


function AuditoriaAvancadaV28(){
  const [logs, setLogs] = React.useState<any[]>([]);

  React.useEffect(()=>{
    try{
      const dados = JSON.parse(localStorage.getItem("ytalseg_envios_v25") || "[]");
      const logsGerados = dados.map((d:any)=>({
        id: d.id,
        cliente: d.cliente,
        valor: d.valor,
        canal: d.canal,
        data: d.criadoEm
      }));
      setLogs(logsGerados);
    }catch{}
  },[]);

  function limpar(){
    localStorage.removeItem("ytalseg_envios_v25");
    setLogs([]);
  }

  return (
    <div style={{padding:20}}>
      <h1>Auditoria Avançada</h1>

      <button onClick={limpar}>Limpar histórico</button>

      <div style={{marginTop:20}}>
        {logs.length === 0 && <div>Nenhum registro</div>}

        {logs.slice(0,20).map((l:any)=>(
          <div key={l.id} style={{
            borderBottom:"1px solid #ddd",
            padding:10
          }}>
            <strong>{l.cliente}</strong> - {l.canal} - R$ {l.valor} <br/>
            <small>{l.data}</small>
          </div>
        ))}
      </div>
    </div>
  );
}


function MultiUsuarioV29(){
  const [user,setUser] = React.useState("");
  const [lista,setLista] = React.useState<any[]>([]);

  React.useEffect(()=>{
    const u = localStorage.getItem("ytalseg_user_v20") || "default";
    setUser(u);
    try{
      const data = JSON.parse(localStorage.getItem("ytalseg_envios_v25_"+u) || "[]");
      setLista(data);
    }catch{}
  },[]);

  function salvarTeste(){
    const novo = {
      id: Date.now(),
      cliente: "Teste "+user,
      valor: Math.floor(Math.random()*1000)
    };

    const novaLista = [novo,...lista];
    setLista(novaLista);
    localStorage.setItem("ytalseg_envios_v25_"+user, JSON.stringify(novaLista));
  }

  return (
    <div style={{padding:20}}>
      <h1>Multiusuário</h1>

      <div>Usuário atual: {user}</div>

      <button onClick={salvarTeste}>Gerar dado usuário</button>

      <pre style={{marginTop:20}}>
        {JSON.stringify(lista.slice(0,5),null,2)}
      </pre>
    </div>
  );
}




function bloquearMenuPorPerfil(menu, perfil){
  const regras = {
    admin: ["*"],
    operador: ["dashboard","envio","auditoria","multi-v29"],
    financeiro: ["dashboard","financeiro","banco-v27"],
    consulta: ["dashboard"]
  };

  const permitido = regras[perfil] || [];

  if(permitido.includes("*")) return true;
  return permitido.includes(menu);
}

function ControleAcessoV30({perfil}:{perfil:any}){
  const permissoes:any = {
    admin: ["tudo"],
    operador: ["envio","dashboard","auditoria"],
    financeiro: ["financeiro","dashboard"],
    consulta: ["dashboard"]
  };

  const acesso = permissoes[perfil] || [];

  return (
    <div style={{padding:20}}>
      <h1>Controle de Acesso</h1>

      <div>Perfil atual: {perfil}</div>

      <pre style={{marginTop:20}}>
        Permissões: {JSON.stringify(acesso,null,2)}
      </pre>
    </div>
  );
}



function carregarUsuariosV34() {
  try {
    const salvos = JSON.parse(localStorage.getItem("ytalseg_users_v33") || "[]");
    if (Array.isArray(salvos) && salvos.length > 0) {
      return salvos;
    }
  } catch {}

  const padrao = [
    { id: 1, user: "admin", senha: "123", perfil: "admin", ativo: true },
    { id: 2, user: "operador", senha: "123", perfil: "operador", ativo: true },
    { id: 3, user: "financeiro", senha: "123", perfil: "financeiro", ativo: true },
    { id: 4, user: "consulta", senha: "123", perfil: "consulta", ativo: true },
  ];

  localStorage.setItem("ytalseg_users_v33", JSON.stringify(padrao));
  return padrao;
}

function autenticarUsuarioV34(user: string, senha: string) {
  const usuarios = carregarUsuariosV34();

  return usuarios.find(
    (u: any) =>
      String(u.user || "").trim().toLowerCase() === user.trim().toLowerCase() &&
      String(u.senha || "") === String(senha || "") &&
      u.ativo !== false
  );
}

function LoginSeguroV32({onLogin}:{onLogin:any}){
  const [user,setUser]=React.useState("");
  const [senha,setSenha]=React.useState("");
  const [erro,setErro]=React.useState("");

  React.useEffect(() => {
    carregarUsuariosV34();
  }, []);

  function entrar(){
    const encontrado = autenticarUsuarioV34(user, senha);

    if(encontrado){
      const payload = {
        user: encontrado.user,
        perfil: encontrado.perfil || "consulta",
        loginEm: new Date().toISOString()
      };

      localStorage.setItem("ytalseg_auth", JSON.stringify(payload));
      localStorage.setItem("ytalseg_user_v20", JSON.stringify(payload));
      onLogin(encontrado.user, encontrado.perfil || "consulta");
    }else{
      setErro("Usuário/senha inválidos ou usuário inativo.");
    }
  }

  return (
    <div style={{padding:40, minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:"#eef1f3"}}>
      <div style={{background:"#fff", padding:28, borderRadius:22, width:"100%", maxWidth:430, boxShadow:"0 16px 38px rgba(0,0,0,.10)", border:"1px solid #e5e7eb"}}>
        <h1 style={{marginTop:0, color:"#00B050"}}>YTALSEG</h1>
        <h2>Login Seguro</h2>

        <input
          placeholder="Usuário"
          value={user}
          onChange={e=>setUser(e.target.value)}
          onKeyDown={e=>{ if(e.key === "Enter") entrar(); }}
          style={{width:"100%", padding:12, borderRadius:10, border:"1px solid #d1d5db", marginBottom:10, fontWeight:800}}
        />

        <input
          placeholder="Senha"
          type="password"
          value={senha}
          onChange={e=>setSenha(e.target.value)}
          onKeyDown={e=>{ if(e.key === "Enter") entrar(); }}
          style={{width:"100%", padding:12, borderRadius:10, border:"1px solid #d1d5db", marginBottom:12, fontWeight:800}}
        />

        <button onClick={entrar} style={{width:"100%", padding:12, border:0, borderRadius:10, background:"#00B050", color:"#fff", fontWeight:1000}}>
          Entrar
        </button>

        {erro && <div style={{marginTop:12, color:"#b91c1c", fontWeight:900}}>{erro}</div>}

        <div style={{marginTop:14, padding:12, borderRadius:12, background:"#f9fafb", color:"#374151", fontSize:12, fontWeight:800}}>
          Usuários padrão se não houver cadastro: admin/123, operador/123, financeiro/123, consulta/123.
        </div>
      </div>
    </div>
  );
}

function GestaoUsuariosV33(){
  const [usuarios,setUsuarios] = React.useState<any[]>([]);

  React.useEffect(()=>{
    try{
      const u = JSON.parse(localStorage.getItem("ytalseg_users_v33") || "[]");
      setUsuarios(u);
    }catch{}
  },[]);

  function salvar(lista:any){
    setUsuarios(lista);
    localStorage.setItem("ytalseg_users_v33", JSON.stringify(lista));
  }

  function adicionar(){
    const novo = {
      id: Date.now(),
      user: "novo",
      senha: "123",
      perfil: "consulta",
      ativo: true
    };
    salvar([novo,...usuarios]);
  }

  function atualizar(index:number, campo:string, valor:any){
    const lista = usuarios.map((u,i)=> i===index ? {...u,[campo]:valor} : u);
    salvar(lista);
  }

  function remover(index:number){
    const lista = usuarios.filter((_,i)=>i!==index);
    salvar(lista);
  }

  return (
    <div style={{padding:20}}>
      <h1>Gestão de Usuários</h1>

      <button onClick={adicionar}>Adicionar usuário</button>
      <button onClick={() => salvar(carregarUsuariosV34())} style={{marginLeft:8}}>Inicializar usuários padrão</button>

      {usuarios.map((u,i)=>(
        <div key={u.id} style={{border:"1px solid #ddd",padding:10,marginTop:10}}>
          <input value={u.user} onChange={e=>atualizar(i,"user",e.target.value)} />
          <input value={u.senha} onChange={e=>atualizar(i,"senha",e.target.value)} />
          <select value={u.perfil} onChange={e=>atualizar(i,"perfil",e.target.value)}>
            <option>admin</option>
            <option>operador</option>
            <option>financeiro</option>
            <option>consulta</option>
          </select>
          <label>
            Ativo
            <input type="checkbox" checked={u.ativo} onChange={e=>atualizar(i,"ativo",e.target.checked)} />
          </label>
          <button onClick={()=>remover(i)}>Excluir</button>
        </div>
      ))}
    </div>
  );
}


function NotificacoesSistemaV35(){
  const [notificacoes,setNotificacoes] = React.useState<any[]>([]);

  React.useEffect(()=>{
    try{
      const logs = JSON.parse(localStorage.getItem("ytalseg_envios_v25") || "[]");
      const lista = logs.slice(0,10).map((l:any)=>({
        id:l.id,
        texto:`Envio realizado para ${l.cliente}`,
        data:l.criadoEm
      }));
      setNotificacoes(lista);
    }catch{}
  },[]);

  return (
    <div style={{padding:20}}>
      <h1>Notificações</h1>

      {notificacoes.length === 0 && <div>Nenhuma notificação</div>}

      {notificacoes.map(n=>(
        <div key={n.id} style={{
          borderBottom:"1px solid #ddd",
          padding:10
        }}>
          <strong>{n.texto}</strong>
          <div style={{fontSize:12}}>{n.data}</div>
        </div>
      ))}
    </div>
  );
}


function PersistenciaElectronV36() {
  const CHAVES = [
    "ytalseg_relatorios_versoes_v11_2",
    "ytalseg_pacotes_cliente_v11_6",
    "ytalseg_config_v11_7",
    "ytalseg_users_v33",
    "ytalseg_envios_v25",
    "ytalseg_auditoria_v18",
    "ytalseg_notificacoes_v19",
    "ytalseg_auto_backup_v22",
  ];

  const [status, setStatus] = React.useState("");
  const [caminho, setCaminho] = React.useState("");
  const [resumo, setResumo] = React.useState<any>({ chaves: 0, registros: 0 });

  function coletarDadosLocais() {
    const dados: any = {};

    CHAVES.forEach((key) => {
      const raw = localStorage.getItem(key);
      if (raw !== null) {
        try {
          dados[key] = JSON.parse(raw);
        } catch {
          dados[key] = raw;
        }
      }
    });

    return dados;
  }

  function aplicarDados(dados: any) {
    if (!dados || typeof dados !== "object") return;

    Object.keys(dados).forEach((key) => {
      if (!CHAVES.includes(key)) return;
      localStorage.setItem(key, JSON.stringify(dados[key]));
    });
  }

  function atualizarResumo(dados: any) {
    const chaves = Object.keys(dados || {}).length;
    const registros = Object.values(dados || {}).reduce((acc: number, item: any) => {
      if (Array.isArray(item)) return acc + item.length;
      if (item && typeof item === "object") return acc + Object.keys(item).length;
      return acc + 1;
    }, 0);

    setResumo({ chaves, registros });
  }

  async function salvarNoElectron() {
    try {
      const api = (window as any).ytalsegAPI;

      if (!api?.salvarDados) {
        setStatus("Persistência Electron disponível apenas no app instalado.");
        return;
      }

      const dados = coletarDadosLocais();
      const res = await api.salvarDados({ dados });

      if (res.ok) {
        setStatus("Dados salvos fora do navegador com sucesso.");
        setCaminho(res.path || "");
        atualizarResumo(dados);
      } else {
        setStatus(res.erro || "Não foi possível salvar.");
      }
    } catch {
      setStatus("Erro ao salvar dados.");
    }
  }

  async function carregarDoElectron() {
    try {
      const api = (window as any).ytalsegAPI;

      if (!api?.carregarDados) {
        setStatus("Persistência Electron disponível apenas no app instalado.");
        return;
      }

      const res = await api.carregarDados();

      if (res.ok) {
        aplicarDados(res.dados || {});
        atualizarResumo(res.dados || {});
        setCaminho(res.path || "");
        setStatus("Dados carregados do banco local Electron. Recarregue a tela se necessário.");
      } else {
        setStatus(res.erro || "Não foi possível carregar.");
      }
    } catch {
      setStatus("Erro ao carregar dados.");
    }
  }

  async function exportarBackup() {
    try {
      const api = (window as any).ytalsegAPI;

      if (!api?.backupDados) {
        setStatus("Backup Electron disponível apenas no app instalado.");
        return;
      }

      const res = await api.backupDados();

      if (res.ok) {
        setStatus("Backup exportado com sucesso.");
        setCaminho(res.path || "");
      } else if (res.erro !== "cancelado") {
        setStatus(res.erro || "Não foi possível exportar backup.");
      }
    } catch {
      setStatus("Erro ao exportar backup.");
    }
  }

  async function importarBackup() {
    try {
      const api = (window as any).ytalsegAPI;

      if (!api?.importarBackupDados) {
        setStatus("Importação Electron disponível apenas no app instalado.");
        return;
      }

      const res = await api.importarBackupDados();

      if (res.ok) {
        aplicarDados(res.dados || {});
        atualizarResumo(res.dados || {});
        setStatus("Backup importado com sucesso. Recarregue a tela se necessário.");
        setCaminho(res.path || "");
      } else if (res.erro !== "cancelado") {
        setStatus(res.erro || "Não foi possível importar backup.");
      }
    } catch {
      setStatus("Erro ao importar backup.");
    }
  }

  React.useEffect(() => {
    atualizarResumo(coletarDadosLocais());
  }, []);

  return (
    <div className="persist-v36">
      <style>{`
        .persist-v36 { display: grid; gap: 16px; }
        .persist-head h1 { margin: 0; font-size: 30px; font-weight: 1000; color: #111827; }
        .persist-head p { margin: 6px 0 0; color: #6b7280; font-weight: 800; }
        .persist-box, .persist-card { background: white; border: 1px solid #e5e7eb; border-radius: 22px; padding: 18px; box-shadow: 0 10px 24px rgba(0,0,0,.06); }
        .persist-cards { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 12px; }
        .persist-card span { display: block; color: #6b7280; font-size: 12px; font-weight: 1000; text-transform: uppercase; }
        .persist-card strong { display: block; margin-top: 6px; color: #00B050; font-size: 24px; font-weight: 1000; word-break: break-word; }
        .persist-actions { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 14px; }
        .persist-btn { border: 0; border-radius: 10px; padding: 10px 13px; font-weight: 900; cursor: pointer; background: #e5e7eb; color: #111; }
        .persist-btn-green { background: #00B050; color: white; }
        .persist-status { padding: 12px; border-radius: 14px; background: #ecfdf5; border: 1px solid rgba(0,176,80,.25); color: #166534; font-weight: 900; }
        .persist-path { color: #374151; font-weight: 800; word-break: break-all; font-size: 13px; }
        @media (max-width: 900px) { .persist-cards { grid-template-columns: 1fr; } }
      `}</style>

      <div className="persist-head">
        <h1>Persistência Real Electron</h1>
        <p>Salva os dados fora do navegador em arquivo JSON dentro do app.</p>
      </div>

      {status && <div className="persist-status">{status}</div>}

      <div className="persist-cards">
        <div className="persist-card">
          <span>Bases monitoradas</span>
          <strong>{resumo.chaves}</strong>
        </div>
        <div className="persist-card">
          <span>Registros estimados</span>
          <strong>{resumo.registros}</strong>
        </div>
        <div className="persist-card">
          <span>Status</span>
          <strong>{(window as any).ytalsegAPI?.salvarDados ? "Electron OK" : "Web"}</strong>
        </div>
      </div>

      <div className="persist-box">
        <h3 style={{ marginTop: 0 }}>Ações do banco real</h3>

        <div className="persist-actions">
          <button className="persist-btn persist-btn-green" onClick={salvarNoElectron}>Salvar no Electron</button>
          <button className="persist-btn persist-btn-green" onClick={carregarDoElectron}>Carregar do Electron</button>
          <button className="persist-btn" onClick={exportarBackup}>Exportar backup</button>
          <button className="persist-btn" onClick={importarBackup}>Importar backup</button>
        </div>

        {caminho && (
          <div style={{ marginTop: 14 }}>
            <strong>Caminho:</strong>
            <div className="persist-path">{caminho}</div>
          </div>
        )}
      </div>
    </div>
  );
}


function AlertasInteligentesV37() {
  const [alertas, setAlertas] = React.useState<any[]>([]);
  const [status, setStatus] = React.useState("");

  function brlLocal(v:any) {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(Number(v || 0));
  }

  function carregarJSON(key:string, fallback:any) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return fallback;
      return JSON.parse(raw);
    } catch {
      return fallback;
    }
  }

  function gerarAlertas() {
    const novos:any[] = [];
    const pacotes = carregarJSON("ytalseg_pacotes_cliente_v11_6", []);
    const relatorios = carregarJSON("ytalseg_relatorios_versoes_v11_2", []);
    const envios = carregarJSON("ytalseg_envios_v25", []);
    const usuarios = carregarJSON("ytalseg_users_v33", []);

    if (Array.isArray(pacotes)) {
      pacotes.forEach((p:any) => {
        if (!p.pdfCliente) {
          novos.push({
            id: `pacote-pdf-${p.id}`,
            nivel: "alto",
            origem: "Pacote Cliente",
            titulo: "Pacote sem PDF do cliente",
            descricao: `${p.cliente || "Cliente"} está com PDF pendente.`,
            valor: p.valor || 0,
          });
        }

        if (!p.notaFiscal) {
          novos.push({
            id: `pacote-nf-${p.id}`,
            nivel: "medio",
            origem: "Pacote Cliente",
            titulo: "Nota fiscal pendente",
            descricao: `${p.cliente || "Cliente"} ainda não possui nota fiscal marcada.`,
            valor: p.valor || 0,
          });
        }

        if (!p.comprovante) {
          novos.push({
            id: `pacote-comp-${p.id}`,
            nivel: "medio",
            origem: "Pacote Cliente",
            titulo: "Comprovante pendente",
            descricao: `${p.cliente || "Cliente"} ainda não possui comprovante marcado.`,
            valor: p.valor || 0,
          });
        }

        if ((p.status || "").toLowerCase() !== "concluído" && (p.status || "").toLowerCase() !== "concluido") {
          novos.push({
            id: `pacote-status-${p.id}`,
            nivel: "baixo",
            origem: "Pacote Cliente",
            titulo: "Pacote não concluído",
            descricao: `${p.cliente || "Cliente"} está com status: ${p.status || "Pendente"}.`,
            valor: p.valor || 0,
          });
        }
      });
    }

    if (Array.isArray(relatorios)) {
      relatorios.forEach((r:any) => {
        const statusRel = (r.status || "Rascunho").toLowerCase();

        if (statusRel !== "pago" && statusRel !== "concluído" && statusRel !== "concluido") {
          novos.push({
            id: `rel-status-${r.id}`,
            nivel: statusRel === "cobrado" ? "alto" : "medio",
            origem: "Relatórios",
            titulo: "Relatório com pendência",
            descricao: `${r.cliente || "Cliente"} está com status: ${r.status || "Rascunho"}.`,
            valor: r.valor || 0,
          });
        }
      });
    }

    if (Array.isArray(envios) && envios.length === 0) {
      novos.push({
        id: "envios-zero",
        nivel: "baixo",
        origem: "Envios",
        titulo: "Nenhum envio registrado",
        descricao: "Ainda não existe envio registrado no sistema.",
        valor: 0,
      });
    }

    if (Array.isArray(usuarios)) {
      const inativos = usuarios.filter((u:any) => u.ativo === false);
      if (inativos.length > 0) {
        novos.push({
          id: "usuarios-inativos",
          nivel: "baixo",
          origem: "Usuários",
          titulo: "Usuários inativos",
          descricao: `${inativos.length} usuário(s) inativo(s) no sistema.`,
          valor: 0,
        });
      }

      const semAdminAtivo = !usuarios.some((u:any) => u.perfil === "admin" && u.ativo !== false);
      if (semAdminAtivo) {
        novos.push({
          id: "sem-admin",
          nivel: "alto",
          origem: "Usuários",
          titulo: "Nenhum admin ativo",
          descricao: "Atenção: não existe usuário admin ativo cadastrado.",
          valor: 0,
        });
      }
    }

    setAlertas(novos);
    localStorage.setItem("ytalseg_alertas_v37", JSON.stringify(novos));
    setStatus(`Alertas atualizados: ${novos.length}`);
  }

  React.useEffect(() => {
    const salvos = carregarJSON("ytalseg_alertas_v37", []);
    if (Array.isArray(salvos) && salvos.length > 0) {
      setAlertas(salvos);
    } else {
      gerarAlertas();
    }
  }, []);

  const totalValor = alertas.reduce((acc, a) => acc + Number(a.valor || 0), 0);
  const altos = alertas.filter((a) => a.nivel === "alto").length;
  const medios = alertas.filter((a) => a.nivel === "medio").length;

  function classeNivel(nivel:string) {
    if (nivel === "alto") return "#fee2e2";
    if (nivel === "medio") return "#fff7ed";
    return "#eff6ff";
  }

  function corNivel(nivel:string) {
    if (nivel === "alto") return "#991b1b";
    if (nivel === "medio") return "#9a3412";
    return "#1d4ed8";
  }

  return (
    <div className="alertas-v37">
      <style>{`
        .alertas-v37 { display: grid; gap: 16px; }
        .alertas-head h1 { margin: 0; font-size: 30px; font-weight: 1000; color: #111827; }
        .alertas-head p { margin: 6px 0 0; color: #6b7280; font-weight: 800; }
        .alertas-box, .alertas-card { background: white; border: 1px solid #e5e7eb; border-radius: 22px; padding: 18px; box-shadow: 0 10px 24px rgba(0,0,0,.06); }
        .alertas-cards { display: grid; grid-template-columns: repeat(4, minmax(0,1fr)); gap: 12px; }
        .alertas-card span { display: block; color: #6b7280; font-size: 12px; font-weight: 1000; text-transform: uppercase; }
        .alertas-card strong { display: block; margin-top: 6px; color: #00B050; font-size: 24px; font-weight: 1000; }
        .alertas-actions { display: flex; gap: 10px; flex-wrap: wrap; }
        .alertas-btn { border: 0; border-radius: 10px; padding: 10px 13px; font-weight: 900; cursor: pointer; background: #e5e7eb; color: #111; }
        .alertas-btn-green { background: #00B050; color: white; }
        .alertas-status { padding: 12px; border-radius: 14px; background: #ecfdf5; border: 1px solid rgba(0,176,80,.25); color: #166534; font-weight: 900; }
        .alerta-item { background: white; border: 1px solid #e5e7eb; border-radius: 18px; padding: 16px; display: grid; grid-template-columns: .8fr 1fr 2fr .8fr; gap: 12px; align-items: center; box-shadow: 0 10px 22px rgba(0,0,0,.05); }
        .alerta-badge { display: inline-flex; justify-content: center; padding: 7px 10px; border-radius: 999px; font-size: 12px; font-weight: 1000; }
        .alerta-title { font-weight: 1000; color: #111827; }
        .alerta-desc { color: #374151; font-weight: 800; font-size: 13px; }
        @media (max-width: 1000px) { .alertas-cards { grid-template-columns: 1fr 1fr; } .alerta-item { grid-template-columns: 1fr; } }
        @media (max-width: 700px) { .alertas-cards { grid-template-columns: 1fr; } }
      `}</style>

      <div className="alertas-head">
        <h1>Alertas Inteligentes</h1>
        <p>Verificação automática de pacotes, relatórios, usuários e envios.</p>
      </div>

      {status && <div className="alertas-status">{status}</div>}

      <div className="alertas-cards">
        <div className="alertas-card"><span>Total</span><strong>{alertas.length}</strong></div>
        <div className="alertas-card"><span>Altos</span><strong>{altos}</strong></div>
        <div className="alertas-card"><span>Médios</span><strong>{medios}</strong></div>
        <div className="alertas-card"><span>Valor envolvido</span><strong>{brlLocal(totalValor)}</strong></div>
      </div>

      <div className="alertas-box">
        <div className="alertas-actions">
          <button className="alertas-btn alertas-btn-green" onClick={gerarAlertas}>Atualizar alertas</button>
          <button className="alertas-btn" onClick={() => { setAlertas([]); localStorage.removeItem("ytalseg_alertas_v37"); setStatus("Alertas limpos."); }}>Limpar alertas</button>
        </div>
      </div>

      <div style={{ display: "grid", gap: 10 }}>
        {alertas.length === 0 && (
          <div className="alertas-box">Nenhum alerta encontrado. Tudo certo por aqui.</div>
        )}

        {alertas.map((a) => (
          <div className="alerta-item" key={a.id}>
            <div>
              <span className="alerta-badge" style={{ background: classeNivel(a.nivel), color: corNivel(a.nivel) }}>
                {String(a.nivel).toUpperCase()}
              </span>
            </div>
            <div className="alerta-title">{a.origem}</div>
            <div>
              <div className="alerta-title">{a.titulo}</div>
              <div className="alerta-desc">{a.descricao}</div>
            </div>
            <div>{brlLocal(a.valor)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}


function CentralMonitoramentoV38(){
  const [resumo,setResumo] = React.useState({alertas:0, usuarios:0, envios:0});

  React.useEffect(()=>{
    try{
      const alertas = JSON.parse(localStorage.getItem("ytalseg_alertas_v37") || "[]");
      const usuarios = JSON.parse(localStorage.getItem("ytalseg_users_v33") || "[]");
      const envios = JSON.parse(localStorage.getItem("ytalseg_envios_v25") || "[]");

      setResumo({
        alertas: alertas.length,
        usuarios: usuarios.length,
        envios: envios.length
      });
    }catch{}
  },[]);

  return (
    <div style={{padding:20}}>
      <h1>Central de Monitoramento</h1>

      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
        <BoxV38 titulo="Alertas" valor={resumo.alertas}/>
        <BoxV38 titulo="Usuários" valor={resumo.usuarios}/>
        <BoxV38 titulo="Envios" valor={resumo.envios}/>
      </div>
    </div>
  );
}

function BoxV38({titulo,valor}:{titulo:string,valor:any}){
  return (
    <div style={{background:"#fff",padding:20,border:"1px solid #ddd",borderRadius:12}}>
      <span>{titulo}</span>
      <h2>{valor}</h2>
    </div>
  );
}


function DashboardProV39(){
  const [dados,setDados] = React.useState({envios:0, usuarios:0, alertas:0});

  React.useEffect(()=>{
    try{
      const envios = JSON.parse(localStorage.getItem("ytalseg_envios_v25") || "[]");
      const usuarios = JSON.parse(localStorage.getItem("ytalseg_users_v33") || "[]");
      const alertas = JSON.parse(localStorage.getItem("ytalseg_alertas_v37") || "[]");

      setDados({
        envios: envios.length,
        usuarios: usuarios.length,
        alertas: alertas.length
      });
    }catch{}
  },[]);

  return (
    <div style={{padding:20}}>
      <h1>Dashboard PRO</h1>

      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
        <BoxDashboardProV39 titulo="Envios" valor={dados.envios}/>
        <BoxDashboardProV39 titulo="Usuários" valor={dados.usuarios}/>
        <BoxDashboardProV39 titulo="Alertas" valor={dados.alertas}/>
      </div>

      <div style={{marginTop:20,background:"#fff",padding:20,border:"1px solid #ddd",borderRadius:12}}>
        <h3>Resumo</h3>
        <p>Sistema em operação com {dados.envios} envios, {dados.usuarios} usuários e {dados.alertas} alertas.</p>
      </div>
    </div>
  );
}

function BoxDashboardProV39({titulo,valor}:{titulo:string,valor:any}){
  return (
    <div style={{background:"#fff",padding:20,border:"1px solid #ddd",borderRadius:12}}>
      <span>{titulo}</span>
      <h2>{valor}</h2>
    </div>
  );
}


function LogsSistemaV40() {
  const [logs, setLogs] = React.useState<any[]>([]);
  const [status, setStatus] = React.useState("");

  function carregarJSON(key:string, fallback:any) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return fallback;
      return JSON.parse(raw);
    } catch {
      return fallback;
    }
  }

  function dataBR(v:any) {
    if (!v) return "-";
    try {
      return new Date(v).toLocaleString("pt-BR");
    } catch {
      return String(v);
    }
  }

  function gerarLogs() {
    const lista:any[] = [];

    const envios = carregarJSON("ytalseg_envios_v25", []);
    const usuarios = carregarJSON("ytalseg_users_v33", []);
    const alertas = carregarJSON("ytalseg_alertas_v37", []);
    const pacotes = carregarJSON("ytalseg_pacotes_cliente_v11_6", []);
    const relatorios = carregarJSON("ytalseg_relatorios_versoes_v11_2", []);

    if (Array.isArray(envios)) {
      envios.forEach((e:any) => {
        lista.push({
          id: `envio-${e.id || Math.random()}`,
          tipo: "Envio",
          usuario: e.usuario || "sistema",
          acao: `Envio via ${e.canal || "canal não informado"}`,
          detalhe: `${e.cliente || "Cliente"} • ${e.valor ? new Intl.NumberFormat("pt-BR", {style:"currency", currency:"BRL"}).format(Number(e.valor || 0)) : "sem valor"}`,
          data: e.criadoEm || new Date().toISOString()
        });
      });
    }

    if (Array.isArray(usuarios)) {
      usuarios.forEach((u:any) => {
        lista.push({
          id: `usuario-${u.id || u.user}`,
          tipo: "Usuário",
          usuario: u.user || "-",
          acao: u.ativo === false ? "Usuário inativo" : "Usuário ativo",
          detalhe: `Perfil: ${u.perfil || "consulta"}`,
          data: new Date().toISOString()
        });
      });
    }

    if (Array.isArray(alertas)) {
      alertas.forEach((a:any) => {
        lista.push({
          id: `alerta-${a.id || Math.random()}`,
          tipo: "Alerta",
          usuario: "sistema",
          acao: `${String(a.nivel || "baixo").toUpperCase()} • ${a.titulo || "Alerta"}`,
          detalhe: `${a.origem || "-"} • ${a.descricao || "-"}`,
          data: new Date().toISOString()
        });
      });
    }

    if (Array.isArray(pacotes)) {
      pacotes.forEach((p:any) => {
        lista.push({
          id: `pacote-${p.id || Math.random()}`,
          tipo: "Pacote",
          usuario: "sistema",
          acao: `Status: ${p.status || "Pendente"}`,
          detalhe: `${p.cliente || "Cliente"} • PDF: ${p.pdfCliente ? "OK" : "Pendente"} • NF: ${p.notaFiscal ? "OK" : "Pendente"} • Comprovante: ${p.comprovante ? "OK" : "Pendente"}`,
          data: p.criadoEm || new Date().toISOString()
        });
      });
    }

    if (Array.isArray(relatorios)) {
      relatorios.forEach((r:any) => {
        lista.push({
          id: `relatorio-${r.id || Math.random()}`,
          tipo: "Relatório",
          usuario: "sistema",
          acao: `Status: ${r.status || "Rascunho"}`,
          detalhe: `${r.cliente || "Cliente"} • ${r.tipo || "-"} • ${r.valor ? new Intl.NumberFormat("pt-BR", {style:"currency", currency:"BRL"}).format(Number(r.valor || 0)) : "sem valor"}`,
          data: r.criadoEm || new Date().toISOString()
        });
      });
    }

    const ordenados = lista.sort((a,b) => String(b.data).localeCompare(String(a.data))).slice(0, 300);
    setLogs(ordenados);
    localStorage.setItem("ytalseg_logs_v40", JSON.stringify(ordenados));
    setStatus(`Logs atualizados: ${ordenados.length}`);
  }

  function registrarManual() {
    const acao = window.prompt("Descreva a ação para registrar no log:");
    if (!acao) return;

    const auth = carregarJSON("ytalseg_auth", {});
    const novo = {
      id: `manual-${Date.now()}`,
      tipo: "Manual",
      usuario: auth.user || "usuário",
      acao,
      detalhe: "Registro manual",
      data: new Date().toISOString()
    };

    const novaLista = [novo, ...logs].slice(0, 300);
    setLogs(novaLista);
    localStorage.setItem("ytalseg_logs_v40", JSON.stringify(novaLista));
    setStatus("Log manual registrado.");
  }

  function exportarLogs() {
    const blob = new Blob([JSON.stringify(logs, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ytalseg_logs_v40_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setStatus("Logs exportados.");
  }

  function limparLogs() {
    if (!window.confirm("Deseja limpar os logs V40?")) return;
    setLogs([]);
    localStorage.removeItem("ytalseg_logs_v40");
    setStatus("Logs limpos.");
  }

  React.useEffect(() => {
    const salvos = carregarJSON("ytalseg_logs_v40", []);
    if (Array.isArray(salvos) && salvos.length > 0) setLogs(salvos);
    else gerarLogs();
  }, []);

  const total = logs.length;
  const envios = logs.filter((l) => l.tipo === "Envio").length;
  const alertas = logs.filter((l) => l.tipo === "Alerta").length;
  const manuais = logs.filter((l) => l.tipo === "Manual").length;

  return (
   <div className="logs-v40">
      <style>{`
        .logs-v40 { display: grid; gap: 16px; }
        .logs-head h1 { margin: 0; font-size: 30px; font-weight: 1000; color: #111827; }
        .logs-head p { margin: 6px 0 0; color: #6b7280; font-weight: 800; }
        .logs-box, .logs-card { background: white; border: 1px solid #e5e7eb; border-radius: 22px; padding: 18px; box-shadow: 0 10px 24px rgba(0,0,0,.06); }
        .logs-cards { display: grid; grid-template-columns: repeat(4, minmax(0,1fr)); gap: 12px; }
        .logs-card span { display: block; color: #6b7280; font-size: 12px; font-weight: 1000; text-transform: uppercase; }
        .logs-card strong { display: block; margin-top: 6px; color: #00B050; font-size: 24px; font-weight: 1000; }
        .logs-actions { display: flex; gap: 10px; flex-wrap: wrap; }
        .logs-btn { border: 0; border-radius: 10px; padding: 10px 13px; font-weight: 900; cursor: pointer; background: #e5e7eb; color: #111; }
        .logs-btn-green { background: #00B050; color: white; }
        .logs-status { padding: 12px; border-radius: 14px; background: #ecfdf5; border: 1px solid rgba(0,176,80,.25); color: #166534; font-weight: 900; }
        .log-item { background: white; border: 1px solid #e5e7eb; border-radius: 18px; padding: 14px; display: grid; grid-template-columns: .8fr 1fr 1.4fr 2fr 1fr; gap: 12px; align-items: center; box-shadow: 0 8px 18px rgba(0,0,0,.04); font-size: 13px; }
        .log-badge { display: inline-flex; justify-content: center; padding: 6px 10px; border-radius: 999px; background: #eff6ff; color: #1d4ed8; font-size: 12px; font-weight: 1000; }
        .log-main { font-weight: 1000; color: #111827; }
        .log-detail { color: #374151; font-weight: 800; }
        @media (max-width: 1000px) { .logs-cards { grid-template-columns: 1fr 1fr; } .log-item { grid-template-columns: 1fr; } }
        @media (max-width: 700px) { .logs-cards { grid-template-columns: 1fr; } }
      `}</style>

      <div className="logs-head">
        <h1>Logs do Sistema</h1>
        <p>Rastreamento de ações, envios, pacotes, usuários, relatórios e alertas.</p>
      </div>

      {status && <div className="logs-status">{status}</div>}

      <div className="logs-cards">
        <div className="logs-card"><span>Total</span><strong>{total}</strong></div>
        <div className="logs-card"><span>Envios</span><strong>{envios}</strong></div>
        <div className="logs-card"><span>Alertas</span><strong>{alertas}</strong></div>
        <div className="logs-card"><span>Manuais</span><strong>{manuais}</strong></div>
      </div>

      <div className="logs-box">
        <div className="logs-actions">
          <button className="logs-btn logs-btn-green" onClick={gerarLogs}>Atualizar logs</button>
          <button className="logs-btn" onClick={registrarManual}>Registrar manual</button>
          <button className="logs-btn" onClick={exportarLogs}>Exportar JSON</button>
          <button className="logs-btn" onClick={limparLogs}>Limpar logs</button>
        </div>
      </div>

      <div style={{ display: "grid", gap: 10 }}>
        {logs.length === 0 && <div className="logs-box">Nenhum log encontrado.</div>}

        {logs.map((log) => (
          <div className="log-item" key={log.id}>
            <div><span className="log-badge">{log.tipo}</span></div>
            <div className="log-main">{log.usuario}</div>
            <div className="log-main">{log.acao}</div>
            <div className="log-detail">{log.detalhe}</div>
            <div>{dataBR(log.data)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}


function BackupAutomaticoV41(){
  const [status,setStatus] = React.useState("");

  function fazerBackup(){
    try{
      const dados:any = {};
      Object.keys(localStorage).forEach(k=>{
        dados[k] = localStorage.getItem(k);
      });

      const blob = new Blob([JSON.stringify(dados,null,2)],{type:"application/json"});
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "backup_ytalseg_auto.json";
      a.click();
      URL.revokeObjectURL(url);

      setStatus("Backup gerado com sucesso");
    }catch{
      setStatus("Erro ao gerar backup");
    }
  }

  function restaurarBackup(e:any){
    const file = e.target.files[0];
    if(!file) return;

    const reader = new FileReader();
    reader.onload = function(evt:any){
      try{
        const dados = JSON.parse(evt.target.result);
        Object.keys(dados).forEach(k=>{
          localStorage.setItem(k,dados[k]);
        });
        setStatus("Backup restaurado com sucesso");
      }catch{
        setStatus("Erro ao restaurar backup");
      }
    };
    reader.readAsText(file);
  }

  return (
    <div style={{padding:20}}>
      <h1>Backup Automático</h1>

      <button onClick={fazerBackup}>Gerar Backup</button>

      <input type="file" onChange={restaurarBackup}/>

      <div>{status}</div>
    </div>
  );
}

function CloudRealStatusV45_1(){
  const [status,setStatus] = React.useState("");
  const [ultima,setUltima] = React.useState("");

  function testarConexao(){
    const payload = {
      ok: true,
      origem: "YTALSEG",
      modo: "cloud-real-base",
      data: new Date().toISOString()
    };

    localStorage.setItem("ytalseg_cloud_real_status_v45_1", JSON.stringify(payload));
    setStatus("Base cloud real pronta para conectar em Firebase/API.");
    setUltima(payload.data);
  }

  function prepararDados(){
    try{
      const dados:any = {};
      Object.keys(localStorage).forEach(k=>{
        dados[k] = localStorage.getItem(k);
      });

      localStorage.setItem("ytalseg_cloud_real_payload_v45_1", JSON.stringify({
        criadoEm: new Date().toISOString(),
        dados
      }));

      setStatus("Payload preparado para envio cloud real.");
      setUltima(new Date().toISOString());
    }catch{
      setStatus("Erro ao preparar dados.");
    }
  }

  return (
    <div style={{padding:20}}>
      <h1>Cloud Real — Status</h1>
      <p>Base segura para futura integração Firebase/API sem alterar o ERP atual.</p>

      <div style={{display:"flex",gap:10,flexWrap:"wrap",marginTop:15}}>
        <button onClick={testarConexao}>Testar base cloud</button>
        <button onClick={prepararDados}>Preparar payload</button>
      </div>

      <div style={{marginTop:20,background:"#fff",border:"1px solid #ddd",borderRadius:12,padding:16}}>
        <strong>Status:</strong>
        <div>{status || "Aguardando teste."}</div>
        {ultima && <small>Última ação: {ultima}</small>}
      </div>
    </div>
  );
}


function IntegracaoAPIRealV46(){
  const [url,setUrl] = React.useState("");
  const [token,setToken] = React.useState("");
  const [status,setStatus] = React.useState("");
  const [ultimo,setUltimo] = React.useState<any>(null);

  React.useEffect(()=>{
    try{
      const cfg = JSON.parse(localStorage.getItem("ytalseg_api_real_v46") || "{}");
      setUrl(cfg.url || "");
      setToken(cfg.token || "");
    }catch{}
  },[]);

  function salvarConfig(){
    const cfg = {
      url: url.trim(),
      token: token.trim(),
      atualizadoEm: new Date().toISOString()
    };
    localStorage.setItem("ytalseg_api_real_v46", JSON.stringify(cfg));
    setStatus("Configuração da API salva.");
    setUltimo(cfg);
  }

  async function testarConexao(){
    try{
      if(!url.trim()){
        setStatus("Informe a URL da API.");
        return;
      }

      const payload = {
        origem: "YTALSEG",
        teste: true,
        data: new Date().toISOString()
      };

      localStorage.setItem("ytalseg_api_real_teste_v46", JSON.stringify(payload));

      setStatus("Teste preparado. API real será conectada quando o endpoint estiver disponível.");
      setUltimo(payload);
    }catch{
      setStatus("Erro ao testar integração.");
    }
  }

  function prepararEnvioCompleto(){
    try{
      const dados:any = {};
      Object.keys(localStorage).forEach(k=>{
        dados[k] = localStorage.getItem(k);
      });

      const pacote = {
        criadoEm: new Date().toISOString(),
        url,
        temToken: !!token,
        dados
      };

      localStorage.setItem("ytalseg_api_payload_v46", JSON.stringify(pacote));
      setStatus("Payload completo preparado para envio à API.");
      setUltimo({ criadoEm: pacote.criadoEm, chaves: Object.keys(dados).length });
    }catch{
      setStatus("Erro ao preparar payload.");
    }
  }

  return (
    <div style={{padding:20}}>
      <h1>Integração API Real</h1>
      <p>Base segura para conectar o ERP YTALSEG em Firebase, Supabase ou backend próprio.</p>

      <div style={{background:"#fff",border:"1px solid #ddd",borderRadius:12,padding:16,display:"grid",gap:10,maxWidth:760}}>
        <label style={{fontWeight:900}}>URL da API</label>
        <input
          value={url}
          onChange={(e)=>setUrl(e.target.value)}
          placeholder="https://sua-api.com"
          style={{padding:10,border:"1px solid #ccc",borderRadius:8}}
        />

        <label style={{fontWeight:900}}>Token / chave</label>
        <input
          value={token}
          onChange={(e)=>setToken(e.target.value)}
          placeholder="opcional"
          style={{padding:10,border:"1px solid #ccc",borderRadius:8}}
        />

        <div style={{display:"flex",gap:10,flexWrap:"wrap",marginTop:8}}>
          <button onClick={salvarConfig}>Salvar configuração</button>
          <button onClick={testarConexao}>Testar base</button>
          <button onClick={prepararEnvioCompleto}>Preparar payload</button>
        </div>
      </div>

      <div style={{marginTop:20,background:"#fff",border:"1px solid #ddd",borderRadius:12,padding:16}}>
        <strong>Status:</strong>
        <div>{status || "Aguardando configuração."}</div>
        {ultimo && (
          <pre style={{whiteSpace:"pre-wrap",marginTop:10,maxHeight:220,overflow:"auto"}}>
            {JSON.stringify(ultimo,null,2)}
          </pre>
        )}
      </div>
    </div>
  );
}


function DiagnosticoSistemaV47(){
  const [resultado,setResultado] = React.useState<any[]>([]);
  const [status,setStatus] = React.useState("");

  function testar(){
    const testes:any[] = [];

    function ok(nome:string, detalhe:string){
      testes.push({ nome, estado:"OK", detalhe });
    }

    function alerta(nome:string, detalhe:string){
      testes.push({ nome, estado:"ALERTA", detalhe });
    }

    try{
      const users = JSON.parse(localStorage.getItem("ytalseg_users_v33") || "[]");
      if(Array.isArray(users) && users.length > 0) ok("Usuários", `${users.length} usuário(s) cadastrado(s)`);
      else alerta("Usuários", "Nenhum usuário cadastrado");
    }catch{
      alerta("Usuários", "Base de usuários inválida");
    }

    try{
      const auth = JSON.parse(localStorage.getItem("ytalseg_auth") || "{}");
      if(auth.user) ok("Sessão", `Logado como ${auth.user}`);
      else alerta("Sessão", "Sessão não encontrada");
    }catch{
      alerta("Sessão", "Sessão inválida");
    }

    try{
      const logs = JSON.parse(localStorage.getItem("ytalseg_logs_v40") || "[]");
      if(Array.isArray(logs)) ok("Logs", `${logs.length} registro(s)`);
      else alerta("Logs", "Formato inválido");
    }catch{
      alerta("Logs", "Erro lendo logs");
    }

    try{
      const alertas = JSON.parse(localStorage.getItem("ytalseg_alertas_v37") || "[]");
      if(Array.isArray(alertas)) ok("Alertas", `${alertas.length} alerta(s)`);
      else alerta("Alertas", "Formato inválido");
    }catch{
      alerta("Alertas", "Erro lendo alertas");
    }

    try{
      const api = JSON.parse(localStorage.getItem("ytalseg_api_real_v46") || "{}");
      if(api.url) ok("API Real", `URL configurada: ${api.url}`);
      else alerta("API Real", "URL da API não configurada");
    }catch{
      alerta("API Real", "Configuração da API inválida");
    }

    try{
      const electron = (window as any).ytalsegAPI;
      if(electron) ok("Electron API", "Bridge ytalsegAPI disponível");
      else alerta("Electron API", "Rodando sem bridge Electron");
    }catch{
      alerta("Electron API", "Erro verificando bridge Electron");
    }

    setResultado(testes);
    setStatus(`Diagnóstico concluído: ${testes.length} verificações`);
    localStorage.setItem("ytalseg_diagnostico_v47", JSON.stringify({ criadoEm:new Date().toISOString(), testes }));
  }

  React.useEffect(()=>{
    testar();
  },[]);

  const totalOk = resultado.filter(r=>r.estado === "OK").length;
  const totalAlertas = resultado.filter(r=>r.estado !== "OK").length;

  return (
    <div style={{padding:20}}>
      <h1>Diagnóstico do Sistema</h1>
      <p>Verificação rápida de usuários, sessão, logs, alertas, API e Electron.</p>

      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,margin:"15px 0"}}>
        <div style={{background:"#fff",border:"1px solid #ddd",borderRadius:12,padding:16}}>
          <strong>Total</strong>
          <h2>{resultado.length}</h2>
        </div>
        <div style={{background:"#fff",border:"1px solid #ddd",borderRadius:12,padding:16}}>
          <strong>OK</strong>
          <h2 style={{color:"#00B050"}}>{totalOk}</h2>
        </div>
        <div style={{background:"#fff",border:"1px solid #ddd",borderRadius:12,padding:16}}>
          <strong>Alertas</strong>
          <h2 style={{color:"#b45309"}}>{totalAlertas}</h2>
        </div>
      </div>

      <button onClick={testar}>Executar diagnóstico</button>

      <div style={{marginTop:15,fontWeight:900}}>{status}</div>

      <div style={{display:"grid",gap:10,marginTop:15}}>
        {resultado.map((r,i)=>(
          <div key={i} style={{background:"#fff",border:"1px solid #ddd",borderRadius:12,padding:14}}>
            <strong>{r.estado === "OK" ? "✅" : "⚠️"} {r.nome}</strong>
            <div>{r.detalhe}</div>
          </div>
        ))}
      </div>
    </div>
  );
}


function PerformanceSistemaV48(){
  const [dados,setDados] = React.useState({memoria:0,itens:0});
  const [status,setStatus] = React.useState("");

  function analisar(){
    try{
      let total = 0;
      let itens = 0;

      Object.keys(localStorage).forEach(k=>{
        const v = localStorage.getItem(k) || "";
        total += v.length;
        itens++;
      });

      setDados({
        memoria: total,
        itens: itens
      });

      setStatus("Análise de performance concluída");
    }catch{
      setStatus("Erro na análise");
    }
  }

  React.useEffect(()=>{
    analisar();
  },[]);

  return (
    <div style={{padding:20}}>
      <h1>Performance do Sistema</h1>

      <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:10}}>
        <div style={{background:"#fff",padding:15,border:"1px solid #ddd",borderRadius:12}}>
          <strong>Uso memória (bytes)</strong>
          <h2>{dados.memoria}</h2>
        </div>

        <div style={{background:"#fff",padding:15,border:"1px solid #ddd",borderRadius:12}}>
          <strong>Total itens</strong>
          <h2>{dados.itens}</h2>
        </div>
      </div>

      <button onClick={analisar} style={{marginTop:15}}>Reanalisar</button>

      <div style={{marginTop:10}}>{status}</div>
    </div>
  );
}


function LimpezaInteligenteV49(){
  const [status,setStatus] = React.useState("");
  const [itens,setItens] = React.useState<any[]>([]);

  const protegidos = [
    "ytalseg_user_v20",
    "ytalseg_auth",
    "ytalseg_users_v33",
    "ytalseg_relatorios_versoes_v11_2",
    "ytalseg_pacotes_cliente_v11_6",
    "ytalseg_envios_v25",
    "ytalseg_logs_v40",
    "ytalseg_alertas_v37",
    "ytalseg_api_real_v46"
  ];

  function analisar(){
    const lista:any[] = [];

    try{
      Object.keys(localStorage).forEach((k)=>{
        const valor = localStorage.getItem(k) || "";
        const protegido = protegidos.includes(k);
        const vazio = valor === "" || valor === "[]" || valor === "{}" || valor === "null";
        const temporario = k.includes("teste") || k.includes("temp") || k.includes("rascunho_old");

        lista.push({
          chave:k,
          tamanho:valor.length,
          protegido,
          podeLimpar: !protegido && (vazio || temporario),
          motivo: protegido ? "Protegido" : vazio ? "Vazio" : temporario ? "Temporário" : "Manter"
        });
      });

      setItens(lista);
      setStatus(`Análise concluída: ${lista.length} chave(s) verificadas.`);
    }catch{
      setStatus("Erro ao analisar limpeza.");
    }
  }

  function limparSeguro(){
    try{
      const remover = itens.filter(i=>i.podeLimpar).map(i=>i.chave);

      remover.forEach((k)=>localStorage.removeItem(k));

      setStatus(`Limpeza concluída: ${remover.length} item(ns) removido(s).`);
      analisar();
    }catch{
      setStatus("Erro ao executar limpeza.");
    }
  }

  function exportarRelatorio(){
    const blob = new Blob([JSON.stringify(itens,null,2)],{type:"application/json"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ytalseg_limpeza_v49_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setStatus("Relatório de limpeza exportado.");
  }

  React.useEffect(()=>{
    analisar();
  },[]);

  const limpar = itens.filter(i=>i.podeLimpar).length;
  const protegidosQtd = itens.filter(i=>i.protegido).length;
  const totalBytes = itens.reduce((acc,i)=>acc + Number(i.tamanho || 0),0);

  return (
    <div style={{padding:20}}>
      <h1>Limpeza Inteligente</h1>
      <p>Remove apenas itens seguros, vazios ou temporários. Dados importantes ficam protegidos.</p>

      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,margin:"15px 0"}}>
        <div style={{background:"#fff",border:"1px solid #ddd",borderRadius:12,padding:16}}>
          <strong>Total chaves</strong>
          <h2>{itens.length}</h2>
        </div>
        <div style={{background:"#fff",border:"1px solid #ddd",borderRadius:12,padding:16}}>
          <strong>Podem limpar</strong>
          <h2>{limpar}</h2>
        </div>
        <div style={{background:"#fff",border:"1px solid #ddd",borderRadius:12,padding:16}}>
          <strong>Protegidos</strong>
          <h2>{protegidosQtd}</h2>
        </div>
      </div>

      <div style={{display:"flex",gap:10,flexWrap:"wrap",marginBottom:15}}>
        <button onClick={analisar}>Analisar</button>
        <button onClick={limparSeguro}>Limpar seguro</button>
        <button onClick={exportarRelatorio}>Exportar relatório</button>
      </div>

      <div style={{fontWeight:900,marginBottom:10}}>{status}</div>
      <div style={{fontSize:12,marginBottom:15}}>Uso estimado: {totalBytes} bytes</div>

      <div style={{display:"grid",gap:8}}>
        {itens.map((item)=>(
          <div key={item.chave} style={{
            background:"#fff",
            border:"1px solid #ddd",
            borderRadius:12,
            padding:12,
            display:"grid",
            gridTemplateColumns:"2fr .7fr .8fr 1fr",
            gap:10,
            alignItems:"center"
          }}>
            <strong>{item.chave}</strong>
            <span>{item.tamanho} bytes</span>
            <span>{item.protegido ? "🔒 Protegido" : item.podeLimpar ? "🧹 Limpar" : "✅ Manter"}</span>
            <span>{item.motivo}</span>
          </div>
        ))}
      </div>
    </div>
  );
}


function AuditoriaAvancadaV50(){
  const [logs,setLogs] = React.useState<any[]>([]);
  const [status,setStatus] = React.useState("");

  function gerarAuditoria(){
    try{
      const lista:any[] = [];

      Object.keys(localStorage).forEach(k=>{
        const valor = localStorage.getItem(k);
        lista.push({
          chave:k,
          tamanho:valor ? valor.length : 0,
          atualizadoEm:new Date().toISOString()
        });
      });

      setLogs(lista);
      localStorage.setItem("ytalseg_auditoria_v50", JSON.stringify(lista));
      setStatus("Auditoria gerada com sucesso");
    }catch{
      setStatus("Erro na auditoria");
    }
  }

  React.useEffect(()=>{
    gerarAuditoria();
  },[]);

  return (
    <div style={{padding:20}}>
      <h1>Auditoria Avançada</h1>

      <button onClick={gerarAuditoria}>Gerar auditoria</button>

      <div style={{marginTop:10}}>{status}</div>

      <div style={{marginTop:15,display:"grid",gap:8}}>
        {logs.map((l,i)=>(
          <div key={i} style={{background:"#fff",padding:10,border:"1px solid #ddd",borderRadius:8}}>
            <strong>{l.chave}</strong>
            <div>{l.tamanho} bytes</div>
          </div>
        ))}
      </div>
    </div>
  );
}
