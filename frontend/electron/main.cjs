const { app, BrowserWindow, ipcMain, dialog, Menu, shell } = require("electron");
const path = require("path");
const fs = require("fs");
const zlib = require("zlib");
const { spawn } = require("child_process");

let backendProcess = null;

app.setName("YTALSEG Relatórios");


function getBackendBaseDir() {
  if (app.isPackaged) return path.join(process.resourcesPath, "backend");
  return path.join(__dirname, "..", "..", "app", "backend");
}

function getPythonExecutable(backendDir) {
  const winPython = path.join(backendDir, ".venv", "Scripts", "python.exe");
  const unixPython = path.join(backendDir, ".venv", "bin", "python");
  if (fs.existsSync(winPython)) return winPython;
  if (fs.existsSync(unixPython)) return unixPython;
  return process.platform === "win32" ? "python" : "python3";
}

function startBackend() {
  if (backendProcess) return;
  const backendDir = getBackendBaseDir();
  const mainPy = path.join(backendDir, "app", "main.py");
  if (!fs.existsSync(mainPy)) {
    console.error("Backend não encontrado:", mainPy);
    return;
  }
  const pythonExe = getPythonExecutable(backendDir);
  backendProcess = spawn(pythonExe, ["-m", "uvicorn", "app.main:app", "--host", "127.0.0.1", "--port", "8000"], {
    cwd: backendDir,
    windowsHide: true,
    stdio: "ignore",
    env: { ...process.env, PYTHONUTF8: "1", PYTHONIOENCODING: "utf-8" }
  });
  backendProcess.on("exit", () => { backendProcess = null; });
  backendProcess.on("error", (e) => { console.error("Falha ao iniciar backend:", e); backendProcess = null; });
}

function stopBackend() {
  try {
    if (backendProcess && !backendProcess.killed) backendProcess.kill();
  } catch {}
  backendProcess = null;
}

function getDataDir() {
  const dir = path.join(app.getPath("userData"), "ytalseg-data");
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  return dir;
}

function getDataFile() {
  return path.join(getDataDir(), "banco-ytalseg.json");
}

function readJsonSafe(file, fallback) {
  try {
    if (!fs.existsSync(file)) return fallback;
    const raw = fs.readFileSync(file, "utf8");
    if (!raw.trim()) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function writeJsonSafe(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2), "utf8");
}

function crc32(buf) {
  let table = crc32.table;
  if (!table) {
    table = crc32.table = new Uint32Array(256);
    for (let i = 0; i < 256; i++) {
      let c = i;
      for (let k = 0; k < 8; k++) c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
      table[i] = c >>> 0;
    }
  }
  let crc = 0 ^ -1;
  for (let i = 0; i < buf.length; i++) crc = (crc >>> 8) ^ table[(crc ^ buf[i]) & 0xff];
  return (crc ^ -1) >>> 0;
}

function dosDateTime(date = new Date()) {
  const year = Math.max(date.getFullYear(), 1980);
  return {
    dosTime: (date.getHours() << 11) | (date.getMinutes() << 5) | Math.floor(date.getSeconds() / 2),
    dosDate: ((year - 1980) << 9) | ((date.getMonth() + 1) << 5) | date.getDate()
  };
}

