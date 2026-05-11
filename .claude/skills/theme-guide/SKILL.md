---
name: theme-guide
description: Reference guide for the 9-color theme system. Ensures all implementation uses CSS custom properties instead of hardcoded values.
---

# Theme Guide

This skill documents the unified 9-color theme system used throughout the application. Always use the CSS custom properties below instead of hardcoded hex values. Hardcoded colors break theme switching and are not allowed in new code.

## The 9 Theme Colors

| CSS Variable    | Purpose                                              | Default (Dark)  |
|-----------------|------------------------------------------------------|-----------------|
| `--bg`          | Page background                                      | `#080c14`       |
| `--surface`     | Card / panel background (layer 1)                   | `#16202e`       |
| `--surface2`    | Slightly elevated surface (layer 2), inputs, tags   | `#1e2d40`       |
| `--accent`      | Highlights, links, focus rings, active borders      | `#73B1DD`       |
| `--primary`     | Primary buttons and interactive controls            | `#3574B3`       |
| `--secondary`   | Secondary buttons and lower-emphasis controls       | `#4a5568`       |
| `--success`     | Positive states, completion indicators              | `#3db87a`       |
| `--warning`     | Caution states, due-soon indicators                 | `#e8a930`       |
| `--error`       | Destructive actions, validation errors, overdue     | `#e05c6a`       |

## Additional Derived Variables (do not override in themes)

| CSS Variable    | Purpose                                             |
|-----------------|-----------------------------------------------------|
| `--error-rgb`   | RGB components of `--error` for `rgba()` patterns  |
| `--border`      | Border color (not a theme field, stays fixed)       |
| `--text`        | Primary text (auto-computed from `--bg` brightness) |
| `--text-muted`  | Muted text (auto-computed from `--bg` brightness)   |
| `--accent-btn`  | Legacy alias kept for `--primary`; prefer `--primary` in new code |

## Utility Button Classes

These classes are defined in `index.css` and must be used for styled buttons:

| Class          | Color used    | When to use                              |
|----------------|---------------|------------------------------------------|
| `.btn-primary` | `--primary`   | Default action, form submit, confirm     |
| `.btn-secondary` | `--surface2` + border | Cancel, back, neutral actions  |
| `.btn-error`   | `--error`     | Delete, destructive, irreversible action |
| `.btn-warning` | `--warning`   | Caution action                           |

> Note: `.btn-danger` was renamed to `.btn-error`. Never use `.btn-danger` in new code.

## Usage Rules

1. **Never use hardcoded hex values** for colors in CSS or inline styles. Always use `var(--<name>)`.
2. **Use `--primary` for buttons** and interactive elements (not `--accent`).
3. **Use `--accent` for links, highlights, and focus rings** (not `--primary`).
4. **Use `--error` for destructive actions** — never `--danger` (that name no longer exists).
5. **Use `rgba(var(--error-rgb), <alpha>)` for semi-transparent error tints** (e.g. hover backgrounds).
6. **Use `rgba(var(--success-rgb), <alpha>)` pattern if needed** — add `--success-rgb` to `:root` if not present.

## Theme Schema (Backend)

The `ThemeColors` Pydantic model in `backend/app/schemas.py` has exactly 9 fields:

```python
class ThemeColors(BaseModel):
    bg: str
    surface: str
    surface2: str
    accent: str
    primary: str
    secondary: str
    success: str
    warning: str
    error: str
```

When writing tests or API fixtures, all 9 fields must be present. Use `DEFAULT_THEME_COLORS` from `frontend/src/utils/theme.js` as the canonical reference for default values.

## Obtaining Current Colors in JS

```js
import { DEFAULT_THEME_COLORS, getCurrentThemeColors } from "../utils/theme";

// Default values (for tests, initial state):
const defaults = DEFAULT_THEME_COLORS;

// Live values applied to document (for custom theme editor pre-population):
const live = getCurrentThemeColors();
```

## Applying a Theme

```js
import { applyTheme } from "../utils/theme";

applyTheme(themeColors); // sets all 9 CSS custom properties + --error-rgb + text colors
```
