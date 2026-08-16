export type Debounced<T extends (...args: never[]) => void> = ((
  ...args: Parameters<T>
) => void) & {
  flush: () => void;
  cancel: () => void;
  pending: () => boolean;
};

export function createDebounced<T extends (...args: never[]) => void>(
  fn: T,
  waitMs: number,
): Debounced<T> {
  let timer: ReturnType<typeof setTimeout> | null = null;
  let lastArgs: Parameters<T> | null = null;

  const run = () => {
    timer = null;
    if (!lastArgs) return;
    const args = lastArgs;
    lastArgs = null;
    fn(...args);
  };

  const schedule = ((...args: Parameters<T>) => {
    lastArgs = args;
    if (timer) clearTimeout(timer);
    timer = setTimeout(run, waitMs);
  }) as Debounced<T>;

  schedule.flush = () => {
    if (timer) clearTimeout(timer);
    run();
  };

  schedule.cancel = () => {
    if (timer) clearTimeout(timer);
    timer = null;
    lastArgs = null;
  };

  schedule.pending = () => timer !== null;

  return schedule;
}
