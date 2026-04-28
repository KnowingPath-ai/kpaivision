---
name: root-files-auditor
description: Audit all files sitting in the root of a project folder to determine if they are used, referenced, safe to delete, or auto-generated. Trigger this skill when the user wants to clean up their project root, identify unused files, or understand what each root-level file does. Generates a color-coded interactive HTML report showing every file's status and where it is referenced across the codebase.
allowed-tools: Bash(find *), Bash(grep *), Bash(python *), Read(**), Bash(node *)
---

# Root Files Auditor

Scan the project root directory, analyze every file found there, and generate an interactive HTML audit report.

## Steps

### 1. Discover root-level files
Find all files sitting directly in the project root (not in subfolders):
```bash
find . -maxdepth 1 -type f | sort
```

### 2. For each file found, determine

**Usage status:**
- Is it imported or referenced anywhere in `src/`?
- Is it referenced in `package.json`, `vite.config.ts`, `tsconfig.json`, or any config file?
- Is it referenced in any `.html`, `.md`, or `.env` file?
- Is it a build artifact or auto-generated file?
- Is it a dotfile or tool config (`.eslintrc`, `.prettierrc`, `.gitignore`, etc.)?

**Search commands to use:**
```bash
# Check if file is referenced anywhere in the project
grep -r "FILENAME" . --include="*.ts" --include="*.tsx" --include="*.js" --include="*.json" --include="*.html" --include="*.md" --exclude-dir=node_modules --exclude-dir=dist --exclude-dir=.git -l

# Check package.json scripts
grep "FILENAME" package.json
```

### 3. Classify each file into one of these statuses

| Status | Meaning | Row Color |
|---|---|---|
| **Used** | Actively imported or referenced in codebase | 🔴 Red — keep |
| **Config** | Tool or build configuration file | 🟡 Yellow — review before deleting |
| **Auto-generated** | Created by build tools, never edit manually | 🟡 Yellow — safe but check |
| **Unused** | No references found anywhere | 🟢 Green — safe to delete |
| **Unknown** | Could not determine — needs manual review | 🟡 Yellow — review needed |

### 4. Generate the HTML report

Save as `root-files-audit.html` in the project root.

The report must include:
- **Summary bar** at the top: total files, used count, unused count, safe-to-delete count
- **Filterable table** with buttons: All / Used / Unused / Config / Auto-generated
- **Columns:** File Name | Size | Type | Status | Referenced In | Safe to Delete?
- **Color-coded rows:** green = safe to delete, yellow = review, red = keep
- **Expandable references:** click a file row to expand and see exactly which files reference it
- **Export button:** copy the unused files list to clipboard

## Output

```
root-files-audit.html   ← generated in project root
```

Open it in your browser for the full interactive report.

## Notes

- Always exclude `node_modules/`, `dist/`, `.git/` from searches
- Common auto-generated files: `package-lock.json`, `yarn.lock`, `pnpm-lock.yaml`, `.DS_Store`, `Thumbs.db`
- Common config files that should never be deleted: `.gitignore`, `.env.example`, `tsconfig.json`, `vite.config.ts`, `package.json`
- If a file has no extension, check if it is a script or binary before marking as unused
- Always warn before suggesting deletion of any `.env` file
