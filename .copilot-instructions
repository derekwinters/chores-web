# Copilot Code Review Instructions

Review all pull requests against these criteria before approving.

## Frontend (React)

### Code Quality
- All components export as default or named exports
- Props typed with TypeScript or JSDoc
- Components use React hooks properly
- No console.log or debug statements in production code
- CSS follows BEM naming: `.component__element--modifier`

### Testing
- New components have test files in `src/__tests__/`
- Tests use React Testing Library (not Enzyme)
- Mock external API calls with `vi.mock()`
- Tests check for user-visible text, not implementation details
- Run `npm test -- --run` shows 205+ tests passing

### React Query
- Proper `queryKey` structure: `["resource", id, filters]`
- `useQuery` for reads, `useMutation` for writes
- `onSuccess`/`onError` callbacks handle side effects
- Cache invalidation is specific, not global
- Loading/error states handled

### Styling
- Use CSS files, not inline styles
- Reference design tokens: `var(--bg)`, `var(--accent)`, etc.
- Responsive design: mobile-first
- No hardcoded colors (use variables)

## Backend (FastAPI/Python)

### Code Quality
- Type hints on all functions
- Docstrings on public functions
- Async/await for database operations
- No blocking I/O in async functions
- Error handling with appropriate HTTP status codes

### API Endpoints
- All endpoints use `get_current_user` dependency
- Responses use Pydantic schemas
- Request validation via schemas (automatic)
- Tags and summaries for Swagger docs
- 404 for missing resources, 400 for bad input

### Database
- Use SQLAlchemy ORM, not raw SQL
- Mapped types with type hints in models.py
- Proper relationships and foreign keys
- Transactions wrap multi-step operations

### Services
- Business logic in `services/` modules
- Action logging via `_log_action()` for user-visible changes
- Services are testable pure functions
- Error messages are user-friendly

## Commits

### Format
- Imperative mood: "add feature", "fix bug", "refactor"
- First line <50 characters
- Body explains WHY, not WHAT
- Blank line between subject and body
- Reference issues: "Fixes #123"

### Example
```
feat: add theme deletion for custom themes

- Add DELETE /theme/delete/{theme_id} endpoint
- Prevent deletion of default themes
- Switch to dark if deleted theme active
- Add confirmation modal with tests

Fixes #42

Frontend tests: 205/205 passing ✓

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>
```

## Testing Requirements

- Frontend: `npm test -- --run` returns 205/205 passing
- No skipped tests (`.skip` or `.todo`)
- Tests cover happy path AND error cases
- Mock external calls, not internal functions

## Documentation

- Update docs/API.md if endpoints change
- Update docs/ARCHITECTURE.md if structure changes
- Docstrings on complex functions
- Comments explain WHY, not WHAT

## Security

- No hardcoded secrets
- Input validation on all user inputs (Pydantic validates)
- Auth checks on sensitive operations
- No SQL injection (use ORM)
- CORS properly configured

## Performance

- Database queries are efficient
- No N+1 problems
- React Query cache is used properly
- Async operations don't block
- Images optimized before commit

## Common Issues to Check

1. ✅ Tests pass completely (205/205)
2. ✅ No console.log in production code
3. ✅ Type hints on functions
4. ✅ Error handling present
5. ✅ Logging for user actions
6. ✅ API documented
7. ✅ Components/services exported properly
8. ✅ Database migrations/schema changes handled
9. ✅ CORS/auth checks in place
10. ✅ Commit message quality

## Approval Criteria

APPROVE only if:
- ✅ All tests pass
- ✅ Code follows patterns
- ✅ No breaking changes without migration
- ✅ Documentation updated
- ✅ Security checks pass
- ✅ Commit messages are clear

REQUEST CHANGES if:
- ❌ Tests fail or missing
- ❌ Console.log present
- ❌ No error handling
- ❌ Schema changes not documented
- ❌ API not documented
- ❌ Commit message unclear
