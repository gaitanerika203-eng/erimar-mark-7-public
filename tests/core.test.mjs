import test from 'node:test';import assert from 'node:assert/strict';import {capabilities,somax,recordEvent,metrics,plan} from '../src/core.mjs';
test('ten capabilities',()=>assert.equal(capabilities.length,10));
test('reject empty goals',()=>assert.throws(()=>somax({goal:''})));
test('dedup allowed capabilities',()=>{const x=somax({goal:'Make storefront',capabilities:['testing','testing','unknown']});assert.deepEqual(x.selected,['testing']);assert.equal(x.rejected,2)});
test('restrict telemetry payload',()=>{const x=recordEvent({stage:'somax',action:'check',token:'SECRET',email:'private@example.com'});assert.ok(!JSON.stringify(x).includes('SECRET'));assert.ok(!JSON.stringify(x).includes('private@example.com'))});
test('no unapproved execution',()=>{const x=plan({goal:'Create shop'});assert.equal(x.mode,'plan-only');assert.equal(x.requires_human_approval,true)});
test('metrics have p95',()=>assert.equal(typeof metrics().latency_p95_ms,'number'));
