import { BoxIcon, BoxSelect, Clock5, Package, PackagePlus } from "lucide-react";
import Topbar from "../components/topbar";
import StatCard from "../components/statcard";
import Loader from "../components/loader";
import { AddProduct } from "../components/Inventory_components/invetory_add_modal";
import { InventoryListItem } from "../components/Inventory_components/inventory_list_item";
import { UseProductContext } from "../context/productContext";
import { useEffect, useState } from "react";

export const Inventory = () => {
  const { products } = UseProductContext();
  const [searchTerm, setSearchTerm] = useState("");

  const statItems = [
    { id: 1, title: "Available", value: products.length, icon: <BoxIcon /> },
    { id: 2, title: "New Arrivals", value: 20, icon: <PackagePlus /> },
    { id: 3, title: "Low stocks", value: 10, icon: <Clock5 /> },
    { id: 4, title: "Recently Ordered", value: products.length, icon: <Package /> },
  ];

  useEffect(() => {
    console.log(products);
  }, [products]);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );


  return (
    <div className="w-full min-h-screen bg-gray-50">
      <Topbar title={"Inventory"} />
      <div className="flex flex-wrap justify-center gap-6 px-4 py-6 md:justify-between max-w-7xl mx-auto">
        {statItems.map((item) => (
          <StatCard
            key={item.id}
            icon={item.icon}
            title={item.title}
            value={item.value}
          />
        ))}
      </div>
      <div className="flex flex-col md:flex-row md:items-center justify-between px-6 md:px-20 py-4 gap-4">
      <input
          type="text"
          placeholder="Search products by name..."
          className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <AddProduct />
      </div>
      <div className="px-4 pb-10 max-w-7xl mx-auto">
        {products.length === 0 ? (
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
