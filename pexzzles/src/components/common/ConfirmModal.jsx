import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

export default function ConfirmModal({ open, image, grid, onStart, onCancel }) {
  const modalRef = useRef(null);

  useEffect(() => {
    function handleEsc(e) {
      if (e.key === "Escape" && open) onCancel();
    }
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [open, onCancel]);

  if (!open) return null;

  return createPortal(
    <div
      className="modal fade show"
      style={{ display: "block", background: "rgba(0,0,0,.5)" }}
      role="dialog"
      aria-modal="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content" style={{ borderRadius: "16px" }}>
          <div className="modal-header">
            <h5 className="modal-title">Ready to start?</h5>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
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
              }}
            ></div>
            <div className="mt-3">
              <div className="text-soft">
                Grid size:{" "}
                <strong>
                  {grid}×{grid}
                </strong>
              </div>
              <div className="text-soft">
                Photo by{" "}
                <a href={image?.authorUrl} target="_blank" rel="noreferrer">
                  {image?.authorName}
                </a>{" "}
                on{" "}
                <a href="https://unsplash.com" target="_blank" rel="noreferrer">
                  Unsplash
                </a>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn btn-outline-secondary" onClick={onCancel}>
              Cancel
            </button>
            <button className="btn btn-dark" onClick={onStart}>
              Start
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
