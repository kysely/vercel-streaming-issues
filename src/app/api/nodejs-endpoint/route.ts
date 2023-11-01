import { makeHandler } from "@/lib/route-handler";

export const runtime = "nodejs";

export const POST = makeHandler(runtime);
