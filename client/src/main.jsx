import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthContextProvider } from "./context/AuthContext";
import { AllRoutes } from "./Routes/Routes";
import { ErrorProvider } from "./context/errorProvider";
import { ProductContextProvider } from "./context/productContext";
import { UserContextProvider } from "./context/usersContext";
import { CustomerContextProvider } from "./context/customerContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthContextProvider>
      <ErrorProvider>
        <CustomerContextProvider>
          <UserContextProvider>
            <ProductContextProvider>
              <AllRoutes />
            </ProductContextProvider>
          </UserContextProvider>
        </CustomerContextProvider>
      </ErrorProvider>
    </AuthContextProvider>
  </StrictMode>
);
