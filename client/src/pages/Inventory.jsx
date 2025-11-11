import { BoxIcon, Clock5, Edit, File, Package, PackagePlus } from "lucide-react";
import Topbar from "../components/topbar";
import StatCard from "../components/statcard";
import { UseProductContext } from "../context/productContext";
import { useState } from "react";
import { Link } from "react-router-dom";

export const Inventory = () => {
  const { products, getThisWeekProducts } = UseProductContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const lowstock = []; // should be array, not number
  const newArrivals = getThisWeekProducts();

  const statItems = [
    {
      id: "all",
      title: "Available",
      value: products.length,
      icon: <BoxIcon />,
    },
    {
      id: "new",
      title: "New Arrivals",
      value: newArrivals.length,
      icon: <PackagePlus />,
    },
    {
      id: "low",
      title: "Low stocks",
      value: lowstock.length,
      icon: <Clock5 />,
    },
    {
      id: "recent",
      title: "Recently Ordered",
      value: products.length,
      icon: <Package />,
    },
  ];

  // Get products by tab
  const getFilteredByTab = () => {
    if (activeTab === "low") return lowstock;
    if (activeTab === "new") return newArrivals;
    return products;
  };

  // Search filter
  const filteredProducts = getFilteredByTab().filter((product) => {
    const term = searchTerm.toLowerCase();
    const nameMatch = product.name?.toLowerCase().includes(term);
    const modelMatch = String(product.itemmodel_id || "").toLowerCase().includes(term);
    const categoryMatch = product.category?.toLowerCase().includes(term);
    return nameMatch || modelMatch || categoryMatch;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  // Reset page when tab/search changes
  const handleTabChange = (id) => {
    setActiveTab(id);
    setCurrentPage(1);
  };

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <Topbar title={"Inventory"} />

      {/* Stats Section */}
      <div className="flex flex-wrap justify-center gap-6 px-4 py-6 md:justify-between max-w-7xl mx-auto">
        {statItems.map((item) => (
          <div
            key={item.id}
            onClick={() => handleTabChange(item.id)}
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

      {/* Search + Add Product */}
      <div className="flex flex-col md:flex-row md:items-center justify-between px-6 md:px-20 py-2 gap-4">
        <input
          type="text"
          placeholder="Search products by name..."
          className="w-full md:w-64 px-4 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />
        <div className="flex flex-row-reverse gap-2">
          <Link
            to={"../add_products"}
            className="bg-gradient-to-r from-black via-[#0a0f2c] to-[#013ea0] text-white flex p-2 
        rounded cursor-pointer items-center justify-center gap-2 hover:brightness-110 transition"
          >
            Add Product
          </Link>
        </div>
      </div>

      {/* Product List */}
      <div className="overflow-x-auto">
        <table className="w-full max-w-6xl mx-auto bg-white rounded-lg shadow-md overflow-hidden text-sm">
          <thead className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
            <tr>
              <th className="text-left px-4 py-3 font-medium">Product</th>
              <th className="text-left px-4 py-3 font-medium">Category</th>
              <th className="text-left px-4 py-3 font-medium">Description</th>
              <th className="text-left px-4 py-3 font-medium">Added Date</th>
              <th className="text-left px-4 py-3 font-medium">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {currentProducts.map((row, i) => (
              <tr key={i} className="hover:bg-gray-50 transition">
                <td className="px-4 py-3 font-medium text-gray-700">
                  {row.itemmodel_id + " " + row.name}
                </td>
                <td className="px-4 py-3 text-gray-600">{row.category}</td>
                <td className="px-4 py-3 text-gray-600">{row.description}</td>
                <td className="px-4 py-3 text-gray-600">{row.received_date}</td>
                <td className="px-4 py-3 text-gray-600 flex items-center justify-center gap-2">
                  <Link
                    className="py-1 px-2 sm:px-3 bg-blue-600 hover:bg-blue-700 flex gap-1 items-center justify-center rounded text-white text-xs transition"
                    to={`../edit-repairs/${row.id}`}
                  >
                    <Edit size={16} /> Edit
                  </Link>
                  <Link
                    to={`../product_items/${row.id}`}
                    className="py-1 px-2 sm:px-3 bg-green-600 hover:bg-green-700 flex gap-1 items-center justify-center rounded text-white text-xs transition"
                  >
                    <File size={16} /> View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {currentProducts.length === 0 && (
          <div className="text-center py-10 text-gray-500 text-sm">
            No products found.
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-8">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50"
          >
            Previous
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-4 py-2 rounded-md ${
                currentPage === page
                  ? "bg-indigo-600 text-white"
                  : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-100"
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Inventory;
