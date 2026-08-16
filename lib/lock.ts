const tails = new Map<string, Promise<unknown>>();

/** Serialize async work per key so draft saves cannot race a publish write. */
export function withEventLock<T>(id: string, fn: () => T | Promise<T>): Promise<T> {
  const prev = tails.get(id) ?? Promise.resolve();
  const run = prev.then(fn, fn);
  tails.set(
    id,
    run.then(
      () => undefined,
      () => undefined,
    ),
  );
  return run;
}