function createZip(files) {
  const localParts = [];
  const centralParts = [];
  let offset = 0;
  const { dosTime, dosDate } = dosDateTime();

  for (const file of files) {
    const name = Buffer.from(String(file.nome || "arquivo.txt").replace(/\\/g, "/"), "utf8");
    const data = Buffer.from(String(file.conteudo || ""), "utf8");
    const compressed = zlib.deflateRawSync(data);
    const crc = crc32(data);

    const local = Buffer.alloc(30);
    local.writeUInt32LE(0x04034b50, 0);
    local.writeUInt16LE(20, 4);
    local.writeUInt16LE(0, 6);
    local.writeUInt16LE(8, 8);
    local.writeUInt16LE(dosTime, 10);
    local.writeUInt16LE(dosDate, 12);
    local.writeUInt32LE(crc, 14);
    local.writeUInt32LE(compressed.length, 18);
    local.writeUInt32LE(data.length, 22);
    local.writeUInt16LE(name.length, 26);
    local.writeUInt16LE(0, 28);

    localParts.push(local, name, compressed);

    const central = Buffer.alloc(46);
    central.writeUInt32LE(0x02014b50, 0);
    central.writeUInt16LE(20, 4);
    central.writeUInt16LE(20, 6);
    central.writeUInt16LE(0, 8);
    central.writeUInt16LE(8, 10);
    central.writeUInt16LE(dosTime, 12);
    central.writeUInt16LE(dosDate, 14);
    central.writeUInt32LE(crc, 16);
    central.writeUInt32LE(compressed.length, 20);
    central.writeUInt32LE(data.length, 24);
    central.writeUInt16LE(name.length, 28);
    central.writeUInt16LE(0, 30);
    central.writeUInt16LE(0, 32);
    central.writeUInt16LE(0, 34);
    central.writeUInt16LE(0, 36);
    central.writeUInt32LE(0, 38);
    central.writeUInt32LE(offset, 42);

    centralParts.push(central, name);
    offset += local.length + name.length + compressed.length;
  }

  const centralSize = centralParts.reduce((sum, part) => sum + part.length, 0);
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0);
  end.writeUInt16LE(0, 4);
  end.writeUInt16LE(0, 6);
  end.writeUInt16LE(files.length, 8);
  end.writeUInt16LE(files.length, 10);
  end.writeUInt32LE(centralSize, 12);
  end.writeUInt32LE(offset, 16);
  end.writeUInt16LE(0, 20);

  return Buffer.concat([...localParts, ...centralParts, end]);
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 850,
    minWidth: 1100,
    minHeight: 720,
    title: "YTALSEG Relatórios",
    icon: path.join(__dirname, "assets", "icon.ico"),
    show: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false
    }
  });

  win.once("ready-to-show", () => win.show());

  const indexFile = path.join(__dirname, "..", "dist", "index.html");
  if (fs.existsSync(indexFile)) win.loadFile(indexFile);
  else win.loadURL("http://localhost:5173");
}

app.whenReady().then(() => {
  Menu.setApplicationMenu(null);
  startBackend();
  createWindow();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    stopBackend();
    app.quit();
  }
});

ipcMain.handle("exportar-pacote", async (event, data) => {
  try {
    const { cliente, arquivos } = data || {};
    const destino = dialog.showSaveDialogSync({
      title: "Salvar pacote",
      defaultPath: `${cliente || "pacote-cliente"}.zip`,
      filters: [{ name: "ZIP", extensions: ["zip"] }]
    });

    if (!destino) return { ok: false, erro: "cancelado" };
    fs.writeFileSync(destino, createZip((arquivos || []).filter((f) => f && f.conteudo)));
    return { ok: true, path: destino };
  } catch (e) {
    return { ok: false, erro: e.message };
  }
});

ipcMain.handle("salvar-dados", async (event, payload) => {
  try {
    const file = getDataFile();
    const bancoAtual = readJsonSafe(file, { versao: "V56", criadoEm: new Date().toISOString(), dados: {} });
    const bancoNovo = { ...bancoAtual, versao: "V56", atualizadoEm: new Date().toISOString(), dados: payload?.dados || payload || {} };
    writeJsonSafe(file, bancoNovo);
    return { ok: true, path: file, atualizadoEm: bancoNovo.atualizadoEm };
  } catch (e) {
    return { ok: false, erro: e.message };
  }
});

ipcMain.handle("carregar-dados", async () => {
  try {
    const file = getDataFile();
    const banco = readJsonSafe(file, { versao: "V56", dados: {} });
    return { ok: true, path: file, dados: banco.dados || {}, atualizadoEm: banco.atualizadoEm || null };
  } catch (e) {
    return { ok: false, erro: e.message };
  }
});

