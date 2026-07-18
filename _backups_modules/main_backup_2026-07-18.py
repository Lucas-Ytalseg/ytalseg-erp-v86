from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path
from datetime import datetime
import re
import json
import os
import shutil
import sqlite3
import calendar
import pdfplumber
import pytesseract
from pydantic import BaseModel
from typing import Optional, List
import uuid

app = FastAPI(title="YTALSEG Backend", version="8.0.0 PROFISSIONAL")

# ===== PREFIXO /api =====
# O frontend chama as rotas com prefixo /api (ex: /api/financeiro).
# As rotas do backend sao definidas sem o prefixo (ex: /financeiro).
# Este middleware remove o /api do caminho antes do roteamento, de forma
# que tanto /financeiro quanto /api/financeiro funcionem.
@app.middleware("http")
async def remover_prefixo_api(request, call_next):
    if request.scope["path"].startswith("/api/"):
        request.scope["path"] = request.scope["path"][4:]  # remove "/api"
    elif request.scope["path"] == "/api":
        request.scope["path"] = "/"
    return await call_next(request)

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

# Ordem de prioridade: DATA_DIR (Railway/produção) > LOCALAPPDATA (Windows) > home
# No Railway, defina a env var DATA_DIR para um volume persistente, ex: /data
_base_data = os.getenv("DATA_DIR") or os.getenv("LOCALAPPDATA") or str(Path.home())
DATA_DIR = Path(_base_data) / "YTALSEG"
DATA_DIR.mkdir(parents=True, exist_ok=True)

UPLOAD_DIR = DATA_DIR / "uploads"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

UPLOAD_RELATORIOS_DIR = UPLOAD_DIR / "relatorios"
UPLOAD_RELATORIOS_DIR.mkdir(parents=True, exist_ok=True)

UPLOAD_NOTAS_DIR = UPLOAD_DIR / "notas"
UPLOAD_NOTAS_DIR.mkdir(parents=True, exist_ok=True)

MAX_UPLOAD_SIZE = 15 * 1024 * 1024  # 15 MB

BACKUP_DIR = DATA_DIR / "backups"
BACKUP_DIR.mkdir(parents=True, exist_ok=True)

EMPRESAS_PATH = DATA_DIR / "empresas.json"
DB_PATH = DATA_DIR / "ytalseg_erp.db"

POPPLER_PATH = r"C:\Users\lucas\Downloads\Release-25.12.0-0\poppler-25.12.0\Library\bin"
TESSERACT_PATH = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

# No Windows local usa o caminho fixo do Tesseract; no Linux/Railway (Dockerfile instala
# tesseract-ocr via apt) o binário já está no PATH, então não precisa configurar nada.
if Path(TESSERACT_PATH).exists():
    pytesseract.pytesseract.tesseract_cmd = TESSERACT_PATH

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

# ===== MÊS/ANO DE REFERÊNCIA (competência) =====
MESES_PT = {
    "janeiro": 1, "fevereiro": 2, "marco": 3, "março": 3, "abril": 4,
    "maio": 5, "junho": 6, "julho": 7, "agosto": 8, "setembro": 9,
    "outubro": 10, "novembro": 11, "dezembro": 12,
}

def parse_mes_ano_referencia(referencia: str, fallback_data: str = ""):
    """Extrai mês/ano de competência de um texto livre (ex: 'Junho / 2026').
    Se não conseguir, usa o mês/ano da data informada como fallback."""
    texto = (referencia or "").lower()
    mes_encontrado = None
    for nome, numero in MESES_PT.items():
        if nome in texto:
            mes_encontrado = numero
            break
    ano_match = re.search(r"(20\d{2})", texto)
    ano_encontrado = int(ano_match.group(1)) if ano_match else None

    if mes_encontrado and ano_encontrado:
        return mes_encontrado, ano_encontrado

    try:
        if fallback_data:
            d = datetime.fromisoformat(fallback_data[:10])
            return mes_encontrado or d.month, ano_encontrado or d.year
    except Exception:
        pass

    hoje = datetime.now()
    return mes_encontrado or hoje.month, ano_encontrado or hoje.year

def parse_mes_ano_sem_fallback(referencia: str):
    """Como parse_mes_ano_referencia, mas sem chutar o mês/ano de hoje quando não
    encontra os dois no texto — melhor deixar em branco (o usuário revisa e corrige
    no histórico) do que registrar uma competência errada pra um documento antigo."""
    texto = (referencia or "").lower()
    mes_encontrado = None
    for nome, numero in MESES_PT.items():
        if nome in texto:
            mes_encontrado = numero
            break
    ano_match = re.search(r"(20\d{2})", texto)
    ano_encontrado = int(ano_match.group(1)) if ano_match else None
    if mes_encontrado and ano_encontrado:
        return mes_encontrado, ano_encontrado
    return None, None

# ===== EXTRAÇÃO DE PDF (upload de relatórios antigos e notas fiscais) =====
def extrair_texto_pdf(caminho: Path) -> str:
    """Extrai todo o texto de um PDF. Primeiro tenta a camada de texto nativa (rápido — é o caso dos
    relatórios da própria YTALSEG, gerados via impressão do navegador). Se o PDF não tiver texto
    selecionável (comum em notas fiscais da Prefeitura, que muitas vezes são vetorizadas/escaneadas),
    cai para OCR renderizando cada página como imagem. Nunca lança exceção — string vazia em caso de
    erro, pra sempre cair no preenchimento manual."""
    texto_nativo = ""
    try:
        partes = []
        with pdfplumber.open(caminho) as pdf:
            for pagina in pdf.pages:
                partes.append(pagina.extract_text() or "")
        texto_nativo = "\n".join(partes)
    except Exception:
        texto_nativo = ""

    if len(texto_nativo.strip()) >= 30:
        return texto_nativo

    try:
        partes_ocr = []
        with pdfplumber.open(caminho) as pdf:
            for pagina in pdf.pages:
                imagem = pagina.to_image(resolution=300).original
                partes_ocr.append(pytesseract.image_to_string(imagem, lang="por"))
        return "\n".join(partes_ocr)
    except Exception:
        return texto_nativo

def _valor_brl_para_float(valor_str: str) -> float:
    try:
        limpo = valor_str.strip().replace(".", "").replace(",", ".")
        return float(limpo)
    except Exception:
        return 0.0

def _data_br_para_iso(data_br: str) -> str:
    try:
        d, m, a = data_br.strip().split("/")
        return f"{a}-{m.zfill(2)}-{d.zfill(2)}"
    except Exception:
        return ""

def _validar_pdf_upload(conteudo: bytes, nome_original: str):
    """Retorna uma mensagem de erro (string) se o arquivo for inválido, ou None se estiver ok."""
    if not (nome_original or "").lower().endswith(".pdf"):
        return "Envie apenas arquivos PDF."
    if not conteudo.startswith(b"%PDF"):
        return "Arquivo não parece ser um PDF válido."
    if len(conteudo) > MAX_UPLOAD_SIZE:
        return f"Arquivo maior que {MAX_UPLOAD_SIZE // (1024 * 1024)}MB."
    return None

def _normalizar_ascii(s: str) -> str:
    troca = str.maketrans("áâãàéêíóôõúç", "aaaaeeiooouc")
    return re.sub(r"[^a-z]", "", (s or "").lower().translate(troca))

