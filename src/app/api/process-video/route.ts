import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getVideoTranscript } from "@/lib/youtube";
import { generateSummary } from "@/lib/openai";
import { embedVideoInNotionPage, updateNotionPage } from "@/lib/notion";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { youtubeUrl, notionPageId } = body;

  if (!youtubeUrl || !notionPageId) {
    return NextResponse.json(
      { error: "Missing YouTube URL or Notion Page ID" },
      { status: 400 }
    );
  }

  try {
    // Check if video already processed
    let video = await prisma.video.findUnique({ where: { youtubeUrl } });
    if (!video) {
      video = await prisma.video.create({ data: { youtubeUrl } });
    }

    // Get transcript
    const transcript = await getVideoTranscript(youtubeUrl);

    // Generate summary
    const summary = await generateSummary(transcript);

    // Update Notion
    await embedVideoInNotionPage(notionPageId, youtubeUrl);
    await updateNotionPage(notionPageId, transcript, summary);

    // Update database
    await prisma.video.update({
      where: { id: video.id },
      data: { transcript, summary },
    });

    return NextResponse.json({
      message: "Video processed successfully",
      videoId: video.id,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "An error occurred while processing the video" },
      { status: 500 }
    );
  }
}
