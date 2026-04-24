---
name: mkdocs-validate
description: Validate and maintain MkDocs configuration and documentation files
---

# MkDocs Validate Skill

Validates MkDocs configuration enforcing strict build compliance.

## Usage

```
/mkdocs-validate
```

## Validation Steps

1. **Scan docs directory**: Find all `.md` files recursively
2. **Parse config**: Extract `nav` entries from `mkdocs.yml`
3. **Report missing**: Files in `docs/` not in nav (breaks `--strict`)
4. **Report broken**: Nav entries referencing non-existent files
5. **Fix if requested**: Add missing files to nav or create stubs

## Critical Rules

- Build uses `--strict` — every `docs/` file MUST be in nav
- Build aborts if nav references non-existent file
- Never remove `--strict` from CI workflows
- Every new `.md` file must be in nav before commit

## Config Location

- Main config: `mkdocs.yml` (repo root)
- Docs directory: `docs/`
- Dependencies: `docs/requirements.txt`

## Build Command

```bash
pip install -r docs/requirements.txt mkdocs
mkdocs build --strict
```

## Nav Structure

All files under `docs/` must appear in `mkdocs.yml` nav section.
Paths are relative to `docs/` directory.

Example:
```yaml
nav:
  - Home: index.md
  - API: api/index.md
  - Architecture: ARCHITECTURE.md
```
