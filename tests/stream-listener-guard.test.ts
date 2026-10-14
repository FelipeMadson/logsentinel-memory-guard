import {test} from 'node:test';
import assert from 'node:assert/strict';
import {EventEmitter} from 'node:events';
import {PassThrough} from 'node:stream';
import {createStreamListenerGuard} from '../src/index.ts';
test('CRIT-1: growth is measured relative to an actual stream baseline',()=>{
 const stream=new PassThrough();const fn=()=>{};stream.on('data',fn);
 const guard=createStreamListenerGuard(stream,{threshold:2});stream.on('data',fn);assert.deepEqual(guard.inspect(),[]);
 stream.on('data',fn);const finding=guard.inspect().find(item=>item.event==='data');
 assert.ok(finding);assert.equal(finding.baseline,1);assert.equal(finding.current,3);assert.equal(finding.added,2);stream.destroy();
});
test('CRIT-2: removal and reset update the diagnostic without mutating listeners',()=>{
 const emitter=new EventEmitter(),fn=()=>{},guard=createStreamListenerGuard(emitter,{threshold:2});
 emitter.on('data',fn);emitter.on('data',fn);assert.equal(guard.inspect().length,1);
 emitter.removeAllListeners('data');assert.deepEqual(guard.inspect(),[]);
 emitter.on('data',fn);emitter.on('data',fn);guard.resetBaseline();assert.deepEqual(guard.inspect(),[]);
 emitter.on('data',fn);emitter.on('data',fn);assert.equal(guard.inspect()[0].added,2);
});
test('CRIT-3: repeated inspection is passive and supports symbol events',()=>{
 const emitter=new EventEmitter(),event=Symbol('stream'),fn=()=>{},guard=createStreamListenerGuard(emitter,{threshold:1}),max=emitter.getMaxListeners();
 emitter.on(event,fn);for(let i=0;i<12;i++){const item=guard.inspect().find(f=>f.event===event);assert.ok(item);assert.equal(item.current,1);assert.equal(item.added,1);}
 assert.equal(emitter.listenerCount(event),1);assert.deepEqual(emitter.eventNames(),[event]);assert.equal(emitter.getMaxListeners(),max);
});
test('CRIT-4: thresholds are positive safe integers and the default is ten',()=>{
 const emitter=new EventEmitter();emitter.setMaxListeners(0);
 for(const threshold of [0,-1,1.5,NaN,Infinity,Number.MAX_SAFE_INTEGER+1])assert.throws(()=>createStreamListenerGuard(emitter,{threshold}));
 const guard=createStreamListenerGuard(emitter);const fn=()=>{};for(let i=0;i<9;i++)emitter.on('data',fn);assert.deepEqual(guard.inspect(),[]);
 emitter.on('data',fn);assert.equal(guard.inspect()[0].added,10);
});
