import React from "react";
import logo from "../../assets/logos/pexzzles-logo.svg";

export default function Header() {
  return (
    <div
      className="container-narrow d-flex align-items-center justify-content-center"
      style={{ paddingTop: "24px" }}
    >
      <img
        src={logo}
        alt="Pexzzles - Cognitive Photo Puzzles"
        className="logo"
      />
    </div>
  );
}
