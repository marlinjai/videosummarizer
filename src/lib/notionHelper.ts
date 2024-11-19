/* eslint-disable @typescript-eslint/no-explicit-any */

export function getTitleProperty(row: any, property: string): string {
  const titleProperty = row.properties[property] as {
    type: "title";
    title: { text: { content: string } }[];
  };
  return titleProperty.title[0]?.text.content || "";
}

export function getUrlProperty(row: any, property: string): string | undefined {
  const urlProperty = row.properties[property] as {
    type: "url";
    url: string;
  };
  return urlProperty.url;
}
