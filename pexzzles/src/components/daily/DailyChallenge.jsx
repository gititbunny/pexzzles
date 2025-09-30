import React, { useEffect, useState } from "react";
import { searchPhotos, triggerDownload } from "../../services/unsplash";

function hashSeed(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24);
  }
  return h >>> 0;
}

function todayLocalISO() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export default function DailyChallenge({ grid, onSelect, onBack }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [image, setImage] = useState(null);
  const [seed, setSeed] = useState(todayLocalISO());

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError("");
      try {
        const keywords = [
          "landscape",
          "nature",
          "mountains",
          "flowers",
          "beach",
          "forest",
          "animals",
          "sunrise",
          "lake",
          "river",
        ];
        const kIdx = hashSeed(seed + ":kw") % keywords.length;
        const keyword = keywords[kIdx];

        const data = await searchPhotos(keyword, 1, 30);
        if (!data.results.length)
          throw new Error("No images found for daily challenge.");
        const iIdx = hashSeed(seed + ":img") % data.results.length;
        const chosen = data.results[iIdx];

        setImage(chosen);
      } catch (e) {
        setError("Unable to load today’s challenge. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [seed]);

  async function start() {
    if (!image) return;
    await triggerDownload(image.downloadLocation);
    onSelect(image, seed);
  }

  return (
    <div className="container-narrow">
      <h2 className="mb-2">Daily Challenge</h2>
      <div className="text-soft mb-3" style={{ fontSize: 14 }}>
        Date: <strong>{seed}</strong> • Grid:{" "}
        <strong>
          {grid}×{grid}
        </strong>
      </div>

      {loading && (
        <div className="alert alert-secondary">Preparing today’s puzzle…</div>
      )}
      {error && (
        <div className="alert alert-danger d-flex align-items-center justify-content-between">
          <span>{error}</span>
          <button className="btn btn-sm btn-outline-dark" onClick={onBack}>
            Back
          </button>
        </div>
      )}

      {!loading && !error && image && (
        <>
          <div className="row g-3">
            <div className="col-12 col-md-6">
              <div
                className="square"
                style={{
                  backgroundImage: `url(${image.fullUrl})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  borderRadius: "12px",
                  boxShadow: "var(--shadow)",
                  border: "2px solid var(--border)",
                }}
              />
            </div>
            <div className="col-12 col-md-6">
              <div className="card" style={{ borderRadius: 12 }}>
                <div className="card-body">
                  <h5 className="card-title">Today’s Image</h5>
                  <p className="card-text text-soft" style={{ fontSize: 14 }}>
                    Photo by{" "}
                    <a href={image.authorUrl} target="_blank" rel="noreferrer">
                      {image.authorName}
                    </a>{" "}
                    on{" "}
                    <a
                      href="https://unsplash.com"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Unsplash
                    </a>
                    .
                  </p>
                  <button className="btn btn-dark btn-big me-2" onClick={start}>
                    Start
                  </button>
                  <button
                    className="btn btn-outline-dark btn-big"
                    onClick={onBack}
                  >
                    Back
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
