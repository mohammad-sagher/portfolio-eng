/**
 * Pub/sub bridge between UI and the 3D canvas (§4.3). UI components publish "pulse" events;
 * the scene subscribes. No component imports the canvas, no canvas imports components.
 */
type Events = { pulse: { strength?: number } };
type Handler<K extends keyof Events> = (e: Events[K]) => void;
const handlers = new Map<keyof Events, Set<Handler<any>>>();
export const sceneBus = {
  on<K extends keyof Events>(k: K, h: Handler<K>): () => void {
    if (!handlers.has(k)) handlers.set(k, new Set());
    handlers.get(k)!.add(h);
    return () => { handlers.get(k)!.delete(h); };
  },
  emit<K extends keyof Events>(k: K, e: Events[K]) { handlers.get(k)?.forEach((h) => h(e)); },
};
