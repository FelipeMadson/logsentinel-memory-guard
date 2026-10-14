import { EventEmitter } from 'node:events';

interface ListenerInfo {
  event: string | symbol;
  baseline: number;
  current: number;
  added: number;
}

/** Samples listener growth without registering or removing listeners. Counts do not prove a memory leak. */
function createStreamListenerGuard(emitter: EventEmitter, { threshold = 10 }: { threshold?: number } = {}): { inspect: () => ListenerInfo[]; resetBaseline: () => void } {
  if (!Number.isSafeInteger(threshold) || threshold <= 0) {
    throw new Error('Threshold must be a positive safe integer.');
  }

  const baseline = new Map<string | symbol, number>();

  const resetBaseline = () => {
    baseline.clear();
    emitter.eventNames().forEach(event => {
      baseline.set(event, emitter.listenerCount(event));
    });
  };

  resetBaseline();

  const inspect = (): ListenerInfo[] => {
    const result: ListenerInfo[] = [];
    emitter.eventNames().forEach(event => {
      const base = baseline.get(event) || 0;
      const curr = emitter.listenerCount(event);
      if (curr - base >= threshold) {
        result.push({
          event,
          baseline: base,
          current: curr,
          added: curr - base,
        });
      }
    });
    return result;
  };

  return { inspect, resetBaseline };
}

export { createStreamListenerGuard };
