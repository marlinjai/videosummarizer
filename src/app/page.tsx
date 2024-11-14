"use client";

import { useState } from "react";

export default function Home() {
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [notionPageId, setNotionPageId] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch("/api/process-video", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ youtubeUrl, notionPageId }),
    });

    const data = await response.json();

    if (response.ok) {
      setMessage("Video processed successfully!");
    } else {
      setMessage(`Error: ${data.error}`);
    }
  };

  return (
    <div>
      <h1>YouTube to Notion Processor</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="YouTube URL"
          value={youtubeUrl}
          onChange={(e) => setYoutubeUrl(e.target.value)}
        />
        <input
          type="text"
          placeholder="Notion Page ID"
          value={notionPageId}
          onChange={(e) => setNotionPageId(e.target.value)}
        />
        <button type="submit">Process Video</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
