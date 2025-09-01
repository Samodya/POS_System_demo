import { BoxIcon, Edit, Laptop, X } from "lucide-react";
import { useEffect, useState } from "react";
import { UseitemCategoriesContext } from "../../context/itemCategory_context";
import apiService from "../../utilities/httpservices";
import Cookies from "js-cookie";

export const EditCategry = ({id}) => {
  const [showmenu, setShowmenu] = useState(false);
  const [modelcode, setModelCode] = useState("");
  const [buying_price, setBuyingPrice] = useState(0);
  const [dealers_price, setDealersPrice] = useState(0);
  const [selling_price, setSellingPrice] = useState(0);
  const { refreshItemCategories } = UseitemCategoriesContext();
  const token = Cookies.get('token')

  const getCategory = async () => {
    try {
      const result = await apiService.getDataById('item-category',id, token)
      console.log(result);
      setModelCode(result.modelCode);
      setBuyingPrice(result.buying_price);
      setDealersPrice(result.dealers_price);
      setSellingPrice(result.selling_price);
    } catch (error) {
      console.log(error);
    }
  }



 async function handleSave(){

    const data = {
      modelCode:modelcode,
      buying_price:buying_price,
      dealers_price:dealers_price,
      selling_price:selling_price
    }
    try {
      const result = await apiService.updateData('item-category',id, data, token)

      
      console.log("data added:", result);
      setShowmenu(false)
    } catch (error) {
      console.log(error);
    }

    refreshItemCategories();
  }

  return (
    <div>
      {/* Open Button */}
      <button
        className="py-1 px-2 sm:px-3 bg-blue-600 hover:bg-blue-700 flex gap-1 items-center justify-center rounded text-white text-xs transition"
        onClick={() => {
          setShowmenu(true)
          getCategory()
        }}
      >
        <Edit size={16} />
        <span>Edit</span>
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
                  <Laptop size={20} />
                  Add Category
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
                  <label className="block text-sm font-medium mb-1">
                    Model Code:
                  </label>
                  <input
                    type="text"
                    value={modelcode}
                    onChange={(e) => setModelCode(e.target.value)}
                    className="w-full border rounded px-3 py-1.5 text-sm focus:ring focus:ring-blue-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Buying Price:
                  </label>
                  <input
                    type="number"
                    value={buying_price}
                    onChange={(e) => setBuyingPrice(e.target.value)}
                    className="w-full border rounded px-3 py-1.5 text-sm focus:ring focus:ring-blue-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Dealers Price
                  </label>
                  <input
                    type="text"
                    value={dealers_price}
                    onChange={(e) => setDealersPrice(e.target.value)}
                    className="w-full border rounded px-3 py-1.5 text-sm focus:ring focus:ring-blue-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Selling Price
                  </label>
                  <input
                    type="number"
                    value={selling_price}
                    onChange={(e) => setSellingPrice(e.target.value)}
                    className="w-full border rounded px-3 py-1.5 text-sm focus:ring focus:ring-blue-200"
                  />
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
