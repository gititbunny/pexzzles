import React, { useState } from "react";
import { useApp } from "../../context/AppContext";

export default function NameForm({ onNext }) {
  const { name, setName } = useApp();
  const [value, setValue] = useState(name);

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = (value || "").trim();
    if (!trimmed) return;
    setName(trimmed);
    onNext();
  }

  return (
    <div className="container-narrow">
      <h1 className="mb-3">Welcome to Pexzzles</h1>
      <p className="text-soft">
        Let’s personalize your experience. What should we call you?
      </p>
      <form onSubmit={handleSubmit} className="mt-3">
        <div className="mb-3">
          <input
            type="text"
            className="form-control form-control-lg"
            placeholder="Enter your name"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            aria-label="Your name"
          />
        </div>
        <button type="submit" className="btn btn-dark btn-big">
          Continue
        </button>
      </form>
    </div>
  );
}
