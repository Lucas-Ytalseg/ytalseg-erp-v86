const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("ytalsegAPI", {
  ping: () => "pong",
  exportarPacote: (data) => ipcRenderer.invoke("exportar-pacote", data),
  salvarDados: (data) => ipcRenderer.invoke("salvar-dados", data),
  carregarDados: () => ipcRenderer.invoke("carregar-dados"),
  backupDados: () => ipcRenderer.invoke("backup-dados"),
  importarBackupDados: () => ipcRenderer.invoke("importar-backup-dados"),
  salvarPDF: (nomeArquivo) => ipcRenderer.invoke("salvar-pdf", nomeArquivo),
  visualizarPDF: (nomeArquivo) => ipcRenderer.invoke("visualizar-pdf", nomeArquivo),
  gerarBackup: () => ipcRenderer.invoke("gerar-backup")
});
