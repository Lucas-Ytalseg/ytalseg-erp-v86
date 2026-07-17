import importlib
import sys
import uuid
from pathlib import Path

import pytest

# app/backend/app/main.py é importado como "app.backend.app.main" (pacote namespace,
# sem __init__.py em lugar nenhum) - é assim que o Dockerfile roda o uvicorn também.
# Isso só funciona se a raiz do repositório estiver no sys.path; garante isso aqui
# porque pytest, ao descobrir este conftest.py, normalmente só adiciona a pasta
# app/backend/tests/ (onde ele está) ao sys.path, não a raiz do repo.
REPO_ROOT = Path(__file__).resolve().parents[3]
if str(REPO_ROOT) not in sys.path:
    sys.path.insert(0, str(REPO_ROOT))


@pytest.fixture()
def client(tmp_path, monkeypatch):
    monkeypatch.setenv("DATA_DIR", str(tmp_path))
    sys.modules.pop("app.backend.app.main", None)
    main = importlib.import_module("app.backend.app.main")
    from fastapi.testclient import TestClient

    with TestClient(main.app) as test_client:
        test_client.main = main  # dá acesso direto ao módulo (conectar_db etc.) nos testes
        yield test_client


def inserir_nota_direto(main_module, *, cliente, valor, mes_referencia, ano_referencia,
                         numero_nota="844", cancelada=0, data_recebimento="", financeiro_id=""):
    """Não existe endpoint JSON simples pra criar uma nota fiscal (só upload multipart
    de PDF) - pra testar a camada de vínculo isoladamente, insere a linha direto no
    banco via a mesma conexão que o app usa. Só usado em teste."""
    conn = main_module.conectar_db()
    item_id = str(uuid.uuid4())
    conn.execute(
        """INSERT INTO notas_fiscais
           (id, numero_nota, cliente, cnpj_tomador, mes_referencia, ano_referencia,
            data_emissao, vencimento, valor, codigo_verificacao, arquivo_nome,
            arquivo_nome_original, criado_em, financeiro_id, cancelada, data_recebimento)
           VALUES (?, ?, ?, '', ?, ?, '2026-07-01', '', ?, '', NULL, '', '2026-07-01T00:00:00', ?, ?, ?)""",
        (item_id, numero_nota, cliente, mes_referencia, ano_referencia, valor, financeiro_id, cancelada, data_recebimento),
    )
    conn.commit()
    conn.close()
    return item_id
