import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { instalarInterceptorFetch } from "./services/auth";

instalarInterceptorFetch();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);