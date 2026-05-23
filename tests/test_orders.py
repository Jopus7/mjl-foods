from tests.conftest import client


def test_create_order_success():

    order_data = {
        "customer": {
            "firstName":
            "Karol",

            "phone":
            "123456789",

            "email":
            "karol@test.pl",

            "address":
            "Warszawska 1",

            "city":
            "Warszawa"
        },

        "comment":
        "Test order",

        "promoCode":
        None,

        "items": [
            {
                "productId": 1,
                "quantity": 1
            }
        ]
    }

    response = client.post(
        "/api/orders/create",
        json=order_data
    )

    assert response.status_code == 200

    data = response.json()

    assert data["success"] is True
    assert "orderId" in data
    assert data["status"] == "accepted"


def test_create_empty_order():

    order_data = {
        "customer": {
            "firstName":
            "Karol",

            "phone":
            "123456789",

            "email":
            "karol@test.pl",

            "address":
            "Warszawska 1",

            "city":
            "Warszawa"
        },

        "comment":
        "Test order",

        "promoCode":
        None,

        "items": []
    }

    response = client.post(
        "/api/orders/create",
        json=order_data
    )

    assert response.status_code == 400


def test_get_orders():

    response = client.get(
        "/api/orders"
    )

    assert response.status_code == 200

    data = response.json()

    assert isinstance(
        data,
        list
    )