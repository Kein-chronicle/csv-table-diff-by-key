import { diffTables } from '../scripts/diff.mjs';

// Columns reordered, one column added, one removed, one row changed - the diff is by key and header, not by position.
const before = [['id', 'price', 'stock'], ['a', 10, 5], ['b', 20, 0]];
const after  = [['stock', 'id', 'note'], [5, 'a', 'new'], [3, 'b', '']];

for (const change of diffTables(before, after, 'id')) console.log(JSON.stringify(change));

console.log('--- keys are typed: 1 and "1" are different rows');
console.log(diffTables([['k', 'v'], [1, 'x']], [['k', 'v'], ['1', 'x']], 'k').map(c => c.kind + ':' + c.type).join(' '));
