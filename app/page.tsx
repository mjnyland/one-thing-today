"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [entry, setEntry] = useState("");
  const [todayEntry, setTodayEntry] = useState("");
  const [currentPrompt, setCurrentPrompt] = useState(
    "What's one thing you want to do today?"
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateAIPrompt = async () => {
    setIsLoading(true);
    setError(null);
    try {
      console.log("Sending request to generate prompt...");
      const response = await fetch("/api/generate-prompt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      console.log("Response data:", data);

      if (!response.ok) {
        throw new Error(
          data.error || data.details || "Failed to generate prompt"
        );
      }

      setCurrentPrompt(data.prompt);
    } catch (error) {
      console.error("Error generating prompt:", error);
      setError(
        error instanceof Error ? error.message : "Failed to generate prompt"
      );
      setCurrentPrompt("What's one thing you want to do today?");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const today = new Date().toLocaleDateString();
    const savedEntry = localStorage.getItem(today);
    if (savedEntry) {
      setTodayEntry(savedEntry);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const today = new Date().toLocaleDateString();
    localStorage.setItem(today, entry);
    setTodayEntry(entry);
    setEntry("");
  };

  return (
    <div className="bg-zinc-950 text-white min-h-screen h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            value={entry}
            onChange={(e) => setEntry(e.target.value)}
            placeholder={currentPrompt}
            className="w-full h-64 p-4 text-lg bg-zinc-900 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none placeholder:text-zinc-500 font-mono"
          />
          <div className="flex justify-between gap-4">
            <div className="flex justify-end gap-4">
              <button
                type="submit"
                className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200 font-medium font-mono"
              >
                Save Entry
              </button>
              <button
                type="button"
                onClick={() => {
                  localStorage.clear();
                  setTodayEntry("");
                }}
                className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors duration-200 font-medium font-mono"
              >
                Clear Storage
              </button>
            </div>
            <div className="flex justify-end gap-4">
              <button
                type="button"
                className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200 font-medium font-mono disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => {
                  setEntry("");
                  generateAIPrompt();
                }}
                disabled={isLoading}
              >
                {isLoading ? "Generating..." : "New Prompt"}
              </button>
            </div>
          </div>
          {error && (
            <div className="text-red-500 text-sm font-mono mt-2">
              Error: {error}
            </div>
          )}
        </form>
        {todayEntry && (
          <div className="p-4 bg-zinc-950 rounded-lg">
            <p className="text-md font-medium mb-2 font-mono text-sm">
              {new Date().toLocaleDateString()}
            </p>
            <p className="text-zinc-300 font-mono font-medium text-md">
              {todayEntry}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
