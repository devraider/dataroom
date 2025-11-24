from pydantic import SecretStr
from pydantic_settings import BaseSettings, SettingsConfigDict


class DatabaseSettings(BaseSettings):
    model_config = SettingsConfigDict(
        env_prefix="POSTGRES_",
        case_sensitive=True,
    )
    USER: str
    PASSWORD: SecretStr
    HOST: str
    DATABASE: str
    PORT: int

    @property
    def db_url(self) -> str:
        return f"postgresql+psycopg2://{self.USER}:{self.PASSWORD.get_secret_value()}@{self.HOST}:{self.PORT}/{self.DATABASE}"


class AppSettings(BaseSettings):
    DEBUG: bool = False
    SECRET_KEY: SecretStr
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    GOOGLE_CLIENT_ID: str = ""

database_settings = DatabaseSettings()
app_settings = AppSettings()