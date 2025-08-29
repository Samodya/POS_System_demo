import { Trash2, X } from "lucide-react";
import { useState } from "react";
import apiService from "../../utilities/httpservices";
import Cookies from "js-cookie";
import { UseProductContext } from "../../context/productContext";


export const DeleteItem = ({ id, productName }) => {
  const [showmenu, setShowmenu] = useState(false);
  const token = Cookies.get('token');
  const { refreshProducts } = UseProductContext();

  const handleDelete = async () => {
    try {
        const result = await apiService.deleteData('products',id, token)
        console.log('Button pressed');
        refreshProducts();
        setShowmenu(false);
    } catch (error) {
        console.log(error);
    }
  }
  return (
    <div>
       <button
            className="flex-1 flex items-center justify-center gap-1 text-white bg-red-600 hover:bg-red-700 rounded-md px-3 py-1 text-sm font-semibold transition"
            aria-label="Delete item"
            onClick={()=>setShowmenu(true)}
          >
            <Trash2 size={16} />
            Delete
          </button>

      {showmenu ? (
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
                  <Trash2 size={20} />
                  Delete User
                </div>
                <button
                  className="bg-red-500 hover:bg-red-600 text-white rounded-full p-1"
                  onClick={() => {
                    setShowmenu(false);
                  }}
                >
                  <X size={18} />
                </button>
              </div>
              <div className="flex items-center justify-center h-20">
                Are you sure you want to delete {productName} from the Inventory?
              </div>

              <div className="flex flex-row-reverse p-2 gap-2">
                <button 
                    onClick={handleDelete}
                
                className="p-2 bg-red-500 text-white font-medium rounded cursor-pointer">
                  Delete
                </button>
                <button
                  className="p-2 bg-yellow-500 text-white font-medium rounded cursor-pointer"
                  onClick={() => {
                    setShowmenu(false);
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </>
      ) : (
        ""
      )}
    </div>
  );
};
