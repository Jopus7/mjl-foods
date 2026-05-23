from tests.conftest import client


def test_login_success():
    login_data = {
        "username": "admin",
        "password": "admin123"
    }

    response = client.post(
        "/api/auth/login",
        data=login_data
    )

    assert response.status_code == 200

    response_data = response.json()

    assert "access_token" in response_data
    assert response_data["token_type"] == "bearer"


def test_login_invalid_password():
    login_data = {
        "username": "admin",
        "password": "wrongpassword"
    }

    response = client.post(
        "/api/auth/login",
        data=login_data
    )

    assert response.status_code == 401


def test_login_missing_password():
    login_data = {
        "username": "admin"
    }

    response = client.post(
        "/api/auth/login",
        data=login_data
    )

    assert response.status_code == 422