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
import { RepairSaleContextProvider } from "./context/repair_sale_context";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthContextProvider>
      <ErrorProvider>
        <CustomerContextProvider>
          <UserContextProvider>
            <ProductContextProvider>
              <RepairContextProvider>
                <RepairSaleContextProvider>
                  <SaleContextProvider>
                    <SaleItemsContextProvider>
                      <AllRoutes />
                    </SaleItemsContextProvider>
                  </SaleContextProvider>
                </RepairSaleContextProvider>
              </RepairContextProvider>
            </ProductContextProvider>
          </UserContextProvider>
        </CustomerContextProvider>
      </ErrorProvider>
    </AuthContextProvider>
  </StrictMode>
);
