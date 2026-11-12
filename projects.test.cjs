const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const api = fs.existsSync('./projects.js') ? require('./projects.js') : {};
const repo = (name, extra = {}) => ({name, private:false, fork:false, topics:['portfolio'], updated_at:'2026-01-01', ...extra});
test('只展示满足全部条件的仓库，并按更新日期排序', () => {
  assert.equal(typeof api.selectProjects, 'function');
  const input = [repo('old'),repo('new',{updated_at:'2026-11-01'}),repo('secret',{private:true}),repo('copy',{fork:true}),repo('xuegavin.github.io'),repo('other',{topics:[]}),repo('missing',{topics:null})];
  assert.deepEqual(api.selectProjects(input).map(r=>r.name), ['new','old']);
});
test('读取完整分页，空结果合法', async () => {
  assert.equal(typeof api.fetchRepositories, 'function');
  const rows=Array.from({length:100},(_,i)=>repo('item'+i));
  const result=await api.fetchRepositories(async url=>({ok:true,json:async()=>new URL(url).searchParams.get('page')==='1'?rows:[repo('last')]}));
  assert.equal(result.length,101);
  assert.deepEqual(await api.fetchRepositories(async()=>({ok:true,json:async()=>[]})),[]);
});
test('限流及异常响应不能当作空仓库成功结果', async () => {
  assert.equal(typeof api.fetchRepositories, 'function');
  await assert.rejects(api.fetchRepositories(async()=>({ok:false,status:403})), /403/);
  await assert.rejects(api.fetchRepositories(async()=>({ok:true,json:async()=>({message:'error'})})), /数据/);
});
