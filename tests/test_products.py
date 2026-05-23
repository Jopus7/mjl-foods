from tests.conftest import client


def test_get_products_returns_200():
    response = client.get("/api/products")

    assert response.status_code == 200


def test_get_products_returns_list():
    response = client.get("/api/products")

    data = response.json()

    assert isinstance(data, list)


def test_product_has_required_fields():
    response = client.get("/api/products")

    data = response.json()

    if len(data) > 0:
        product = data[0]

        assert "id" in product
        assert "name" in product
        assert "price" in product