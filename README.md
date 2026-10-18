# csv-table-diff-by-key

**Diff two tables by a key column, not by position: type-sensitive cell changes plus added and removed rows and columns.**

[![test](https://github.com/Kein-chronicle/csv-table-diff-by-key/actions/workflows/test.yml/badge.svg)](https://github.com/Kein-chronicle/csv-table-diff-by-key/actions/workflows/test.yml) ![license](https://img.shields.io/badge/license-MIT-blue.svg) ![dependencies](https://img.shields.io/badge/dependencies-none-brightgreen.svg)

## Why

Exports get reordered. A position-based diff reports everything changed; a keyed one reports what did. Keys are typed (`1` is not `"1"`), so an accidental number-to-text change shows up instead of being hidden.

## Install

**As a Claude Code skill** (Claude uses it when the task matches the skill description):

```sh
git clone https://github.com/Kein-chronicle/csv-table-diff-by-key.git ~/.claude/skills/keyed-table-diff
```

For a single project, clone into `<project>/.claude/skills/keyed-table-diff` instead, then start a new Claude Code session.

**As a library** (Node.js 22+, no dependencies):

```sh
npm install github:Kein-chronicle/csv-table-diff-by-key
```

or copy the one file you need: `scripts/diff.mjs` is self-contained.

**Requires:** Node.js 22+.

## Quick start

Run the quickstart:

```console
$ node examples/quickstart.mjs
{"kind":"column","column":"price","type":"removed"}
{"kind":"column","column":"note","type":"added"}
{"kind":"cell","key":"a","column":"price","type":"removed","before":10}
{"kind":"cell","key":"a","column":"note","type":"added","after":"new"}
{"kind":"cell","key":"b","column":"price","type":"removed","before":20}
{"kind":"cell","key":"b","column":"stock","type":"modified","before":0,"after":3}
{"kind":"cell","key":"b","column":"note","type":"added","after":""}
--- keys are typed: 1 and "1" are different rows
row:removed cell:removed cell:removed row:added cell:added cell:added
```

The output above is real: it is produced by the files in `examples/`.

## API

```js
import { diffTables } from 'csv-table-diff-by-key';

diffTables(
  [['id', 'price'], ['a', 10]],      // before: header row + rows of JSON scalars
  [['id', 'price'], ['a', 12]],      // after
  'id',                              // key column
); // [{ kind:'cell', key:'a', column:'price', type:'modified', before:10, after:12 }]
```

Input is already-parsed arrays (there is no CSV or XLSX parsing, and CSV parsers return strings only, so `1` and `"1"` stay different). Each change is `{ kind: 'column' | 'row' | 'cell', type: 'added' | 'removed' | 'modified', ... }`. Duplicate or empty keys, ragged rows, non-scalar cells and a missing key column throw.

## Limits

- JSON scalars only: no XLSX parsing, formula evaluation, formatting comparison or fuzzy matching.
- Callers should bound input size.

## Related projects

These solve neighbouring problems; use them when they fit better.

- **daff**: a table diff and patch tool for tabular data
- **pandas `DataFrame.compare`**: Python equivalent

## More from the same collection

Small, tested tools that grew out of running AI agents and game/app pipelines for months:

- [**pdf-page-range-parser**](https://github.com/Kein-chronicle/pdf-page-range-parser): Parse "1-3, 5, 8-" page selections into exact ranges without silently sorting or deduplicating, and reject anything ambiguous.
- [**pdf-annotation-rotation**](https://github.com/Kein-chronicle/pdf-annotation-rotation): Rotate PDF/canvas annotations (boxes, lines, ink, source masks) a quarter turn in display coordinates, without mutating the input.
- [**pdf-text-position-table-extract**](https://github.com/Kein-chronicle/pdf-text-position-table-extract): Rebuild a rectangular table from positioned text fragments (x, baseline, size, text), keeping empty cells in place.

## Development

```sh
node --test tests/run.mjs
```

The tests include inputs that are supposed to be rejected, so a green run also shows the checks can fail. See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

MIT. See [LICENSE](LICENSE).

If this saved you a debugging session, a star helps other people find it. Bug reports and failing test cases are even better.

<sub>Keywords: diff, table, csv, spreadsheet, data-comparison, javascript, esm, zero-dependencies</sub>
