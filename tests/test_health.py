from tests.conftest import client


def test_app_is_running():
    response = client.get("/")

    assert response.status_code == 200
    assert response.json() == {
        "message": "Welcome to MJL foods API"
    }