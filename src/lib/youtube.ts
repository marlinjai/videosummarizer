import { YoutubeTranscript } from "youtube-transcript";
import fetch from "node-fetch";

export async function getVideoTranscript(youtubeUrl: string): Promise<string> {
  const videoId = extractVideoId(youtubeUrl);
  const transcript = await YoutubeTranscript.fetchTranscript(videoId);
  const transcriptText = transcript.map((item) => item.text).join(" ");
  return transcriptText;
}

function extractVideoId(url: string): string {
  const urlObj = new URL(url);
  return urlObj.searchParams.get("v") || urlObj.pathname.split("/").pop() || "";
}

export async function getVideoDetails(videoId: string) {
  const apiKey = process.env.YOUTUBE_API_KEY; // Ensure you’ve set this in .env.local
  const url = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${apiKey}&part=snippet`;

  const response = await fetch(url);
  const data = await response.json();

  if (data.items.length === 0) {
    throw new Error("No video found with the provided ID");
  }

  const { title, description, thumbnails } = data.items[0].snippet;
  return {
    title,
    description,
    thumbnailUrl: thumbnails?.high?.url || thumbnails?.default?.url,
  };
}
