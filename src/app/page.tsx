"use client";

import { RequestTrigger } from "@/components/request-trigger";

export default function Home() {
  return (
    <main className="mx-auto max-w-lg flex flex-col divide-y">
      <RequestTrigger endpoint="/api/nodejs-endpoint" />
      <RequestTrigger endpoint="/api/edge-endpoint" />
      <RequestTrigger endpoint="/api/nodejs-streaming-endpoint" />
      <RequestTrigger endpoint="/api/edge-streaming-endpoint" />
    </main>
  );
}
