from fastapi import FastAPI, UploadFile, File, Form
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path
from datetime import datetime
import re
import fitz
import json
import os
import shutil
import sqlite3
import calendar
from pydantic import BaseModel
from typing import Optional
import uuid

app = FastAPI(title="YTALSEG Backend", version="8.0.0 PROFISSIONAL")

# ===== CORS MIDDLEWARE (FIXED) =====
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ===== PATHS =====
try:
    BASE_DIR = Path(__file__).resolve().parent
except NameError:
    BASE_DIR = Path.cwd()

DATA_DIR = Path(os.getenv("LOCALAPPDATA", str(Path.home()))) / "YTALSEG"
DATA_DIR.mkdir(parents=True, exist_ok=True)

UPLOAD_DIR = DATA_DIR / "uploads"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

BACKUP_DIR = DATA_DIR / "backups"
BACKUP_DIR.mkdir(parents=True, exist_ok=True)

EMPRESAS_PATH = DATA_DIR / "empresas.json"
DB_PATH = DATA_DIR / "ytalseg_erp.db"

POPPLER_PATH = r"C:\Users\lucas\Downloads\Release-25.12.0-0\poppler-25.12.0\Library\bin"
TESSERACT_PATH = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

# ===== EMPRESA PADRÃO =====
EMPRESA_ATUAL = {
    "nome": "GEOAMBIENTAL",
    "cnpj": "05.453.862/0001-93",
    "diaria_diurna": 560.00,
    "diaria_normal": 560.00,
    "diaria_noturna": 560.00,
    "sabado": 400.00,
    "domingo_feriado": 350.00,
    "hora_20": 672.00,
    "hora_50": 840.00,
    "hora_100": 1120.00,
    "adicional_noturno": 140.00,
    "usa_adicional_noturno": True,
    "feriado_usa_valor_domingo": True,
}

def carregar_empresas():
    if not EMPRESAS_PATH.exists():
        empresas_padrao = {"geoambiental": EMPRESA_ATUAL}
        EMPRESAS_PATH.write_text(json.dumps(empresas_padrao, indent=2, ensure_ascii=False), encoding="utf-8")
    return json.loads(EMPRESAS_PATH.read_text(encoding="utf-8"))

def salvar_empresas(empresas: dict):
    EMPRESAS_PATH.write_text(json.dumps(empresas, indent=2, ensure_ascii=False), encoding="utf-8")

def gerar_id_empresa(nome: str):
    base = re.sub(r"[^a-z0-9]+", "_", nome.lower()).strip("_")
    return base or "empresa"

class EmpresaPayload(BaseModel):
    id: Optional[str] = None
    nome: str
    cnpj: str = ""
    diaria_diurna: float = 0
    diaria_noturna: float = 0
    sabado: float = 0
    domingo_feriado: float = 0
    hora_20: float = 0
    hora_50: float = 0
    hora_100: float = 0
    adicional_noturno: float = 0
    usa_adicional_noturno: bool = True
    feriado_usa_valor_domingo: bool = True

def obter_empresa(empresa_id: str):
    empresas = carregar_empresas()
    return empresas.get(empresa_id) or empresas.get("geoambiental") or list(empresas.values())[0]

# ===== DATABASE =====
def conectar_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = conectar_db()
    cur = conn.cursor()
    cur.execute("""
        CREATE TABLE IF NOT EXISTS financeiro (
            id TEXT PRIMARY KEY,
            cliente TEXT NOT NULL,
            referencia TEXT,
            descricao TEXT,
            valor REAL NOT NULL DEFAULT 0,
            status TEXT NOT NULL DEFAULT 'pendente',
            data_emissao TEXT,
            data_recebimento TEXT
        )
    """)
    cur.execute("""
        CREATE TABLE IF NOT EXISTS equipe (
            id TEXT PRIMARY KEY,
            nome TEXT NOT NULL,
            funcao TEXT,
            telefone TEXT,
            admissao TEXT,
            ativo INTEGER NOT NULL DEFAULT 1,
            diaria REAL NOT NULL DEFAULT 0,
            comissao REAL NOT NULL DEFAULT 0,
            documentos TEXT,
            validade TEXT
        )
    """)
    conn.commit()
    conn.close()

init_db()

class FinanceiroPayload(BaseModel):
    id: Optional[str] = None
    cliente: str
    referencia: str = ""
    descricao: str = ""
    valor: float = 0
    status: str = "pendente"
    dataEmissao: str = ""
    dataRecebimento: str = ""

class EquipePayload(BaseModel):
    id: Optional[str] = None
    nome: str
    funcao: str = ""
    telefone: str = ""
    admissao: str = ""
    ativo: bool = True
    diaria: float = 0
    comissao: float = 0
    documentos: str = ""
    validade: str = ""

def gerar_id():
    return str(uuid.uuid4())

def row_financeiro(row):
    return {
        "id": row["id"],
        "cliente": row["cliente"],
        "referencia": row["referencia"] or "",
        "descricao": row["descricao"] or "",
        "valor": row["valor"] or 0,
        "status": row["status"] or "pendente",
        "dataEmissao": row["data_emissao"] or "",
        "dataRecebimento": row["data_recebimento"] or "",
    }

def row_equipe(row):
    return {
        "id": row["id"],
        "nome": row["nome"],
        "funcao": row["funcao"] or "",
        "telefone": row["telefone"] or "",
        "admissao": row["admissao"] or "",
        "ativo": bool(row["ativo"]),
        "diaria": row["diaria"] or 0,
        "comissao": row["comissao"] or 0,
        "documentos": row["documentos"] or "",
        "validade": row["validade"] or "",
    }