ipcMain.handle("backup-dados", async () => {
  try {
    const file = getDataFile();
    const banco = readJsonSafe(file, { versao: "V56", dados: {} });
    const destino = dialog.showSaveDialogSync({
      title: "Salvar backup do banco YTALSEG",
      defaultPath: `backup-ytalseg-${Date.now()}.json`,
      filters: [{ name: "JSON", extensions: ["json"] }]
    });

    if (!destino) return { ok: false, erro: "cancelado" };
    writeJsonSafe(destino, banco);
    return { ok: true, path: destino };
  } catch (e) {
    return { ok: false, erro: e.message };
  }
});

ipcMain.handle("importar-backup-dados", async () => {
  try {
    const result = dialog.showOpenDialogSync({
      title: "Importar backup YTALSEG",
      filters: [{ name: "JSON", extensions: ["json"] }],
      properties: ["openFile"]
    });

    if (!result || !result[0]) return { ok: false, erro: "cancelado" };
    const banco = readJsonSafe(result[0], null);
    if (!banco) return { ok: false, erro: "Arquivo inválido." };
    writeJsonSafe(getDataFile(), banco);
    return { ok: true, path: result[0], dados: banco.dados || {} };
  } catch (e) {
    return { ok: false, erro: e.message };
  }
});


ipcMain.handle("salvar-pdf", async (event, nomeArquivo) => {
  try {
    const win = BrowserWindow.fromWebContents(event.sender);
    if (!win) return { ok: false, erro: "Janela não encontrada." };
    const destino = dialog.showSaveDialogSync(win, {
      title: "Salvar PDF",
      defaultPath: nomeArquivo || "Relatorio_YTALSEG.pdf",
      filters: [{ name: "PDF", extensions: ["pdf"] }]
    });
    if (!destino) return { ok: false, erro: "cancelado" };
    const pdf = await win.webContents.printToPDF({ printBackground: true, landscape: false, marginsType: 0 });
    fs.writeFileSync(destino, pdf);
    return { ok: true, path: destino };
  } catch (e) {
    return { ok: false, erro: e.message };
  }
});



ipcMain.handle("visualizar-pdf", async (event, nomeArquivo) => {
  try {
    const win = BrowserWindow.fromWebContents(event.sender);
    if (!win) return { ok: false, erro: "Janela não encontrada." };

    const pdf = await win.webContents.printToPDF({
      printBackground: true,
      landscape: false,
      marginsType: 0
    });

    // Correção V82:
    // Não reutiliza o mesmo arquivo de preview, porque o Adobe/Edge pode deixar o PDF aberto e travado.
    // Cada visualização gera um arquivo novo no TEMP, evitando EBUSY/resource busy or locked.
    const baseName = String(nomeArquivo || "Preview_YTALSEG.pdf")
      .replace(/[\/:*?"<>|]/g, "_")
      .replace(/\.pdf$/i, "");

    const dir = path.join(app.getPath("temp"), "ytalseg-preview");
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    const stamp = new Date().toISOString().replace(/[:.]/g, "-");
    const file = path.join(dir, `${baseName}_${stamp}.pdf`);

    fs.writeFileSync(file, pdf);

    const erro = await shell.openPath(file);
    if (erro) return { ok: false, erro };
    return { ok: true, path: file };
  } catch (e) {
    return { ok: false, erro: e.message };
  }
});

ipcMain.handle("gerar-backup", async () => {
  try {
    const origem = getDataFile();
    const banco = readJsonSafe(origem, { versao: "V66", dados: {} });
    const pasta = path.join(getDataDir(), "backups");
    if (!fs.existsSync(pasta)) fs.mkdirSync(pasta, { recursive: true });
    const arquivo = path.join(pasta, `backup-ytalseg-${new Date().toISOString().replace(/[:.]/g, "-")}.json`);
    writeJsonSafe(arquivo, banco);
    return { ok: true, pasta, arquivo };
  } catch (e) {
    return { ok: false, erro: e.message };
  }
});
