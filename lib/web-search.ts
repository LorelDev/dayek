export type SearchResult = {
  title: string;
  url: string;
  content: string;
};

export async function tavilySearch(query: string, max = 5): Promise<SearchResult[]> {
  const apiKey = process.env.TAVILY_API_KEY;
  if (!apiKey) return [];

  const res = await fetch("https://api.tavily.com/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      api_key: apiKey,
      query,
      search_depth: "basic",
      max_results: max,
      include_answer: false,
    }),
  });

  if (!res.ok) {
    console.error("Tavily error:", res.status, await res.text().catch(() => ""));
    return [];
  }

  const data = await res.json();
  const results = Array.isArray(data?.results) ? data.results : [];
  return results.map((r: { title?: string; url: string; content?: string }) => ({
    title: r.title || r.url,
    url: r.url,
    content: r.content || "",
  }));
}
