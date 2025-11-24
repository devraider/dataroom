from typing import Optional

import jwt
from passlib.context import CryptContext

from backend.src.config.settings import app_settings

PWD_CONTEXT = CryptContext(schemes=["bcrypt"], deprecated="auto")



def verify_token(token: str) -> Optional[dict]:
    """Verify and decode JWT token

    Args:
        token: JWT token to verify

    Returns:
        dict: Decoded token payload or None if invalid
    """
    try:
        payload = jwt.decode(token, app_settings.SECRET_KEY.get_secret_value(), algorithms=[app_settings.ALGORITHM])
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
