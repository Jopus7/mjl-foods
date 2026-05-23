from datetime import (
    datetime,
    timedelta
)

from jose import jwt

from fastapi import (
    Depends,
    HTTPException
)

from fastapi.security import (
    OAuth2PasswordBearer
)

SECRET_KEY = "super-secret-key"

ALGORITHM = "HS256"

ACCESS_TOKEN_EXPIRE_MINUTES = 60

ADMIN_USERNAME = "admin"
ADMIN_PASSWORD = "admin123"

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/api/auth/login"
)


def create_access_token(
    data: dict
):
    to_encode = data.copy()

    expire = (
        datetime.utcnow()
        + timedelta(
            minutes=
            ACCESS_TOKEN_EXPIRE_MINUTES
        )
    )

    to_encode.update({
        "exp": expire
    })

    return jwt.encode(
        to_encode,
        SECRET_KEY,
        algorithm=ALGORITHM
    )


def authenticate_admin(
    username: str,
    password: str
):
    return (
        username == ADMIN_USERNAME
        and
        password == ADMIN_PASSWORD
    )


def verify_token(
    token: str = Depends(
        oauth2_scheme
    )
):
    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        username = payload.get("sub")

        if username != ADMIN_USERNAME:
            raise HTTPException(
                status_code=403,
                detail="Access denied"
            )

        return username

    except Exception:
        raise HTTPException(
            status_code=401,
            detail="Invalid token"
        )