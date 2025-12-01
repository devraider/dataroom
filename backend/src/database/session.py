from collections.abc import Generator

from sqlmodel import Session, SQLModel, create_engine

from backend.src.config.settings import app_settings, database_settings

engine = create_engine(
    database_settings.db_url,
    echo=app_settings.DEBUG,
    pool_pre_ping=True,
    pool_size=5,
    max_overflow=10,
)


def create_db_and_tables() -> None:
    """Create database and tables
    Returns:
        None: Create database and tables
    """
    SQLModel.metadata.create_all(engine)


def get_session() -> Generator[Session]:
    """Create a new database session
    Context manager that yields a SQLModel Session object.
    Yields:
        Generator[Session, None, None]: SQLModel Session object
    """
    with Session(engine) as session:
        yield session
