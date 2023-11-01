import { makeHandler } from "@/lib/route-handler";

export const runtime = "edge";

export const POST = makeHandler(runtime);
