import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Toaster } from "sonner";
import { AuthProvider } from "./context/AuthContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Toaster position="top-right" richColors expand={false} />
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>
);
