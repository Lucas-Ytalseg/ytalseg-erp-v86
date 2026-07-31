// YTALSEG ERP - V51 FINAL CONSOLIDADA
// Base consolidada a partir do App.tsx atual enviado.
// Foco: estabilidade, menu limpo, permissões sem duplicações e zero bugs de merge com | em JSX.

import React from "react";
const HistoricoPDFs = React.lazy(() => import("./modules/HistoricoPDFs"));
const Relatorios = React.lazy(() => import("./modules/Relatorios"));
const Dashboard = React.lazy(() => import("./modules/Dashboard"));
import BancoLocal from "./modules/BancoLocal";
import AuditoriaSistema from "./modules/AuditoriaSistema";
import LoginSistema from "./modules/LoginSistema";
import PermissoesSistema from "./modules/PermissoesSistema";
import BackupAutomatico from "./modules/BackupAutomatico";
import Clientes from "./modules/Clientes";
const Financeiro = React.lazy(() => import("./modules/Financeiro"));
import Equipe from "./modules/Equipe";
const NotaFiscal = React.lazy(() => import("./modules/NotaFiscal"));
import Configuracoes from "./modules/Configuracoes";
import ConfiguracoesSistema from "./modules/ConfiguracoesSistema";
const Cobranca = React.lazy(() => import("./modules/Cobranca"));

type MenuKey = "dashboard" | "banco-local" | "auditoria" | "permissoes" | "backup" | "config-sistema" | "relatorios" | "clientes" | "financeiro" | "equipe" | "notafiscal" | "configuracoes" | "historico-pdfs" | "cobranca";

const VERDE = "#00B050";

type PerfilUsuario = "admin" | "operador" | "financeiro" | "consulta";

const PERMISSOES_MENU: Record<PerfilUsuario, MenuKey[]> = {
  admin: [
    "dashboard",
    "banco-local",
    "auditoria",
    "permissoes",
    "config-sistema",
    "relatorios",
    "clientes",
    "financeiro",
    "equipe",
    "notafiscal",
    "configuracoes",
    "historico-pdfs",
    "backup",
    "cobranca",
  ],
  operador: [
    "dashboard",
    "relatorios",
    "clientes",
    "historico-pdfs",
  ],
  financeiro: [
    "dashboard",
    "banco-local",
    "auditoria",
    "financeiro",
    "notafiscal",
    "historico-pdfs",
    "cobranca",
  ],
  consulta: [
    "dashboard",
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
  const [menu, setMenu] = React.useState<MenuKey>("dashboard");
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
    { id: "banco-local", label: "Banco Local", icon: "🗄️" },
    { id: "auditoria", label: "Auditoria", icon: "🧾" },
    { id: "permissoes", label: "Permissões", icon: "🔐" },
    { id: "backup", label: "Backup", icon: "💾" },
    { id: "config-sistema", label: "Config Sistema", icon: "🛠️" },
    { id: "relatorios", label: "Relatórios", icon: "📄" },
    { id: "clientes", label: "Clientes", icon: "🏢" },
    { id: "financeiro", label: "Financeiro", icon: "💰" },
    { id: "equipe", label: "Equipe", icon: "👷" },
    { id: "notafiscal", label: "Nota Fiscal", icon: "🧾" },
    { id: "cobranca", label: "Cobrança", icon: "💸" },
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
      ids: ["dashboard"],
    },
    {
      titulo: "Operação",
      icone: "📁",
      ids: ["relatorios", "historico-pdfs"],
    },
    {
      titulo: "Gestão",
      icone: "👥",
      ids: ["clientes", "financeiro", "equipe", "notafiscal", "cobranca", "permissoes"],
    },
    {
      titulo: "Dados e Segurança",
      icone: "💾",
      ids: ["banco-local", "backup"],
    },
    {
      titulo: "Sistema",
      icone: "🛠️",
      ids: ["config-sistema", "auditoria", "configuracoes"],
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
            {menu === "banco-local" && "Banco Local"}
            {menu === "auditoria" && "Auditoria do Sistema"}
            {menu === "permissoes" && "Permissões do Sistema"}
            {menu === "backup" && "Backup Automático"}
            {menu === "config-sistema" && "Configurações do Sistema"}
            {menu === "relatorios" && "Relatórios de Horas"}
            {menu === "clientes" && "Clientes"}
            {menu === "financeiro" && "Financeiro"}
            {menu === "equipe" && "Equipe"}
            {menu === "notafiscal" && "Nota Fiscal"}
            {menu === "cobranca" && "Cobrança"}
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
          <React.Suspense fallback={<div style={{ padding: 24, fontWeight: 800 }}>Carregando…</div>}>
          {menu === "dashboard" && <Dashboard />}
          {menu === "banco-local" && <BancoLocal />}
          {menu === "auditoria" && <AuditoriaSistema />}
          {menu === "permissoes" && <PermissoesSistema />}
          {menu === "backup" && <BackupAutomatico />}
          {menu === "config-sistema" && <ConfiguracoesSistema />}

          {menu === "relatorios" && (
            <div className="relatorios-box">
              <Relatorios />
            </div>
          )}

          {menu === "clientes" && <Clientes />}
          {menu === "financeiro" && <Financeiro />}
          {menu === "equipe" && <Equipe />}
          {menu === "notafiscal" && <NotaFiscal />}
          {menu === "cobranca" && <Cobranca />}
          {menu === "configuracoes" && <Configuracoes />}
          {menu === "historico-pdfs" && <HistoricoPDFs onAbrirRelatorio={() => setMenu("relatorios")} />}
          </React.Suspense>
        </section>
      </main>
    </div>
  );
}
