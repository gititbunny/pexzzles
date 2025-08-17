const ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;

const API_BASE = "https://api.unsplash.com";

export function toSquare(url, size = 1200) {
  const sep = url.includes("?") ? "&" : "?";
  return `${url}${sep}w=${size}&h=${size}&fit=crop`;
}

export async function searchPhotos(keyword, page = 1, perPage = 24) {
  if (!ACCESS_KEY) throw new Error("Missing VITE_UNSPLASH_ACCESS_KEY");

  const params = new URLSearchParams({
    query: keyword,
    page: String(page),
    per_page: String(perPage),
    orientation: "squarish",
  });

  const res = await fetch(`${API_BASE}/search/photos?${params.toString()}`, {
    headers: { Authorization: `Client-ID ${ACCESS_KEY}` },
  });
  if (!res.ok) throw new Error("Unsplash search failed");

  const data = await res.json();
  const results = (data.results || []).map((p) => {
    const authorName = p.user?.name || "Unknown";
    const authorUrl = p.user?.links?.html || p.user?.portfolio_url || "#";
    const raw = p.urls?.raw || p.urls?.regular || p.urls?.full || "";
    const thumb = p.urls?.thumb || p.urls?.small || p.urls?.regular || "";
    const downloadLocation = p.links?.download_location; // required to trigger download
    return {
      id: p.id,
      authorName,
      authorUrl,
      thumbUrl: toSquare(thumb, 400),
      fullUrl: toSquare(raw, 1200),
      downloadLocation,
    };
  });

  return { results, total: data.total, total_pages: data.total_pages };
}

export async function triggerDownload(downloadLocation) {
  if (!downloadLocation) return;
  const res = await fetch(`${downloadLocation}&client_id=${ACCESS_KEY}`);

  return res.ok;
}