def _extrair_colunas_info_relatorio_por_posicao(caminho: Path) -> dict:
    """O cabeçalho do relatório de horas (Relatorios.tsx, bloco .info) é um grid CSS
    de 4 colunas na mesma linha visual ("Empresa / Cliente", "Mês / Referência",
    "Responsáveis técnicos", "Arquivo processado"). Quando o PDF é gerado via
    impressão do navegador, essas 4 colunas costumam quebrar em várias linhas de
    texto (nome de cliente comprido, rótulo "Responsáveis técnicos" quebrando em 2
    linhas etc.) — então nem a extração de texto simples nem uma extração "com
    layout" (que só preserva espaçamento de UMA linha) dão conta de reconstruir o
    conteúdo de cada coluna corretamente.

    Por isso esta função usa a POSIÇÃO (x0) de cada palavra no PDF (via
    pdfplumber.extract_words) pra descobrir onde cada uma das 4 colunas começa
    (a partir da primeira palavra de cada rótulo) e agrupa todas as palavras
    dentro da faixa horizontal de cada coluna, em qualquer linha, reconstruindo o
    texto de cada célula mesmo com quebras de linha. A fatia vertical (onde o
    bloco de cabeçalho termina e o corpo do relatório começa) é achada pelo maior
    espaço vertical entre linhas logo abaixo do cabeçalho — a quebra pro próximo
    bloco (margem CSS) é sempre bem maior que o espaçamento entre linhas dentro
    da própria célula."""
    try:
        with pdfplumber.open(caminho) as pdf:
            if not pdf.pages:
                return {}
            palavras = pdf.pages[0].extract_words(use_text_flow=False, keep_blank_chars=False)
    except Exception:
        return {}
    if not palavras:
        return {}

    alvos = {
        "cliente": "empresa",
        "referencia": "mes",
        "responsaveis": "responsaveis",
        "arquivo": "arquivo",
    }
    ancoras = {}
    for chave, alvo in alvos.items():
        for w in palavras:
            if _normalizar_ascii(w["text"]) == alvo:
                ancoras[chave] = (w["x0"], w["top"])
                break
    if len(ancoras) < 4:
        return {}

    colunas_ordenadas = sorted(ancoras.items(), key=lambda item: item[1][0])
    topo_cabecalho = min(top for _, (_, top) in ancoras.items())

    candidatas = sorted([w for w in palavras if w["top"] >= topo_cabecalho - 1], key=lambda w: w["top"])
    tops_unicos = sorted({round(w["top"], 1) for w in candidatas})

    limite_inferior = tops_unicos[-1] if tops_unicos else topo_cabecalho
    janela = tops_unicos[:16]
    if len(janela) > 1:
        gaps = [(janela[i] - janela[i - 1], janela[i - 1]) for i in range(1, len(janela))]
        maior_gap_top = max(gaps, key=lambda g: g[0])[1]
        limite_inferior = maior_gap_top

    bloco = [w for w in candidatas if w["top"] <= limite_inferior + 1]

    valores_por_coluna: dict = {chave: [] for chave, _ in colunas_ordenadas}
    for w in bloco:
        for idx, (chave, (x_ini, _)) in enumerate(colunas_ordenadas):
            x_fim = colunas_ordenadas[idx + 1][1][0] if idx + 1 < len(colunas_ordenadas) else float("inf")
            if x_ini - 3 <= w["x0"] < x_fim - 3:
                valores_por_coluna[chave].append(w)
                break

    def montar_texto(lista_palavras):
        lista_ordenada = sorted(lista_palavras, key=lambda w: (round(w["top"], 1), w["x0"]))
        return " ".join(w["text"] for w in lista_ordenada)

    resultado = {}
    m_cliente = re.search(r"Empresa\s*/\s*Cliente\s*(.*)", montar_texto(valores_por_coluna.get("cliente", [])), re.IGNORECASE | re.DOTALL)
    if m_cliente:
        cliente = re.split(r"CNPJ\s*:", m_cliente.group(1), maxsplit=1, flags=re.IGNORECASE)[0]
        resultado["cliente"] = cliente.strip()

    m_ref = re.search(r"M[êe]s\s*/\s*Refer[êe]ncia\s*(.*)", montar_texto(valores_por_coluna.get("referencia", [])), re.IGNORECASE | re.DOTALL)
    if m_ref:
        resultado["referencia"] = m_ref.group(1).strip()

    return resultado

def parse_relatorio_ytalseg(texto: str, caminho: Optional[Path] = None):
    """Tenta reconhecer um PDF como um relatório gerado pelo próprio ERP YTALSEG
    (impresso via window.print() e salvo como PDF pelo usuário). Retorna None se a
    assinatura do relatório não for encontrada — o formulário fica em branco pro
    usuário preencher manualmente.

    Usa o título "RELATÓRIO DE HORAS" como assinatura (em vez do texto de discriminação
    de serviços, que também aparece nas notas fiscais emitidas — o texto é copiado de lá
    pro portal da Prefeitura, então não serve pra diferenciar os dois tipos de PDF)."""
    if not texto or "YTALSEG" not in texto or "RELATÓRIO DE HORAS" not in texto:
        return None

    texto_limpo = texto.replace("\xa0", " ")
    dados = {"cliente": "", "referencia": "", "valor": 0.0, "tipo": "Cliente"}

    colunas = _extrair_colunas_info_relatorio_por_posicao(caminho) if caminho else {}
    dados["cliente"] = colunas.get("cliente", "")
    dados["referencia"] = colunas.get("referencia", "")

    if not dados["cliente"]:
        m_cliente = re.search(r"Empresa\s*/\s*Cliente\s*\n?\s*([^\n]+)", texto_limpo)
        if m_cliente:
            dados["cliente"] = m_cliente.group(1).strip()

    if not dados["referencia"]:
        m_ref = re.search(r"M[êe]s\s*/\s*Refer[êe]ncia\s*\n?\s*([^\n]+)", texto_limpo, re.IGNORECASE)
        if m_ref:
            dados["referencia"] = m_ref.group(1).strip()

    # Valor: ancorado no rótulo "VALOR DA NOTA" (aparece 2x: resumo e rodapé) em vez
    # de simplesmente pegar o último "R$" do documento — mais preciso e resiliente
    # a qualquer texto extra depois do total. Mantém o comportamento antigo (último
    # R$ do documento) só como fallback, se o rótulo não for encontrado.
    valor_encontrado = None
    for m_label in re.finditer(r"VALOR\s+DA\s+NOTA", texto_limpo, re.IGNORECASE):
        janela = texto_limpo[m_label.end(): m_label.end() + 60]
        m_valor = re.search(r"R\$\s*([\d.]+,\d{2})", janela)
        if m_valor:
            valor_encontrado = m_valor.group(1)
    if valor_encontrado:
        dados["valor"] = _valor_brl_para_float(valor_encontrado)
    else:
        valores = re.findall(r"R\$\s*([\d.]+,\d{2})", texto_limpo)
        if valores:
            dados["valor"] = _valor_brl_para_float(valores[-1])

    if "Diurna" in texto_limpo and "Noturna" in texto_limpo and "Adic. 25%" in texto_limpo:
        dados["tipo"] = "Interno"

    return dados

def _janela_apos(texto: str, label_regex: str, tamanho: int = 150) -> str:
    """Retorna o trecho de texto logo após um rótulo. Usado em vez de âncoras de linha
    fixas porque OCR de layout em caixas (como a NFS-e) intercala rótulo/valor com outros
    textos vizinhos na mesma linha, então "próxima linha" não é confiável."""
    m = re.search(label_regex, texto, re.IGNORECASE)
    if not m:
        return ""
    return texto[m.end(): m.end() + tamanho]

def parse_nfse_sp(texto: str):
    """Extrai os campos de uma NFS-e da Prefeitura de São Paulo. Nunca lança exceção —
    campos não encontrados voltam vazios/None pra permitir preenchimento manual."""
    dados = {
        "numeroNota": "", "cliente": "", "cnpjTomador": "", "mesReferencia": None,
        "anoReferencia": None, "dataEmissao": "", "vencimento": "", "valor": 0.0,
        "codigoVerificacao": "",
    }
    if not texto:
        return dados

    texto_limpo = texto.replace("\xa0", " ")

    janela_num = _janela_apos(texto_limpo, r"N[uú]mero da Nota", 120)
    m_num = re.search(r"\b(\d{6,})\b", janela_num)
    if m_num:
        dados["numeroNota"] = m_num.group(1).strip()

    janela_emissao = _janela_apos(texto_limpo, r"Data e Hora de Emiss[ãa]o", 150)
    m_emissao = re.search(r"(\d{2}/\d{2}/\d{4})(?:\s+\d{2}:\d{2}:\d{2})?", janela_emissao)
    if m_emissao:
        dados["dataEmissao"] = _data_br_para_iso(m_emissao.group(1))

    janela_verif = _janela_apos(texto_limpo, r"C[óo]digo de Verifica[çc][ãa]o", 150)
    m_verif = re.search(r"([A-Z0-9]{4}-[A-Z0-9]{4})", janela_verif)
    if m_verif:
        dados["codigoVerificacao"] = m_verif.group(1).strip()

    m_secao_tomador = re.search(
        r"TOMADOR DE SERVI[ÇC]OS(.*?)(?:DISCRIMINA[ÇC][ÃA]O|INTERMEDI[ÁA]RIO|$)", texto_limpo, re.DOTALL
    )
    bloco_tomador = m_secao_tomador.group(1) if m_secao_tomador else texto_limpo

    m_nome = re.search(r"Raz[ãa]o Social:\s*([^\n]+)", bloco_tomador)
    if m_nome:
        dados["cliente"] = m_nome.group(1).strip()

    m_cnpj = re.search(r"CPF/CNPJ:\s*([\d./-]+)", bloco_tomador)
    if m_cnpj:
        dados["cnpjTomador"] = m_cnpj.group(1).strip()

    m_valor = re.search(r"VALOR TOTAL DO SERVI[ÇC]O\s*=?\s*R\$\s*([\d.]+,\d{2})", texto_limpo)
    if m_valor:
        dados["valor"] = _valor_brl_para_float(m_valor.group(1))

    m_mes = re.search(r"M[ÊE]S DE\s+([A-ZÇÃÕÁÉÍÓÚ]+)\s+DE\s+(\d{4})", texto_limpo, re.IGNORECASE)
    if m_mes:
        mes_num = MESES_PT.get(m_mes.group(1).strip().lower())
        if mes_num:
            dados["mesReferencia"] = mes_num
            dados["anoReferencia"] = int(m_mes.group(2))

    m_venc = re.search(r"VENCIMENTO\s+(\d{2}/\d{2}/\d{4})", texto_limpo, re.IGNORECASE)
    if m_venc:
        dados["vencimento"] = _data_br_para_iso(m_venc.group(1))

    return dados

