from fastapi import (
    APIRouter,
    HTTPException,
    Depends
)

from fastapi.security import (
    OAuth2PasswordRequestForm
)

from app.auth.auth import (
    authenticate_admin,
    create_access_token
)

router = APIRouter()


@router.post("/api/auth/login")
def login(
    form_data:
    OAuth2PasswordRequestForm =
    Depends()
):
    is_valid = authenticate_admin(
        form_data.username,
        form_data.password
    )

    if not is_valid:
        raise HTTPException(
            status_code=401,
            detail=
            "Invalid credentials"
        )

    token = create_access_token(
        {
            "sub":
            form_data.username
        }
    )

    return {
        "access_token":
        token,
        "token_type":
        "bearer"
    }