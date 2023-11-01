"use client";

import { nanoid } from "nanoid";
import { useCallback, useRef, useState } from "react";

const styles = {
  button: "bg-white border text-black p-2 rounded",
  buttonLoading: "border-red-300 text-red-500",
  result: "rounded p-2 border border-green-500 bg-green-100 text-green-900",
  error: "rounded p-2 border border-orange-500 bg-orange-100 text-orange-900",
};

type Outcome = {
  result?: string;
  error?: string;
};

export function RequestTrigger({ endpoint }: { endpoint: string }) {
  const [isLoading, setLoading] = useState(false);
  const [outcome, setOutcome] = useState<Outcome>({});
  const abortControllerRef = useRef<AbortController>(new AbortController());

  const stop = () => abortControllerRef.current.abort();

  const trigger = useCallback(async () => {
    abortControllerRef.current = new AbortController();

    setLoading(true);
    setOutcome({});

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        body: JSON.stringify({
          traceId: nanoid(8),
        }),
        headers: { "Content-Type": "application/json" },
        signal: abortControllerRef.current.signal,
      });

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      let responseText = "";

      while (true) {
        if (!reader) return;

        const { done, value } = await reader.read();
        if (done) {
          break;
        }
        // Update the chat state with the new message tokens.
        responseText += decoder.decode(value, { stream: true });
        setOutcome({ result: responseText });

        // The request has been aborted, stop reading the stream.
        if (abortControllerRef.current.signal.aborted) {
          reader.cancel();
          break;
        }
      }

      setOutcome({ result: responseText });
    } catch (e) {
      console.error(e);
      setOutcome((o) => ({ ...o, error: String(e) }));
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  return (
    <div className="flex flex-col py-6 space-y-2">
      <p className="font-mono">{endpoint}</p>
      {isLoading ? (
        <button
          className={styles.button + " " + styles.buttonLoading}
          onClick={stop}
        >
          Abort Loading
        </button>
      ) : (
        <button className={styles.button} onClick={trigger}>
          Trigger Fetch
        </button>
      )}

      {outcome.error ? <p className={styles.error}>{outcome.error}</p> : null}
      {outcome.result ? (
        <p className={styles.result}>{outcome.result}</p>
      ) : null}
    </div>
  );
}
