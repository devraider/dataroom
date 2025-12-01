import jwt
from fastapi import Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from passlib.context import CryptContext
from sqlmodel import Session, select
from starlette import status

from backend.src.config.settings import app_settings
from backend.src.database.session import get_session
from backend.src.models.token_blacklist import TokenBlacklist
from backend.src.models.user import User

PWD_CONTEXT = CryptContext(schemes=["bcrypt"], deprecated="auto")
SECURITY = HTTPBearer()


def is_token_blacklisted(token: str, session: Session) -> bool:
    """Check if token is blacklisted

    Args:
        token: JWT token to check
        session: Database session

    Returns:
        bool: True if token is blacklisted
    """
    blacklisted = session.exec(select(TokenBlacklist).where(TokenBlacklist.token == token)).first()
    return blacklisted is not None


def verify_token(token: str) -> dict | None:
    """Verify and decode JWT token

    Args:
        token: JWT token to verify

    Returns:
        dict: Decoded token payload or None if invalid
    """
    try:
        payload = jwt.decode(
            token, app_settings.SECRET_KEY.get_secret_value(), algorithms=[app_settings.ALGORITHM]
        )
        return payload
    except jwt.InvalidTokenError:
        return None


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify password against hash

    Args:
        plain_password: Plain text password
        hashed_password: Hashed password

    Returns:
        bool: True if password matches
    """
    return PWD_CONTEXT.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    """Hash password

    Args:
        password: Plain text password

    Returns:
        str: Hashed password
    """
    return PWD_CONTEXT.hash(password)


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(SECURITY),
    session: Session = Depends(get_session),
) -> type[User]:
    """Get current authenticated user from JWT token

    Args:
        credentials: HTTP Authorization credentials with Bearer token
        session: Database session

    Returns:
        User: Authenticated user object

    Raises:
        HTTPException: If token is invalid or user not found
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    token = credentials.credentials

    # Check if token is blacklisted
    if is_token_blacklisted(token, session):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has been revoked",
            headers={"WWW-Authenticate": "Bearer"},
        )

    payload = verify_token(token)

    if payload is None:
        raise credentials_exception

    user_id: int | None = payload.get("sub")
    if user_id is None:
        raise credentials_exception

    user = session.get(User, int(user_id))
    if user is None:
        raise credentials_exception

    return user
