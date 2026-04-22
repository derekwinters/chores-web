Guide the user through Test-Driven Development for the feature described in $ARGUMENTS.

Follow the red-green-refactor cycle strictly:

**Step 1 — Red: Write a failing test**
- Ask the user to describe the expected behavior if $ARGUMENTS is vague
- Identify the correct test file location (frontend: `frontend/src/**/*.test.*`, backend: `backend/tests/`)
- Write the smallest test that captures the desired behavior
- Run the test suite to confirm it fails for the right reason (not a syntax error or import failure)
- Frontend: `cd frontend && npm test`
- Backend: `cd backend && pytest`

**Step 2 — Green: Write minimum implementation**
- Write only enough code to make the failing test pass
- Do not add extra logic, edge cases, or abstractions beyond what the test demands
- Run the test suite again to confirm it passes

**Step 3 — Refactor**
- Review the implementation and test for clarity and duplication
- Refactor if needed, running tests after each change to stay green
- Do not add new behavior during refactor

After completing the cycle, ask the user if there are more behaviors to cover and repeat from Step 1.
