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
import { ItemCategoriesContextProvider } from "./context/itemCategory_context";
import { SaleItemsContextProvider } from "./context/saleItemsContext";
import { SaleContextProvider } from "./context/salesContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthContextProvider>
      <ErrorProvider>
        <ItemCategoriesContextProvider>
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
        </ItemCategoriesContextProvider>
      </ErrorProvider>
    </AuthContextProvider>
  </StrictMode>
);
