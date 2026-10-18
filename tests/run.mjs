import test from 'node:test';
import assert from 'node:assert/strict';

import {diffTables} from '../scripts/diff.mjs';
test('reordering is ignored but scalar types remain significant',()=>{
 assert.deepEqual(diffTables([['id','v'],[1,'a'],[2,'b']],[['v','id'],['b',2],['a',1]],'id'),[]);
 const changes=diffTables([['id','v'],[1,1]],[['id','v'],[1,'1']],'id');assert.equal(changes[0].type,'modified');
});
test('empty tables retain structural changes; null differs from absent',()=>{
 assert.deepEqual(diffTables([['id']],[['id','x']],'id'),[{kind:'column',column:'x',type:'added'}]);
 assert.equal(diffTables([['id'],[1]],[['id','x'],[1,null]],'id')[1].after,null);
});
test('ambiguous keys, unsupported objects and malformed tables fail',()=>{
 for(const t of [[['id'],[1],[1]],[['id'],['']],[['id','id']],[['id'],[{}]],[['id','v'],[1]]])assert.throws(()=>diffTables(t,[['id']],'id'));
 assert.equal(diffTables([['id'],[1]],[['id'],['1']],'id').filter(x=>x.kind==='row').length,2);
});
