{
  "name": "save-implement-plans",
  "description": "Creates a timestamped implementation plan file and checks off implemented items in the official SSV checklist.",
  "trigger": [
    "save implement plan",
    "save implementation plan",
    "create implement plan",
    "check off implemented items",
    "update checklist"
  ],
  "actions": [
    {
      "type": "code",
      "language": "python",
      "purpose": "Generate timestamp, create new implement plan file, cross-reference official checklist, and mark completed items.",
      "code": "import os, datetime, re\n\n# === 1. Generate timestamp ===\nnow = datetime.datetime.now()\nstamp = now.strftime('%m%d%Y_%H%M')\n\n# === 2. Paths ===\nbase_dir = r'C:\\aom_NewXPS\\ClaudeProjects\\stashsnapvault\\updated_docs'\nsave_dir = os.path.join(base_dir, 'saved_implement_plans_done')\nofficial_checklist_path = os.path.join(base_dir, 'codebase_analysis', 'official_docs', 'Master_SSV_CheckList_done.md')\n\n# Ensure save directory exists\nos.makedirs(save_dir, exist_ok=True)\n\n# === 3. Create new file ===\nfilename = f'{stamp}_implement_plan.md'\nfilepath = os.path.join(save_dir, filename)\n\nif os.path.exists(filepath):\n    raise Exception(f'File already exists: {filepath}')\n\n# === 4. Load official checklist ===\nwith open(official_checklist_path, 'r', encoding='utf-8') as f:\n    checklist = f.readlines()\n\n# === 5. Detect implemented items from the conversation ===\n# Claude will pass the implementation summary as {{input}}\nimplemented_text = input_text\nimplemented_items = []\n\nfor line in checklist:\n    item = line.strip('- ').strip()\n    if item and item.lower() in implemented_text.lower():\n        implemented_items.append(item)\n\n# === 6. Build updated checklist with checkmarks ===\nupdated_checklist = []\nfor line in checklist:\n    stripped = line.strip('- ').strip()\n    if stripped in implemented_items:\n        updated_checklist.append(f'- [x] {stripped}\\n')\n    else:\n        updated_checklist.append(line)\n\n# === 7. Write the new implement plan file ===\nwith open(filepath, 'w', encoding='utf-8') as f:\n    f.write('# Implementation Plan\\n')\n    f.write(f'Generated: {stamp}\\n\\n')\n    f.write('## Summary of Implemented Items\\n')\n    for item in implemented_items:\n        f.write(f'- {item}\\n')\n    f.write('\\n---\\n')\n    f.write('## Updated Official Checklist (Auto-Checked)\\n')\n    f.writelines(updated_checklist)\n\nresult = f'Implementation plan saved to: {filepath}'"
    }
  ]
}
