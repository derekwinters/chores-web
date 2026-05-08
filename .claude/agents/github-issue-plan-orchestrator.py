#!/usr/bin/env python3
"""
GitHub Issue Plan Orchestrator Agent

Coordinates issue planning through exploration, proposal, and refinement.
Persists state in pinned bot comments on issues.
"""

import json
import subprocess
from typing import Optional, Dict, Any, List
from dataclasses import dataclass
from enum import Enum


class State(Enum):
    """Orchestrator state machine states."""
    VALIDATE = 1
    EXPLORE = 2
    PROPOSE = 3
    PAUSE = 4
    REFINE = 5
    FINALIZE = 6
    COMPLETE = 7


@dataclass
class OrchestratorState:
    """Current orchestrator state."""
    issue_number: int
    current_state: State
    progress: int  # 0-7
    history: List[str]  # completed states
    metadata: Dict[str, Any]  # exploration results, proposal, etc.

    def to_comment(self) -> str:
        """Format state as GitHub issue comment."""
        history_str = " → ".join(self.history + [self.current_state.name])
        return f"""@bot-plan-status
Current State: {self.current_state.name}
Progress: {self.progress}/7
History: {history_str}
Next: {self._next_state()}"""

    def _next_state(self) -> str:
        """Get next state after current."""
        try:
            return State(self.current_state.value + 1).name
        except ValueError:
            return "DONE"

    def workflow_diagram(self) -> str:
        """Generate workflow diagram with current state highlighted."""
        states = [
            ("Validate", State.VALIDATE),
            ("Explore", State.EXPLORE),
            ("Propose", State.PROPOSE),
            ("Pause", State.PAUSE),
            ("Refine", State.REFINE),
            ("Finalize", State.FINALIZE),
            ("Complete", State.COMPLETE),
        ]

        # Build top and bottom borders
        top = "┌──────────┐"
        bottom = "└──────────┘"
        current_top = "┏━━━━━━━━━━┓"
        current_bottom = "┗━━━━━━━━━━┛"

        top_line = "  ".join(
            current_top if s[1] == self.current_state else top for s in states
        )
        bottom_line = "  ".join(
            current_bottom if s[1] == self.current_state else bottom for s in states
        )

        # Build content line
        content_parts = []
        for name, state in states:
            if state == self.current_state:
                content_parts.append(f"┃{name:^10}┃")
            else:
                content_parts.append(f"│{name:^10}│")

        content_line = "─▶".join(content_parts)

        return f"""GITHUB ISSUE PLAN WORKFLOW
==========================

{top_line}
{content_line}
{bottom_line}"""


class GitHubIssuePlan:
    """Orchestrator for GitHub issue planning workflow."""

    def __init__(self, issue_number: int):
        self.issue_number = issue_number
        self.state = OrchestratorState(
            issue_number=issue_number,
            current_state=State.VALIDATE,
            progress=0,
            history=[],
            metadata={},
        )

    def run(self) -> Dict[str, Any]:
        """Execute planning workflow."""
        print(self.state.workflow_diagram())
        print()

        while self.state.current_state != State.COMPLETE:
            try:
                self._execute_state()
                self._update_issue_status()
            except Exception as e:
                print(self.state.workflow_diagram())
                print(f"\nError in {self.state.current_state.name}: {e}")
                return {"error": str(e), "state": self.state.current_state.name}

        print(self.state.workflow_diagram())
        return {"success": True, "issue": self.issue_number, "state": "COMPLETE"}

    def _execute_state(self):
        """Execute current state logic."""
        if self.state.current_state == State.VALIDATE:
            self._validate()
        elif self.state.current_state == State.EXPLORE:
            self._explore()
        elif self.state.current_state == State.PROPOSE:
            self._propose()
        elif self.state.current_state == State.PAUSE:
            self._pause()
        elif self.state.current_state == State.REFINE:
            self._refine()
        elif self.state.current_state == State.FINALIZE:
            self._finalize()
        elif self.state.current_state == State.COMPLETE:
            pass

    def _validate(self):
        """[1] Validate issue is ready to plan."""
        # Check issue has ready-to-plan label
        result = self._call_skill("github-issue-validate", self.issue_number)
        self.state.metadata["validation"] = result
        self.state.history.append("validate")
        self.state.progress = 1
        self._transition(State.EXPLORE)

    def _explore(self):
        """[2] Deep exploration of issue and codebase."""
        result = self._call_skill("github-issue-explore", self.issue_number)
        self.state.metadata["exploration"] = result
        self.state.history.append("explore")
        self.state.progress = 2
        self._transition(State.PROPOSE)

    def _propose(self):
        """[3] Generate implementation proposal."""
        result = self._call_skill("github-issue-propose", self.issue_number)
        self.state.metadata["proposal"] = result
        self._post_issue_comment(result.get("proposal", ""))
        self.state.history.append("propose")
        self.state.progress = 3
        self._transition(State.PAUSE)

    def _pause(self):
        """[4] Pause for user review."""
        self.state.history.append("pause")
        print(f"Issue #{self.issue_number} paused waiting for user feedback")
        # Agent would exit here, resume triggered by webhook on new comment

    def _refine(self):
        """[5] Refine proposal based on user feedback."""
        result = self._call_skill("github-issue-refine", self.issue_number)
        self.state.metadata["proposal"] = result
        self._post_issue_comment(result.get("refined_proposal", ""))
        self.state.history.append("refine")
        self.state.progress = 5
        self._transition(State.FINALIZE)

    def _finalize(self):
        """[6] Finalize plan and post to issue."""
        plan = self.state.metadata.get("proposal", {})
        self._post_issue_comment(f"## Final Plan\n\n{plan}")
        # Update labels
        subprocess.run(
            ["gh", "issue", "edit", str(self.issue_number), "--remove-label", "ready-to-plan"],
            check=False,
        )
        subprocess.run(
            ["gh", "issue", "edit", str(self.issue_number), "--add-label", "ready-for-work"],
            check=False,
        )
        self.state.history.append("finalize")
        self.state.progress = 6
        self._transition(State.COMPLETE)

    def _transition(self, next_state: State):
        """Transition to next state."""
        self.state.current_state = next_state

    def _call_skill(self, skill_name: str, issue_number: int, **kwargs) -> Dict[str, Any]:
        """Call a skill (currently stubbed)."""
        print(f"Calling skill: {skill_name} for issue #{issue_number}")
        return {"status": "ok"}

    def _post_issue_comment(self, comment: str):
        """Post comment on GitHub issue."""
        subprocess.run(
            ["gh", "issue", "comment", str(self.issue_number), "--body", comment],
            check=True,
        )

    def _update_issue_status(self):
        """Update pinned status comment."""
        print(self.state.workflow_diagram())
        print()
        status_comment = self.state.to_comment()
        print(f"Status: {status_comment}\n")


def main():
    """Entry point."""
    import sys

    if len(sys.argv) < 2:
        print("Usage: python orchestrator.py <issue-number>")
        sys.exit(1)

    issue_number = int(sys.argv[1])
    plan = GitHubIssuePlan(issue_number)
    result = plan.run()
    print(json.dumps(result, indent=2))


if __name__ == "__main__":
    main()
