import { Logger, sleep } from "./utils";

/**
 * Async generator that yields { data: number } every 500 ms.
 * The generator stops after 20 iterations.
 */
export async function* Worker({
  log,
  abortSignal,
}: {
  log: Logger;
  abortSignal?: AbortSignal;
}): AsyncIterableIterator<{ data: number }> {
  let i = 1;

  while (i < 20) {
    abortSignal?.throwIfAborted();

    const newValue = { data: i++ };

    log(`Working on ${newValue.data}`);
    yield newValue;

    await sleep(500);
  }
}
