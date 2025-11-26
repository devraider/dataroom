
import shutil

from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select

from backend.src.api.auth.security import get_current_user
from backend.src.api.routes.files import files_router
from backend.src.config.settings import app_settings
from backend.src.database.session import get_session
from backend.src.models.user import User
from backend.src.models.workspace import Workspace, WorkspaceMember
from backend.src.schemas.workspace import (
    WorkspaceAddMember,
    WorkspaceCreate,
    WorkspaceMemberResponse,
    WorkspaceResponse,
)
from backend.src.types.roles import RoleEnum

workspace_router = APIRouter(prefix="/workspaces", tags=["workspaces"])

# Include files subrouter
workspace_router.include_router(
    files_router,
    prefix="/{workspace_id}/files",
    tags=["files"]
)


@workspace_router.get("/", response_model=list[WorkspaceResponse])
def get_workspaces(
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
    skip: int = 0,
    limit: int = 100,
):
    """Get workspaces for the current authenticated user"""
    statement = (
        select(Workspace)
        .join(WorkspaceMember)
        .where(WorkspaceMember.user_id == current_user.id)
        .offset(skip)
        .limit(limit)
    )
    workspaces = session.exec(statement).all()

    response = []
    for workspace in workspaces:
        members = [
            WorkspaceMemberResponse(
                id=member.user.id,
                email=member.user.email,
                name=member.user.full_name,
                picture=member.user.google_picture,
                role=member.role
            )
            for member in workspace.members
        ]
        response.append(
            WorkspaceResponse(
                id=workspace.id,
                name=workspace.name,
                description=workspace.description,
                created_at=workspace.created_at,
                updated_at=workspace.updated_at,
                created_by=workspace.created_by,
                members=members
            )
        )
    
    return response


@workspace_router.post("/", response_model=WorkspaceResponse)
def create_workspace(
    workspace: WorkspaceCreate,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    """Create a new workspace and add the current user as admin"""

    new_workspace = Workspace(
        name=workspace.name,
        description=workspace.description,
        created_by=current_user.id
    )
    session.add(new_workspace)
    session.commit()
    session.refresh(new_workspace)

    # Add creator as ADMIN member
    workspace_member = WorkspaceMember(
        workspace_id=new_workspace.id,
        user_id=current_user.id,
        role=RoleEnum.ADMIN
    )
    session.add(workspace_member)
    session.commit()
    session.refresh(workspace_member)

    return WorkspaceResponse(
        id=new_workspace.id,
        name=new_workspace.name,
        description=new_workspace.description,
        created_at=new_workspace.created_at,
        updated_at=new_workspace.updated_at,
        created_by=new_workspace.created_by,
        members=[
            WorkspaceMemberResponse(
                id=current_user.id,
                email=current_user.email,
                name=current_user.full_name,
                picture=current_user.google_picture,
                role=RoleEnum.ADMIN
            )
        ]
    )


@workspace_router.put("/{workspace_id}", response_model=WorkspaceResponse)
def update_workspace(
    workspace_id: int,
    workspace: WorkspaceCreate,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    """Update an existing workspace"""
    existing_workspace = session.get(Workspace, workspace_id)
    if not existing_workspace:
        raise HTTPException(status_code=404, detail="Workspace not found")

    existing_workspace.name = workspace.name
    existing_workspace.description = workspace.description
    session.add(existing_workspace)
    session.commit()
    session.refresh(existing_workspace)

    members = [
        WorkspaceMemberResponse(
            id=member.user.id,
            email=member.user.email,
            name=member.user.full_name,
            picture=member.user.google_picture,
            role=member.role
        )
        for member in existing_workspace.members
    ]

    return WorkspaceResponse(
        id=existing_workspace.id,
        name=existing_workspace.name,
        description=existing_workspace.description,
        created_at=existing_workspace.created_at,
        updated_at=existing_workspace.updated_at,
        created_by=existing_workspace.created_by,
        members=members
    )


@workspace_router.delete("/{workspace_id}")
def delete_workspace(
    workspace_id: int,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
) -> None:
    """Delete a workspace"""
    existing_workspace = session.get(Workspace, workspace_id)
    if not existing_workspace:
        raise HTTPException(status_code=404, detail="Workspace not found")

    workspace_dir = app_settings.STORAGE_BASE_PATH / str(workspace_id)
    if workspace_dir.exists():
        try:
            shutil.rmtree(workspace_dir)
        except Exception as e:
            print(f"Warning: Failed to delete workspace directory: {str(e)}")

    session.delete(existing_workspace)
    session.commit()

    return

@workspace_router.post("/{workspace_id}/members", response_model=WorkspaceResponse)
def add_workspace_member(
    workspace_id: int,
    member: WorkspaceAddMember,
    session: Session = Depends(get_session),
):
    """Add a member to a workspace by email (creates user if needed)"""
    existing_workspace = session.get(Workspace, workspace_id)
    if not existing_workspace:
        raise HTTPException(status_code=404, detail="Workspace not found")

    # Try to find existing user by email
    user_to_add = session.exec(select(User).where(User.email == member.email)).first()
    
    if not user_to_add:
        # User doesn't exist yet - store email for invitation
        # For now, we'll reject until they sign up
        raise HTTPException(
            status_code=404, 
            detail="User not found. They need to sign up first before being added to a workspace."
        )

    # Check if user is already a member
    existing_member = session.exec(
        select(WorkspaceMember).where(
            WorkspaceMember.workspace_id == workspace_id,
            WorkspaceMember.user_id == user_to_add.id
        )
    ).first()
    if existing_member:
        raise HTTPException(status_code=400, detail="User is already a member")

    workspace_member = WorkspaceMember(
        workspace_id=workspace_id,
        user_id=user_to_add.id,
        role=member.role
    )
    session.add(workspace_member)
    session.commit()
    session.refresh(existing_workspace)

    members = [
        WorkspaceMemberResponse(
            id=m.user.id,
            email=m.user.email,
            name=m.user.full_name,
            picture=m.user.google_picture,
            role=m.role
        )
        for m in existing_workspace.members
    ]

    return WorkspaceResponse(
        id=existing_workspace.id,
        name=existing_workspace.name,
        description=existing_workspace.description,
        created_at=existing_workspace.created_at,
        updated_at=existing_workspace.updated_at,
        created_by=existing_workspace.created_by,
        members=members
    )