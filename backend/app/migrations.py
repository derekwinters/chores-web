"""Database migrations using Alembic."""
import asyncio
import subprocess
import sys
from pathlib import Path
from sqlalchemy.ext.asyncio import AsyncSession

from .database import set_db_status, set_migrations_in_progress, DatabaseStatus


async def apply_migrations(db: AsyncSession):
    """Run pending Alembic migrations."""
    backend_dir = Path(__file__).parent.parent
    set_migrations_in_progress(True)

    try:
        proc = subprocess.run(
            [sys.executable, "-m", "alembic", "upgrade", "head"],
            cwd=backend_dir,
            capture_output=True,
            text=True,
            timeout=30
        )

        if proc.returncode != 0:
            set_db_status(DatabaseStatus.ERROR)
            print(f"Alembic migration warning: {proc.stderr}", file=sys.stderr)
        else:
            set_db_status(DatabaseStatus.READY)
            print("Database migrations applied successfully")
    except (subprocess.TimeoutExpired, FileNotFoundError) as e:
        set_db_status(DatabaseStatus.ERROR)
        print(f"Warning: Could not run migrations: {e}", file=sys.stderr)
    finally:
        set_migrations_in_progress(False)
