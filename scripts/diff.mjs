function key(value) {
  if(value===null)return 'null';
  if(!['string','number','boolean'].includes(typeof value)||(typeof value==='number'&&!Number.isFinite(value)))throw new TypeError('cells must be finite JSON scalars');
  return JSON.stringify([typeof value,value]);
}
function index(table,column) {
  if(!Array.isArray(table)||!table.length||!Array.isArray(table[0]))throw new TypeError('table needs a header');
  const headers=table[0];if(!headers.length||headers.some(h=>typeof h!=='string'||!h.trim())||new Set(headers).size!==headers.length)throw new TypeError('unique nonempty string headers required');
  const ki=headers.indexOf(column);if(ki<0)throw new Error('key column missing');
  const rows=new Map();
  for(const row of table.slice(1)){
    if(!Array.isArray(row)||row.length!==headers.length)throw new TypeError('ragged row');
    row.forEach(key); if(row[ki]===null||row[ki]==='')throw new Error('empty row key');
    const id=key(row[ki]);if(rows.has(id))throw new Error('duplicate row key');
    rows.set(id,new Map(headers.map((h,i)=>[h,row[i]])));
  }
  return {headers,rows};
}
export function diffTables(before,after,column) {
  const a=index(before,column),b=index(after,column),out=[];
  for(const h of new Set([...a.headers,...b.headers]))if(!a.headers.includes(h)||!b.headers.includes(h))out.push({kind:'column',column:h,type:a.headers.includes(h)?'removed':'added'});
  for(const id of new Set([...a.rows.keys(),...b.rows.keys()])){
    const ar=a.rows.get(id),br=b.rows.get(id);
    if(!ar||!br)out.push({kind:'row',key:(ar||br).get(column),type:ar?'removed':'added'});
    for(const h of new Set([...a.headers,...b.headers])){
      const hasA=!!ar?.has(h),hasB=!!br?.has(h);if(!hasA&&!hasB)continue;
      const av=ar?.get(h),bv=br?.get(h);
      if(hasA&&hasB&&key(av)===key(bv))continue;
      out.push({kind:'cell',key:(ar||br).get(column),column:h,type:!hasA?'added':!hasB?'removed':'modified',...(hasA?{before:av}:{}),...(hasB?{after:bv}:{})});
    }
  }
  return out;
}
