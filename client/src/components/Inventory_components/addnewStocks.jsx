import { Monitor, X, PackagePlus } from "lucide-react";
import { useEffect, useState } from "react";
import apiService from "../../utilities/httpservices";
import Cookies from "js-cookie";
import { UseProductContext } from "../../context/productContext";

export const AddNewStocks = ({
  id,
  modelCode,
  buyingprice,
  sellingprice,
  dealersprice
}) => {
  const { refreshProducts } = UseProductContext();
  const [quantity, setQuantity] = useState(1);
  const [showmenu, setShowmenu] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const token = Cookies.get("token");

  useEffect(() => {
    // Calculate total price whenever quantity or buyingprice changes
    const newTotal = Number(quantity) * Number(buyingprice);
    setTotalPrice(newTotal);
  }, [quantity, buyingprice]);

  const handleSave = async () => {
    const data = {
      product_id: id,
      model_id: modelCode,
      unit_buying_price: buyingprice,
      quantity: quantity,
      total_amount: totalPrice
    };
    refreshProducts();
    console.log(data);
    try {
      const result = await apiService.createData('stock-log', data, token);
      console.log("pressed");
      setShowmenu(false);
    } catch (error) {
      console.log(error);
    }
    
  };

  return (
    <div>
      {/* Open Button */}
      <button
        className="py-1 rounded px-2 bg-blue-800 text-white flex gap-1 text-sm hover:bg-blue-700 transition"
        onClick={() => setShowmenu(true)}
      >
        <Monitor size={16} />
        <span>Add</span>
      </button>

      {showmenu && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black-900 bg-opacity-30 backdrop-blur-sm"
            style={{ zIndex: 1000 }}
            onClick={() => setShowmenu(false)}
          ></div>

          {/* Modal */}
          <div
            className="fixed inset-0 flex items-center justify-center p-4"
            style={{ zIndex: 1001 }}
          >
            <div className="w-full max-w-lg bg-white p-5 rounded-2xl shadow-lg">
              {/* Header */}
              <div className="flex justify-between items-center border-b pb-3 mb-4">
                <div className="text-lg font-semibold flex gap-2 items-center">
                  <PackagePlus size={20} />
                  Add New Stocks
                </div>
                <button
                  className="bg-red-500 hover:bg-red-600 text-white rounded-full p-1"
                  onClick={() => setShowmenu(false)}
                >
                  <X size={18} />
                </button>
              </div>

              {/* Form */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Quantity</label>
                  <input
                    type="number" // Changed to number for better UX
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full border rounded px-3 py-1.5 text-sm focus:ring focus:ring-blue-200"
                    min="1" // Ensure quantity is at least 1
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Buying Price</label>
                  <div className="w-full border rounded px-3 py-1.5 text-sm bg-gray-100 flex items-center">
                    <span className="font-semibold">Rs. {Number(buyingprice).toFixed(2)}</span>
                  </div>
                </div>
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Total Price</label>
                  <div className="w-full border rounded px-3 py-1.5 text-sm bg-blue-50">
                    <span className="font-bold text-blue-800 text-lg">Rs. {totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end mt-5">
                <button
                  className="bg-blue-800 hover:bg-blue-700 text-sm py-1.5 px-4 text-white rounded transition"
                  onClick={handleSave}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};