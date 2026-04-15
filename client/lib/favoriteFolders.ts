export type FavoriteMap = Record<string, string>;

const STORAGE_KEY = "favoriteFolders";

export function loadFavoriteFolders(): { folders: string[]; mapping: FavoriteMap } {
  if (typeof window === "undefined") {
    return { folders: ["Umumiy"], mapping: {} };
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { folders: ["Umumiy"], mapping: {} };
    }

    const parsed = JSON.parse(raw) as {
      folders?: string[];
      mapping?: FavoriteMap;
    };

    return {
      folders: Array.isArray(parsed.folders) && parsed.folders.length > 0 ? parsed.folders : ["Umumiy"],
      mapping: parsed.mapping && typeof parsed.mapping === "object" ? parsed.mapping : {},
    };
  } catch {
    return { folders: ["Umumiy"], mapping: {} };
  }
}

export function saveFavoriteFolders(folders: string[], mapping: FavoriteMap) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ folders, mapping }));
}
