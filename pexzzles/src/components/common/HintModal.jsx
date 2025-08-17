import React, { useEffect } from "react";
import { createPortal } from "react-dom";

export default function HintModal({ open, image, grid, onCancel }) {
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => onCancel?.(), 4000);
    return () => clearTimeout(t);
  }, [open, onCancel]);

  if (!open) return null;

  return createPortal(
    <div
      className="modal fade show"
      style={{ display: "block", background: "rgba(0,0,0,.6)" }}
      role="dialog"
      aria-modal="true"
      aria-label="Hint - original image preview"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div
          className="modal-content"
          style={{ borderRadius: "16px", overflow: "hidden" }}
        >
          <div className="modal-header">
            <h5 className="modal-title">Hint (shows for 4 seconds)</h5>
            <button
              type="button"
              className="btn-close"
              aria-label="Close hint"
              onClick={onCancel}
            ></button>
          </div>
          <div className="modal-body">
            <div
              className="square"
              style={{
                backgroundImage: `url(${image?.fullUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                borderRadius: "12px",
                boxShadow: "var(--shadow)",
                border: "1px solid var(--border)",
              }}
            />
            <div className="mt-2 text-soft" style={{ fontSize: "12px" }}>
              Original image preview for a {grid}×{grid} puzzle. Photo by{" "}
              <a href={image?.authorUrl} target="_blank" rel="noreferrer">
                {image?.authorName}
              </a>{" "}
              on{" "}
              <a href="https://unsplash.com" target="_blank" rel="noreferrer">
                Unsplash
              </a>
              .
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
