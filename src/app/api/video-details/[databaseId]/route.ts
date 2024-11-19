/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/video-details/[databaseId]/route.ts

import { fetchFirstNRows } from "@/lib/notion";
import { getVideoDetails } from "@/lib/youtube";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { databaseId: string } }
) {
  const { databaseId } = params;

  try {
    // Fetch the first row from the specified Notion database
    const rows = await fetchFirstNRows(databaseId, 1);

    if (rows.length === 0) {
      throw new Error("No rows found in the database");
    }

    const firstRow = rows[0];

    // Extract the video ID from the first row
    const videoIdProperty = firstRow.properties["video id"];

    let videoId = "";

    if (
      videoIdProperty.type === "rich_text" &&
      videoIdProperty.rich_text.length > 0
    ) {
      videoId = videoIdProperty.rich_text[0].plain_text;
    } else {
      throw new Error("Video ID not found in the first row");
    }

    // Get video details
    const videoDetails = await getVideoDetails(videoId);

    // Return the video details
    return NextResponse.json(videoDetails);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "An error occurred" },
      { status: 500 }
    );
  }
}
