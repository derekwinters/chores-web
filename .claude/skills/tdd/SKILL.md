---
name: tdd
description: Guide Test-Driven Development using red-green-refactor cycle
---

# TDD Skill

Guides Test-Driven Development by following the red-green-refactor cycle strictly.

## Usage

```
/tdd <feature description>
```

## Red-Green-Refactor Cycle

### Step 1: Red — Write Failing Test
- Ask user for expected behavior (if vague)
- Identify correct test file location:
  - Frontend: `frontend/src/**/*.test.*`
  - Backend: `backend/tests/`
- Write smallest test that captures desired behavior
- Run test suite to confirm failure (not syntax error)
- Frontend: `cd frontend && npm test`
- Backend: `cd backend && pytest`

### Step 2: Green — Write Minimum Code
- Write only code needed to pass the test
- No extra logic, edge cases, or abstractions
- Run tests again to confirm passing

### Step 3: Refactor
- Review implementation and test for clarity
- Remove duplication if present
- Do NOT add new behavior during refactor
- Run tests after each change

## Iteration

After completing cycle, ask user if more behaviors to test.
Repeat from Step 1 for each behavior.

## Key Rules

- Write test BEFORE implementation
- Minimum viable implementation per test
- Green state maintained after refactor
- No scope creep during refactor
- One behavior per test cycle
