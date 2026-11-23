'use strict';
const { createHash, timingSafeEqual, randomUUID } = require('node:crypto');
const MAX_BYTES=8192;
const KINDS=new Set(['web-app','ecommerce','restaurant','mobile-app','api','automation','other']);
function configuredTokens(env) {
  if(env.MARK7_DIFY_TOKENS_JSON) {
    try {
      const entries=JSON.parse(env.MARK7_DIFY_TOKENS_JSON);
      if(!Array.isArray(entries)||entries.length>100)return [];
      const ids=new Set(), secrets=new Set();
      return entries.map(e=>{
        if(!e||typeof e.tenant!=='string'||!/^[a-zA-Z0-9_-]{3,64}$/.test(e.tenant)||ids.has(e.tenant)||
          typeof e.token!=='string'||e.token.length<32||secrets.has(e.token))throw Error('bad_tokens');
        ids.add(e.tenant);secrets.add(e.token);return e;
      });
    }catch{return [];}
  }
  return typeof env.MARK7_DIFY_API_TOKEN==='string'&&env.MARK7_DIFY_API_TOKEN.length>=32?
    [{tenant:'owner',token:env.MARK7_DIFY_API_TOKEN}]:[];
}
function authenticate(header,entries){
  if(typeof header!=='string'||!/^Bearer [^\s]{32,4096}$/.test(header))return null;
  const h=createHash('sha256').update(header.slice(7)).digest();let tenant=null;
  for(const e of entries){const x=createHash('sha256').update(e.token).digest();if(timingSafeEqual(x,h))tenant=e.tenant;}
  return tenant;
}
function plan(input){
  if(!input||Array.isArray(input)||typeof input!=='object'||Object.keys(input).some(x=>!['goal','kind'].includes(x)))throw Error('input');
  const {goal,kind='web-app'}=input;
  if(typeof goal!=='string'||!goal.trim()||goal.length>500||/[\x00-\x08\x0b\x0c\x0e-\x1f]/.test(goal)||!KINDS.has(kind))throw Error('input');
  return {id:randomUUID(),version:'0.2.0',mode:'plan-only',goal:goal.trim(),kind,
    route:['intake','somas','somax','tropic','mci','mcsipim','attentici','result'],
    capabilities:['requirements','architecture','code_generation','testing','telemetry','security_review','git_pr','portable_export','deployment_planning','state_resume'],
    requires_human_approval:true,recommendations:[
      {stage:'requirements',task:'Confirm scope, privacy and costs'},
      {stage:'architecture',task:'Define frontend, backend, security and data model'},
      {stage:'testing',task:'Test in an isolated environment'},
      {stage:'security_review',task:'Review permissions, quotas and privacy'},
      {stage:'deployment_planning',task:'Require approval before deployment'}],
    note:'Reference planning only. No proprietary SOMAX engine, code execution, model calls, Git changes, deployment or payment.'};
}
function reply(res,status,value,headers={}){
  res.statusCode=status;res.setHeader('Content-Type','application/json; charset=utf-8');
  res.setHeader('Cache-Control','no-store');res.setHeader('X-Content-Type-Options','nosniff');
  for(const [k,v]of Object.entries(headers))res.setHeader(k,v);res.end(JSON.stringify(value));
}
async function quota(tenant,env,fetcher=fetch){
  const host=env.MARK7_REDIS_REST_URL,token=env.MARK7_REDIS_REST_TOKEN;
  if(!host||!token||!/^https:\/\//.test(host))return null;
  const limit=Math.min(Math.max(Number(env.MARK7_DIFY_REQUESTS_PER_MINUTE)||20,1),60);
  const key='mark7:dify:quota:'+tenant+':'+Math.floor(Date.now()/60000);
  const script="local n=redis.call('INCR',KEYS[1]);if n==1 then redis.call('EXPIRE',KEYS[1],120) end;return n";
  const response=await fetcher(host.replace(/\/$/,'')+'/eval',{
    method:'POST',headers:{'Authorization':'Bearer '+token,'Content-Type':'application/json'},
    body:JSON.stringify([script,1,key]),signal:AbortSignal.timeout(4000)});
  if(!response.ok)throw Error('quota');
  const value=await response.json();
  if(typeof value?.result!=='number')throw Error('quota');
  return value.result<=limit;
}
async function handler(req,res,options={}){
  const env=options.env||process.env;
  if(req.method==='GET'&&req.url?.split('?')[0]==='/api/health')return reply(res,200,{ok:true,service:'mark7-plan-api',mode:'plan-only'});
  if(req.method!=='POST')return reply(res,405,{error:'method_not_allowed'},{Allow:'POST'});
  if(env.MARK7_DIFY_ENABLED!=='true')return reply(res,503,{error:'gateway_disabled'});
  const entries=configuredTokens(env);
  if(!entries.length)return reply(res,503,{error:'gateway_not_configured'});
  const tenant=authenticate(req.headers?.authorization,entries);
  if(!tenant)return reply(res,401,{error:'unauthorized'});
  if(!/^application\/json(?:\s*;|\s*$)/i.test(req.headers?.['content-type']||''))return reply(res,415,{error:'unsupported_media_type'});
  let body;
  try{
    if(req.body!==undefined){if(Buffer.byteLength(JSON.stringify(req.body))>MAX_BYTES)return reply(res,413,{error:'payload_too_large'});body=req.body;}
    else{let chunks=[],n=0;for await(const c of req){n+=c.length;if(n>MAX_BYTES)return reply(res,413,{error:'payload_too_large'});chunks.push(c);}
      body=JSON.parse(Buffer.concat(chunks).toString('utf8'));}
  }catch{return reply(res,400,{error:'invalid_json'});}
  let output;try{output=plan(body);}catch{return reply(res,400,{error:'invalid_input'});}
  let allowed;try{allowed=await quota(tenant,env,options.fetcher);}catch{return reply(res,503,{error:'rate_limiter_unavailable'});}
  if(allowed===null)return reply(res,503,{error:'distributed_rate_limit_required'});
  if(!allowed)return reply(res,429,{error:'rate_limited'},{'Retry-After':'60'});
  return reply(res,200,output);
}
module.exports=handler;module.exports._test={plan,authenticate,configuredTokens,quota};
