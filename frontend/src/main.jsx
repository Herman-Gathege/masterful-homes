// frontend/src/main.jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { SidebarProvider } from "./context/SidebarContext";

createRoot(document.getElementById("root")).render(
  <SidebarProvider>
    <StrictMode>
      <App />
    </StrictMode>
  </SidebarProvider>
);
