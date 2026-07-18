from conftest import inserir_nota_direto


def _achar_nota(client, item_id):
    res = client.get("/notas-fiscais")
    return next(n for n in res.json()["notas"] if n["id"] == item_id)


def _achar_financeiro(client, item_id):
    res = client.get("/financeiro")
    return next(l for l in res.json()["lancamentos"] if l["id"] == item_id)


def _criar_financeiro(client, **overrides):
    payload = {
        "cliente": "Cliente Vinculado Cobranca",
        "referencia": "",
        "descricao": "",
        "valor": 500.0,
        "status": "pendente",
        "mesReferencia": 7,
        "anoReferencia": 2026,
    }
    payload.update(overrides)
    res = client.post("/financeiro", json=payload)
    assert res.status_code == 200
    return res.json()["lancamento"]


def test_registrar_cobranca_em_nota_vinculada_usa_fluxo_do_financeiro(client):
    """Simula exatamente o que Cobranca.tsx faz pra uma nota vinculada: pega o
    lancamento (via GET /vinculos), sobrescreve status/observacao e reenvia o
    objeto inteiro pra POST /financeiro - sem tocar em nenhum endpoint novo."""
    lanc = _criar_financeiro(client)
    nota_id = inserir_nota_direto(
        client.main, cliente="Cliente Vinculado Cobranca", valor=500.0, mes_referencia=7, ano_referencia=2026
    )
    client.post("/vinculos", json={"lancamentoId": lanc["id"], "notaId": nota_id})

    vinculos = client.get("/vinculos").json()["vinculos"]
    vinculo = next(v for v in vinculos if v["notaId"] == nota_id)
    assert vinculo["lancamento"]["id"] == lanc["id"]

    atualizado = {
        **vinculo["lancamento"],
        "status": "cobrado",
        "observacao": "[Cobrança 18/07/2026] Cobrado - registrado via aba Cobrança.",
    }
    res = client.post("/financeiro", json=atualizado)
    assert res.status_code == 200

    financeiro_atualizado = _achar_financeiro(client, lanc["id"])
    assert financeiro_atualizado["status"] == "cobrado"
    assert "Cobrança" in financeiro_atualizado["observacao"]

    # "cobrado" não é um status de recebimento nem cancelamento - a nota continua
    # em aberto, nada aqui pode marcar como Recebida sozinho.
    nota_atualizada = _achar_nota(client, nota_id)
    assert nota_atualizada["dataRecebimento"] == ""
    assert nota_atualizada["cancelada"] is False
    # e como a nota está vinculada, os campos aditivos da própria nota não são usados
    assert nota_atualizada["cobrancaStatus"] == ""


def test_registrar_cobranca_grava_status_data_obs(client):
    nota_id = inserir_nota_direto(
        client.main, cliente="Cliente Sem Vinculo", valor=200.0, mes_referencia=7, ano_referencia=2026
    )

    res = client.patch(
        f"/notas-fiscais/{nota_id}/cobranca",
        json={"status": "cobrado", "data": "2026-07-18", "obs": "Cobrado por WhatsApp"},
    )
    assert res.status_code == 200
    item = res.json()["item"]
    assert item["cobrancaStatus"] == "cobrado"
    assert item["cobrancaData"] == "2026-07-18"
    assert item["cobrancaObs"] == "Cobrado por WhatsApp"

    nota_atualizada = _achar_nota(client, nota_id)
    assert nota_atualizada["cobrancaStatus"] == "cobrado"


def test_registrar_cobranca_usa_data_de_hoje_quando_nao_informada(client):
    nota_id = inserir_nota_direto(
        client.main, cliente="Cliente Sem Data", valor=150.0, mes_referencia=7, ano_referencia=2026
    )

    res = client.patch(f"/notas-fiscais/{nota_id}/cobranca", json={"status": "negociacao"})
    assert res.status_code == 200
    item = res.json()["item"]
    assert item["cobrancaStatus"] == "negociacao"
    assert item["cobrancaData"] != ""


def test_registrar_cobranca_desfazer_limpa_os_3_campos(client):
    nota_id = inserir_nota_direto(
        client.main, cliente="Cliente Desfazer", valor=300.0, mes_referencia=7, ano_referencia=2026
    )
    client.patch(
        f"/notas-fiscais/{nota_id}/cobranca",
        json={"status": "prometeu_pagar", "data": "2026-07-20", "obs": "Prometeu pagar dia 20"},
    )

    res = client.patch(f"/notas-fiscais/{nota_id}/cobranca", json={"status": ""})
    assert res.status_code == 200
    item = res.json()["item"]
    assert item["cobrancaStatus"] == ""
    assert item["cobrancaData"] == ""
    assert item["cobrancaObs"] == ""


def test_registrar_cobranca_nao_mexe_em_cancelada_nem_data_recebimento(client):
    nota_id = inserir_nota_direto(
        client.main, cliente="Cliente Intocavel", valor=400.0, mes_referencia=7, ano_referencia=2026
    )

    res = client.patch(f"/notas-fiscais/{nota_id}/cobranca", json={"status": "cobrado"})
    assert res.status_code == 200
    item = res.json()["item"]
    assert item["cancelada"] is False
    assert item["dataRecebimento"] == ""

    # também não deve criar nenhum vínculo nem mexer no Financeiro
    vinculos = client.get("/vinculos").json()["vinculos"]
    assert not any(v["notaId"] == nota_id for v in vinculos)


def test_registrar_cobranca_nota_inexistente_retorna_erro(client):
    res = client.patch("/notas-fiscais/id-que-nao-existe/cobranca", json={"status": "cobrado"})
    assert res.status_code == 200
    assert res.json()["status"] == "erro"
