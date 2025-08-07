import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthContextProvider } from "./context/AuthContext";
import { AllRoutes } from "./Routes/Routes";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthContextProvider>
      <AllRoutes />
    </AuthContextProvider>
  </StrictMode>
);
