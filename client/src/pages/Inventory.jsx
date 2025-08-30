import { BoxIcon, Clock5, Package, PackagePlus } from "lucide-react";
import Topbar from "../components/topbar";
import StatCard from "../components/statcard";
import { AddProduct } from "../components/Inventory_components/invetory_add_modal";
import { InventoryListItem } from "../components/Inventory_components/inventory_list_item";
import { UseProductContext } from "../context/productContext";
import { useState } from "react";
import { Link } from "react-router-dom";

export const Inventory = () => {
  const { products, getLowStockProducts, getThisWeekProducts } = UseProductContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const lowstock = getLowStockProducts();
  const newArrivals = getThisWeekProducts();

  const statItems = [
    { id: "all", title: "Available", value: products.length, icon: <BoxIcon /> },
    { id: "new", title: "New Arrivals", value: newArrivals.length, icon: <PackagePlus /> },
    { id: "low", title: "Low stocks", value: lowstock.length, icon: <Clock5 /> },
    { id: "recent", title: "Recently Ordered", value: products.length, icon: <Package /> },
  ];

  // Decide which list to show based on active tab
  const getFilteredByTab = () => {
    if (activeTab === "low") return lowstock;
    if (activeTab === "new") return newArrivals;
    return products; // default to all
  };

  const filteredProducts = getFilteredByTab().filter((product) =>
    product.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <Topbar title={"Inventory"} />

      {/* Stats Section */}
      <div className="flex flex-wrap justify-center gap-6 px-4 py-6 md:justify-between max-w-7xl mx-auto">
        {statItems.map((item) => (
          <div
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`cursor-pointer transition-all ${
              activeTab === item.id ? "scale-105" : "opacity-80 hover:opacity-100"
            }`}
          >
            <StatCard
              icon={item.icon}
              title={item.title}
              value={item.value}
            />
          </div>
        ))}
      </div>

      {/* Search + Add Product */}
      <div className="flex flex-col md:flex-row md:items-center justify-between px-6 md:px-20 py-4 gap-4">
        <input
          type="text"
          placeholder="Search products by name..."
          className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="flex flex-row-reverse gap-2">
        <AddProduct />
        <Link to={"../p_category"} className="bg-gradient-to-r from-black via-[#0a0f2c] to-[#013ea0] text-white flex p-2 
        rounded cursor-pointer items-center justify-center gap-2 hover:brightness-110 transition">
          Manage Product Categoies
        </Link>
        </div>
      </div>

      {/* Product List */}
      <div className="px-4 pb-10 max-w-7xl mx-auto">
        {filteredProducts.length === 0 ? (
          <p className="text-center text-gray-500 text-lg mt-20">No products found</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-15">
            {filteredProducts.map((product) => (
              <InventoryListItem
                key={product.id}
                id={product.id}
                name={product.name}
                dealers_price={product.dealers_price}
                filePath={product.image_path}
                buyingPrice={product.buying_price}
                price={product.price}
                quantity={product.quantity}
                category={product.category}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Inventory;
