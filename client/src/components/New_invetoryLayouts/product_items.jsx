import { useParams } from "react-router-dom";
import Topbar from "../topbar";
import apiService from "../../utilities/httpservices";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { PlusCircle, Save, Search, Settings, ShoppingBag, WrenchIcon } from "lucide-react"; // Added Settings icon

export const ProductItems = () => {
  const { product_id } = useParams();
  const token = Cookies.get("token");

  // Product info
  const [productname, setProductName] = useState("");
  const [category, setCategory] = useState("");
  const [itemmodel_id, setItemmodelId] = useState("");
  const [description, setDescription] = useState("");

  // Item form
  const [serial_no, setSerial_No] = useState("");
  const [buying_price, setBuyingPrice] = useState("");
  const [retail_price, setRetailPrice] = useState("");
  const [dealers_price, setDealersPrice] = useState("");
  const [warranty_period, setWarrantyPeriod] = useState("");
  const [item_status, setItemStatus] = useState("Available");
  const [conditions, setConditions] = useState("");

  // Item list
  const [productItems, setProductItems] = useState([]);
  const [filter, setFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // --- API Calls ---
  const getProductDetails = async () => {
    try {
      const results = await apiService.getDataById("products", product_id, token);
      setProductName(results.name);
      setItemmodelId(results.itemmodel_id);
      setCategory(results.category);
      setDescription(results.description);
    } catch (error) {
      console.log(error);
    }
  };

  const getProductItemsById = async () => {
    try {
      const results = await apiService.getDataById("product_items/byProduct", product_id, token);
      setProductItems(results);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const data = {
      serial_no,
      buying_price,
      retail_price,
      dealers_price,
      warranty_period,
      item_status,
      conditions,
      product_id,
    };
    try {
      await apiService.createData("product_items", data, token);
      alert("Item added successfully!");
      setSerial_No(""); setBuyingPrice(""); setRetailPrice(""); setDealersPrice("");
      setWarrantyPeriod(""); setItemStatus("Available"); setConditions("");
      getProductItemsById();
    } catch (error) {
      console.error(error);
      alert("Failed to save item.");
    }
  };

  useEffect(() => {
    getProductDetails();
    getProductItemsById();
  }, []);

  // --- Filter, Paginate, and Count Logic ---
  const filteredItems = productItems.filter(
    (item) =>
      item.serial_no?.toLowerCase().includes(filter.toLowerCase()) ||
      item.conditions?.toLowerCase().includes(filter.toLowerCase())
  );
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const displayedItems = filteredItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const countByCondition = (cond) => productItems.filter((i) => i.conditions === cond).length;

  // Function to determine badge style
  const getConditionBadge = (condition) => {
    switch (condition) {
      case "Brand New":
        return "bg-green-100 text-green-800 font-medium px-2 py-0.5 rounded-full";
      case "Used":
        return "bg-yellow-100 text-yellow-800 font-medium px-2 py-0.5 rounded-full";
      default:
        return "bg-gray-100 text-gray-800 font-medium px-2 py-0.5 rounded-full";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Topbar title="Product Details" />

      {/* --- Product Overview (Improved Layout: Focused Center) --- */}
      <div className="mx-auto mt-7 px-1 sm:px-2 lg:px-4">
        <div className="max-w-8xl mx-auto p-6 bg-white rounded-xl shadow-xl border-t-4 border-indigo-500">
          <h2 className="text-2xl font-extrabold mb-4 text-gray-900 flex items-center gap-2">
            <Settings className="w-6 h-6 text-indigo-500" />
            {productname} Information
          </h2>

          {/* Info Group: Uses 3 columns on medium screens and up */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-12 mb-6">
            <div className="flex flex-col border-l-4 border-indigo-100 pl-3">
              <strong className="text-sm uppercase tracking-wider text-gray-500">Model ID</strong>
              <span className="text-xl font-bold text-gray-900">{itemmodel_id}</span>
            </div>
            <div className="flex flex-col border-l-4 border-indigo-100 pl-3">
              <strong className="text-sm uppercase tracking-wider text-gray-500">Category</strong>
              <span className="text-xl font-bold text-gray-900">{category}</span>
            </div>
            <div className="flex flex-col border-l-4 border-indigo-100 pl-3">
              <strong className="text-sm uppercase tracking-wider text-gray-500">Total Items</strong>
              <span className="text-xl font-bold text-gray-900">{productItems.length}</span>
            </div>
          </div>

          {/* Description: Always takes full available width */}
          <div className="pt-4 mt-4 border-t border-gray-100">
            <strong className="text-sm uppercase tracking-wider text-gray-500 mb-2 block">Description</strong>
            <p className="text-gray-700 leading-relaxed italic">
              {description}
            </p>
          </div>
        </div>
      </div>
      {/* ----------------------------------------------------------- */}

      {/* Main content: Form + List */}
      <div className="flex flex-col lg:flex-row gap-6 mx-auto px-1 sm:px-2 lg:px-4 max-w-8xl mt-6">
        
        {/* Left: Item Form - Fixed width on large screens */}
        <div className="lg:w-1/3 w-full bg-white shadow-xl rounded-xl p-6 border border-gray-100 h-fit">
          <div className="flex items-center gap-3 border-b pb-3 mb-5">
            <PlusCircle className="text-green-600 w-6 h-6" />
            <h2 className="text-xl font-semibold text-gray-800">Add New Inventory Item</h2>
          </div>
          <form onSubmit={handleSave} className="space-y-4">
            <input type="text" placeholder="Serial No (Unique Identifier)" required
              value={serial_no} onChange={(e) => setSerial_No(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 outline-none transition" />
            
            {/* Price fields group - using a 2-column grid on small screens and up */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input type="number" placeholder="Buying Price (Rs.)" required
                value={buying_price} onChange={(e) => setBuyingPrice(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 outline-none transition" />
              <input type="number" placeholder="Retail Price (Rs.)" required
                value={retail_price} onChange={(e) => setRetailPrice(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 outline-none transition" />
              <input type="number" placeholder="Dealer Price (Rs.)" required
                value={dealers_price} onChange={(e) => setDealersPrice(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 outline-none transition" />
            </div>

            <select value={warranty_period} onChange={(e) => setWarrantyPeriod(e.target.value)} required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 outline-none transition appearance-none bg-white">
              <option value="">-- Select Warranty Period --</option>
              <option value="No Warranty">No Warranty</option>
              <option value="1 Month">1 Month</option>
              <option value="3 Months">3 Months</option>
              <option value="6 Months">6 Months</option>
              <option value="1 Year">1 Year</option>
              <option value="2 Years">2 Years</option>
            </select>
            
            <select value={conditions} onChange={(e) => setConditions(e.target.value)} required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 outline-none transition appearance-none bg-white">
              <option value="">-- Select Condition --</option>
              <option value="Brand New">Brand New</option>
              <option value="Used">Used</option>
            </select>
            
            <button type="submit" className="flex items-center justify-center w-full gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold shadow-md hover:bg-indigo-700 transition duration-200">
              <Save className="w-5 h-5" /> Save Item to Inventory
            </button>
          </form>
        </div>

        {/* Right: Item List - Takes up remaining width */}
        <div className="lg:w-2/3 w-full flex flex-col gap-6">
          
          {/* Filter and counts Card */}
          <div className="bg-white p-4 rounded-xl shadow-md border border-gray-100">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              {/* Search */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Search className="text-gray-500 w-5 h-5" />
                <input type="text" value={filter} onChange={(e) => setFilter(e.target.value)}
                  placeholder="Search serial or condition..."
                  className="border rounded-lg px-3 py-2 w-full focus:ring-indigo-500 focus:border-indigo-500 outline-none transition" />
              </div>
              
              {/* Counts */}
              <div className="flex gap-4 text-sm font-medium">
                <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full">
                  Brand New: <strong>{countByCondition("Brand New")}</strong>
                </span>
                <span className="px-3 py-1 bg-yellow-50 text-yellow-700 rounded-full">
                  Used: <strong>{countByCondition("Used")}</strong>
                </span>
                <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full">
                  Total: <strong>{productItems.length}</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Item List Table */}
          <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-200">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-100 text-gray-700 uppercase tracking-wider border-b">
                  <tr>
                    <th className="px-4 py-2 text-center">Serial No</th>
                    <th className="px-4 py-2 text-center">Condition</th>
                    <th className="px-4 py-2 text-center">Warranty</th>
                    <th className="px-4 py-2 text-center hidden sm:table-cell">Retail Price</th>
                    <th className="px-4 py-2 text-center hidden md:table-cell">Dealer Price</th>
                    <th className="px-4 py-2 text-center">Status</th>
                    <th className="px-4 py-2 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {displayedItems.length > 0 ? (
                    displayedItems.map((item) => (
                      <tr key={item.id} className="hover:bg-indigo-50 transition duration-150">
                        <td className="px-4 py-2 font-medium text-gray-800 text-center">{item.serial_no}</td>
                        <td className="px-4 py-2 text-center">
                          <span className={getConditionBadge(item.conditions)}>{item.conditions}</span>
                        </td>
                        <td className="px-4 py-2 text-gray-600 text-center">{item.warranty_period || 'N/A'}</td>
                        <td className="px-4 py-2 text-center font-semibold hidden sm:table-cell ">Rs.{item.retail_price}</td>
                        <td className="px-4 py-2 text-gray-500 hidden md:table-cell text-center">Rs.{item.dealers_price}</td>
                        <td className="px-4 py-2 text-center">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${item.item_status === "Available" ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}>
                            {item.item_status}
                          </span>
                        </td>
                        <td className="px-4 py-3 flex items-center justify-center gap-2">
                          <div className="flex items-center justify-center px-2 py-1 bg-green-500 text-white rounded-3xl"> <button><ShoppingBag size={16} /></button></div>
                          <div className="flex items-center justify-center px-2 py-1 bg-red-500 text-white rounded-3xl"> <button><WrenchIcon size={16} /> </button></div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-gray-500 italic">
                        No items found for this product.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-2 pb-6">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button key={page} onClick={() => setCurrentPage(page)}
                  className={`px-4 py-2 text-sm rounded-full font-medium transition duration-200 ${
                    currentPage === page ? "bg-indigo-600 text-white shadow-md" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}>
                  {page}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};