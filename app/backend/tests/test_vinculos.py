from conftest import inserir_nota_direto


def _criar_financeiro(client, **overrides):
    payload = {
        "cliente": "Cliente Teste",
        "referencia": "",
        "descricao": "",
        "valor": 100.0,
        "status": "pendente",
        "mesReferencia": 7,
        "anoReferencia": 2026,
    }
    payload.update(overrides)
    res = client.post("/financeiro", json=payload)
    assert res.status_code == 200
    return res.json()["lancamento"]


def _achar_financeiro(client, item_id):
    res = client.get("/financeiro")
    return next(l for l in res.json()["lancamentos"] if l["id"] == item_id)


def _achar_nota(client, item_id):
    res = client.get("/notas-fiscais")
    return next(n for n in res.json()["notas"] if n["id"] == item_id)


def test_criar_vinculo_sem_conflito(client):
    lanc = _criar_financeiro(client)
    nota_id = inserir_nota_direto(
        client.main, cliente="Cliente Teste", valor=100.0, mes_referencia=7, ano_referencia=2026
    )

    res = client.post("/vinculos", json={"lancamentoId": lanc["id"], "notaId": nota_id})
    assert res.status_code == 200
    corpo = res.json()
    assert corpo["status"] == "ok"
    assert corpo["vinculo"]["lancamentoId"] == lanc["id"]
    assert corpo["vinculo"]["notaId"] == nota_id

    listagem = client.get("/vinculos").json()["vinculos"]
    assert any(v["lancamentoId"] == lanc["id"] and v["notaId"] == nota_id for v in listagem)

    financeiro_atualizado = _achar_financeiro(client, lanc["id"])
    assert financeiro_atualizado["notaEnviada"] is True
    assert financeiro_atualizado["nota"] == "844"
    assert financeiro_atualizado["dataEnvioNota"]

    # ambos os lados continuam editáveis depois de vinculados
    res_edicao = client.post("/financeiro", json={**financeiro_atualizado, "observacao": "editado depois de vincular"})
    assert res_edicao.status_code == 200
    res_edicao_nota = client.patch(f"/notas-fiscais/{nota_id}", json={"cliente": "Cliente Teste Editado"})
    assert res_edicao_nota.status_code == 200


def test_propagacao_financeiro_para_nota(client):
    lanc = _criar_financeiro(client)
    nota_id = inserir_nota_direto(
        client.main, cliente="Cliente Teste", valor=100.0, mes_referencia=7, ano_referencia=2026
    )
    client.post("/vinculos", json={"lancamentoId": lanc["id"], "notaId": nota_id})

    res = client.post("/financeiro", json={**lanc, "status": "recebido", "dataRecebimento": "2026-07-10"})
    assert res.status_code == 200

    nota_atualizada = _achar_nota(client, nota_id)
    assert nota_atualizada["dataRecebimento"] == "2026-07-10"
    assert nota_atualizada["cancelada"] is False


def test_propagacao_nota_para_financeiro(client):
    lanc = _criar_financeiro(client)
    nota_id = inserir_nota_direto(
        client.main, cliente="Cliente Teste", valor=100.0, mes_referencia=7, ano_referencia=2026
    )
    client.post("/vinculos", json={"lancamentoId": lanc["id"], "notaId": nota_id})

    res = client.patch(f"/notas-fiscais/{nota_id}", json={"dataRecebimento": "2026-07-05"})
    assert res.status_code == 200

    financeiro_atualizado = _achar_financeiro(client, lanc["id"])
    assert financeiro_atualizado["status"] == "recebido"
    assert financeiro_atualizado["dataRecebimento"] == "2026-07-05"


def test_propagacao_cancelamento_nota_para_financeiro(client):
    lanc = _criar_financeiro(client)
    nota_id = inserir_nota_direto(
        client.main, cliente="Cliente Teste", valor=100.0, mes_referencia=7, ano_referencia=2026
    )
    client.post("/vinculos", json={"lancamentoId": lanc["id"], "notaId": nota_id})

    res = client.patch(f"/notas-fiscais/{nota_id}", json={"cancelada": True})
    assert res.status_code == 200

    financeiro_atualizado = _achar_financeiro(client, lanc["id"])
    assert financeiro_atualizado["status"] == "nota_cancelada"


def test_conflito_na_criacao_do_vinculo(client):
    lanc = _criar_financeiro(client, status="recebido", dataRecebimento="2026-07-01")
    nota_id = inserir_nota_direto(
        client.main, cliente="Cliente Teste", valor=100.0, mes_referencia=7, ano_referencia=2026, cancelada=1
    )

    res = client.post("/vinculos", json={"lancamentoId": lanc["id"], "notaId": nota_id})
    assert res.status_code == 409
    conflito = res.json()["detail"]["conflito"]
    assert conflito["lancamentoId"] == lanc["id"]
    assert conflito["notaId"] == nota_id
    assert conflito["financeiro"]["status"] == "recebido"
    assert conflito["nota"]["cancelada"] is True

    res2 = client.post("/vinculos", json={"lancamentoId": lanc["id"], "notaId": nota_id, "resolverConflito": "nota"})
    assert res2.status_code == 200

    financeiro_atualizado = _achar_financeiro(client, lanc["id"])
    nota_atualizada = _achar_nota(client, nota_id)
    assert financeiro_atualizado["status"] == "nota_cancelada"
    assert nota_atualizada["cancelada"] is True


