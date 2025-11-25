
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select

from backend.src.api.auth.security import get_current_user
from backend.src.database.session import get_session
from backend.src.models.user import User
from backend.src.models.workspace import Workspace, WorkspaceMember
from backend.src.schemas.workspace import (
    WorkspaceCreate,
    WorkspaceMemberResponse,
    WorkspaceResponse,
)
from backend.src.types.roles import RoleEnum

workspace_router = APIRouter(prefix="/workspaces", tags=["workspaces"])


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