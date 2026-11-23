import { randomUUID } from 'node:crypto';
export const capabilities = Object.freeze(['requirements','architecture','code_generation','testing','telemetry','security_review','git_pr','portable_export','deployment_planning','state_resume']);
const stages = new Set(['intake','somas','somax','tropic','mci','mcsipim','attentici','result']);
const history=[];
export function somax(input){
 if(!input || typeof input!=='object'||Array.isArray(input)||typeof input.goal!=='string'||!input.goal.trim()||input.goal.length>500)throw Error('invalid_goal');
 const requested=Array.isArray(input.capabilities)?input.capabilities:capabilities;
 const selected=[...new Set(requested.filter(x=>typeof x==='string'&&capabilities.includes(x)))];
 return {goal:input.goal.trim(),kind:typeof input.kind==='string'?input.kind.slice(0,40):'web-app',selected,rejected:requested.length-selected.length,route:['intake','somas','somax','tropic','mci','mcsipim','attentici','result'],mode:'plan-only',requires_human_approval:true};
}
export function recordEvent({stage,action,status='ok',duration_ms=0}={}){
 if(!stages.has(stage))throw Error('invalid_stage');
 const event={ts:new Date().toISOString(),id:randomUUID(),stage,action:String(action??'').replace(/[^a-z0-9_-]/gi,'_').slice(0,40),status:['ok','blocked','error'].includes(status)?status:'error',duration_ms:Math.max(0,Math.min(Number(duration_ms)||0,60000))};
 history.push(event);if(history.length>500)history.shift();return event;
}
export function metrics(){const sorted=history.map(x=>x.duration_ms).sort((a,b)=>a-b);const p=f=>sorted.length?sorted[Math.ceil(sorted.length*f)-1]:0;return {total_tasks:history.length,blocked_actions:history.filter(x=>x.status==='blocked').length,errors:history.filter(x=>x.status==='error').length,latency_p50_ms:p(.5),latency_p95_ms:p(.95),storage:'ephemeral',external_export:false};}
export function plan(input){const start=Date.now();const result=somax(input);recordEvent({stage:'somax',action:'plan',status:result.rejected?'blocked':'ok',duration_ms:Date.now()-start});return {...result,version:'0.3.0',telemetry:metrics(),note:'No live deployments, external AI calls, Git writes or payments are performed.'};}
