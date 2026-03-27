"use client";
import { useEffect, useState } from "react";


export default function OpenAIChat() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState<string | null>(null);

  // Get geolocation on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation(
            `Latitude: ${pos.coords.latitude}, Longitude: ${pos.coords.longitude}`
          );
        },
        (err) => {
          setLocation(null);
        }
      );
    }
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setResponse("");
    try {
      // Add location info to the prompt if available
      const promptWithLocation = location
        ? `${prompt}\n\nUser location: ${location}`
        : prompt;
      const res = await fetch("/api/openai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: promptWithLocation }),
      });
      const data = await res.json();
      setResponse(data.choices?.[0]?.message?.content || JSON.stringify(data));
    } catch (err) {
      setResponse("Error: " + err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <textarea className="resize border p-2"
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          rows={4}
          placeholder="Type your prompt here..."
          required
        />
        <button type="submit" disabled={loading} style={{ padding: 8 }}>
          {loading ? "Loading..." : "Send"}
        </button>
      </form>
      {location && (
        <div className="text-xs text-zinc-500 mb-2">Detected location: {location}</div>
      )}
      {response && (
        <div>
          <strong>Response:</strong>
          <div>{response}</div>
        </div>
      )}
    </div>
  );
}
