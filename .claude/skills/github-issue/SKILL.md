---
name: github-issue
description: Automates GitHub issue workflow - branch creation, implementation, testing, docker rebuild, and PR creation
---

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
- Fetch issue details from GitHub
- Determine commit type based on issue context:
  - `fix:` for bugs
  - `feat:` for features
  - `refactor:` for code improvements
  - `docs:` for documentation
  - `test:` for tests
- Update main branch
- Create branch `<type>-issue-XX` (e.g., `fix-issue-41`)
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
<type>: <description> (#issue-number)

Additional details about changes, decisions made, or context.

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>
```

Where `<type>` is determined from issue context:
- `feat` - New feature or enhancement
- `fix` - Bug fix
- `refactor` - Code restructuring without behavior change
- `docs` - Documentation updates
- `test` - Test-only changes
- `chore` - Build, deps, or tooling

## Examples

```
/github-issue 41
```
Analyzes issue #41, determines it's a bug fix, creates `fix-issue-41` branch

```
/github-issue 46
```
Analyzes issue #46, determines it's a feature, creates `feat-issue-46` branch

## Notes

- All tests must pass before creating PR
- Docker containers must be restarted after rebuild
- Each step has manual confirmation option
- Can abort at any time
