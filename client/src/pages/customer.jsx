import { Contact, Search, UserRoundCog, UserStar, Users } from "lucide-react";
import GlobalError from "../components/globalError";
import Topbar from "../components/topbar";
import { UseProductContext } from "../context/productContext";
import { useState } from "react";
import StatCard from "../components/statcard";
import { NewCustomer } from "../components/Customer/newCustome";

export const Customer = () => {
  const { products, getLowStockProducts, getThisWeekProducts } = UseProductContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const lowstock = getLowStockProducts();
  const newArrivals = getThisWeekProducts();

  const statItems = [
    {
      id: "all",
      title: "All Customers",
      value: products.length,
      icon: <Users />,
    },
    {
      id: "new",
      title: "Frequent Customers",
      value: newArrivals.length,
      icon: <UserStar />,
    },
    {
      id: "low",
      title: "Urgent Customers",
      value: lowstock.length,
      icon: <UserRoundCog />,
    },
    {
      id: "recent",
      title: "Recently Customer",
      value: products.length,
      icon: <Contact />,
    },
  ];

  const getFilteredByTab = () => {
    if (activeTab === "low") return lowstock;
    if (activeTab === "new") return newArrivals;
    return products; // default to all
  };

  const filteredProducts = getFilteredByTab().filter((product) =>
    product.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full">
      <Topbar title={"Customers"} />

      <div className="flex flex-wrap justify-center gap-6 px-4 py-6 md:justify-between max-w-7xl mx-auto">
        {statItems.map((item) => (
          <div
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`cursor-pointer transition-all ${
              activeTab === item.id
                ? "scale-105"
                : "opacity-80 hover:opacity-100"
            }`}
          >
            <StatCard icon={item.icon} title={item.title} value={item.value} />
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 py-5 px-10">
        <div className="relative w-full sm:w-80 bg-white rounded">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by username..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>
        <NewCustomer />
      </div>
    </div>
  );
};
