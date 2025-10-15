import { useEffect, useState } from "react";

export default function App() {
  const [health, setHealth] = useState<string>("loading...");

  useEffect(() => {
    const base = import.meta.env.VITE_API_URL || "http://localhost:3000";
    fetch(`${base}/api/v1/health`)
      .then((response) => response.json())
      .then((data) => setHealth(JSON.stringify(data)))
      .catch((error) => setHealth(`error: ${error}`));
  }, []);

  return (
    <div style={{ fontFamily: "system-ui", padding: 24 }}>
      <h1>Client ↔ API demo</h1>
      <p>API URL: {import.meta.env.VITE_API_URL || "http://localhost:3000"}</p>
      <pre>{health}</pre>
    </div>
  );
}
