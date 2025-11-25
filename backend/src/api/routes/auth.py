from datetime import timedelta

import httpx
import jwt
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select

from backend.src.api.auth.security import get_current_user
from backend.src.config.settings import app_settings
from backend.src.database.session import get_session
from backend.src.models.user import User
from backend.src.schemas.auth import (
    GoogleLoginRequest,
    GoogleLoginResponse,
    TokenResponse,
)
from backend.src.schemas.user import UserResponse
from backend.src.types.date import utc_now

auth_router = APIRouter(prefix="/auth", tags=["auth"])


@auth_router.post("/google", response_model=TokenResponse)
async def google_login(
    request: GoogleLoginRequest,
    session: Session = Depends(get_session),
):
    """Login with Google OAuth
    Verifies Google ID token, creates/finds user, and returns JWT access token.
    
    Args:
        request: Google login request with JWT credential
        session: Database session
        
    Returns:
        TokenResponse: Access token and user info
    """
    try:
        # Verify Google token using Google's tokeninfo endpoint
        async with httpx.AsyncClient() as client:
            response = await client.get(
                "https://oauth2.googleapis.com/tokeninfo",
                params={"id_token": request.credential},
                timeout=10.0,
            )
            
            if response.status_code != 200:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid Google token",
                )
            
            token_info = response.json()

        google_login_response = GoogleLoginResponse.model_validate(token_info)

        # Validate token audience
        if google_login_response.audience != app_settings.GOOGLE_CLIENT_ID:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=f"Invalid token audience. Got: {token_info.get('aud')}, Expected: {app_settings.GOOGLE_CLIENT_ID}",
            )

        # Validate email verification
        if not google_login_response.email_verified:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email not verified",
            )
        
        if not google_login_response.email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email not provided",
            )
        
        # Find or create user
        user = session.exec(
            select(User).where(User.google_user_id == google_login_response.user_id)
        ).first()
        
        if not user:
            user = User(
                email=google_login_response.email,
                full_name=google_login_response.name,
                google_user_id=google_login_response.user_id,
                google_picture=google_login_response.picture,
            )
            session.add(user)
            session.commit()
            session.refresh(user)
        
        # Generate JWT token
        token_data = {
            "sub": str(user.id),
            "email": user.email,
            "exp": utc_now() + timedelta(minutes=app_settings.ACCESS_TOKEN_EXPIRE_MINUTES),
        }
        
        access_token = jwt.encode(
            token_data,
            app_settings.SECRET_KEY.get_secret_value(),
            algorithm=app_settings.ALGORITHM
        )
        
        return TokenResponse(
            token=access_token,
            user=UserResponse(id=user.id,
                              email=user.email, name=user.full_name,
                              picture=user.google_picture)
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Authentication failed: {str(e)}",
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
