from collections.abc import Generator
from unittest.mock import AsyncMock, MagicMock, patch

import pytest
from fastapi import status
from fastapi.testclient import TestClient
from sqlmodel import Session, select

from backend.src.models.token_blacklist import TokenBlacklist
from backend.src.models.user import User


@pytest.fixture(autouse=True)
def mock_httpx_client() -> Generator[tuple[MagicMock | AsyncMock, MagicMock]]:
    """Automatically mock httpx.AsyncClient for all tests."""
    with patch("httpx.AsyncClient") as mock_client_class:
        # Default success response
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.json.return_value = {
            "sub": "default_user",
            "email": "default@example.com",
            "email_verified": "true",
            "name": "Default User",
            "aud": "test_google_client_id",
        }

        # Mock the async context manager
        mock_client = AsyncMock()
        mock_client.get = AsyncMock(return_value=mock_response)
        mock_client_class.return_value.__aenter__.return_value = mock_client

        yield mock_client_class, mock_response


async def test_google_login_success_new_user(
    mock_httpx_client, client: TestClient, session: Session
) -> None:
    """Test successful login with a new Google user."""
    _, mock_response = mock_httpx_client

    # Update mock response for this test
    mock_response.json.return_value = {
        "sub": "google_user_123",
        "email": "test@example.com",
        "email_verified": "true",
        "name": "Test User",
        "picture": "https://example.com/photo.jpg",
        "aud": "test_google_client_id",
    }

    response = client.post(
        "/api/auth/google",
        json={"credential": "fake_google_token"},
    )

    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert "token" in data
    assert data["user"]["email"] == "test@example.com"
    assert data["user"]["name"] == "Test User"

    # Verify user was created in database
    user = session.exec(select(User).where(User.email == "test@example.com")).first()
    assert user is not None
    assert user.google_user_id == "google_user_123"


async def test_google_login_success_existing_user(
    mock_httpx_client, client: TestClient, session: Session
) -> None:
    """Test successful login with an existing Google user."""
    _, mock_response = mock_httpx_client

    existing_user = User(
        email="existing@example.com",
        full_name="Existing User",
        google_user_id="google_user_456",
        google_picture="https://example.com/old.jpg",
    )
    session.add(existing_user)
    session.commit()
    session.refresh(existing_user)

    mock_response.json.return_value = {
        "sub": "google_user_456",
        "email": "existing@example.com",
        "email_verified": "true",
        "name": "Existing User",
        "picture": "https://example.com/old.jpg",
        "aud": "test_google_client_id",
    }

    response = client.post(
        "/api/auth/google",
        json={"credential": "fake_google_token"},
    )

    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert "token" in data
    assert data["user"]["email"] == "existing@example.com"


async def test_google_login_invalid_token(
    mock_httpx_client, client: TestClient
) -> None:
    """Test login with invalid Google token."""
    _, mock_response = mock_httpx_client

    # Update mock to return error
    mock_response.status_code = 400

    response = client.post(
        "/api/auth/google",
        json={"credential": "invalid_token"},
    )

    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    assert "Invalid Google token" in response.json()["detail"]


async def test_get_me_success(
    mock_httpx_client, client: TestClient, session: Session
) -> None:
    """Test successfully getting current user info."""
    _, mock_response = mock_httpx_client

    mock_response.status_code = 200
    mock_response.json.return_value = {
        "sub": "google_user_789",
        "email": "me@example.com",
        "email_verified": "true",
        "name": "Me User",
        "picture": "https://example.com/me.jpg",
        "aud": "test_google_client_id",
    }

    login_response = client.post(
        "/api/auth/google",
        json={"credential": "fake_token"},
    )
    token = login_response.json()["token"]

    response = client.get(
        "/api/auth/me",
        headers={"Authorization": f"Bearer {token}"},
    )

    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["email"] == "me@example.com"
    assert data["full_name"] == "Me User"


def test_get_me_unauthorized(client: TestClient) -> None:
    """Test getting current user without authentication."""
    response = client.get("/api/auth/me")
    assert response.status_code == status.HTTP_403_FORBIDDEN


async def test_logout_success(
    mock_httpx_client, client: TestClient, session: Session
) -> None:
    """Test successful logout."""
    _, mock_response = mock_httpx_client

    mock_response.status_code = 200
    mock_response.json.return_value = {
        "sub": "google_user_999",
        "email": "logout@example.com",
        "email_verified": "true",
        "name": "Logout User",
        "picture": "https://example.com/logout.jpg",
        "aud": "test_google_client_id",
    }

    login_response = client.post(
        "/api/auth/google",
        json={"credential": "fake_token"},
    )
    token = login_response.json()["token"]

    response = client.post(
        "/api/auth/logout",
        headers={"Authorization": f"Bearer {token}"},
    )

    assert response.status_code == status.HTTP_200_OK

    blacklisted = session.exec(
        select(TokenBlacklist).where(TokenBlacklist.token == token)
    ).first()
    assert blacklisted is not None


async def test_logout_token_becomes_invalid(
    mock_httpx_client, client: TestClient, session: Session
) -> None:
    """Test that blacklisted token cannot be used."""
    _, mock_response = mock_httpx_client

    # Update mock response for this test
    mock_response.status_code = 200
    mock_response.json.return_value = {
        "sub": "google_user_111",
        "email": "blacklist@example.com",
        "email_verified": "true",
        "name": "Blacklist User",
        "picture": "https://example.com/blacklist.jpg",
        "aud": "test_google_client_id",
    }

    login_response = client.post(
        "/api/auth/google",
        json={"credential": "fake_token"},
    )
    token = login_response.json()["token"]

    client.post(
        "/api/auth/logout",
        headers={"Authorization": f"Bearer {token}"},
    )

    response = client.get(
        "/api/auth/me",
        headers={"Authorization": f"Bearer {token}"},
    )

    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    assert "revoked" in response.json()["detail"].lower()


def test_logout_unauthorized(client: TestClient) -> None:
    """Test logout without authentication."""
    response = client.post("/api/auth/logout")
    assert response.status_code == status.HTTP_403_FORBIDDEN
