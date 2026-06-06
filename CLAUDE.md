# CLAUDE.md — Developer and AI Agent Reference

## API Versioning Rules

All API routes are versioned under `/api/v1/`. The status endpoints
(`/status/`) are unversioned infrastructure and must not be prefixed.

The current API version is recorded in `API_VERSION` at the repo root.

### Breaking Change Ritual

CI hard-fails when `oasdiff` detects a breaking API change and `API_VERSION`
has not been incremented. To introduce a breaking change:

1. Increment `API_VERSION` (e.g., `1` → `2`).
2. Mount new routes under `/api/v{N}/` alongside existing ones.
3. Run `cd backend && python ../scripts/generate_openapi.py` to update
   `docs/api/openapi.json` (the committed golden snapshot).
4. Commit all three changes together.

An AI given "add a required parameter and update tests" will not automatically
do any of these steps — that is the enforcement guarantee.

### What counts as a breaking change?
- Removing an endpoint or HTTP method
- Adding a required request parameter or body field
- Changing a field type in a response
- Renaming a path parameter
- Removing a response field that clients may depend on

### What does NOT count as a breaking change?
- Adding an optional request parameter
- Adding a new endpoint
- Adding a new optional response field
- Changing error messages (but not error codes)

## Password Reset Flow

When a user has `requires_password_reset = True`, `POST /v1/auth/login`
returns HTTP 403 with body:
```json
{"reset_token": "<short-lived JWT>", "detail": "Password change required"}
```
The client uses this token to call `PUT /v1/auth/password/reset` with the
new password. On success the endpoint returns a normal LoginResponse.

## Auth Log

All authentication events are stored in `auth_log` (not `user_log`):
- `login_succeeded` / `login_failed`
- `password_changed` (self-service and admin)
- `password_reset`
- `user_created`

Available at `GET /v1/auth/log` (admin only).
