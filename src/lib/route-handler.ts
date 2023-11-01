import { NextResponse } from "next/server";
import { logger } from "./utils";
import { Worker } from "./worker";

export function makeHandler(runtime: string) {
  return async (req: Request) => {
    const { traceId } = await req.json();
    const abortSignal = req.signal;

    abortSignal.addEventListener("abort", () => {
      log("Abort signal received");
    });

    const log = logger(runtime, traceId, "route");
    const workerLog = logger(runtime, traceId, "worker");

    const worker = Worker({ abortSignal, log: workerLog });

    try {
      for await (const value of worker) {
        log(`Received ${value.data}`);
      }

      log("Finished working");

      return NextResponse.json(
        { message: "Finished processing" },
        { status: 200 }
      );
    } catch (e) {
      if ((e as any).name === "AbortError") {
        log("Request aborted");

        return;
      }

      throw e;
    }
  };
}
