from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from ..database import get_db
from ..models import Person, Theme
from ..schemas import ThemeOut, ThemeSave, ThemeColors
from ..dependencies import get_current_user

router = APIRouter(prefix="/theme", tags=["theme"])

# Default themes to seed database
DEFAULT_THEMES = {
    "dark": {
        "id": "dark",
        "name": "Dark",
        "colors": {
            "bg": "#080c14",
            "surface": "#16202e",
            "surface2": "#1e2d40",
            "accent": "#73B1DD",
            "success": "#3db87a",
            "warning": "#e8a930",
            "danger": "#e05c6a",
        },
        "is_default": True,
        "is_builtin": True,
    },
    "light": {
        "id": "light",
        "name": "Light",
        "colors": {
            "bg": "#f5f5f5",
            "surface": "#ffffff",
            "surface2": "#eeeeee",
            "accent": "#0066cc",
            "success": "#00aa00",
            "warning": "#ff9900",
            "danger": "#cc0000",
        },
        "is_default": False,
        "is_builtin": True,
    },
    "charcoal": {
        "id": "charcoal",
        "name": "Charcoal",
        "colors": {
            "bg": "#1a1a1a",
            "surface": "#2d2d2d",
            "surface2": "#3a3a3a",
            "accent": "#999999",
            "success": "#999999",
            "warning": "#999999",
            "danger": "#999999",
        },
        "is_default": False,
        "is_builtin": True,
    },
    "paper": {
        "id": "paper",
        "name": "Paper",
        "colors": {
            "bg": "#faf8f3",
            "surface": "#ffffff",
            "surface2": "#f0ede6",
            "accent": "#b8860b",
            "success": "#558b2f",
            "warning": "#e0860b",
            "danger": "#d32f2f",
        },
        "is_default": False,
        "is_builtin": True,
    },
    "pink": {
        "id": "pink",
        "name": "Pink",
        "colors": {
            "bg": "#fce4ec",
            "surface": "#f8bbd0",
            "surface2": "#f48fb1",
            "accent": "#ec407a",
            "success": "#66bb6a",
            "warning": "#ffa726",
            "danger": "#ef5350",
        },
        "is_default": False,
        "is_builtin": True,
    },
    "frog": {
        "id": "frog",
        "name": "Frog",
        "colors": {
            "bg": "#1b4d2e",
            "surface": "#2d6a3e",
            "surface2": "#3d8b52",
            "accent": "#c8e6c9",
            "success": "#9ccc65",
            "warning": "#ffa726",
            "danger": "#ef5350",
        },
        "is_default": False,
        "is_builtin": True,
    },
}


async def seed_default_themes(db: AsyncSession):
    for theme_id, theme_data in DEFAULT_THEMES.items():
        existing = await db.execute(select(Theme).where(Theme.id == theme_id))
        if not existing.scalar_one_or_none():
            theme = Theme(
                id=theme_data["id"],
                name=theme_data["name"],
                colors=theme_data["colors"],
                is_default=theme_data["is_default"],
                is_builtin=theme_data["is_builtin"],
            )
            db.add(theme)
    await db.commit()


@router.get("/list", response_model=list[ThemeOut])
async def list_themes(current_user: str = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    await seed_default_themes(db)
    result = await db.execute(select(Theme))
    themes = result.scalars().all()
    return [ThemeOut(id=t.id, name=t.name, colors=ThemeColors(**t.colors)) for t in themes]


@router.get("/current", response_model=ThemeOut)
async def get_current_theme(current_user: str = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    await seed_default_themes(db)
    result = await db.execute(select(Person).where(Person.username == current_user))
    person = result.scalars().first()

    theme_id = person.preferred_theme if person and person.preferred_theme else None

    if theme_id:
        theme_result = await db.execute(select(Theme).where(Theme.id == theme_id))
        theme = theme_result.scalar_one_or_none()
        if theme:
            return ThemeOut(id=theme.id, name=theme.name, colors=ThemeColors(**theme.colors))

    default_result = await db.execute(select(Theme).where(Theme.is_default == True))
    default_theme = default_result.scalar_one_or_none()
    if default_theme:
        return ThemeOut(id=default_theme.id, name=default_theme.name, colors=ThemeColors(**default_theme.colors))

    dark_result = await db.execute(select(Theme).where(Theme.id == "dark"))
    dark_theme = dark_result.scalar_one()
    return ThemeOut(id=dark_theme.id, name=dark_theme.name, colors=ThemeColors(**dark_theme.colors))


@router.post("/set/{theme_id}", response_model=ThemeOut)
async def set_theme(theme_id: str, current_user: str = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    theme_result = await db.execute(select(Theme).where(Theme.id == theme_id))
    theme = theme_result.scalar_one_or_none()
    if not theme:
        raise HTTPException(status_code=404, detail="Theme not found")

    result = await db.execute(select(Person).where(Person.username == current_user))
    person = result.scalars().first()
    if person:
        person.preferred_theme = theme_id
        db.add(person)
        await db.commit()
        await db.refresh(person)

    return ThemeOut(id=theme.id, name=theme.name, colors=ThemeColors(**theme.colors))


@router.post("/save", response_model=ThemeOut)
async def save_custom_theme(body: ThemeSave, current_user: str = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    custom_count = await db.execute(select(Theme).where(Theme.is_builtin == False))
    theme_id = f"custom_{len(custom_count.scalars().all())}"
    theme = Theme(
        id=theme_id,
        name=body.name,
        colors={
            "bg": body.colors.bg,
            "surface": body.colors.surface,
            "surface2": body.colors.surface2,
            "accent": body.colors.accent,
            "success": body.colors.success,
            "warning": body.colors.warning,
            "danger": body.colors.danger,
        },
        is_default=False,
        is_builtin=False,
    )
    db.add(theme)
    await db.commit()
    return ThemeOut(id=theme.id, name=theme.name, colors=ThemeColors(**theme.colors))


@router.delete("/delete/{theme_id}")
async def delete_theme(theme_id: str, current_user: str = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    theme_result = await db.execute(select(Theme).where(Theme.id == theme_id))
    theme = theme_result.scalar_one_or_none()
    if not theme:
        raise HTTPException(status_code=404, detail="Theme not found")
    if theme.is_builtin:
        raise HTTPException(status_code=400, detail="Cannot delete built-in themes")

    await db.delete(theme)
    await db.commit()
    return {"message": "Theme deleted"}
