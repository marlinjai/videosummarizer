// app/actions.ts

"use server";

import { redirect } from "next/navigation";

export async function processVideo(formData: FormData) {
  const youtubeUrl = formData.get("youtubeUrl") as string;
  const notionPageId = formData.get("notionPageId") as string;

  try {
    const response = await fetch("/api/process-video", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ youtubeUrl, notionPageId }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Processing failed");
    }

    // Redirect to a success page with a query parameter for displaying the message
    redirect(
      `/success?message=${encodeURIComponent("Video processed successfully!")}`
    );
  } catch (error) {
    redirect(`/error?message=${encodeURIComponent((error as Error).message)}`);
  }
}
