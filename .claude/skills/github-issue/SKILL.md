# GitHub Issue Workflow

Automates the process of addressing GitHub issues in chores-web repository.

## Usage

```
/github-issue <issue-number>
```

## Workflow

1. **Branch creation**: Create `feat-issue-XX` branch from updated main
2. **Implementation**: Address issue requirements
3. **Testing**: Run test suite to verify changes
4. **Docker rebuild**: Build and restart containers
5. **Commit**: Create conventional commit with issue reference
6. **PR creation**: Open pull request to main branch

## Flow Steps

### 1. Prepare Branch
- Update main branch
- Create new branch `feat-issue-XX`
- Verify branch created

### 2. Implementation
- Implement feature based on issue requirements
- Update tests as needed
- Keep changes focused on issue scope

### 3. Verify Tests
- Run full test suite
- Ensure all tests pass
- Check for regressions

### 4. Docker Rebuild
- Build new Docker images
- Stop and restart containers
- Verify containers running

### 5. Commit Changes
- Stage all changes
- Create conventional commit: `feat: <description>`
- Include issue number in message if not in title

### 6. Create Pull Request
- Push branch to origin
- Create GitHub PR
- Link to issue in PR description
- Use conventional commit format for title

## Conventional Commit Format

```
feat: <description> (#issue-number)

Additional details about changes, decisions made, or context.

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>
```

## Example

```
/github-issue 46
```

Creates feat-issue-46 branch and guides through addressing issue #46.

## Notes

- All tests must pass before creating PR
- Docker containers must be restarted after rebuild
- Each step has manual confirmation option
- Can abort at any time
