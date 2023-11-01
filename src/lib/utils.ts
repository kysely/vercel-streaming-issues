export type Logger = (message: any) => void;

export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const logger = (
  runtime: string,
  traceId?: string,
  component?: string
): Logger => {
  const namespace = [runtime, traceId, component]
    .filter(Boolean)
    .map((v) => `[${v}]`)
    .join(" ");

  return (message: any) => {
    console.error(`[${new Date().toISOString()}] ${namespace}`, message);
  };
};

export function createLazyStream<T>(
  iterator: AsyncIterableIterator<T>,
  { log }: { log: Logger }
) {
  return new ReadableStream({
    async pull(controller) {
      log("PULL");
      const { value, done } = await iterator.next();

      if (done) {
        log("DONE");
        controller.close();
      } else {
        controller.enqueue(JSON.stringify(value) + "\n");
      }
    },
    async cancel(reason) {
      log(`CANCEL: ${reason}`);
    },
  });
}