def test_unicidade_de_vinculo(client):
    lanc = _criar_financeiro(client)
    nota_b = inserir_nota_direto(
        client.main, cliente="Cliente Teste", valor=100.0, mes_referencia=7, ano_referencia=2026, numero_nota="100"
    )
    nota_c = inserir_nota_direto(
        client.main, cliente="Cliente Teste", valor=100.0, mes_referencia=7, ano_referencia=2026, numero_nota="200"
    )
    client.post("/vinculos", json={"lancamentoId": lanc["id"], "notaId": nota_b})

    res = client.post("/vinculos", json={"lancamentoId": lanc["id"], "notaId": nota_c})
    assert res.json()["status"] == "erro"

    listagem = client.get("/vinculos").json()["vinculos"]
    vinculos_do_lancamento = [v for v in listagem if v["lancamentoId"] == lanc["id"]]
    assert len(vinculos_do_lancamento) == 1
    assert vinculos_do_lancamento[0]["notaId"] == nota_b


def test_cascade_delete_limpa_vinculo(client):
    lanc = _criar_financeiro(client)
    nota_id = inserir_nota_direto(
        client.main, cliente="Cliente Teste", valor=100.0, mes_referencia=7, ano_referencia=2026
    )
    client.post("/vinculos", json={"lancamentoId": lanc["id"], "notaId": nota_id})

    res = client.delete(f"/notas-fiscais/{nota_id}")
    assert res.status_code == 200

    listagem = client.get("/vinculos").json()["vinculos"]
    assert not any(v["notaId"] == nota_id for v in listagem)

    financeiro_atualizado = _achar_financeiro(client, lanc["id"])
    assert financeiro_atualizado["notaEnviada"] is False
    assert financeiro_atualizado["nota"] == ""
    assert financeiro_atualizado["dataEnvioNota"] == ""


def test_essy_regressao_nota_excluida(client):
    """Reproduz exatamente o bug relatado pelo Lucas: cliente Essy, nota 844, valor 9000."""
    lanc = _criar_financeiro(client, cliente="Essy", valor=9000.0, mesReferencia=7, anoReferencia=2026)
    financeiro_id = lanc["id"]

    nota_id = inserir_nota_direto(
        client.main, cliente="Essy", valor=9000.0, mes_referencia=7, ano_referencia=2026, numero_nota="844"
    )

    res_vinculo = client.post("/vinculos", json={"lancamentoId": financeiro_id, "notaId": nota_id})
    assert res_vinculo.status_code == 200

    financeiro_apos_vinculo = _achar_financeiro(client, financeiro_id)
    assert financeiro_apos_vinculo["notaEnviada"] is True
    assert financeiro_apos_vinculo["nota"] == "844"
    assert financeiro_apos_vinculo["dataEnvioNota"]

    # editar o lançamento não pode falhar (era o segundo sintoma do bug relatado)
    res_edicao = client.post("/financeiro", json={**financeiro_apos_vinculo, "observacao": "teste"})
    assert res_edicao.status_code == 200
    assert res_edicao.json()["status"] == "ok"

    # excluir a nota
    res_delete = client.delete(f"/notas-fiscais/{nota_id}")
    assert res_delete.status_code == 200

    listagem_vinculos = client.get("/vinculos").json()["vinculos"]
    assert not any(v["notaId"] == nota_id for v in listagem_vinculos)

    financeiro_limpo = _achar_financeiro(client, financeiro_id)
    assert financeiro_limpo["notaEnviada"] is False
    assert financeiro_limpo["nota"] == ""
    assert financeiro_limpo["dataEnvioNota"] == ""
    assert financeiro_limpo["cliente"] == "Essy"
    assert financeiro_limpo["valor"] == 9000.0
    assert financeiro_limpo["observacao"] == "teste"

    # continua editável / não está travado
    res_edicao2 = client.post("/financeiro", json={**financeiro_limpo, "status": "cobrado"})
    assert res_edicao2.status_code == 200
    assert res_edicao2.json()["lancamento"]["status"] == "cobrado"

    # religar a uma nota nova funciona normalmente
    nova_nota_id = inserir_nota_direto(
        client.main, cliente="Essy", valor=9000.0, mes_referencia=7, ano_referencia=2026, numero_nota="845"
    )
    res_novo_vinculo = client.post("/vinculos", json={"lancamentoId": financeiro_id, "notaId": nova_nota_id})
    assert res_novo_vinculo.status_code == 200

    financeiro_final = _achar_financeiro(client, financeiro_id)
    assert financeiro_final["notaEnviada"] is True
    assert financeiro_final["nota"] == "845"
