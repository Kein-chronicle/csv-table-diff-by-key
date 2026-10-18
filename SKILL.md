---
name: keyed-table-diff
description: Compare keyed tables while preserving scalar types and structural column changes. Use when comparing exported datasets with reordered rows or columns.
---

# keyed-table-diff

Compare keyed tables while preserving scalar types and structural column changes.

## Workflow

1. Confirm the input contract and exclusions below before transforming user data.
2. Import the named exports from `scripts/diff.mjs`. Node.js 22+; no npm dependencies. Browser use requires a modern ES module runtime.
3. Run `node --test tests/run.mjs` from this skill folder. The tests contain concrete inputs, expected outputs and rejection cases.
4. Integrate the pure function into the caller. Surface thrown errors as an invalid input result; do not replace failure with empty success.
5. Preserve the original data and inspect a representative output before adding writes or exports.

## Contract and limits

Input is a header plus rectangular JSON scalar rows. Keys are unique, nonempty and type-sensitive. Output reports changed cells and structural rows/columns. No XLSX parsing, formula evaluation, formatting comparison or fuzzy matching; callers must bound input size.

## Verification

Run `node --test tests/run.mjs` after copying this folder into an agent's skill directory. Keep `scripts/` and `tests/` together; there are no references to a private source repository. The assertions in `tests/run.mjs` are executable usage examples.
