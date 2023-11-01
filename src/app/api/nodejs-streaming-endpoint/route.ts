import { makeStreamingHandler } from "@/lib/streaming-route-handler";

export const runtime = "nodejs";

export const POST = makeStreamingHandler(runtime);
