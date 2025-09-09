import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { AuthContextProvider } from "./context/AuthContext";
import { AllRoutes } from "./Routes/Routes";
import { ErrorProvider } from "./context/errorProvider";
import { ProductContextProvider } from "./context/productContext";
import { UserContextProvider } from "./context/usersContext";
import { CustomerContextProvider } from "./context/customerContext";
import { RepairContextProvider } from "./context/repairContext";
import { SaleItemsContextProvider } from "./context/saleItemsContext";
import { SaleContextProvider } from "./context/salesContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthContextProvider>
      <ErrorProvider>
          <CustomerContextProvider>
            <UserContextProvider>
              <ProductContextProvider>
                <RepairContextProvider>
                  <SaleContextProvider>
                    <SaleItemsContextProvider>
                      <AllRoutes />
                    </SaleItemsContextProvider>
                  </SaleContextProvider>
                </RepairContextProvider>
              </ProductContextProvider>
            </UserContextProvider>
          </CustomerContextProvider>
      </ErrorProvider>
    </AuthContextProvider>
  </StrictMode>
);
