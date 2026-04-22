Validate and maintain the MkDocs configuration for this project.

## Context

- Config: `mkdocs.yml` at repo root
- Docs: `docs/` directory
- Build runs with `--strict` — every file in `docs/` **must** appear in the `nav` or the build aborts
- Dependencies: `docs/requirements.txt` (mkdocs-material==9.5.50, mkdocstrings[python])

## When invoked

1. Find all `.md` files under `docs/` (recursive, ignore `requirements.txt`)
2. Parse the `nav` section of `mkdocs.yml` and collect every referenced file path
3. Report any `docs/` files **not** in nav — these will break `--strict` builds
4. Report any nav entries that reference files that **don't exist**
5. If the user asks to fix: add missing files to the appropriate nav section, or create stub files for missing nav entries

## Building locally

```bash
pip install -r docs/requirements.txt mkdocs
mkdocs build --strict
```

## Nav structure (current)

```yaml
nav:
  - Home: index.md
  - API Reference:
    - Overview & Auth: api/index.md
    - Chores: api/chores.md
    - People: api/people.md
    - Points: api/points.md
    - Log: api/log.md
    - Themes: api/themes.md
    - Config & Health: api/config.md
  - Architecture: ARCHITECTURE.md
  - Developer Guide: DEVELOPER.md
  - Deployment: DEPLOYMENT.md
```

## Rules

- Never remove `--strict` from CI workflows (`docs-preview.yml`, `docs-deploy.yml`)
- Every new `.md` file added to `docs/` must be added to nav before committing
- Nav paths are relative to `docs/` — e.g. `api/chores.md` maps to `docs/api/chores.md`
