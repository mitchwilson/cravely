"use client";
import { useState } from "react";
import { useGeoLocation } from "./hooks/useGeoLocation";
import ResponseUI from "./ResponseUI";

export default function OpenAIChat() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [mealtime, setMealtime] = useState("");
  const [occasion, setOccasion] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [distance, setDistance] = useState("");
  const location = useGeoLocation();

  async function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault();
    setLoading(true);
    setResponse("");
    try {
      // Add location info to the prompt if available
      const promptWithContext = `
        ${prompt}
        User location: ${location}
        Mealtime: ${mealtime}
        Occasion: ${occasion}
        Price range: ${priceRange}
        Distance preference: ${distance}
      `;
      const res = await fetch("/api/openai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: promptWithContext }),
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
        <select
          value={mealtime}
          onChange={e => setMealtime(e.target.value)}
          className="border p-2"
        >
          <option value="">Select mealtime</option>
          <option value="Breakfast">Breakfast</option>
          <option value="Lunch">Lunch</option>
          <option value="Dinner">Dinner</option>
        </select>
        <select
          value={occasion}
          onChange={e => setOccasion(e.target.value)}
          className="border p-2"
        >
          <option value="">Select occasion</option>
          <option value="Normal occasion">Normal occasion</option>
          <option value="Birthday">Birthday</option>
          <option value="Date">Date</option>
        </select>
        <select
          value={priceRange}
          onChange={e => setPriceRange(e.target.value)}
          className="border p-2"
        >
          <option value="">Select price range</option>
          <option value="Cheap price">Cheap</option>
          <option value="Regular price">Regular price</option>
          <option value="Expensive price">Expensive</option>
        </select>
        <select
          value={distance}
          onChange={e => setDistance(e.target.value)}
          className="border p-2"
        >
          <option value="">Select distance</option>
          <option value="Walking distance">Walking distance</option>
          <option value="Within 5 miles">Within 5 miles</option>
          <option value="Within 10 miles">Within 10 miles</option>
          <option value="No distance preference">No distance preference</option>
        </select>
        <textarea className="resize border p-2"
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          rows={4}
          placeholder="Tell us what you are craving ..."
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
          <div>
            <ResponseUI response={response} />
          </div>
        </div> 
      )}
    </div>
  );
}
