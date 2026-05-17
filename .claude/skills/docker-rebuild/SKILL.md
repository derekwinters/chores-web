---
name: docker-rebuild
description: Rebuild a Docker image from a Dockerfile. Run this when you are going to ask the user to "approve to commit and PR, or request changes" after completing a task, or when the user asks for "docker rebuild".
---

Run `bash .claude/skills/docker-rebuild/script.sh` to rebuild the Docker image from the Dockerfile. This is typically done after completing an implementation task, before asking the user to approve for commit and PR, or when the user explicitly requests a "docker rebuild".