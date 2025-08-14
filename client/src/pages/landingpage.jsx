import { Route, Routes } from "react-router-dom";
import { Dashboard } from "./Dashboard";
import Sidebar from "../components/navigation";
import { Sales } from "./sales";
import { Products } from "./products";
import { Reports } from "./Reports";
import { Inventory } from "./Inventory";
import { Customer } from "./customer";
import { Repairs } from "./repairs";
import { NewSale } from "../components/sales/newsale";
// import { TasksManger } from "./taskmanger"
// import { UserProfile } from "./userProfilePage"
// import { UsersPage } from "./Users"

export const LandingPage = () => {
  return (
    <div className="flex">
      <Sidebar />

      <div className="max-h-screen overflow-auto w-full">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/sales" element={<Sales />} />
          <Route path="/products" element={<Products />} />
          <Route path="/repairs" element={<Repairs />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/customer" element={<Customer />} />
          <Route path="/New Sale" element={<NewSale />} />
          {/* <Route
                    path="/users"
                    element={<UsersPage/>}
                /> */}
        </Routes>
      </div>
    </div>
  );
};