# ===== API ROUTES =====
@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/empresas")
def listar_empresas():
    empresas = carregar_empresas()
    return {
        "status": "ok",
        "empresas": [{"id": chave, **dados} for chave, dados in empresas.items()]
    }

@app.get("/empresas/{empresa_id}")
def obter_empresa_api(empresa_id: str):
    empresas = carregar_empresas()
    if empresa_id not in empresas:
        return {"status": "erro", "erro": "Empresa não encontrada"}
    return {"status": "ok", "id": empresa_id, "empresa": empresas[empresa_id]}

@app.post("/empresas")
def salvar_empresa_api(payload: EmpresaPayload):
    empresas = carregar_empresas()
    empresa_id = (payload.id or gerar_id_empresa(payload.nome)).lower().strip()
    empresa_id = re.sub(r"[^a-z0-9_]+", "_", empresa_id).strip("_")
    dados = payload.dict()
    dados.pop("id", None)
    dados["diaria_normal"] = dados.get("diaria_diurna", 0)
    empresas[empresa_id] = dados
    salvar_empresas(empresas)
    return {"status": "ok", "id": empresa_id, "empresa": dados, "mensagem": "Empresa salva com sucesso"}

@app.delete("/empresas/{empresa_id}")
def excluir_empresa_api(empresa_id: str):
    empresas = carregar_empresas()
    if empresa_id not in empresas:
        return {"status": "erro", "erro": "Empresa não encontrada"}
    if empresa_id == "geoambiental":
        return {"status": "erro", "erro": "A empresa padrão não pode ser excluída"}
    removida = empresas.pop(empresa_id)
    salvar_empresas(empresas)
    return {"status": "ok", "id": empresa_id, "empresa": removida, "mensagem": "Empresa excluída com sucesso"}

@app.get("/financeiro")
def listar_financeiro():
    conn = conectar_db()
    rows = conn.execute("SELECT * FROM financeiro ORDER BY data_emissao DESC, rowid DESC").fetchall()
    conn.close()
    return {"status": "ok", "lancamentos": [row_financeiro(r) for r in rows]}

@app.post("/financeiro")
def salvar_financeiro(payload: FinanceiroPayload):
    item_id = payload.id or gerar_id()
    conn = conectar_db()
    conn.execute(
        """INSERT OR REPLACE INTO financeiro (id, cliente, referencia, descricao, valor, status, data_emissao, data_recebimento)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)""",
        (item_id, payload.cliente, payload.referencia, payload.descricao, payload.valor, payload.status, payload.dataEmissao, payload.dataRecebimento),
    )
    conn.commit()
    row = conn.execute("SELECT * FROM financeiro WHERE id = ?", (item_id,)).fetchone()
    conn.close()
    return {"status": "ok", "lancamento": row_financeiro(row)}

@app.delete("/financeiro/{item_id}")
def excluir_financeiro(item_id: str):
    conn = conectar_db()
    conn.execute("DELETE FROM financeiro WHERE id = ?", (item_id,))
    conn.commit()
    conn.close()
    return {"status": "ok", "id": item_id}

@app.get("/equipe")
def listar_equipe():
    conn = conectar_db()
    rows = conn.execute("SELECT * FROM equipe ORDER BY nome ASC").fetchall()
    conn.close()
    return {"status": "ok", "equipe": [row_equipe(r) for r in rows]}

@app.post("/equipe")
def salvar_equipe(payload: EquipePayload):
    item_id = payload.id or gerar_id()
    conn = conectar_db()
    conn.execute(
        """INSERT OR REPLACE INTO equipe (id, nome, funcao, telefone, admissao, ativo, diaria, comissao, documentos, validade)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
        (item_id, payload.nome, payload.funcao, payload.telefone, payload.admissao, 1 if payload.ativo else 0, payload.diaria, payload.comissao, payload.documentos, payload.validade),
    )
    conn.commit()
    row = conn.execute("SELECT * FROM equipe WHERE id = ?", (item_id,)).fetchone()
    conn.close()
    return {"status": "ok", "colaborador": row_equipe(row)}

@app.delete("/equipe/{item_id}")
def excluir_equipe(item_id: str):
    conn = conectar_db()
    conn.execute("DELETE FROM equipe WHERE id = ?", (item_id,))
    conn.commit()
    conn.close()
    return {"status": "ok", "id": item_id}

@app.post("/backup")
def criar_backup():
    try:
        BACKUP_DIR.mkdir(parents=True, exist_ok=True)
        if not DB_PATH.exists():
            return {"status": "erro", "erro": "Banco SQLite não encontrado."}
        nome = f"ytalseg_erp_backup_{datetime.now().strftime('%Y%m%d_%H%M%S')}.db"
        destino = BACKUP_DIR / nome
        shutil.copy2(DB_PATH, destino)
        return {"status": "ok", "arquivo": nome, "caminho": str(destino), "pasta": str(BACKUP_DIR)}
    except Exception as e:
        return {"status": "erro", "erro": str(e)}

@app.get("/sistema-info")
def sistema_info():
    return {
        "status": "ok",
        "data_dir": str(DATA_DIR),
        "db_path": str(DB_PATH),
        "backup_dir": str(BACKUP_DIR),
        "empresas_path": str(EMPRESAS_PATH),
    }

# ===== SERVE STATIC FILES (AT THE END!) =====
static_dir = Path(__file__).parent / "static"
if static_dir.exists():
    app.mount("/", StaticFiles(directory=static_dir, html=True), name="static")