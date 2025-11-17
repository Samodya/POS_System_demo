import { Route, Routes } from "react-router-dom";
import { Dashboard } from "./Dashboard";
import Sidebar from "../components/navigation";
import { Sales } from "./sales";
import { Products } from "./products";
import { Reports } from "./Reports";
import { Inventory } from "./Inventory";
import { Customer } from "./customer";
import { Repairs } from "./repairs";
import { Invoice } from "../components/sales/invoiceModal";
import { Users } from "./users";
import { AddRepair } from "../components/repair/addRepair";
import { EditRepair } from "../components/repair/editRepair";
import { ViewSale } from "../components/sales/viewsale";
import { AddProduct } from "../components/New_invetoryLayouts/add_product";
import { ProductItems } from "../components/New_invetoryLayouts/product_items";
import { EditProduct } from "../components/New_invetoryLayouts/edit_product";

export const LandingPage = () => {
  return (
    <div className="flex">
      <Sidebar />
     

      <div className="max-h-screen overflow-auto w-full bg-gray-200">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/sales" element={<Sales />} />
          <Route path="/sales_info/:saleid" element={<ViewSale />} />
          <Route path="/invoice" element={<Invoice />} />
          <Route path="/products" element={<Products />} />
          <Route path="/repairs" element={<Repairs />} />
          <Route path="/new-repairs" element={<AddRepair />} />
          <Route path="/add_products" element={<AddProduct/>} />
          <Route path="/edit-repairs/:id" element={<EditRepair />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/customer" element={<Customer />} />
          <Route path="/users" element={<Users/>} />
          <Route path="/edit_products/:product_id" element={<EditProduct/>}/>
          <Route path="/product_items/:product_id" element={<ProductItems/>}/>
          {/* <Route
                    path="/users"
                    element={<UsersPage/>}
                /> */}
        </Routes>
      </div>
    </div>
  );
};
