import React, { useEffect, useMemo, useRef, useState } from "react";
import { useApp } from "../../context/AppContext";
import { searchPhotos, triggerDownload } from "../../services/unsplash";

export default function ImageSearch({ onSelect }) {
  const { settings, setSettings } = useApp();
  const [keyword, setKeyword] = useState(settings.lastKeyword || "");
  const [query, setQuery] = useState(settings.lastKeyword || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const t = setTimeout(() => setQuery(keyword.trim()), 500);
    return () => clearTimeout(t);
  }, [keyword]);

  useEffect(() => {
    async function run() {
      if (!query) {
        setResults([]);
        setPage(1);
        setTotalPages(1);
        return;
      }
      setLoading(true);
      setError("");
      try {
        const data = await searchPhotos(query, 1, 24);
        setResults(data.results);
        setPage(1);
        setTotalPages(data.total_pages || 1);
        setSettings({ ...settings, lastKeyword: query });
      } catch (err) {
        setError("Unable to load images. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    run();
  }, [query]);

  async function choose(img) {
    await triggerDownload(img.downloadLocation);

    onSelect(img);
  }

  async function loadMore() {
    if (page >= totalPages) return;
    const next = page + 1;
    setLoading(true);
    try {
      const data = await searchPhotos(query, next, 24);
      setResults((prev) => [...prev, ...data.results]);
      setPage(next);
      setTotalPages(data.total_pages || next);
    } catch (e) {
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container-narrow">
      <h2 className="mb-3">Search for a Photo</h2>
      <p className="text-soft">
        Enter any keyword and click search (e.g. "nature", "flowers", "city",
        etc...).
      </p>

      <div className="input-group mb-3" style={{ maxWidth: "600px" }}>
        <input
          type="text"
          className="form-control form-control-lg"
          placeholder="Try: nature, flowers, city, beach..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          aria-label="Search photos keyword"
        />
        <button
          className="btn btn-dark"
          onClick={() => setQuery(keyword.trim())}
        >
          Search
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row g-3">
        {results.map((img) => (
          <div key={img.id} className="col-6 col-md-3">
            <button
              className="w-100 p-0 border-0 bg-transparent"
              onClick={() => choose(img)}
              aria-label={`Choose photo by ${img.authorName}`}
            >
              <div
                className="square"
                style={{
                  backgroundImage: `url(${img.thumbUrl})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  borderRadius: "12px",
                  boxShadow: "var(--shadow)",
                  border: "1px solid var(--border)",
                }}
              ></div>
            </button>
            <div className="mt-1 text-soft" style={{ fontSize: "12px" }}>
              Photo by{" "}
              <a href={img.authorUrl} target="_blank" rel="noreferrer">
                {img.authorName}
              </a>{" "}
              on{" "}
              <a href="https://unsplash.com" target="_blank" rel="noreferrer">
                Unsplash
              </a>
            </div>
          </div>
        ))}
      </div>

      {results.length > 0 && page < totalPages && (
        <div className="mt-3">
          <button
            className="btn btn-outline-dark btn-big"
            onClick={loadMore}
            disabled={loading}
          >
            {loading ? "Loading…" : "Load more"}
          </button>
        </div>
      )}
    </div>
  );
}
