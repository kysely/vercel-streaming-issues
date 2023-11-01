import { makeStreamingHandler } from "@/lib/streaming-route-handler";

export const runtime = "edge";

export const POST = makeStreamingHandler(runtime);
