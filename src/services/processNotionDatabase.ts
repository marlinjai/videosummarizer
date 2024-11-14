import { getVideoDetails } from "@/lib/youtube";

import { fetchAllNotionRows, updateNotionRow } from "@/lib/notion";

/**
 * Processes the Notion database in batches to avoid rate limits.
 * @param databaseId - The ID of the Notion database
 */
export async function processNotionDatabase(databaseId: string) {
  const rows = await fetchAllNotionRows(databaseId);
  const batchSize = 10; // Number of rows per batch
  const delay = 1000; // Delay between batches in milliseconds (1 second)

  for (let i = 0; i < rows.length; i += batchSize) {
    const batch = rows.slice(i, i + batchSize);

    await Promise.all(
      batch.map(async (row) => {
        try {
          const videoId = row.properties["video id"]; // Adjust to your column name
          const videoData = await getVideoDetails(videoId);

          await updateNotionRow(row.id, videoData);
        } catch (error) {
          console.error(`Error processing row ${row.id}:`, error);
        }
      })
    );

    console.log(`Processed batch ${i / batchSize + 1}`);
    if (i + batchSize < rows.length) {
      await new Promise((resolve) => setTimeout(resolve, delay)); // Wait to avoid rate limit
    }
  }
}
