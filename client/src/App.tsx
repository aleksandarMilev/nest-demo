import { useEffect, useState } from "react";

export default function App() {
  const [health, setHealth] = useState<string>("loading...");

  useEffect(() => {
    const controller = new AbortController();

    void (async () => {
      try {
        const base =
          typeof import.meta.env.VITE_API_URL === "string" &&
          import.meta.env.VITE_API_URL.length > 0
            ? import.meta.env.VITE_API_URL
            : "http://localhost:3000";

        const response = await fetch(`${base}/api/v1/health`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status} ${response.statusText}`);
        }

        const data: unknown = await response.json();

        setHealth(JSON.stringify(data));
      } catch (error: unknown) {
        console.error(error);
        setHealth(
          `error: ${error instanceof Error ? error.message : String(error)}`
        );
      }
    })();

    return () => controller.abort();
  }, []);

  return (
    <div style={{ fontFamily: "system-ui", padding: 24 }}>
      <h1>Client ↔ API demo</h1>
      <p>
        API URL:{" "}
        {typeof import.meta.env.VITE_API_URL === "string" &&
        import.meta.env.VITE_API_URL.length > 0
          ? import.meta.env.VITE_API_URL
          : "http://localhost:3000"}
      </p>
      <pre>{health}</pre>
    </div>
  );
}
