'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const handler=require('../api/plan.js');
const {plan,authenticate,configuredTokens,quota}=handler._test;
const TOKEN='fake-test-only-'.repeat(4);
const env={MARK7_DIFY_ENABLED:'true',MARK7_DIFY_API_TOKEN:TOKEN};
async function call(body,authorization=TOKEN,extra=env,options={}){
  const res={headers:{},setHeader(k,v){this.headers[k]=v;},end(s){this.body=JSON.parse(s);}};
  await handler({method:'POST',url:'/api/plan',body,headers:{authorization:'Bearer '+authorization,'content-type':'application/json'}},res,{env:extra,...options});
  return res;
}
test('planner is plan-only and returns human approval',()=>{
 const r=plan({goal:'Create a store',kind:'ecommerce'});
 assert.equal(r.mode,'plan-only');assert.equal(r.requires_human_approval,true);assert.equal(r.route.includes('somax'),true);
});
test('forbids unknown commands and keys',()=>assert.throws(()=>plan({goal:'hello',execute:'shell'})));
test('forbids unknown kind',()=>assert.throws(()=>plan({goal:'hello',kind:'shell'})));
test('tokens require 32+ bytes',()=>assert.deepEqual(configuredTokens({MARK7_DIFY_API_TOKEN:'short'}),[]));
test('per-tenant token isolation',()=>{
 const list=configuredTokens({MARK7_DIFY_TOKENS_JSON:JSON.stringify([{tenant:'alice',token:'a'.repeat(32)},{tenant:'bob',token:'b'.repeat(32)}])});
 assert.equal(authenticate('Bearer '+'a'.repeat(32),list),'alice');
 assert.equal(authenticate('Bearer '+'b'.repeat(32),list),'bob');
 assert.equal(authenticate('Bearer '+'c'.repeat(32),list),null);
});
test('no token 401',async()=>assert.equal((await call({goal:'x'},'wrong')).statusCode,401));
test('disabled 503',async()=>assert.equal((await call({goal:'x'},TOKEN,{...env,MARK7_DIFY_ENABLED:'false'})).statusCode,503));
test('missing Redis fail closed',async()=>assert.equal((await call({goal:'x'})).statusCode,503));
test('oversize rejected',async()=>assert.equal((await call({goal:'x'.repeat(9000)})).statusCode,413));
test('Redis exception fails closed',async()=>{
 const x=await call({goal:'x'},TOKEN,{...env,MARK7_REDIS_REST_URL:'https://redis.example.org',MARK7_REDIS_REST_TOKEN:'fake'},
 {fetcher:async()=>{throw Error('offline')}});
 assert.equal(x.statusCode,503);
});
test('Redis accepts plan',async()=>{
 const x=await call({goal:'x'},TOKEN,{...env,MARK7_REDIS_REST_URL:'https://redis.example.org',MARK7_REDIS_REST_TOKEN:'fake'},
 {fetcher:async()=>({ok:true,json:async()=>({result:1})})});
 assert.equal(x.statusCode,200);assert.equal(x.body.mode,'plan-only');
});
test('Redis rejects after quota',async()=>{
 const x=await call({goal:'x'},TOKEN,{...env,MARK7_REDIS_REST_URL:'https://redis.example.org',MARK7_REDIS_REST_TOKEN:'fake',MARK7_DIFY_REQUESTS_PER_MINUTE:'2'},
 {fetcher:async()=>({ok:true,json:async()=>({result:3})})});
 assert.equal(x.statusCode,429);
});
