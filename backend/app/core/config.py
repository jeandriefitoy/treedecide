from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    upload_dir: str = "uploads"
    max_preview_rows: int = 10

    cors_origins: list[str] = [
        "http://localhost:3000",
        "https://treedecide.hendrianyudhapratama.my.id",
    ]

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
    )


settings = Settings()