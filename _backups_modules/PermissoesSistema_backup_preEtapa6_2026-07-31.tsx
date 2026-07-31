const PERFIS = [
  {
    nome: "Admin",
    descricao: "Acesso total ao sistema.",
    acessos: [
      "Dashboard",
      "Relatórios",
      "Pacote Cliente",
      "Pendências",
      "Financeiro",
      "Banco Local",
      "Auditoria",
      "Notificações",
      "Configurações",
      "Envios",
    ],
  },
  {
    nome: "Operador",
    descricao: "Foco na operação diária e emissão de relatórios.",
    acessos: [
      "Dashboard",
      "Relatórios",
      "Pacote Cliente",
      "Pendências",
      "Envios",
      "Notificações",
    ],
  },
  {
    nome: "Financeiro",
    descricao: "Foco em cobrança, valores, pacotes e pendências.",
    acessos: [
      "Dashboard",
      "Financeiro",
      "Pacote Cliente",
      "Pendências",
      "Banco Local",
      "Auditoria",
    ],
  },
  {
    nome: "Consulta",
    descricao: "Visualização segura, sem áreas sensíveis.",
    acessos: [
      "Dashboard",
      "Dashboard Operacional",
      "Gráficos",
      "Pendências",
      "Notificações",
    ],
  },
];

export default function PermissoesSistema() {
  return (
    <div className="perm-page">
      <style>{`
        .perm-page {
          display: grid;
          gap: 16px;
        }

        .perm-head h1 {
          margin: 0;
          font-size: 30px;
          font-weight: 1000;
          color: #111827;
        }

        .perm-head p {
          margin: 6px 0 0;
          color: #6b7280;
          font-weight: 800;
        }

        .perm-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 14px;
        }

        .perm-card {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 22px;
          padding: 18px;
          box-shadow: 0 10px 24px rgba(0,0,0,.06);
        }

        .perm-card h2 {
          margin: 0;
          color: #00B050;
          font-size: 24px;
          font-weight: 1000;
        }

        .perm-card p {
          margin: 6px 0 12px;
          color: #6b7280;
          font-weight: 800;
        }

        .perm-list {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .perm-badge {
          padding: 7px 10px;
          border-radius: 999px;
          background: #ecfdf5;
          color: #166534;
          font-size: 12px;
          font-weight: 1000;
        }

        .perm-alert {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 18px;
          padding: 16px;
          color: #374151;
          font-weight: 850;
          box-shadow: 0 10px 22px rgba(0,0,0,.05);
        }

        @media (max-width: 900px) {
          .perm-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="perm-head">
        <h1>Permissões do Sistema</h1>
        <p>Perfis de acesso da V21 para controlar o menu por usuário.</p>
      </div>

      <div className="perm-alert">
        Para trocar o perfil, clique em <strong>Sair</strong> no topo e entre novamente escolhendo outro perfil.
      </div>

      <div className="perm-grid">
        {PERFIS.map((perfil) => (
          <div className="perm-card" key={perfil.nome}>
            <h2>{perfil.nome}</h2>
            <p>{perfil.descricao}</p>
            <div className="perm-list">
              {perfil.acessos.map((a) => (
                <span className="perm-badge" key={a}>{a}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
