import { Trash2, X } from "lucide-react";
import { useState } from "react";
import apiService from "../../utilities/httpservices";
import Cookies from "js-cookie";
import { UseUserContext } from "../../context/usersContext";

export const DeleteUser = ({ id, fullname }) => {
  const [showmenu, setShowmenu] = useState(false);
  const token = Cookies.get('token');
  const { refreshUsers } = UseUserContext();

  const handleDelete = async () => {
    try {
        const result = await apiService.deleteData('users',id, token)
        console.log('Button pressed');
        refreshUsers();
        setShowmenu(false)
    } catch (error) {
        console.log(error);
    }
  }
  return (
    <div>
      <button
        onClick={() => setShowmenu(true)}
        className="py-1 px-2 sm:px-3 bg-red-600 hover:bg-red-700 flex gap-1 items-center justify-center rounded text-white text-xs transition"
      >
        <Trash2 size={14} />
        <span className="hidden sm:inline">Delete</span>
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
                Are you sure you want to delete {fullname}'s Account from the
                system ?
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