def _cliente_bate(a, b) -> bool:
    a = (a or "").strip().lower()
    b = (b or "").strip().lower()
    return bool(a) and bool(b) and (a in b or b in a)

def _buscar_candidatos(conn, tabela: str, coluna_vinculo: str, cliente: str, valor: float, mes, ano, excluir_id: Optional[str] = None):
    """Generaliza o match usado nas sugestões de vínculo (cliente substring nos dois
    sentidos + valor ±R$0,01, priorizando bater mês/ano) pra qualquer uma das 3 tabelas
    (financeiro/notas_fiscais/historico_pdfs), excluindo quem já está vinculado naquela
    coluna. Candidatos com mês/ano exatos vêm primeiro."""
    if not cliente:
        return []
    ja_vinculados = {
        r[0] for r in conn.execute(
            f"SELECT {coluna_vinculo} FROM vinculos WHERE {coluna_vinculo} IS NOT NULL"
        ).fetchall()
    }
    linhas = conn.execute(f"SELECT * FROM {tabela}").fetchall()
    exatos, aproximados = [], []
    for r in linhas:
        if r["id"] == excluir_id or r["id"] in ja_vinculados:
            continue
        if not _cliente_bate(cliente, r["cliente"]):
            continue
        if abs((r["valor"] or 0) - (valor or 0)) >= 0.01:
            continue
        r_mes = r["mes_referencia"] if "mes_referencia" in r.keys() else None
        r_ano = r["ano_referencia"] if "ano_referencia" in r.keys() else None
        mes_ok = bool(mes) and bool(ano) and r_mes == mes and r_ano == ano
        (exatos if mes_ok else aproximados).append(r)
    return exatos + aproximados

def sugerir_financeiro(cliente: str, valor: float, mes, ano):
    """Sugere um lançamento do financeiro que pode corresponder a uma nota fiscal recém-importada."""
    conn = conectar_db()
    candidatos = _buscar_candidatos(conn, "financeiro", "lancamento_id", cliente, valor, mes, ano)
    conn.close()
    return candidatos[0]["id"] if candidatos else None

def _classificar_financeiro(status: str) -> str:
    if status == "recebido":
        return "recebido"
    if status == "nota_cancelada":
        return "cancelado"
    return "aberto"

def _classificar_nota(cancelada, data_recebimento) -> str:
    if cancelada:
        return "cancelado"
    if data_recebimento:
        return "recebido"
    return "aberto"

def _aplicar_classe_no_financeiro(conn, financeiro_id: str, classe: str, data_referencia: str):
    if classe == "recebido":
        conn.execute(
            "UPDATE financeiro SET status = 'recebido', data_recebimento = ? WHERE id = ?",
            (data_referencia or datetime.now().strftime("%Y-%m-%d"), financeiro_id),
        )
    elif classe == "cancelado":
        conn.execute("UPDATE financeiro SET status = 'nota_cancelada' WHERE id = ?", (financeiro_id,))
    else:
        # aberto: só desfaz se estava em recebido/nota_cancelada - preserva status
        # intermediário (cobrado, negociacao etc.) que não tem equivalente na nota.
        conn.execute(
            "UPDATE financeiro SET status = 'pendente', data_recebimento = '' "
            "WHERE id = ? AND status IN ('recebido', 'nota_cancelada')",
            (financeiro_id,),
        )

def _aplicar_classe_na_nota(conn, nota_id: str, classe: str, data_referencia: str):
    if classe == "recebido":
        conn.execute(
            "UPDATE notas_fiscais SET cancelada = 0, data_recebimento = ? WHERE id = ?",
            (data_referencia or datetime.now().strftime("%Y-%m-%d"), nota_id),
        )
    elif classe == "cancelado":
        conn.execute("UPDATE notas_fiscais SET cancelada = 1 WHERE id = ?", (nota_id,))
    else:
        conn.execute(
            "UPDATE notas_fiscais SET cancelada = 0, data_recebimento = '' WHERE id = ?",
            (nota_id,),
        )

def _propagar_status_vinculo(conn, vinculo_row, origem: str):
    """origem: 'financeiro' | 'nota' - o lado que acabou de ser editado é sempre a fonte
    da verdade; empurra a classe (recebido/cancelado/aberto) pro outro lado, na MESMA
    transação (quem chama faz o commit). Nunca bloqueia a edição de origem - só roda
    depois que ela já foi aplicada. Não faz nada se o vínculo não ligar os dois lados."""
    if not vinculo_row["lancamento_id"] or not vinculo_row["nota_id"]:
        return
    financeiro = conn.execute("SELECT * FROM financeiro WHERE id = ?", (vinculo_row["lancamento_id"],)).fetchone()
    nota = conn.execute("SELECT * FROM notas_fiscais WHERE id = ?", (vinculo_row["nota_id"],)).fetchone()
    if not financeiro or not nota:
        return
    if origem == "financeiro":
        classe = _classificar_financeiro(financeiro["status"])
        _aplicar_classe_na_nota(conn, nota["id"], classe, financeiro["data_recebimento"])
    else:
        classe = _classificar_nota(nota["cancelada"], nota["data_recebimento"])
        _aplicar_classe_no_financeiro(conn, financeiro["id"], classe, nota["data_recebimento"])

def _desvincular(conn, vinculo_row):
    """Remove um vínculo e limpa os campos-espelho pra não ficarem stale - é isso que
    conserta o bug da Essy: ao excluir a nota, o financeiro deixa de mostrar
    nota_enviada=1/nota=<número antigo>/data_envio_nota=<data antiga> de um documento
    que não existe mais."""
    conn.execute("DELETE FROM vinculos WHERE id = ?", (vinculo_row["id"],))
    if vinculo_row["nota_id"]:
        conn.execute("UPDATE notas_fiscais SET financeiro_id = '' WHERE id = ?", (vinculo_row["nota_id"],))
    if vinculo_row["lancamento_id"] and vinculo_row["nota_id"]:
        conn.execute(
            "UPDATE financeiro SET nota_enviada = 0, nota = '', data_envio_nota = '' WHERE id = ?",
            (vinculo_row["lancamento_id"],),
        )

def _cascade_excluir_vinculos_de(conn, lancamento_id: Optional[str] = None, nota_id: Optional[str] = None, historico_id: Optional[str] = None):
    condicoes, params = [], []
    if lancamento_id:
        condicoes.append("lancamento_id = ?")
        params.append(lancamento_id)
    if nota_id:
        condicoes.append("nota_id = ?")
        params.append(nota_id)
    if historico_id:
        condicoes.append("historico_id = ?")
        params.append(historico_id)
    if not condicoes:
        return
    rows = conn.execute(f"SELECT * FROM vinculos WHERE {' OR '.join(condicoes)}", params).fetchall()
    for row in rows:
        _desvincular(conn, row)

