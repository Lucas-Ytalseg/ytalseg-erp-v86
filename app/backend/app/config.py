import os
from pathlib import Path
from dotenv import load_dotenv

# Carregar variáveis de ambiente
load_dotenv()

class Settings:
    """Configurações da aplicação"""
    
    # Ambiente
    ENVIRONMENT = os.getenv("ENVIRONMENT", "development")
    IS_PRODUCTION = ENVIRONMENT == "production"
    
    # App
    APP_NAME = "YTALSEG ERP V86"
    APP_VERSION = "8.0.0 PROFISSIONAL"
    SECRET_KEY = os.getenv("SECRET_KEY", "seu-secret-key-mude-em-producao")
    ALGORITHM = os.getenv("ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))
    
    # Database
    DATABASE_URL = os.getenv("DATABASE_URL")
    
    # Se não tiver DATABASE_URL, usa SQLite local
    if not DATABASE_URL:
        BASE_DIR = Path(__file__).resolve().parent
        DATA_DIR = Path(os.getenv("LOCALAPPDATA", str(Path.home()))) / "YTALSEG"
        DATA_DIR.mkdir(parents=True, exist_ok=True)
        DB_PATH = DATA_DIR / "ytalseg_erp.db"
        DATABASE_URL = f"sqlite:///{DB_PATH}"
    
    # CORS
    CORS_ORIGINS = os.getenv("CORS_ORIGINS", "*")
    
    # Paths (Railway)
    UPLOAD_DIR = Path("/tmp/uploads")
    UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
    
    BACKUP_DIR = Path("/tmp/backups")
    BACKUP_DIR.mkdir(parents=True, exist_ok=True)
    
    # Port
    PORT = int(os.getenv("PORT", "8000"))

# Instância de configuração
settings = Settings()
