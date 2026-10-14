import assert from 'node:assert/strict';
import ts from 'typescript';
import fs from 'node:fs';
const compile=p=>ts.transpileModule(fs.readFileSync(p,'utf8'),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022}}).outputText;
const url=s=>'data:text/javascript;base64,'+Buffer.from(s).toString('base64');
const categoryUrl=url(compile('lib/categories.ts'));
const {puzzle}=await import(url(compile('lib/puzzles.ts').replaceAll('./categories',categoryUrl)));
const {properties}=await import(url(compile('lib/properties.ts')));
const origin=process.env.WORD_WARS_ORIGIN||'http://127.0.0.1:8791';
const post=async x=>{const response=await fetch(origin+'/api/room',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(x)});return {ok:response.ok,...await response.json()}};
for(const theme of ['NFL teams','US states','90s Pop']){
 const created=await post({action:'create',name:'Feature check'});assert.ok(created.ok,created.error);
 const session={code:created.room.code,token:created.token};
 const settings=await post({...session,action:'settings',themes:[theme,'NHL teams','90s R&B']});assert.ok(settings.ok,settings.error);
 const start=await post({...session,action:'start'});assert.ok(start.ok,start.error);assert.ok(start.room.solo);
 const early=await post({...session,action:'hint',board:0,index:0});assert.ok(!early.ok);assert.match(early.error,/30 seconds/);
 for(let i=0;i<12;i++){
  const result=await post({...session,action:'answer',board:0,index:i,answer:puzzle(theme,i).answer});assert.ok(result.ok,result.error);
  assert.equal(result.room.solved[0],i+1);assert.ok(result.room.log[0].includes(properties[i]));
  assert.equal(result.room.status,i===11?'finished':'playing');
  if(i===11)assert.equal(result.room.winner,0);
 }
}
console.log('Passed live API: new sports/state/song categories, 12-puzzle solo victory (not 11), named property awards, and early hint rejection.');