def montar_dashboard_financeiro():
    """Monta os dados que alimentam o Dashboard (aba Principal). A partir da v87, o
    status de recebimento (recebida/aberta/vencida) é sempre o da PRÓPRIA nota fiscal
    (campos cancelada/data_recebimento/vencimento, já incluídos por row_nota_fiscal) -
    o Dashboard não cruza mais com o financeiro para calcular esses totais. O cruzamento
    com o financeiro aqui serve só para duas coisas que continuam sendo úteis: o cartão
    informativo 'sem nota emitida' e o mapa de vínculos usado pelo 'Visualizar' do
    histórico de pendências (NotaFiscal.tsx)."""
    conn = conectar_db()
    notas = conn.execute("SELECT * FROM notas_fiscais WHERE COALESCE(cancelada, 0) = 0").fetchall()
    financeiro_rows = conn.execute("SELECT * FROM financeiro").fetchall()
    vinculos_rows = conn.execute("SELECT * FROM vinculos").fetchall()
    conn.close()

    financeiro_usados = set()
    notas_enriquecidas = []
    for n in notas:
        item = row_nota_fiscal(n)
        vinculo = next((v for v in vinculos_rows if v["nota_id"] == n["id"]), None)
        financeiro_id_resolvido = vinculo["lancamento_id"] if vinculo else None
        if financeiro_id_resolvido:
            financeiro_usados.add(financeiro_id_resolvido)
        item["financeiroIdResolvido"] = financeiro_id_resolvido
        notas_enriquecidas.append(item)

    sem_nota_emitida = [
        row_financeiro(f) for f in financeiro_rows
        if f["id"] not in financeiro_usados and (f["status"] or "") != "nota_cancelada"
    ]

    vinculos_financeiro = {}
    for v in vinculos_rows:
        if not v["lancamento_id"]:
            continue
        entrada = vinculos_financeiro.setdefault(v["lancamento_id"], {})
        if v["nota_id"]:
            entrada["notaId"] = v["nota_id"]
        if v["historico_id"]:
            entrada["historicoPdfId"] = v["historico_id"]

    return notas_enriquecidas, sem_nota_emitida, vinculos_financeiro

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
    cur.execute("""
        CREATE TABLE IF NOT EXISTS historico_pdfs (
            id TEXT PRIMARY KEY,
            tipo TEXT NOT NULL,
            cliente TEXT NOT NULL,
            referencia TEXT,
            valor REAL DEFAULT 0,
            criado_em TEXT NOT NULL,
            arquivo_nome TEXT,
            tem_arquivo INTEGER NOT NULL DEFAULT 0,
            dados_json TEXT
        )
    """)
    cur.execute("""
        CREATE TABLE IF NOT EXISTS notas_fiscais (
            id TEXT PRIMARY KEY,
            numero_nota TEXT,
            cliente TEXT,
            cnpj_tomador TEXT,
            mes_referencia INTEGER,
            ano_referencia INTEGER,
            data_emissao TEXT,
            vencimento TEXT,
            valor REAL DEFAULT 0,
            codigo_verificacao TEXT,
            arquivo_nome TEXT,
            arquivo_nome_original TEXT,
            criado_em TEXT NOT NULL,
            financeiro_id TEXT DEFAULT ''
        )
    """)
    cur.execute("""
        CREATE TABLE IF NOT EXISTS vinculos (
            id TEXT PRIMARY KEY,
            lancamento_id TEXT,
            nota_id TEXT,
            historico_id TEXT,
            criado_em TEXT NOT NULL,
            atualizado_em TEXT NOT NULL,
            origem TEXT NOT NULL DEFAULT 'manual'
        )
    """)
    cur.execute("CREATE INDEX IF NOT EXISTS idx_vinculos_lancamento ON vinculos(lancamento_id)")
    cur.execute("CREATE INDEX IF NOT EXISTS idx_vinculos_nota ON vinculos(nota_id)")
    cur.execute("CREATE INDEX IF NOT EXISTS idx_vinculos_historico ON vinculos(historico_id)")
    # Um objeto não pode estar em dois vínculos ao mesmo tempo - garantido no banco via
    # índice único parcial (só considera linhas onde a coluna não é NULL); a checagem em
    # Python (ver _criar_vinculo_core) existe pra devolver uma mensagem amigável antes
    # de bater nesse índice.
    cur.execute("CREATE UNIQUE INDEX IF NOT EXISTS uq_vinculos_lancamento ON vinculos(lancamento_id) WHERE lancamento_id IS NOT NULL")
    cur.execute("CREATE UNIQUE INDEX IF NOT EXISTS uq_vinculos_nota ON vinculos(nota_id) WHERE nota_id IS NOT NULL")
    cur.execute("CREATE UNIQUE INDEX IF NOT EXISTS uq_vinculos_historico ON vinculos(historico_id) WHERE historico_id IS NOT NULL")

    # ===== MIGRAÇÃO: novas colunas do financeiro (Agenda de Cobrança completa) =====
    colunas_existentes = {row["name"] for row in cur.execute("PRAGMA table_info(financeiro)").fetchall()}
    novas_colunas = {
        "vencimento": "TEXT DEFAULT ''",
        "data_promessa_pagamento": "TEXT DEFAULT ''",
        "nota_enviada": "INTEGER DEFAULT 0",
        "data_envio_nota": "TEXT DEFAULT ''",
        "observacao": "TEXT DEFAULT ''",
        "nota": "TEXT DEFAULT ''",
        "mes_referencia": "INTEGER",
        "ano_referencia": "INTEGER",
    }
    for nome_coluna, definicao in novas_colunas.items():
        if nome_coluna not in colunas_existentes:
            cur.execute(f"ALTER TABLE financeiro ADD COLUMN {nome_coluna} {definicao}")

    # ===== MIGRAÇÃO: novas colunas do historico_pdfs (upload de PDFs antigos) =====
    colunas_hist = {row["name"] for row in cur.execute("PRAGMA table_info(historico_pdfs)").fetchall()}
    novas_colunas_hist = {
        "origem": "TEXT DEFAULT 'auto'",
        "data_documento": "TEXT DEFAULT ''",
        "arquivo_nome_original": "TEXT DEFAULT ''",
        "mes_referencia": "INTEGER",
        "ano_referencia": "INTEGER",
    }
    for nome_coluna, definicao in novas_colunas_hist.items():
        if nome_coluna not in colunas_hist:
            cur.execute(f"ALTER TABLE historico_pdfs ADD COLUMN {nome_coluna} {definicao}")

    # ===== MIGRAÇÃO: nota fiscal cancelada (registro fica, só sai dos totais) =====
    # ===== MIGRAÇÃO: status de recebimento da nota (fonte da verdade é a própria nota) =====
    colunas_notas = {row["name"] for row in cur.execute("PRAGMA table_info(notas_fiscais)").fetchall()}
    novas_colunas_notas = {
        "cancelada": "INTEGER DEFAULT 0",
        "data_recebimento": "TEXT DEFAULT ''",
    }
    for nome_coluna, definicao in novas_colunas_notas.items():
        if nome_coluna not in colunas_notas:
            cur.execute(f"ALTER TABLE notas_fiscais ADD COLUMN {nome_coluna} {definicao}")

    conn.commit()

    # Preenche mes_referencia/ano_referencia de lançamentos antigos (uma vez só)
    pendentes_backfill = cur.execute(
        "SELECT id, referencia, data_emissao FROM financeiro WHERE mes_referencia IS NULL"
    ).fetchall()
    for row in pendentes_backfill:
        mes, ano = parse_mes_ano_referencia(row["referencia"], row["data_emissao"])
        cur.execute(
            "UPDATE financeiro SET mes_referencia = ?, ano_referencia = ? WHERE id = ?",
            (mes, ano, row["id"]),
        )
    conn.commit()

    # Preenche mes_referencia/ano_referencia do historico_pdfs (sem chutar: fica NULL
    # se não identificar mês+ano no texto de referência salvo).
    pendentes_hist = cur.execute(
        "SELECT id, referencia FROM historico_pdfs WHERE mes_referencia IS NULL"
    ).fetchall()
    for row in pendentes_hist:
        mes, ano = parse_mes_ano_sem_fallback(row["referencia"])
        cur.execute(
            "UPDATE historico_pdfs SET mes_referencia = ?, ano_referencia = ? WHERE id = ?",
            (mes, ano, row["id"]),
        )
    conn.commit()

    # ===== MIGRAÇÃO: backfill de vinculos a partir do link legado
    # notas_fiscais.financeiro_id (criado pelo antigo POST /notas-fiscais/{id}/vincular).
    # Roda em todo startup mas é idempotente (não insere duplicado). Usa uuid.uuid4()
    # diretamente em vez de gerar_id(), pois gerar_id() só é definida DEPOIS da chamada
    # a init_db() logo abaixo, e chamá-la aqui geraria NameError.
    ja_vinculadas = {
        row["nota_id"] for row in cur.execute(
            "SELECT nota_id FROM vinculos WHERE nota_id IS NOT NULL"
        ).fetchall()
    }
    notas_com_link_legado = cur.execute(
        "SELECT id, financeiro_id FROM notas_fiscais WHERE COALESCE(financeiro_id, '') != ''"
    ).fetchall()
    for nota_row in notas_com_link_legado:
        if nota_row["id"] in ja_vinculadas:
            continue
        financeiro_existe = cur.execute(
            "SELECT 1 FROM financeiro WHERE id = ?", (nota_row["financeiro_id"],)
        ).fetchone()
        if not financeiro_existe:
            continue  # ponteiro órfão pré-existente - não cria vínculo pra um financeiro que não existe mais
        lancamento_ja_vinculado = cur.execute(
            "SELECT 1 FROM vinculos WHERE lancamento_id = ?", (nota_row["financeiro_id"],)
        ).fetchone()
        if lancamento_ja_vinculado:
            continue  # anomalia pré-existente (2 notas apontando pro mesmo financeiro_id) - deixa pra reconciliação manual via UI
        agora = datetime.now().isoformat()
        cur.execute(
            "INSERT INTO vinculos (id, lancamento_id, nota_id, historico_id, criado_em, atualizado_em, origem) "
            "VALUES (?, ?, ?, NULL, ?, ?, 'manual')",
            (str(uuid.uuid4()), nota_row["financeiro_id"], nota_row["id"], agora, agora),
        )
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
    vencimento: str = ""
    dataPromessaPagamento: str = ""
    notaEnviada: bool = False
    dataEnvioNota: str = ""
    observacao: str = ""
    nota: str = ""
    mesReferencia: Optional[int] = None
    anoReferencia: Optional[int] = None
    historicoId: Optional[str] = None  # opcional: quando informado, também cria/atualiza
                                        # um vínculo com esse registro do histórico de PDFs

