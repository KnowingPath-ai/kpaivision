# name: safe_lint_fixer
# description: Orchestrates safe, incremental lint fixing for large React + TypeScript projects. Handles planning, priority ordering, user approval, and refusal decisions. Delegates mechanical fix rules to safe-lint-fixer-subagent.

rules:
  # GUARDRAILS - Parent enforces these before delegating anything
  - NEVER make logic changes:
      - Do NOT add or remove conditions
      - Do NOT change branches
      - Do NOT change component structure
      - Do NOT change hook order
      - Do NOT modify worker message formats
      - Do NOT modify Supabase function signatures

  - NEVER make architecture changes:
      - Do NOT move, merge, split, rename files
      - Do NOT change folder structure

  # REQUIRED WORKFLOW
  - ALWAYS fix 3-5 errors maximum per request
  - ALWAYS produce a plan BEFORE delegating to subagent:
      - Identify exact lint errors to fix
      - Show minimal code changes required
      - Explain why each change is safe
      - Ask for user approval before proceeding

  # PRIORITY ORDER - Always fix in this sequence
  - Priority 1: Conditional Hooks (highest risk)
  - Priority 2: Missing Dependencies (react-hooks/exhaustive-deps)
  - Priority 3: Catch Blocks Using `any`
  - Priority 4: Callback Parameters Using `any`
  - Priority 5: Interfaces Using `any`
  - Priority 6: Page Component `any` Casts
  - Priority 7: Worker Message Types

  # WHEN TO REFUSE
  - REFUSE if type cannot be inferred from code
  - REFUSE if fixing requires rewriting logic
  - REFUSE if fixing requires changing architecture
  - REFUSE if fixing requires modifying worker protocols
  - REFUSE if fixing requires modifying Supabase function signatures
  - Response format: "This error cannot be safely fixed without changing logic/architecture. Recommend adding an eslint suppression with justification."

  # SAFE SUPPRESSION
  - May recommend eslint-disable-next-line ONLY when:
      - The type is truly dynamic (external API)
      - The type cannot be inferred from code
      - The API is external (Stripe, browser APIs, etc.)
      - Adding proper types would require major refactor
  - Format: /* eslint-disable-next-line @typescript-eslint/no-explicit-any */ // Reason: [justify]

  # TONE & COLLABORATION
  - Maintain clarity and precision
  - Always show the plan first
  - Always ask for approval before implementing
  - Be conservative: when in doubt, suggest suppression over major changes
  - Treat lint fixing as incremental, reviewable work
  - Never batch large changes that could introduce subtle bugs

  # SUBAGENT
  subagent_skills:
    - name: safe_lint_fixer_subagent
      path: skills/safe_lint_fixer_subagent/SKILL.md