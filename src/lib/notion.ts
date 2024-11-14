/* eslint-disable @typescript-eslint/no-explicit-any */
import { Client } from "@notionhq/client";

const notion = new Client({ auth: process.env.NOTION_API_KEY });

export async function fetchDatabaseSchema(databaseId: string) {
  const response = await notion.databases.retrieve({
    database_id: databaseId,
  });
  return response.properties;
}

export async function embedVideoInNotionPage(pageId: string, videoUrl: string) {
  await notion.blocks.children.append({
    block_id: pageId,
    children: [
      {
        object: "block",
        type: "embed",
        embed: {
          url: videoUrl,
        },
      },
    ],
  });
}

export async function updateNotionPage(
  pageId: string,
  transcript: string,
  summary: string
) {
  await notion.blocks.children.append({
    block_id: pageId,
    children: [
      {
        object: "block",
        type: "toggle",
        toggle: {
          rich_text: [{ type: "text", text: { content: "Transcript" } }],
          children: [
            {
              object: "block",
              type: "paragraph",
              paragraph: {
                rich_text: [{ type: "text", text: { content: transcript } }],
              },
            },
          ],
        },
      },
      {
        object: "block",
        type: "paragraph",
        paragraph: {
          rich_text: [
            { type: "text", text: { content: `Summary: ${summary}` } },
          ],
        },
      },
    ],
  });
}

export async function updateNotionRow(
  pageId: string,
  videoData: { title: string; description: string; thumbnailUrl: string }
) {
  await notion.pages.update({
    page_id: pageId,
    properties: {
      "Video Title": {
        title: [
          {
            text: {
              content: videoData.title,
            },
          },
        ],
      },
      "Video Description": {
        rich_text: [
          {
            text: {
              content: videoData.description,
            },
          },
        ],
      },
      Thumbnail: {
        files: [
          {
            name: "Thumbnail",
            external: {
              url: videoData.thumbnailUrl,
            },
          },
        ],
      },
    },
  });
}

export async function fetchAllNotionRows(databaseId: string) {
  let rows: any[] = [];
  let cursor = undefined;

  do {
    const response = await notion.databases.query({
      database_id: databaseId,
      start_cursor: cursor,
    });

    rows = rows.concat(response.results);
    cursor = response.next_cursor;
  } while (cursor);

  return rows;
}
