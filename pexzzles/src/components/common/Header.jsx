import React from "react";
import logo from "../../assets/logos/pexzzles-logo.svg";
import { useApp } from "../../context/AppContext";

export default function Header() {
  const { name, setName } = useApp();

  function handleSwitchUser() {
    setName("");
  }

  return (
    <div
      className="container-narrow d-flex align-items-center justify-content-between"
      style={{ paddingTop: "24px" }}
    >
      <img
        src={logo}
        alt="Pexzzles - Cognitive Photo Puzzles"
        className="logo"
      />
      <div className="d-flex align-items-center gap-2">
        {name ? (
          <span className="text-soft me-2" aria-live="polite">
            Hi, <strong>{name}</strong>
          </span>
        ) : null}
        <button
          className="btn btn-outline-dark btn-sm"
          onClick={handleSwitchUser}
          aria-label="Change name to switch user"
          title="Switch user"
        >
          Change name
        </button>
      </div>
    </div>
  );
}
