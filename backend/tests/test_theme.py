"""Tests for theme endpoints."""
import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import Settings


@pytest.mark.asyncio
async def test_get_default_theme_returns_dark_when_not_set(authenticated_client: AsyncClient):
    """GET /theme/default returns dark theme when no default is set in DB."""
    r = await authenticated_client.get("/theme/default")
    assert r.status_code == 200
    data = r.json()
    assert data["id"] == "dark"
    assert data["name"] == "Dark"


@pytest.mark.asyncio
async def test_set_default_theme_persists_and_returns_theme(authenticated_client: AsyncClient, db: AsyncSession):
    """PUT /theme/default/light persists the default and returns the light theme."""
    r = await authenticated_client.put("/theme/default/light")
    assert r.status_code == 200
    data = r.json()
    assert data["id"] == "light"
    assert data["name"] == "Light"

    # Verify it is now returned by GET
    r2 = await authenticated_client.get("/theme/default")
    assert r2.status_code == 200
    assert r2.json()["id"] == "light"


@pytest.mark.asyncio
async def test_get_current_theme_falls_back_to_db_default(authenticated_client: AsyncClient, db: AsyncSession):
    """GET /theme/current falls back to DB default when user has no preferred_theme."""
    # Set the default to charcoal
    db.add(Settings(key="default_theme", value="charcoal"))
    await db.commit()

    r = await authenticated_client.get("/theme/current")
    assert r.status_code == 200
    data = r.json()
    assert data["id"] == "charcoal"


@pytest.mark.asyncio
async def test_set_default_theme_forbidden_for_non_admin(client: AsyncClient, db: AsyncSession):
    """PUT /theme/default/{theme_id} returns 403 for non-admin users."""
    from app.security import hash_password
    from app.models import Person

    # Enable auth
    db.add(Settings(key="auth_enabled", value="true"))

    # Create a non-admin user
    nonadmin_password = "nonadmin_password_123"
    person = Person(
        name="NonAdmin",
        username="nonadmin",
        password_hash=hash_password(nonadmin_password),
        is_admin=False,
    )
    db.add(person)
    await db.commit()

    # Login as non-admin
    login_r = await client.post("/auth/login", json={"username": "nonadmin", "password": nonadmin_password})
    token = login_r.json()["access_token"]

    r = await client.put("/theme/default/light", headers={"Authorization": f"Bearer {token}"})
    assert r.status_code == 403


@pytest.mark.asyncio
async def test_get_default_theme_forbidden_for_non_admin(client: AsyncClient, db: AsyncSession):
    """GET /theme/default returns 403 for non-admin users."""
    from app.security import hash_password
    from app.models import Person

    # Enable auth
    db.add(Settings(key="auth_enabled", value="true"))

    # Create a non-admin user
    nonadmin_password = "nonadmin_password_123"
    person = Person(
        name="NonAdmin2",
        username="nonadmin2",
        password_hash=hash_password(nonadmin_password),
        is_admin=False,
    )
    db.add(person)
    await db.commit()

    # Login as non-admin
    login_r = await client.post("/auth/login", json={"username": "nonadmin2", "password": nonadmin_password})
    token = login_r.json()["access_token"]

    r = await client.get("/theme/default", headers={"Authorization": f"Bearer {token}"})
    assert r.status_code == 403


@pytest.mark.asyncio
async def test_set_default_theme_not_found(authenticated_client: AsyncClient):
    """PUT /theme/default/{theme_id} returns 404 for unknown theme IDs."""
    r = await authenticated_client.put("/theme/default/nonexistent_theme_id")
    assert r.status_code == 404


@pytest.mark.asyncio
async def test_set_theme_only_sets_personal_preference(authenticated_client: AsyncClient, db: AsyncSession):
    """POST /theme/set/{theme_id} only changes personal preference, not site default."""
    # Set DB default to charcoal first
    db.add(Settings(key="default_theme", value="charcoal"))
    await db.commit()

    # Set personal theme to light
    r = await authenticated_client.post("/theme/set/light")
    assert r.status_code == 200
    assert r.json()["id"] == "light"

    # Verify site default is still charcoal
    r2 = await authenticated_client.get("/theme/default")
    assert r2.status_code == 200
    assert r2.json()["id"] == "charcoal"