class HistoricoPdfPayload(BaseModel):
    id: Optional[str] = None
    tipo: str
    cliente: str
    referencia: str = ""
    valor: float = 0
    dados: Optional[dict] = None

class HistoricoPdfEditPayload(BaseModel):
    cliente: Optional[str] = None
    tipo: Optional[str] = None
    referencia: Optional[str] = None
    valor: Optional[float] = None
    dataDocumento: Optional[str] = None

class NotaFiscalEditPayload(BaseModel):
    numeroNota: Optional[str] = None
    cliente: Optional[str] = None
    cnpjTomador: Optional[str] = None
    mesReferencia: Optional[int] = None
    anoReferencia: Optional[int] = None
    dataEmissao: Optional[str] = None
    vencimento: Optional[str] = None
    valor: Optional[float] = None
    codigoVerificacao: Optional[str] = None
    cancelada: Optional[bool] = None
    dataRecebimento: Optional[str] = None

class MarcarRecebidasPayload(BaseModel):
    ids: List[str]
    dataRecebimento: str

class VincularFinanceiroPayload(BaseModel):
    financeiroId: str

class VinculoCreatePayload(BaseModel):
    lancamentoId: Optional[str] = None
    notaId: Optional[str] = None
    historicoId: Optional[str] = None
    origem: str = "manual"
    resolverConflito: Optional[str] = None  # "financeiro" | "nota" - só no reenvio após um 409

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
    chaves = row.keys()
    return {
        "id": row["id"],
        "cliente": row["cliente"],
        "referencia": row["referencia"] or "",
        "descricao": row["descricao"] or "",
        "valor": row["valor"] or 0,
        "status": row["status"] or "pendente",
        "dataEmissao": row["data_emissao"] or "",
        "dataRecebimento": row["data_recebimento"] or "",
        "vencimento": (row["vencimento"] if "vencimento" in chaves else "") or "",
        "dataPromessaPagamento": (row["data_promessa_pagamento"] if "data_promessa_pagamento" in chaves else "") or "",
        "notaEnviada": bool(row["nota_enviada"]) if "nota_enviada" in chaves and row["nota_enviada"] is not None else False,
        "dataEnvioNota": (row["data_envio_nota"] if "data_envio_nota" in chaves else "") or "",
        "observacao": (row["observacao"] if "observacao" in chaves else "") or "",
        "nota": (row["nota"] if "nota" in chaves else "") or "",
        "mesReferencia": row["mes_referencia"] if "mes_referencia" in chaves else None,
        "anoReferencia": row["ano_referencia"] if "ano_referencia" in chaves else None,
    }

def row_historico_resumo(row):
    chaves = row.keys()
    return {
        "id": row["id"],
        "tipo": row["tipo"],
        "cliente": row["cliente"],
        "referencia": row["referencia"] or "",
        "valor": row["valor"] or 0,
        "criadoEm": row["criado_em"],
        "temArquivo": bool(row["tem_arquivo"]),
        "temDados": bool(row["dados_json"]),
        "origem": (row["origem"] if "origem" in chaves else "auto") or "auto",
        "dataDocumento": (row["data_documento"] if "data_documento" in chaves else "") or "",
        "arquivoNomeOriginal": (row["arquivo_nome_original"] if "arquivo_nome_original" in chaves else "") or "",
        "mesReferencia": (row["mes_referencia"] if "mes_referencia" in chaves else None),
        "anoReferencia": (row["ano_referencia"] if "ano_referencia" in chaves else None),
    }

def row_nota_fiscal(row):
    chaves = row.keys()
    return {
        "id": row["id"],
        "numeroNota": row["numero_nota"] or "",
        "cliente": row["cliente"] or "",
        "cnpjTomador": row["cnpj_tomador"] or "",
        "mesReferencia": row["mes_referencia"],
        "anoReferencia": row["ano_referencia"],
        "dataEmissao": row["data_emissao"] or "",
        "vencimento": row["vencimento"] or "",
        "valor": row["valor"] or 0,
        "codigoVerificacao": row["codigo_verificacao"] or "",
        "arquivoNomeOriginal": row["arquivo_nome_original"] or "",
        "temArquivo": bool(row["arquivo_nome"]),
        "criadoEm": row["criado_em"],
        "financeiroId": row["financeiro_id"] or "",
        "cancelada": bool(row["cancelada"]) if "cancelada" in chaves and row["cancelada"] is not None else False,
        "dataRecebimento": (row["data_recebimento"] if "data_recebimento" in chaves else "") or "",
    }

