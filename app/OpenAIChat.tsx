"use client";
import { useState, useEffect } from "react";
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
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

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

  function requestFormReset() {
    setDistance("");  
    setMealtime(""); 
    setOccasion(""); 
    setPriceRange(""); 
    setPrompt("");
    setResponse("");
  }

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className={
          mounted
            ? "flex flex-col gap-3 *:aria-selected:border-orange-400 *:focus:outline-none"
            : "flex flex-col gap-3"
        }
      >
        <select
          value={mealtime}
          onChange={e => setMealtime(e.target.value)}
          aria-selected={mealtime ? "true" : "false"}
          className="border-2 border-purple-400 p-2 rounded-bl-lg rounded-tr-lg"
        >
          <option value="">Select mealtime</option>
          <option value="Breakfast">Breakfast</option>
          <option value="Lunch">Lunch</option>
          <option value="Dinner">Dinner</option>
        </select>
        <select
          value={occasion}
          onChange={e => setOccasion(e.target.value)}
          aria-selected={occasion ? "true" : "false"}
          className="border-2 border-purple-400 p-2 rounded-bl-lg rounded-tr-lg"
        >
          <option value="">Select occasion</option>
          <option value="Normal occasion">Normal occasion</option>
          <option value="Birthday">Birthday</option>
          <option value="Date">Date</option>
        </select>
        <select
          aria-selected={priceRange ? "true" : "false"}
          value={priceRange}
          onChange={e => setPriceRange(e.target.value)}
          className="border-2 border-purple-400 p-2 rounded-bl-lg rounded-tr-lg"
        >
          <option value="">Select price range</option>
          <option value="Cheap price">Cheap</option>
          <option value="Regular price">Regular price</option>
          <option value="Expensive price">Expensive</option>
        </select>
        <select
          value={distance}
          onChange={e => setDistance(e.target.value)}
          aria-selected={distance ? "true" : "false"}
          className="border-2 border-purple-400 p-2 rounded-bl-lg rounded-tr-lg"
        >
          <option value="">Select distance</option>
          <option value="Walking distance">Walking distance</option>
          <option value="Within 5 miles">Within 5 miles</option>
          <option value="Within 10 miles">Within 10 miles</option>
          <option value="No distance preference">No distance preference</option>
        </select>
        <textarea className="resize border-2 border-purple-400 p-2 rounded-bl-lg rounded-tr-lg"
          aria-selected={prompt ? "true" : "false"}
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          rows={4}
          placeholder="Tell us what you are craving ..."
          required
        />
        <div className="mt-2 flex gap-2">

          <button type="submit" disabled={loading} className="border-2 border-orange-400 p-1 rounded-bl-lg rounded-tr-lg">
            {loading ? "Loading..." : "Send"}
          </button>
          <button type="reset"  className="border-2 border-purple-400 p-1 rounded-bl-lg rounded-tr-lg" onClick={() => { requestFormReset() }}>Reset</button>
          </div>
      </form>
      <div
        className={`text-xs text-zinc-500 mb-2 transition-all duration-1000 ease-in-out transform
          ${location
            ? 'opacity-100 max-h-20 scale-110 translate-y-0'
            : 'opacity-0 max-h-0 scale-90 -translate-y-4 overflow-hidden'}
        `}
        aria-live="polite"
      >
        <br></br>
        {location && `Detected location: ${location}`}
      </div>
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
