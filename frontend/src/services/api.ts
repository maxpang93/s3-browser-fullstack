import type { S3ObjectMetadata, Item } from "../types/s3";

// const BASE_URL = process.env.BASE_URL;
const BASE_URL = import.meta.env.VITE_BASE_URL;

export async function listItems(prefix: string): Promise<Item[]> {
  console.log(`prefix: ${prefix}`);
  const res = await fetch(`${BASE_URL}/?prefix=${encodeURIComponent(prefix)}`);

  if (!res.ok) {
    throw new Error("Failed to fetch folders");
  }

  const data: S3ObjectMetadata[] = await res.json();

  const items: Item[] = data.map((obj) => {
    if (obj.Key.endsWith("/")) {
      return {
        type: "folder",
        name: obj.Name,
        prefix: obj.Key,
      };
    } else {
      return {
        type: "file",
        name: obj.Name,
        key: obj.Key,
        size: obj.Size,
        lastModified: obj.LastModified,
      };
    }
  });

  // sort folders to appear first, then each type by name
  items.sort((a, b) => {
    if (a.type === b.type) {
      return a.name.localeCompare(b.name);
    }
    return a.type === "folder" ? -1 : 1;
  });

  return items;
}
