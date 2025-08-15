import { Edit, X } from "lucide-react";
import { useState } from "react";

export const EditUsers = () => {
  const [showmenu, setShowmenu] = useState(false);
  const [fullname, setFullname] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Admin");

  return (
    <div>
      {/* Open Button */}
      <button
        className="py-1 px-2 sm:px-3 bg-blue-600 hover:bg-blue-700 flex gap-1 items-center justify-center rounded text-white text-xs transition"
        onClick={() => setShowmenu(true)}
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
                  <Edit size={20} />
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
                <button className="bg-blue-800 hover:bg-blue-700 text-sm py-1.5 px-4 text-white rounded transition">
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
