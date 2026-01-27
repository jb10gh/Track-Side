# 📝 Agent Scratchpad

**Usage:**
- Append new notes at the bottom.
- Use the format: `## [YYYY-MM-DD] Topic`
- **Refactor Rule:** If a note here is useful for the long term, move it to `knowledge/` and delete it from here.

---

## [2026-01-26] Context System Initialization
- Created `.context/` structure.
- Implemented `scripts/context-refresh.cjs` to auto-generate `active/` files.
- **Action:** Before starting a big task, run `npm run context:refresh` to ensure `active/` is up to date.
