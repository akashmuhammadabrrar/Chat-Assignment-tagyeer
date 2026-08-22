import { apiClient } from "./client";
import { ENDPOINTS } from "./config";
import { SearchedUser } from "@/types/conversation";

async function fetchUserSearch(searchTerm: string): Promise<SearchedUser[]> {
  // Strip any '+' characters as the server regex crashes on '+' with 500 Internal Server Error
  const safeTerm = searchTerm.replace(/\+/g, "").trim();
  if (!safeTerm) return [];

  try {
    const params = new URLSearchParams({ q: safeTerm });
    const res = await apiClient<any>(`${ENDPOINTS.USERS.SEARCH}?${params.toString()}`, {
      method: "GET",
    });

    if (Array.isArray(res)) return res;
    if (Array.isArray(res?.data)) return res.data;
    if (Array.isArray(res?.users)) return res.users;
    return [];
  } catch {
    return [];
  }
}

export async function searchUsers(q: string): Promise<SearchedUser[]> {
  const rawQuery = q.trim();
  if (!rawQuery) return [];

  // 1. Primary search query (safe term without '+')
  const safeQuery = rawQuery.replace(/\+/g, "").trim();
  const primaryResults = await fetchUserSearch(safeQuery);

  // Check if search query is numeric/phone number format
  const isNumericPhone = /^\+?[\d\s-]+$/.test(rawQuery);
  if (!isNumericPhone) {
    return primaryResults;
  }

  // 2. Generate clean digit phone variations WITHOUT '+'
  const cleanDigits = rawQuery.replace(/\D/g, "");
  if (!cleanDigits) return primaryResults;

  const variations: string[] = [cleanDigits];

  if (cleanDigits.startsWith("0")) {
    variations.push(`88${cleanDigits}`);
    variations.push(cleanDigits.slice(1));
  } else if (cleanDigits.startsWith("880")) {
    variations.push(cleanDigits.slice(2)); // e.g. 017...
    variations.push(cleanDigits.slice(3)); // e.g. 17...
  } else {
    variations.push(`0${cleanDigits}`);
    variations.push(`880${cleanDigits}`);
  }

  // Deduplicate search variations
  const uniqueVariations = Array.from(new Set(variations)).filter((v) => v !== safeQuery);

  // 3. Fetch variations in parallel
  const secondaryPromises = uniqueVariations.map((v) => fetchUserSearch(v));
  const secondaryResultsArray = await Promise.all(secondaryPromises);

  // 4. Merge unique results by _id
  const userMap = new Map<string, SearchedUser>();
  for (const user of primaryResults) {
    if (user && user._id) userMap.set(user._id, user);
  }
  for (const list of secondaryResultsArray) {
    for (const user of list) {
      if (user && user._id) userMap.set(user._id, user);
    }
  }

  return Array.from(userMap.values());
}
