from typing import Optional

import jwt

from backend.src.config.settings import app_settings


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