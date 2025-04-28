import React from "react";

function Button({ label, onClick, className = "" }) {
  const handleClick = () => {
    onClick(label); // Pass the button's label to the handler
  };

  return (
    <button className={`button ${className}`} onClick={handleClick}>
      {label}
    </button>
  );
}

export default Button;
