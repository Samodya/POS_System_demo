import { BoxIcon, BoxSelect, Clock5, Package, PackagePlus } from "lucide-react";
import Topbar from "../components/topbar";
import StatCard from "../components/statcard";
import Loader from "../components/loader";
import { AddProduct } from "../components/Inventory_components/invetory_add_modal";

export const Inventory = () => {
  const statItems = [
    { id: 1, title: "Available", value: 60, icon: <BoxIcon /> },
    { id: 2, title: "New Arrivals", value: 20, icon: <PackagePlus /> },
    { id: 3, title: "Low stocks", value: 10, icon: <Clock5 /> },
    { id: 4, title: "Recently Ordered", value :10, icon: <Package/> }
  ];
  return (
    <div className="w-full ">
      <Topbar title={"Inventory"} />
      <div className="flex items-center justify-between p-6">
        {statItems.map((item) => (
          <StatCard
            key={item.id}
            icon={item.icon}
            title={item.title}
            value={item.value}
          />
        ))}
      </div>
      <div className="px-20 py-5 flex flex-row-reverse">
        <AddProduct/>
      </div>
    </div>
  );
};
