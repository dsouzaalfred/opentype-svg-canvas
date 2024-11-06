import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Helmet } from "react-helmet";

import App from "./App";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <Helmet>
      <style>
        @import
        url('https://fonts.googleapis.com/css2?family=Fredoka:wght@300..700&family=Lobster&family=Oswald:wght@200..700&display=swap');
      </style>
    </Helmet>
    <App />
  </StrictMode>
);
