# Chores-Web Issue Workflow Reference

## Repository Structure

```
chores-web/
├── frontend/          # React app
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── api/
│   │   └── __tests__/
│   ├── package.json
│   └── vite.config.js
├── backend/           # FastAPI
│   ├── app/
│   │   ├── routers/
│   │   ├── services/
│   │   └── models.py
│   └── requirements.txt
├── docker-compose.yml
└── .claude/
    └── skills/github-issue/
```

## Key Commands

### Testing
```bash
cd frontend && npm test
```

### Docker
```bash
docker compose build
docker compose down -t 2
docker compose up -d
```

### Git
```bash
git checkout -b feat-issue-<number>
git add -A
git commit -m "message"
git push -u origin feat-issue-<number>
gh pr create --title "..." --body "..."
```

## Test File Patterns

- Component tests: `src/__tests__/<Component>.test.jsx`
- Update tests when modifying components
- All 243+ tests must pass before PR

## Docker Containers

- frontend: React app on port 3000
- backend: FastAPI on port 8000  
- db: PostgreSQL on port 5432

Wait 5 seconds after `docker compose up -d` before declaring ready.

## Common Issue Types

### Feature Additions (#43, #46)
- Add component props/handlers
- Update CSS styling
- Integrate with API
- Test new functionality
- May require multiple components

### Bug Fixes (#41)
- Identify root cause first
- Minimal code changes
- Verify fix doesn't break tests
- Test with real data if possible

### Refactoring
- Preserve existing behavior
- Update tests to match new structure
- Verify all tests still pass

## API Integration

Backend endpoints used:
- POST `/chores/{id}/complete` - Mark chore complete
- POST `/chores/{id}/skip` - Skip chore
- POST `/chores/{id}/mark-due` - Mark chore due now

Frontend client functions:
```javascript
export const completeChore = (id, completedBy) => ...
export const skipChore = (id) => ...
export const markDueChore = (id) => ...
```

## Commit Message Template

```
<type>: Brief description (#issue-number)

Longer description of changes, why they were made, and any
important implementation details.

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>
```

### Commit Types

- **feat:** New feature or enhancement to existing feature
  ```
  feat: Add complete and skip buttons to chores (#46)
  ```

- **fix:** Bug fix
  ```
  fix: Set default points to 1 instead of 0 (#41)
  ```

- **refactor:** Code restructuring without behavior changes
  ```
  refactor: Extract chore sorting logic to utility
  ```

- **docs:** Documentation updates
  ```
  docs: Update README with setup instructions
  ```

- **test:** Test additions or modifications
  ```
  test: Add integration tests for auth flow
  ```

- **chore:** Build, dependencies, tooling
  ```
  chore: Update dependencies
  ```

## PR Description Template

```
## Summary
- Bullet points of changes
- One per major feature/fix

## Test plan
- [x] All tests pass
- [x] Manual testing done
- [x] Docker containers running
- [x] Specific feature tested

## Notes
- Any decisions made
- Trade-offs considered
- Known limitations

🤖 Generated with [Claude Code](https://claude.com/claude-code)
```

## Troubleshooting

### Tests fail after code change
1. Check test error message
2. Update test expectations if needed
3. Fix implementation code
4. Re-run tests

### Docker won't start
1. Check port conflicts: `lsof -i :3000,:8000`
2. Clean up: `docker compose down -v`
3. Rebuild: `docker compose build --no-cache`

### Branch already exists
```bash
git checkout feat-issue-<number>
git pull origin main
# then rebase if needed
```

### Merge conflicts on main
```bash
git fetch origin
git rebase origin/main
# resolve conflicts
git rebase --continue
```
