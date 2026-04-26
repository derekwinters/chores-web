"""Database migrations for schema updates."""
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession


async def apply_migrations(db: AsyncSession):
    """Apply pending migrations. Safe to run multiple times."""
    async with db.begin():
        # Add points_redeemed column if missing (PostgreSQL)
        try:
            await db.execute(text(
                'ALTER TABLE people ADD COLUMN points_redeemed INTEGER NOT NULL DEFAULT 0'
            ))
        except Exception:
            # Column likely already exists, continue
            pass

        # Create redemption_log table if missing
        try:
            await db.execute(text("""
                CREATE TABLE redemption_log (
                    id SERIAL PRIMARY KEY,
                    person_id INTEGER NOT NULL,
                    amount INTEGER NOT NULL,
                    redeemed_by TEXT NOT NULL,
                    timestamp TIMESTAMP WITH TIME ZONE NOT NULL
                )
            """))
        except Exception:
            # Table likely already exists, continue
            pass