def row_vinculo(row):
    return {
        "id": row["id"],
        "lancamentoId": row["lancamento_id"],
        "notaId": row["nota_id"],
        "historicoId": row["historico_id"],
        "criadoEm": row["criado_em"],
        "atualizadoEm": row["atualizado_em"],
        "origem": row["origem"],
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

@app.get("/dashboard/financeiro-notas")
def dashboard_financeiro_notas():
    notas, sem_nota_emitida, vinculos_financeiro = montar_dashboard_financeiro()
    return {"status": "ok", "notas": notas, "semNotaEmitida": sem_nota_emitida, "vinculosFinanceiro": vinculos_financeiro}

@app.get("/vinculos")
def listar_vinculos(cliente: Optional[str] = None, mes: Optional[int] = None, ano: Optional[int] = None):
    conn = conectar_db()
    rows = conn.execute("SELECT * FROM vinculos ORDER BY atualizado_em DESC").fetchall()
    financeiro_map = {r["id"]: r for r in conn.execute("SELECT * FROM financeiro").fetchall()}
    nota_map = {r["id"]: r for r in conn.execute("SELECT * FROM notas_fiscais").fetchall()}
    historico_map = {r["id"]: r for r in conn.execute("SELECT * FROM historico_pdfs").fetchall()}
    conn.close()

    itens = []
    for v in rows:
        lanc = financeiro_map.get(v["lancamento_id"]) if v["lancamento_id"] else None
        nota = nota_map.get(v["nota_id"]) if v["nota_id"] else None
        hist = historico_map.get(v["historico_id"]) if v["historico_id"] else None
        item = row_vinculo(v)
        item["lancamento"] = row_financeiro(lanc) if lanc else None
        item["nota"] = row_nota_fiscal(nota) if nota else None
        item["historico"] = row_historico_resumo(hist) if hist else None
        itens.append(item)

    if cliente:
        c = cliente.strip().lower()
        itens = [
            it for it in itens
            if any(c in (obj["cliente"] or "").lower() for obj in (it["lancamento"], it["nota"], it["historico"]) if obj)
        ]
    if mes and ano:
        itens = [
            it for it in itens
            if any(
                obj.get("mesReferencia") == mes and obj.get("anoReferencia") == ano
                for obj in (it["lancamento"], it["nota"], it["historico"]) if obj
            )
        ]

    return {"status": "ok", "vinculos": itens}

_TABELA_POR_TIPO = {
    "financeiro": ("financeiro", "lancamento_id", row_financeiro),
    "nota": ("notas_fiscais", "nota_id", row_nota_fiscal),
    "historico": ("historico_pdfs", "historico_id", row_historico_resumo),
}

@app.get("/vinculos/sugestoes")
def sugestoes_vinculos(tipo: str, id: str):
    if tipo not in _TABELA_POR_TIPO:
        return {"status": "erro", "erro": "tipo inválido (use financeiro, nota ou historico)"}
    tabela_origem, _, _ = _TABELA_POR_TIPO[tipo]
    conn = conectar_db()
    origem = conn.execute(f"SELECT * FROM {tabela_origem} WHERE id = ?", (id,)).fetchone()
    if not origem:
        conn.close()
        return {"status": "erro", "erro": "Registro não encontrado"}

    resultado = {"status": "ok"}
    for chave, (tabela_alvo, coluna_alvo, row_fn) in _TABELA_POR_TIPO.items():
        if tabela_alvo == tabela_origem:
            continue
        candidatos = _buscar_candidatos(
            conn, tabela_alvo, coluna_alvo,
            origem["cliente"], origem["valor"], origem["mes_referencia"], origem["ano_referencia"],
        )
        resultado[f"candidatos{chave.capitalize()}"] = [row_fn(c) for c in candidatos[:10]]
    conn.close()
    return resultado

def _criar_vinculo_core(payload: VinculoCreatePayload) -> dict:
    ids_informados = [x for x in (payload.lancamentoId, payload.notaId, payload.historicoId) if x]
    if len(ids_informados) < 2:
        return {"status": "erro", "erro": "Informe ao menos dois registros para vincular."}

    conn = conectar_db()
    lanc = conn.execute("SELECT * FROM financeiro WHERE id=?", (payload.lancamentoId,)).fetchone() if payload.lancamentoId else None
    nota = conn.execute("SELECT * FROM notas_fiscais WHERE id=?", (payload.notaId,)).fetchone() if payload.notaId else None
    hist = conn.execute("SELECT * FROM historico_pdfs WHERE id=?", (payload.historicoId,)).fetchone() if payload.historicoId else None
    if payload.lancamentoId and not lanc:
        conn.close()
        return {"status": "erro", "erro": "Lançamento não encontrado"}
    if payload.notaId and not nota:
        conn.close()
        return {"status": "erro", "erro": "Nota fiscal não encontrada"}
    if payload.historicoId and not hist:
        conn.close()
        return {"status": "erro", "erro": "Registro do histórico não encontrado"}

    vinculos_por_campo = {}
    for campo, valor_id in (("lancamento_id", payload.lancamentoId), ("nota_id", payload.notaId), ("historico_id", payload.historicoId)):
        if not valor_id:
            continue
        v = conn.execute(f"SELECT * FROM vinculos WHERE {campo} = ?", (valor_id,)).fetchone()
        if v:
            vinculos_por_campo[campo] = v

    ids_de_vinculos_encontrados = {v["id"] for v in vinculos_por_campo.values()}
    if len(ids_de_vinculos_encontrados) > 1:
        conn.close()
        return {"status": "erro", "erro": "Os registros informados já pertencem a vínculos diferentes. Desvincule antes de criar um novo vínculo."}

    vinculo_alvo = next(iter(vinculos_por_campo.values()), None)
    if vinculo_alvo:
        # Não deixa trocar silenciosamente um lado já preenchido desse vínculo por um
        # id diferente (ex: nota já vinculada tentando ser trocada por outra nota).
        for campo, valor_novo in (("lancamento_id", payload.lancamentoId), ("nota_id", payload.notaId), ("historico_id", payload.historicoId)):
            valor_existente = vinculo_alvo[campo]
            if valor_novo and valor_existente and valor_existente != valor_novo:
                conn.close()
                return {"status": "erro", "erro": "Um dos lados já está vinculado a outro registro. Desvincule antes de criar um novo vínculo."}

    lancamento_id_final = payload.lancamentoId or (vinculo_alvo["lancamento_id"] if vinculo_alvo else None)
    nota_id_final = payload.notaId or (vinculo_alvo["nota_id"] if vinculo_alvo else None)
    historico_id_final = payload.historicoId or (vinculo_alvo["historico_id"] if vinculo_alvo else None)
    lanc_final = lanc or (conn.execute("SELECT * FROM financeiro WHERE id=?", (lancamento_id_final,)).fetchone() if lancamento_id_final else None)
    nota_final = nota or (conn.execute("SELECT * FROM notas_fiscais WHERE id=?", (nota_id_final,)).fetchone() if nota_id_final else None)

    classe_escolhida = None
    if lanc_final and nota_final:
        classe_f = _classificar_financeiro(lanc_final["status"])
        classe_n = _classificar_nota(nota_final["cancelada"], nota_final["data_recebimento"])
        if classe_f != "aberto" and classe_n != "aberto" and classe_f != classe_n:
            if not payload.resolverConflito:
                conn.close()
                raise HTTPException(status_code=409, detail={
                    "status": "conflito",
                    "erro": "Financeiro e nota fiscal têm status incompatíveis.",
                    "conflito": {
                        "lancamentoId": lanc_final["id"],
                        "notaId": nota_final["id"],
                        "financeiro": {"status": lanc_final["status"], "dataRecebimento": lanc_final["data_recebimento"] or ""},
                        "nota": {"cancelada": bool(nota_final["cancelada"]), "dataRecebimento": nota_final["data_recebimento"] or ""},
                    },
                })
            classe_escolhida = classe_f if payload.resolverConflito == "financeiro" else classe_n
        elif classe_f != "aberto":
            classe_escolhida = classe_f
        elif classe_n != "aberto":
            classe_escolhida = classe_n

    agora = datetime.now().isoformat()
    if vinculo_alvo:
        conn.execute(
            "UPDATE vinculos SET lancamento_id=?, nota_id=?, historico_id=?, atualizado_em=? WHERE id=?",
            (lancamento_id_final, nota_id_final, historico_id_final, agora, vinculo_alvo["id"]),
        )
        vinculo_id = vinculo_alvo["id"]
    else:
        vinculo_id = str(uuid.uuid4())
        conn.execute(
            "INSERT INTO vinculos (id, lancamento_id, nota_id, historico_id, criado_em, atualizado_em, origem) VALUES (?, ?, ?, ?, ?, ?, ?)",
            (vinculo_id, lancamento_id_final, nota_id_final, historico_id_final, agora, agora, payload.origem),
        )

    if lancamento_id_final and nota_id_final:
        if classe_escolhida:
            if payload.resolverConflito == "nota":
                data_ref = nota_final["data_recebimento"] or lanc_final["data_recebimento"]
            else:
                data_ref = lanc_final["data_recebimento"] or nota_final["data_recebimento"]
            _aplicar_classe_no_financeiro(conn, lancamento_id_final, classe_escolhida, data_ref)
            _aplicar_classe_na_nota(conn, nota_id_final, classe_escolhida, data_ref)
        conn.execute(
            "UPDATE financeiro SET nota_enviada = 1, nota = ?, data_envio_nota = ? WHERE id = ?",
            (nota_final["numero_nota"], nota_final["data_emissao"] or datetime.now().strftime("%Y-%m-%d"), lancamento_id_final),
        )
        conn.execute("UPDATE notas_fiscais SET financeiro_id = ? WHERE id = ?", (lancamento_id_final, nota_id_final))

    conn.commit()
    row = conn.execute("SELECT * FROM vinculos WHERE id = ?", (vinculo_id,)).fetchone()
    conn.close()
    return {"status": "ok", "vinculo": row_vinculo(row)}

@app.post("/vinculos")
def criar_vinculo(payload: VinculoCreatePayload):
    return _criar_vinculo_core(payload)

@app.delete("/vinculos/{vinculo_id}")
def excluir_vinculo(vinculo_id: str):
    """Desvincula (nunca apaga financeiro/nota/histórico, só o elo entre eles)."""
    conn = conectar_db()
    row = conn.execute("SELECT * FROM vinculos WHERE id = ?", (vinculo_id,)).fetchone()
    if not row:
        conn.close()
        return {"status": "erro", "erro": "Vínculo não encontrado"}
    _desvincular(conn, row)
    conn.commit()
    conn.close()
    return {"status": "ok", "id": vinculo_id}

@app.post("/financeiro")
def salvar_financeiro(payload: FinanceiroPayload):
    item_id = payload.id or gerar_id()
    data_emissao = payload.dataEmissao or datetime.now().strftime("%Y-%m-%d")

    mes_ref, ano_ref = payload.mesReferencia, payload.anoReferencia
    if not mes_ref or not ano_ref:
        mes_ref, ano_ref = parse_mes_ano_referencia(payload.referencia, data_emissao)

    conn = conectar_db()
    conn.execute(
        """INSERT OR REPLACE INTO financeiro
           (id, cliente, referencia, descricao, valor, status, data_emissao, data_recebimento,
            vencimento, data_promessa_pagamento, nota_enviada, data_envio_nota, observacao, nota,
            mes_referencia, ano_referencia)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
        (
            item_id, payload.cliente, payload.referencia, payload.descricao, payload.valor,
            payload.status, data_emissao, payload.dataRecebimento,
            payload.vencimento, payload.dataPromessaPagamento, 1 if payload.notaEnviada else 0,
            payload.dataEnvioNota, payload.observacao, payload.nota,
            mes_ref, ano_ref,
        ),
    )
    # Propagação bidirecional de status: se este lançamento estiver vinculado a uma nota
    # fiscal, reflete a mudança de status nela também (mesma transação).
    vinculo = conn.execute("SELECT * FROM vinculos WHERE lancamento_id = ?", (item_id,)).fetchone()
    if vinculo:
        _propagar_status_vinculo(conn, vinculo, origem="financeiro")

    # Tarefa "Pendentes de vínculo": se um historicoId foi informado e nem ele nem este
    # lançamento já estiverem vinculados, cria o vínculo lançamento+histórico agora.
    if payload.historicoId:
        ja_vinculado_hist = conn.execute("SELECT 1 FROM vinculos WHERE historico_id = ?", (payload.historicoId,)).fetchone()
        ja_vinculado_lanc = conn.execute("SELECT 1 FROM vinculos WHERE lancamento_id = ?", (item_id,)).fetchone()
        if not ja_vinculado_hist and not ja_vinculado_lanc:
            agora = datetime.now().isoformat()
            conn.execute(
                "INSERT INTO vinculos (id, lancamento_id, nota_id, historico_id, criado_em, atualizado_em, origem) "
                "VALUES (?, ?, NULL, ?, ?, ?, 'importado-historico')",
                (str(uuid.uuid4()), item_id, payload.historicoId, agora, agora),
            )

    conn.commit()

    row = conn.execute("SELECT * FROM financeiro WHERE id = ?", (item_id,)).fetchone()
    conn.close()
    return {"status": "ok", "lancamento": row_financeiro(row)}

@app.delete("/financeiro/{item_id}")
def excluir_financeiro(item_id: str):
    conn = conectar_db()
    _cascade_excluir_vinculos_de(conn, lancamento_id=item_id)
    conn.execute("DELETE FROM financeiro WHERE id = ?", (item_id,))
    conn.commit()
    conn.close()
    return {"status": "ok", "id": item_id}

@app.get("/historico-pdfs")
def listar_historico_pdfs():
    conn = conectar_db()
    rows = conn.execute("SELECT * FROM historico_pdfs ORDER BY criado_em DESC").fetchall()
    conn.close()
    return {"status": "ok", "historico": [row_historico_resumo(r) for r in rows]}

@app.get("/historico-pdfs/{item_id}")
def obter_historico_pdf(item_id: str):
    conn = conectar_db()
    row = conn.execute("SELECT * FROM historico_pdfs WHERE id = ?", (item_id,)).fetchone()
    conn.close()
    if not row:
        return {"status": "erro", "erro": "Registro não encontrado"}
    item = row_historico_resumo(row)
    item["dados"] = json.loads(row["dados_json"]) if row["dados_json"] else None
    return {"status": "ok", "item": item}

@app.post("/historico-pdfs/upload")
async def upload_historico_pdfs(files: List[UploadFile] = File(...)):
    criados = []
    erros = []
    conn = conectar_db()
    for arquivo in files:
        conteudo = await arquivo.read()
        erro = _validar_pdf_upload(conteudo, arquivo.filename or "")
        if erro:
            erros.append({"arquivo": arquivo.filename, "erro": erro})
            continue

        nome_fisico = f"{uuid.uuid4()}.pdf"
        caminho = UPLOAD_RELATORIOS_DIR / nome_fisico
        caminho.write_bytes(conteudo)

        texto = extrair_texto_pdf(caminho)
        extraido = parse_relatorio_ytalseg(texto, caminho)

        item_id = gerar_id()
        criado_em = datetime.now().isoformat()
        cliente = extraido["cliente"] if extraido else ""
        referencia = extraido["referencia"] if extraido else ""
        valor = extraido["valor"] if extraido else 0.0
        tipo = extraido["tipo"] if extraido else "Cliente"
        mes_ref, ano_ref = parse_mes_ano_sem_fallback(referencia)

        conn.execute(
            """INSERT INTO historico_pdfs
               (id, tipo, cliente, referencia, valor, criado_em, arquivo_nome, tem_arquivo, dados_json,
                origem, data_documento, arquivo_nome_original, mes_referencia, ano_referencia)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
            (item_id, tipo, cliente, referencia, valor, criado_em, nome_fisico, 1, None,
             "importado", "", arquivo.filename or nome_fisico, mes_ref, ano_ref),
        )
        conn.commit()
        row = conn.execute("SELECT * FROM historico_pdfs WHERE id = ?", (item_id,)).fetchone()
        criados.append(row_historico_resumo(row))
    conn.close()
    return {"status": "ok", "itens": criados, "erros": erros}

@app.patch("/historico-pdfs/{item_id}")
def editar_historico_pdf(item_id: str, payload: HistoricoPdfEditPayload):
    conn = conectar_db()
    row = conn.execute("SELECT * FROM historico_pdfs WHERE id = ?", (item_id,)).fetchone()
    if not row:
        conn.close()
        return {"status": "erro", "erro": "Registro não encontrado"}

    mapa = {
        "cliente": "cliente", "tipo": "tipo", "referencia": "referencia",
        "valor": "valor", "dataDocumento": "data_documento",
    }
    campos = []
    valores = []
    dados = payload.dict()
    for chave_payload, coluna in mapa.items():
        if dados.get(chave_payload) is not None:
            campos.append(f"{coluna} = ?")
            valores.append(dados[chave_payload])

    # Se a Referência foi editada no formulário de confirmação, recalcula mês/ano
    # em silêncio (sem campo novo na UI) a partir do texto que o usuário confirmou.
    if dados.get("referencia") is not None:
        mes_ref, ano_ref = parse_mes_ano_sem_fallback(dados["referencia"])
        campos.append("mes_referencia = ?")
        valores.append(mes_ref)
        campos.append("ano_referencia = ?")
        valores.append(ano_ref)

    if campos:
        valores.append(item_id)
        conn.execute(f"UPDATE historico_pdfs SET {', '.join(campos)} WHERE id = ?", valores)
        conn.commit()

    row = conn.execute("SELECT * FROM historico_pdfs WHERE id = ?", (item_id,)).fetchone()
    conn.close()
    return {"status": "ok", "item": row_historico_resumo(row)}

@app.get("/historico-pdfs/{item_id}/arquivo")
def obter_arquivo_historico_pdf(item_id: str, baixar: int = 0):
    conn = conectar_db()
    row = conn.execute("SELECT * FROM historico_pdfs WHERE id = ?", (item_id,)).fetchone()
    conn.close()
    if not row or not row["tem_arquivo"] or not row["arquivo_nome"]:
        raise HTTPException(status_code=404, detail="Arquivo não encontrado")

    caminho = UPLOAD_RELATORIOS_DIR / row["arquivo_nome"]
    if not caminho.exists():
        raise HTTPException(status_code=404, detail="Arquivo não encontrado no disco")

    nome_exibicao = row["arquivo_nome_original"] or row["arquivo_nome"]
    if baixar:
        return FileResponse(caminho, media_type="application/pdf", filename=nome_exibicao)
    return FileResponse(
        caminho,
        media_type="application/pdf",
        headers={"Content-Disposition": f'inline; filename="{nome_exibicao}"'},
    )

@app.post("/historico-pdfs")
def salvar_historico_pdf(payload: HistoricoPdfPayload):
    item_id = payload.id or gerar_id()
    criado_em = datetime.now().isoformat()
    dados_json = json.dumps(payload.dados, ensure_ascii=False) if payload.dados else None
    mes_ref, ano_ref = parse_mes_ano_sem_fallback(payload.referencia)
    conn = conectar_db()
    conn.execute(
        """INSERT OR REPLACE INTO historico_pdfs
           (id, tipo, cliente, referencia, valor, criado_em, arquivo_nome, tem_arquivo, dados_json,
            mes_referencia, ano_referencia)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
        (item_id, payload.tipo, payload.cliente, payload.referencia, payload.valor, criado_em, None, 0, dados_json,
         mes_ref, ano_ref),
    )
    conn.commit()
    row = conn.execute("SELECT * FROM historico_pdfs WHERE id = ?", (item_id,)).fetchone()
    conn.close()
    return {"status": "ok", "item": row_historico_resumo(row)}

@app.delete("/historico-pdfs/{item_id}")
def excluir_historico_pdf(item_id: str):
    conn = conectar_db()
    row = conn.execute("SELECT * FROM historico_pdfs WHERE id = ?", (item_id,)).fetchone()
    if row and row["tem_arquivo"] and row["arquivo_nome"]:
        caminho = UPLOAD_RELATORIOS_DIR / row["arquivo_nome"]
        if caminho.exists():
            caminho.unlink()
    _cascade_excluir_vinculos_de(conn, historico_id=item_id)
    conn.execute("DELETE FROM historico_pdfs WHERE id = ?", (item_id,))
    conn.commit()
    conn.close()
    return {"status": "ok", "id": item_id}

@app.delete("/historico-pdfs")
def limpar_historico_pdfs():
    conn = conectar_db()
    conn.execute("DELETE FROM historico_pdfs")
    conn.commit()
    conn.close()
    return {"status": "ok"}

@app.post("/notas-fiscais/upload")
async def upload_notas_fiscais(files: List[UploadFile] = File(...)):
    criados = []
    erros = []
    conn = conectar_db()
    for arquivo in files:
        conteudo = await arquivo.read()
        erro = _validar_pdf_upload(conteudo, arquivo.filename or "")
        if erro:
            erros.append({"arquivo": arquivo.filename, "erro": erro})
            continue

        nome_fisico = f"{uuid.uuid4()}.pdf"
        caminho = UPLOAD_NOTAS_DIR / nome_fisico
        caminho.write_bytes(conteudo)

        texto = extrair_texto_pdf(caminho)
        extraido = parse_nfse_sp(texto)

        item_id = gerar_id()
        criado_em = datetime.now().isoformat()

        conn.execute(
            """INSERT INTO notas_fiscais
               (id, numero_nota, cliente, cnpj_tomador, mes_referencia, ano_referencia,
                data_emissao, vencimento, valor, codigo_verificacao, arquivo_nome,
                arquivo_nome_original, criado_em, financeiro_id)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
            (item_id, extraido["numeroNota"], extraido["cliente"], extraido["cnpjTomador"],
             extraido["mesReferencia"], extraido["anoReferencia"], extraido["dataEmissao"],
             extraido["vencimento"], extraido["valor"], extraido["codigoVerificacao"],
             nome_fisico, arquivo.filename or nome_fisico, criado_em, ""),
        )
        conn.commit()
        row = conn.execute("SELECT * FROM notas_fiscais WHERE id = ?", (item_id,)).fetchone()
        item = row_nota_fiscal(row)
        item["sugestaoFinanceiroId"] = sugerir_financeiro(
            extraido["cliente"], extraido["valor"], extraido["mesReferencia"], extraido["anoReferencia"]
        )
        criados.append(item)
    conn.close()
    return {"status": "ok", "itens": criados, "erros": erros}

@app.get("/notas-fiscais")
def listar_notas_fiscais(mes: Optional[int] = None, ano: Optional[int] = None, cliente: Optional[str] = None):
    conn = conectar_db()
    rows = conn.execute("SELECT * FROM notas_fiscais ORDER BY criado_em DESC").fetchall()
    conn.close()
    itens = [row_nota_fiscal(r) for r in rows]
    if mes:
        itens = [i for i in itens if i["mesReferencia"] == mes]
    if ano:
        itens = [i for i in itens if i["anoReferencia"] == ano]
    if cliente:
        c = cliente.strip().lower()
        itens = [i for i in itens if c in i["cliente"].lower()]
    return {"status": "ok", "notas": itens}

@app.post("/notas-fiscais/marcar-recebidas")
def marcar_notas_recebidas(payload: MarcarRecebidasPayload):
    """Marca em lote uma lista de notas como recebidas, todas com a mesma data.
    Notas canceladas são puladas (não faz sentido marcar cancelada como recebida)."""
    if not payload.ids:
        return {"status": "erro", "erro": "Nenhuma nota selecionada"}
    conn = conectar_db()
    atualizadas = []
    puladas = []
    for item_id in payload.ids:
        row = conn.execute("SELECT * FROM notas_fiscais WHERE id = ?", (item_id,)).fetchone()
        if not row:
            continue
        if row["cancelada"]:
            puladas.append(item_id)
            continue
        conn.execute(
            "UPDATE notas_fiscais SET data_recebimento = ? WHERE id = ?",
            (payload.dataRecebimento, item_id),
        )
        vinculo = conn.execute("SELECT * FROM vinculos WHERE nota_id = ?", (item_id,)).fetchone()
        if vinculo:
            _propagar_status_vinculo(conn, vinculo, origem="nota")
        atualizadas.append(item_id)
    conn.commit()
    conn.close()
    return {"status": "ok", "atualizadas": atualizadas, "puladas": puladas}

@app.patch("/notas-fiscais/{item_id}")
def editar_nota_fiscal(item_id: str, payload: NotaFiscalEditPayload):
    conn = conectar_db()
    row = conn.execute("SELECT * FROM notas_fiscais WHERE id = ?", (item_id,)).fetchone()
    if not row:
        conn.close()
        return {"status": "erro", "erro": "Registro não encontrado"}

    mapa = {
        "numeroNota": "numero_nota", "cliente": "cliente", "cnpjTomador": "cnpj_tomador",
        "mesReferencia": "mes_referencia", "anoReferencia": "ano_referencia",
        "dataEmissao": "data_emissao", "vencimento": "vencimento", "valor": "valor",
        "codigoVerificacao": "codigo_verificacao", "cancelada": "cancelada",
        "dataRecebimento": "data_recebimento",
    }
    campos = []
    valores = []
    dados = payload.dict()
    for chave_payload, coluna in mapa.items():
        if dados.get(chave_payload) is not None:
            valor_gravado = dados[chave_payload]
            if isinstance(valor_gravado, bool):
                valor_gravado = 1 if valor_gravado else 0
            campos.append(f"{coluna} = ?")
            valores.append(valor_gravado)

    if campos:
        valores.append(item_id)
        conn.execute(f"UPDATE notas_fiscais SET {', '.join(campos)} WHERE id = ?", valores)
        # dataRecebimento ou cancelada explícitos -> reflete no lançamento vinculado, se
        # houver (propagação bidirecional de status via a tabela vinculos).
        if dados.get("dataRecebimento") is not None or dados.get("cancelada") is not None:
            vinculo = conn.execute("SELECT * FROM vinculos WHERE nota_id = ?", (item_id,)).fetchone()
            if vinculo:
                _propagar_status_vinculo(conn, vinculo, origem="nota")
        conn.commit()

    row = conn.execute("SELECT * FROM notas_fiscais WHERE id = ?", (item_id,)).fetchone()
    conn.close()
    return {"status": "ok", "item": row_nota_fiscal(row)}

@app.get("/notas-fiscais/{item_id}/arquivo")
def obter_arquivo_nota_fiscal(item_id: str, baixar: int = 0):
    conn = conectar_db()
    row = conn.execute("SELECT * FROM notas_fiscais WHERE id = ?", (item_id,)).fetchone()
    conn.close()
    if not row or not row["arquivo_nome"]:
        raise HTTPException(status_code=404, detail="Arquivo não encontrado")

    caminho = UPLOAD_NOTAS_DIR / row["arquivo_nome"]
    if not caminho.exists():
        raise HTTPException(status_code=404, detail="Arquivo não encontrado no disco")

    nome_exibicao = row["arquivo_nome_original"] or row["arquivo_nome"]
    if baixar:
        return FileResponse(caminho, media_type="application/pdf", filename=nome_exibicao)
    return FileResponse(
        caminho,
        media_type="application/pdf",
        headers={"Content-Disposition": f'inline; filename="{nome_exibicao}"'},
    )

@app.delete("/notas-fiscais/{item_id}")
def excluir_nota_fiscal(item_id: str):
    conn = conectar_db()
    row = conn.execute("SELECT * FROM notas_fiscais WHERE id = ?", (item_id,)).fetchone()
    if row and row["arquivo_nome"]:
        caminho = UPLOAD_NOTAS_DIR / row["arquivo_nome"]
        if caminho.exists():
            caminho.unlink()
    _cascade_excluir_vinculos_de(conn, nota_id=item_id)
    conn.execute("DELETE FROM notas_fiscais WHERE id = ?", (item_id,))
    conn.commit()
    conn.close()
    return {"status": "ok", "id": item_id}

@app.post("/notas-fiscais/{item_id}/vincular")
def vincular_nota_financeiro(item_id: str, payload: VincularFinanceiroPayload):
    """Mantido como wrapper fino sobre a lógica de /vinculos (usado pelo banner de
    sugestão automática do upload de notas) - preserva o formato de resposta antigo
    ({lancamento, item}) pra não quebrar o frontend existente. Um 409 de conflito
    propaga normalmente (o chamador HTTP recebe o mesmo status code)."""
    resultado = _criar_vinculo_core(
        VinculoCreatePayload(lancamentoId=payload.financeiroId, notaId=item_id, origem="sugerido-confirmado")
    )
    if resultado.get("status") != "ok":
        return resultado

    conn = conectar_db()
    lanc_atualizado = conn.execute("SELECT * FROM financeiro WHERE id = ?", (payload.financeiroId,)).fetchone()
    nota_atualizada = conn.execute("SELECT * FROM notas_fiscais WHERE id = ?", (item_id,)).fetchone()
    conn.close()
    if not lanc_atualizado or not nota_atualizada:
        return {"status": "erro", "erro": "Nota ou lançamento não encontrado"}
    return {"status": "ok", "lancamento": row_financeiro(lanc_atualizado), "item": row_nota_fiscal(nota_atualizada)}

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