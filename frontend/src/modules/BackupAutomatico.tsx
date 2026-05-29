import { useEffect, useState } from "react";

const KEY = "ytalseg_auto_backup_v22";

export default function BackupAutomatico() {
  const [status, setStatus] = useState("");

  function gerarBackup() {
    const payload = {
      data: new Date().toISOString(),
      storage: { ...localStorage }
    };

    localStorage.setItem(KEY, JSON.stringify(payload));
    setStatus("Backup automático salvo.");
  }

  function restaurarBackup() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) {
        setStatus("Nenhum backup encontrado.");
        return;
      }

      const data = JSON.parse(raw);
      const storage = data.storage || {};

      Object.keys(storage).forEach((k) => {
        localStorage.setItem(k, storage[k]);
      });

      setStatus("Backup restaurado.");
    } catch {
      setStatus("Erro ao restaurar backup.");
    }
  }

  useEffect(() => {
    const i = setInterval(() => {
      gerarBackup();
    }, 30000); // a cada 30s

    return () => clearInterval(i);
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Backup Automático</h1>

      <p>Status: {status}</p>

      <button onClick={gerarBackup}>Gerar agora</button>
      <button onClick={restaurarBackup}>Restaurar backup</button>
    </div>
  );
}
