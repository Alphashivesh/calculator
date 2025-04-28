import React from "react";
import ReactDOM from "react-dom/client"; // Use createRoot for React 18+

import App from "./App"; // Import your main App component
import "./styles.css"; // Import your global styles

// Find the root div in public/index.html
const rootElement = document.getElementById("root");
const root = ReactDOM.createRoot(rootElement);

// Render your App component into that div
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
