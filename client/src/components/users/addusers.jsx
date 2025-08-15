import { UserPlus, X } from "lucide-react";
import { useState } from "react";
import apiService from "../../utilities/httpservices";
import Cookies from "js-cookie";
import { UseUserContext } from "../../context/usersContext";

export const AddUsers = () => {
  const [showmenu, setShowmenu] = useState(false);
  const [fullname, setFullname] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const { refreshUsers } = UseUserContext();
  const [password, setPassword] = useState("admin123");
  const [role, setRole] = useState("Admin");
  const token = Cookies.get('token');

  const handleSave = async () => {
    if (!fullname.trim() || !username.trim()) {
        alert("Fullname and Username are required!");
        return;
      }
  
    const data = {
        fullname:fullname,
        username:username,
        phone:phone,
        email:email,
        password:password,
        role:role
    }
    try {
        const result = await apiService.createData('users/signup',data,token);
        console.log(result);
    } catch (error) {
        console.log(error);
    }
    refreshUsers();
  }

  return (
    <div>
      {/* Open Button */}
      <button
        className="py-1 rounded px-2 bg-blue-800 text-white flex gap-1 text-sm hover:bg-blue-700 transition"
        onClick={() => setShowmenu(true)}
      >
        <UserPlus size={16} />
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
                  <UserPlus size={20} />
                  Add User
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
                  <label className="block text-sm font-medium mb-1">Fullname</label>
                  <input
                    type="text"
                    value={fullname}
                    onChange={(e) => setFullname(e.target.value)}
                    className="w-full border rounded px-3 py-1.5 text-sm focus:ring focus:ring-blue-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Username</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full border rounded px-3 py-1.5 text-sm focus:ring focus:ring-blue-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Contact No</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full border rounded px-3 py-1.5 text-sm focus:ring focus:ring-blue-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border rounded px-3 py-1.5 text-sm focus:ring focus:ring-blue-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border rounded px-3 py-1.5 text-sm focus:ring focus:ring-blue-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Role</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full border rounded px-3 py-1.5 text-sm focus:ring focus:ring-blue-200"
                  >
                    <option value="Admin">Admin</option>
                  </select>
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
