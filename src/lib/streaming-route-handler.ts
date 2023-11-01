import { createLazyStream, logger } from "./utils";
import { Worker } from "./worker";

export function makeStreamingHandler(runtime: string) {
  return async (req: Request) => {
    const { traceId } = await req.json();
    const abortSignal = req.signal;

    abortSignal.addEventListener("abort", () => {
      log("Abort signal received");
    });

    const log = logger(runtime, traceId, "route");
    const workerLog = logger(runtime, traceId, "worker");
    const streamLog = logger(runtime, traceId, "stream");

    const worker = Worker({ log: workerLog });

    const stream = createLazyStream(worker, { log: streamLog });

    try {
      return new Response(stream, {
        headers: { "Content-Type": "application/json" },
      });
    } catch (e) {
      if ((e as any).name === "AbortError") {
        log("Request aborted");

        return;
      }

      throw e;
    }
  };
}
