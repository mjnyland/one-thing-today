"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [entry, setEntry] = useState("");
  const [todayEntry, setTodayEntry] = useState("");

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
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={entry}
          onChange={(e) => setEntry(e.target.value)}
          placeholder="What's one thing you want to do today?"
        />
        <button type="submit">Save</button>
      </form>

      {todayEntry && (
        <div>
          <h2>Today's Entry:</h2>
          <p>{todayEntry}</p>
        </div>
      )}
    </div>
  );
}
