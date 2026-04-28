---
name: save-session-summaries
description: Creates a date and timestamped summary of the current Claude session, saved as a .md file in updated_docs/saved-session-summaries-done/
allowed-tools: Write, Read, Bash(date *)
---

# Save Session Summary

Summarize the current Claude conversation and write it to a timestamped `.md` file.

## Steps

### 1. Generate the filename

Use today's date and current time in this format:
```
MMDDYYYY_HHMM_session_summary.md
```

For today's date, use the `currentDate` from context. For the time, use the current local time. If the time is unavailable, use `0000`.

Example filename: `04022026_1445_session_summary.md`

### 2. Build the summary content

Review the full conversation and produce a structured Markdown document with the following sections:

```markdown
# Session Summary — MM/DD/YYYY HH:MM

## Overview
One paragraph describing what was worked on and the overall goal of the session.

## Work Completed
Bulleted list of every discrete task or change completed (file edits, features built, bugs fixed, decisions made).

## Key Decisions & Findings
Any architectural decisions, root causes uncovered, or important findings discovered during the session.

## Files Changed
List of all files created or modified, with a brief note on what changed.

## Pending / Next Steps
Any outstanding items, TODOs, or follow-up tasks explicitly mentioned during the session.

## Notes
Anything else worth preserving — errors encountered, context for future sessions, caveats.
```

### 3. Write the file

Save the summary to:
```
C:\aom_NewXPS\ClaudeProjects\stashsnapvault\updated_docs\saved_session_summaries_done\<filename>
```

Use the `Write` tool directly. Do **not** use Bash or shell redirection.

### 4. Confirm

After writing, report the full saved file path to the user.

## Notes

- This skill is **manual only** — never triggered automatically
- Do not summarize speculative or hypothetical conversation threads — only work actually done
- Keep the summary factual and concise; future-you should be able to reconstruct what happened from this file alone
- If the session was short or exploratory with no concrete changes, say so explicitly in the Overview
