import React from "react";

function Display({ previous, operator, current, result }) {
  const historyText =
    result === null // Show ongoing calculation if no final result yet
      ? `${previous || ""} ${operator || ""}`
      : ""; // Or maybe show the full equation leading to the result? Let's keep it simple for now.

  const mainText = result !== null ? result : current; // Show result if available, else current input

  return (
    <div className="display-container">
      <div className="display-history">{historyText}</div>
      <div className="display-main">{mainText}</div>
    </div>
  );
}

export default Display;
