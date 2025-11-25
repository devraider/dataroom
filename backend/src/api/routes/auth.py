from datetime import timedelta

import jwt
from fastapi import APIRouter, Depends, HTTPException, status
from google.auth.transport import requests as google_requests
from google.oauth2 import id_token
from sqlmodel import Session, select

from backend.src.api.auth.security import get_current_user
from backend.src.config.settings import app_settings
from backend.src.database.session import get_session
from backend.src.models.user import User
from backend.src.schemas.auth import GoogleLoginRequest, TokenResponse
from backend.src.types.date import utc_now

auth_router = APIRouter(prefix="/auth", tags=["auth"])


@auth_router.post("/google", response_model=TokenResponse)
async def google_login(
    request: GoogleLoginRequest,
    session: Session = Depends(get_session),
):
    """Login with Google OAuth
    
    Args:
        request: Google login request with JWT credential
        session: Database session
        
    Returns:
        TokenResponse: Access token and user info
        
    Raises:
        HTTPException: If Google token is invalid
    """
    try:
        # Verify Google JWT token
        client_info = id_token.verify_oauth2_token(
            request.credential,
            google_requests.Request(),
            app_settings.GOOGLE_CLIENT_ID,
        )
        
        # Extract user info from Google token
        email = client_info.get("email")
        name = client_info.get("name", "")
        client_id = client_info.get("sub")
        
        if not email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email not provided by Google",
            )
        
        # Find or create user
        statement = select(User).where(User.email == email)
        user = session.exec(statement).first()
        
        if not user:
            # Create new user
            user = User(id=client_id, email=email, full_name=name)
            session.add(user)
            session.commit()
            session.refresh(user)
        
        # Create our own JWT token
        access_token_expires = timedelta(minutes=app_settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        expire = utc_now() + access_token_expires
        
        token_data = {
            "sub": str(user.id),
            "email": user.email,
            "exp": expire,
        }
        
        access_token = jwt.encode(
            token_data,
            app_settings.SECRET_KEY.get_secret_value(),
            algorithm=app_settings.ALGORITHM
        )
        
        return TokenResponse(
            access_token=access_token,
            token_type="bearer",
            user={
                "id": user.id,
                "email": user.email,
                "full_name": user.full_name,
            },
        )
        
    except ValueError as e:
        # Invalid Google token
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid Google token: {str(e)}",
        )


@auth_router.get("/me")
async def get_me(current_user: User = Depends(get_current_user)) -> User:
    """Get current authenticated user
    
    Args:
        current_user: Current authenticated user from JWT
        
    Returns:
        dict: User information
    """
    return current_user
