from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
from datetime import datetime
import re
import fitz
import json
import os
import shutil
import sqlite3
import calendar
from fastapi.staticfiles import StaticFiles
from pathlib import Path
from pydantic import BaseModel
from typing import Optional, List

app = FastAPI(title="YTALSEG Backend", version="8.0.0 PROFISSIONAL")

app.add_middleware(
    CORSMiddleware,
# Servir arquivos estáticos do frontend
static_dir = Path(__file__).parent / "static"
if static_dir.exists():
    app.mount("/", StaticFiles(directory=static_dir, html=True), name="static")
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

try:
    BASE_DIR = Path(__file__).resolve().parent
except NameError:
    BASE_DIR = Path.cwd()

# V10.13.2 DESKTOP FIX:
# Quando instalado em Program Files, a pasta resources é somente leitura.
# Por isso banco, uploads, empresas.json e backups precisam ficar no AppData do usuário.
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

# Valores provisórios. Depois vamos migrar para banco de clientes.
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
        empresas_padrao = {
            "geoambiental": EMPRESA_ATUAL
        }
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
    import uuid
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


@app.get("/")
def home():
    return {
        "status": "online",
        "versao": "8.0.0 PROFISSIONAL",
        "mensagem": "Backend YTALSEG V8 com banco de empresas"
    }


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/empresas")
def listar_empresas():
    empresas = carregar_empresas()
    return {
        "status": "ok",
        "empresas": [
            {"id": chave, **dados}
            for chave, dados in empresas.items()
        ]
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

    # Mantém compatibilidade com versões antigas do cálculo.
    dados["diaria_normal"] = dados.get("diaria_diurna", 0)

    empresas[empresa_id] = dados
    salvar_empresas(empresas)

    return {
        "status": "ok",
        "id": empresa_id,
        "empresa": dados,
        "mensagem": "Empresa salva com sucesso"
    }


@app.delete("/empresas/{empresa_id}")
def excluir_empresa_api(empresa_id: str):
    empresas = carregar_empresas()

    if empresa_id not in empresas:
        return {"status": "erro", "erro": "Empresa não encontrada"}

    if empresa_id == "geoambiental":
        return {"status": "erro", "erro": "A empresa padrão não pode ser excluída"}

    removida = empresas.pop(empresa_id)
    salvar_empresas(empresas)

    return {
        "status": "ok",
        "id": empresa_id,
        "empresa": removida,
        "mensagem": "Empresa excluída com sucesso"
    }


def semana_por_data(data: str) -> str:
    try:
        dt = datetime.strptime(data, "%d/%m/%Y")
        nomes = [
            "segunda-feira",
            "terça-feira",
            "quarta-feira",
            "quinta-feira",
            "sexta-feira",
            "sábado",
            "domingo",
        ]
        return nomes[dt.weekday()]
    except Exception:
        return "-"


def tipo_dia_por_data(data: str) -> str:
    semana = semana_por_data(data).lower()
    if "sábado" in semana or "sabado" in semana:
        return "sabado"
    if "domingo" in semana:
        return "domingo"
    return "diaria"


def valor_periodo(tipo_dia: str, periodo: str):
    if tipo_dia == "sabado":
        return EMPRESA_ATUAL["sabado"]
    if tipo_dia == "domingo":
        return EMPRESA_ATUAL["domingo_feriado"]
    if periodo == "noturno":
        return EMPRESA_ATUAL["diaria_noturna"]
    return EMPRESA_ATUAL["diaria_normal"]

def adicional_noturno_25(tipo_dia: str) -> float:
    """Calcula 25% do valor correto do período noturno.
    Diária normal, sábado e domingo/feriado têm bases diferentes.
    """
    return round(float(valor_periodo(tipo_dia, "noturno")) * 0.25, 2)


def limpar_texto_ocr(texto: str) -> str:
    texto = texto.replace("\n", " ")
    texto = re.sub(r"\s+", " ", texto)
    return texto.lower()


def carregar_imagem_pdf(file_path: Path):
    from pdf2image import convert_from_path
    from PIL import Image

    Image.MAX_IMAGE_PIXELS = None

    imagens = convert_from_path(
        str(file_path),
        dpi=220,
        poppler_path=POPPLER_PATH
    )

    if not imagens:
        raise RuntimeError("Não foi possível converter o PDF em imagem.")

    return imagens[0].convert("RGB")


def contar_assinatura_pixels(img, box):
    """
    Conta pixels de assinatura na coluna assinatura.
    Calibrado para NÃO contar as linhas da tabela como assinatura.
    """
    x1, y1, x2, y2 = box
    w = x2 - x1
    h = y2 - y1

    # Margem maior para fugir das linhas horizontais e verticais da tabela.
    mx = max(4, int(w * 0.10))
    my = max(4, int(h * 0.22))

    crop = img.crop((x1 + mx, y1 + my, x2 - mx, y2 - my))

    count = 0
    for r, g, b in crop.getdata():
        # assinatura costuma virar azul/cinza escuro
        azul_caneta = b > r + 10 and b > g + 4 and r < 190
        escuro = r < 105 and g < 105 and b < 135
        if azul_caneta or escuro:
            count += 1

    return count


def ocr_noturno_cell(img, box):
    """
    OCR apenas da célula NOTURNO.
    Diferencia horários escritos de simples traço/linha em branco.
    """
    import pytesseract
    from PIL import ImageOps, ImageEnhance, ImageFilter

    pytesseract.pytesseract.tesseract_cmd = TESSERACT_PATH

    x1, y1, x2, y2 = box
    w = x2 - x1
    h = y2 - y1

    mx = max(3, int(w * 0.04))
    my = max(3, int(h * 0.12))

    crop = img.crop((x1 + mx, y1 + my, x2 - mx, y2 - my)).convert("L")

    # aumenta para OCR reconhecer número manuscrito
    crop = crop.resize((crop.width * 3, crop.height * 3))
    crop = ImageOps.autocontrast(crop)
    crop = ImageEnhance.Contrast(crop).enhance(2.4)
    crop = ImageEnhance.Sharpness(crop).enhance(2.2)
    crop = crop.filter(ImageFilter.SHARPEN)

    txt = pytesseract.image_to_string(
        crop,
        lang="por",
        config="--oem 3 --psm 7 -c tessedit_char_whitelist=0123456789:;hH.oO"
    )

    txt = txt.lower()
    txt = txt.replace("o", "0").replace("h", ":").replace(";", ":").replace(".", ":")
    txt = re.sub(r"\s+", " ", txt)

    return txt.strip()


def noturno_preenchido_por_ocr(texto_cell: str) -> bool:
    """
    Noturno válido se OCR sugerir 2 horários ou padrão 22/06, 21/06, 19/07 etc.
    Traço/linha em branco não deve contar.
    """
    t = texto_cell.lower()

    # remove lixo comum
    t = t.replace(" ", "")

    # Horas completas
    horarios = re.findall(r"(?:[01]?\d|2[0-3])[:](?:[0-5]\d)", t)
    if len(horarios) >= 2:
        return True

    # padrões manuscritos sem dois pontos: 2200 0600
    if re.search(r"2[0-3]0{2}", t) and re.search(r"0?[5-7]0{2}", t):
        return True

    # padrões OCR parcial
    if ("22" in t or "21" in t or "20" in t or "19" in t or "15" in t) and ("06" in t or "6" in t or "07" in t or "7" in t or "00" in t):
        return True

    return False


def montar_resumo(dias):
    total_periodos = sum(d["qtd_periodos"] for d in dias)
    total_diarias = sum(d["valor_diurno"] + d["valor_noturno"] for d in dias)
    total_adicional_noturno = sum(d["adicional_noturno"] for d in dias)
    total_geral = total_diarias + total_adicional_noturno

    dias_normais = len([d for d in dias if d["tipo_dia"] == "diaria" and d["qtd_periodos"] > 0])
    sabados = len([d for d in dias if d["tipo_dia"] == "sabado" and d["qtd_periodos"] > 0])
    domingos = len([d for d in dias if d["tipo_dia"] == "domingo" and d["qtd_periodos"] > 0])

    periodos_diurnos = len([d for d in dias if d["periodo_diurno"]])
    periodos_noturnos = len([d for d in dias if d["periodo_noturno"]])

    return {
        "dias_detectados": dias,
        "resumo": {
            "dias_normais": dias_normais,
            "sabados": sabados,
            "domingos_feriados": domingos,
            "periodos_diurnos": periodos_diurnos,
            "periodos_noturnos": periodos_noturnos,
            "total_periodos": total_periodos,
            "total_diarias": total_diarias,
            "total_sabados": sum(d["valor"] for d in dias if d["tipo_dia"] == "sabado"),
            "total_domingos_feriados": sum(d["valor"] for d in dias if d["tipo_dia"] == "domingo"),
            "total_adicional_noturno": total_adicional_noturno,
            "valor_total": total_geral
        }
    }


def escanear_pdf_padrao_por_template(file_path: Path, mes: int = 3, ano: int = 2026):
    img = carregar_imagem_pdf(file_path)
    W, H = img.size

    # Coordenadas calibradas para o PDF padrão enviado.
    row_top = int(H * 0.288)
    row_h = (H * 0.529) / 31.0

    noturno_x1 = int(W * 0.325)
    noturno_x2 = int(W * 0.418)

    assinatura_x1 = int(W * 0.720)
    assinatura_x2 = int(W * 0.925)

    dias = []

    mes = int(mes or 3)
    ano = int(ano or 2026)

    for dia in range(1, calendar.monthrange(ano, mes)[1] + 1):
        data = f"{dia:02d}/{mes:02d}/{ano}"

        y1 = int(row_top + (dia - 1) * row_h)
        y2 = int(row_top + dia * row_h)

        assinatura_pixels = contar_assinatura_pixels(
            img,
            (assinatura_x1, y1, assinatura_x2, y2)
        )

        # V6.3: threshold calibrado para não contar campo em branco.
        # No PDF de teste, campos vazios ficaram abaixo de ~3.600;
        # assinaturas reais ficaram normalmente acima de ~7.900.
        assinatura = assinatura_pixels >= 6000

        texto_noturno = ocr_noturno_cell(
            img,
            (noturno_x1, y1, noturno_x2, y2)
        )

        noturno = noturno_preenchido_por_ocr(texto_noturno)

        # Regra principal:
        # Sem assinatura = não cobra nada, mesmo se houver linha/ruído no campo.
        if not assinatura:
            diurno = False
            noturno = False
        else:
            # No modelo padrão, se assinou, o período diurno fixo conta.
            diurno = True

        tipo_dia = tipo_dia_por_data(data)
        semana = semana_por_data(data)

        qtd_periodos = int(diurno) + int(noturno)

        valor_diurno = valor_periodo(tipo_dia, "diurno") if diurno else 0
        valor_noturno = valor_periodo(tipo_dia, "noturno") if noturno else 0
        adicional_noturno = adicional_noturno_25(tipo_dia) if noturno and EMPRESA_ATUAL["usa_adicional_noturno"] else 0

        total = valor_diurno + valor_noturno + adicional_noturno

        if qtd_periodos == 0:
            tipo = "sem_trabalho"
        elif diurno and noturno:
            tipo = "diurno_noturno"
        elif noturno:
            tipo = "noturno"
        else:
            tipo = "diurno"

        dias.append({
            "data": data,
            "semana": semana,
            "tipo_dia": tipo_dia,
            "tipo": tipo,
            "periodo_diurno": diurno,
            "periodo_noturno": noturno,
            "assinatura": assinatura,
            "qtd_periodos": qtd_periodos,
            "valor_diurno": valor_diurno,
            "valor_noturno": valor_noturno,
            "adicional_noturno": adicional_noturno,
            "valor": total,
            "debug": {
                "assinatura_pixels": assinatura_pixels,
                "texto_noturno": texto_noturno
            }
        })

    return montar_resumo(dias)


def extrair_texto_pdf(file_path: Path) -> str:
    texto = ""

    try:
        doc = fitz.open(file_path)
        for page in doc:
            texto += page.get_text()
        doc.close()
    except Exception:
        texto = ""

    return limpar_texto_ocr(texto)




# ============================
# V10.9 - FINANCEIRO SQLITE
# ============================

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
        """
        INSERT OR REPLACE INTO financeiro
        (id, cliente, referencia, descricao, valor, status, data_emissao, data_recebimento)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """,
        (
            item_id,
            payload.cliente,
            payload.referencia,
            payload.descricao,
            payload.valor,
            payload.status,
            payload.dataEmissao,
            payload.dataRecebimento,
        ),
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


@app.post("/financeiro/{item_id}/status")
def alterar_status_financeiro(item_id: str, payload: dict):
    status = payload.get("status", "pendente")
    data_recebimento = payload.get("dataRecebimento", "")

    conn = conectar_db()
    conn.execute(
        "UPDATE financeiro SET status = ?, data_recebimento = ? WHERE id = ?",
        (status, data_recebimento, item_id),
    )
    conn.commit()
    row = conn.execute("SELECT * FROM financeiro WHERE id = ?", (item_id,)).fetchone()
    conn.close()

    if not row:
        return {"status": "erro", "erro": "Lançamento não encontrado"}

    return {"status": "ok", "lancamento": row_financeiro(row)}


# ============================
# V10.9 - EQUIPE SQLITE
# ============================

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
        """
        INSERT OR REPLACE INTO equipe
        (id, nome, funcao, telefone, admissao, ativo, diaria, comissao, documentos, validade)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """,
        (
            item_id,
            payload.nome,
            payload.funcao,
            payload.telefone,
            payload.admissao,
            1 if payload.ativo else 0,
            payload.diaria,
            payload.comissao,
            payload.documentos,
            payload.validade,
        ),
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


@app.post("/equipe/{item_id}/ativo")
def alterar_ativo_equipe(item_id: str, payload: dict):
    ativo = bool(payload.get("ativo", True))

    conn = conectar_db()
    conn.execute("UPDATE equipe SET ativo = ? WHERE id = ?", (1 if ativo else 0, item_id))
    conn.commit()
    row = conn.execute("SELECT * FROM equipe WHERE id = ?", (item_id,)).fetchone()
    conn.close()

    if not row:
        return {"status": "erro", "erro": "Colaborador não encontrado"}

    return {"status": "ok", "colaborador": row_equipe(row)}




# ============================
# V10.13.2 - BACKUP SQLITE DESKTOP SAFE
# ============================

@app.post("/backup")
def criar_backup():
    try:
        BACKUP_DIR.mkdir(parents=True, exist_ok=True)

        if not DB_PATH.exists():
            return {"status": "erro", "erro": "Banco SQLite não encontrado."}

        nome = f"ytalseg_erp_backup_{datetime.now().strftime('%Y%m%d_%H%M%S')}.db"
        destino = BACKUP_DIR / nome
        shutil.copy2(DB_PATH, destino)

        return {
            "status": "ok",
            "arquivo": nome,
            "caminho": str(destino),
            "pasta": str(BACKUP_DIR)
        }
    except Exception as e:
        return {"status": "erro", "erro": str(e)}


@app.get("/backups")
def listar_backups():
    try:
        BACKUP_DIR.mkdir(parents=True, exist_ok=True)
        arquivos = sorted([p.name for p in BACKUP_DIR.glob("*.db")], reverse=True)
        return {"status": "ok", "backups": arquivos, "pasta": str(BACKUP_DIR)}
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


# ── SERVIR PDFs GERADOS (acesso via rede/mobile) ─────────────────────────────
from fastapi.responses import FileResponse

@app.get("/pdfs/{nome_arquivo}")
def servir_pdf(nome_arquivo: str):
    """Serve um PDF salvo na pasta outputs ou uploads pelo nome do arquivo."""
    # Procura em outputs primeiro, depois uploads
    outputs_dir = DATA_DIR / "outputs"
    candidatos = [
        DATA_DIR / "outputs" / nome_arquivo,
        DATA_DIR / "uploads" / nome_arquivo,
        DATA_DIR / nome_arquivo,
    ]
    for caminho in candidatos:
        if caminho.exists() and caminho.suffix.lower() == ".pdf":
            return FileResponse(str(caminho), media_type="application/pdf", filename=nome_arquivo)
    return {"status": "erro", "erro": f"Arquivo '{nome_arquivo}' não encontrado."}


@app.get("/historico-pdfs")
def historico_pdfs():
    """Lista todos os PDFs gerados pelo sistema (outputs + uploads)."""
    import hashlib
    resultado = []

    pastas = {
        "outputs": DATA_DIR / "outputs",
        "uploads": DATA_DIR / "uploads",
    }

    for origem, pasta in pastas.items():
        if not pasta.exists():
            continue
        for f in sorted(pasta.glob("*.pdf"), key=lambda x: x.stat().st_mtime, reverse=True):
            nome = f.name
            tipo = "Interno" if "interno" in nome.lower() or "Interno" in nome else "Cliente"
            resultado.append({
                "id": hashlib.md5(str(f).encode()).hexdigest()[:12],
                "tipo": tipo,
                "nome": nome,
                "caminho": str(f),
                "url_download": f"/pdfs/{nome}",
                "criadoEm": datetime.fromtimestamp(f.stat().st_mtime).isoformat(),
                "tamanho": f.stat().st_size,
            })

    return {"ok": True, "historico": resultado}



@app.post("/upload-pdf")
async def upload_pdf(
    file: UploadFile = File(...),
    empresa_id: str = Form("geoambiental"),
    mes: int = Form(3),
    ano: int = Form(2026)
):
    try:
        file_path = UPLOAD_DIR / file.filename

        content = await file.read()
        file_path.write_bytes(content)

        global EMPRESA_ATUAL
        EMPRESA_ATUAL = obter_empresa(empresa_id)

        calculo = escanear_pdf_padrao_por_template(file_path, mes=mes, ano=ano)
        texto = extrair_texto_pdf(file_path)

        return {
            "filename": file.filename,
            "empresa_id": empresa_id,
            "empresa": EMPRESA_ATUAL,
            "status": "PDF lido e calculado - V8 PROFISSIONAL",
            "saved_path": str(file_path),
            "texto_extraido_preview": texto[:1500],
            "calculo": calculo
        }

    except Exception as e:
        return {
            "status": "erro",
            "erro": str(e),
            "tipo": type(e).__name__
        }
