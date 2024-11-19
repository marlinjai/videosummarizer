// app/page.tsx

import { processVideo } from "./actions";

export default function Home() {
  return (
    <div>
      <h1>YouTube to Notion Processor</h1>
      <form action={processVideo}>
        <input
          type="text"
          name="youtubeUrl"
          placeholder="YouTube URL"
          required
        />
        <input
          type="text"
          name="notionPageId"
          placeholder="Notion Page ID"
          required
        />
        <button type="submit">Process Video</button>
      </form>
    </div>
  );
}
