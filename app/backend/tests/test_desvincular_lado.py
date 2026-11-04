import uuid

from conftest import inserir_nota_direto
from test_vinculos import _achar_financeiro, _achar_nota, _criar_financeiro


def _inserir_historico(main_module, cliente="Cliente Teste", valor=100.0):
    conn = main_module.conectar_db()
    item_id = str(uuid.uuid4())
    conn.execute(
        "INSERT INTO historico_pdfs (id, tipo, cliente, referencia, valor, criado_em, tem_arquivo) "
        "VALUES (?, 'Cliente', ?, 'JULHO / 2026', ?, '2026-07-01T00:00:00', 1)",
        (item_id, cliente, valor),
    )
    conn.commit()
    conn.close()
    return item_id


def _vinculo_completo(client):
    lanc = _criar_financeiro(client)
    nota_id = inserir_nota_direto(client.main, cliente="Cliente Teste", valor=100.0, mes_referencia=7, ano_referencia=2026)
    hist_id = _inserir_historico(client.main)
    res = client.post("/vinculos", json={"lancamentoId": lanc["id"], "notaId": nota_id, "historicoId": hist_id})
    assert res.json()["status"] == "ok"
    return lanc, nota_id, hist_id, res.json()["vinculo"]["id"]


def _vinculo_por_id(client, vinculo_id):
    return next((v for v in client.get("/vinculos").json()["vinculos"] if v["id"] == vinculo_id), None)


def test_desvincular_relatorio_mantem_nota_e_lancamento(client):
    lanc, nota_id, hist_id, vinc_id = _vinculo_completo(client)

    res = client.delete(f"/vinculos/{vinc_id}/lado/relatorio")
    assert res.json()["status"] == "ok"

    v = _vinculo_por_id(client, vinc_id)
    assert v["historicoId"] is None
    assert v["notaId"] == nota_id and v["lancamentoId"] == lanc["id"]
    f = _achar_financeiro(client, lanc["id"])
    assert f["notaEnviada"] is True and f["nota"] == "844"
    # nada foi apagado: o relatório continua existindo e volta a ficar livre
    hist = client.get("/historico-pdfs").json()["historico"]
    assert any(h["id"] == hist_id for h in hist)


def test_desvincular_nota_mantem_relatorio_e_limpa_espelhos(client):
    lanc, nota_id, hist_id, vinc_id = _vinculo_completo(client)

    res = client.delete(f"/vinculos/{vinc_id}/lado/nota")
    assert res.json()["status"] == "ok"

    v = _vinculo_por_id(client, vinc_id)
    assert v["notaId"] is None
    assert v["historicoId"] == hist_id and v["lancamentoId"] == lanc["id"]
    f = _achar_financeiro(client, lanc["id"])
    assert f["notaEnviada"] is False and f["nota"] == ""
    assert _achar_nota(client, nota_id)["financeiroId"] == ""


def test_desvincular_quando_sobra_um_lado_remove_o_vinculo(client):
    lanc = _criar_financeiro(client)
    hist_id = _inserir_historico(client.main)
    vinc_id = client.post("/vinculos", json={"lancamentoId": lanc["id"], "historicoId": hist_id}).json()["vinculo"]["id"]

    assert client.delete(f"/vinculos/{vinc_id}/lado/relatorio").json()["status"] == "ok"
    assert _vinculo_por_id(client, vinc_id) is None
    assert _achar_financeiro(client, lanc["id"])  # lançamento continua lá


def test_desvincular_lado_invalido_ou_vazio(client):
    lanc = _criar_financeiro(client)
    nota_id = inserir_nota_direto(client.main, cliente="Cliente Teste", valor=100.0, mes_referencia=7, ano_referencia=2026)
    vinc_id = client.post("/vinculos", json={"lancamentoId": lanc["id"], "notaId": nota_id}).json()["vinculo"]["id"]

    assert client.delete(f"/vinculos/{vinc_id}/lado/xyz").status_code == 400
    assert client.delete(f"/vinculos/{vinc_id}/lado/relatorio").json()["status"] == "erro"
    assert client.delete("/vinculos/nao-existe/lado/nota").json()["status"] == "erro"


def test_dashboard_expoe_vinculo_id(client):
    lanc, _, _, vinc_id = _vinculo_completo(client)
    mapa = client.get("/dashboard/financeiro-notas").json()["vinculosFinanceiro"]
    assert mapa[lanc["id"]]["vinculoId"] == vinc_id
