import { Edit, Trash2, Users2, Search } from "lucide-react";
import StatCard from "../components/statcard";
import Topbar from "../components/topbar";
import { UseUserContext } from "../context/usersContext";
import { AddUsers } from "../components/users/addusers";
import { useState } from "react";
import { EditUsers } from "../components/users/editUsers";

export const Users = () => {
  const { users } = UseUserContext();
  const [searchTerm, setSearchTerm] = useState("");

  const items = [
    { id: 1, title: "All Users", value: users.length, icon: <Users2 /> },
    { id: 2, title: "Active Users", value: users.length, icon: <Users2 /> },
    { id: 3, title: "Admins", value: users.length, icon: <Users2 /> },
  ];

  // Filtered list
  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  console.log(users);

  return (
    <div>
      <Topbar title="Users" />
      <div className="p-4 sm:p-6 space-y-6">
        
        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {items.map((item) => (
            <div key={item.id} className="flex justify-center">
              <StatCard
                title={item.title}
                icon={item.icon}
                value={item.value}
              />
            </div>
          ))}
        </div>

        {/* Search + Add User */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
          <div className="relative w-full sm:w-80 bg-white rounded">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by username..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
          <AddUsers />
        </div>

        {/* Users Table */}
        <div className="overflow-x-auto">
          <div className="min-w-[600px] sm:min-w-full bg-white shadow-lg rounded-2xl border border-gray-200">
            <table className="w-full border-collapse">
              <thead className="bg-gray-100">
                <tr>
                <th className="py-3 px-4 text-gray-700 text-center text-sm font-semibold">Fullname</th>
                  <th className="py-3 px-4 text-gray-700 text-center text-sm font-semibold">Username</th>
                  <th className="py-3 px-4 text-gray-700 text-center text-sm font-semibold">Contact no</th>
                  <th className="py-3 px-4 text-gray-700 text-center text-sm font-semibold">Email</th>
                  <th className="py-3 px-4 text-gray-700 text-center text-sm font-semibold">Role</th>
                  <th className="py-3 px-4 text-gray-700 text-center text-sm font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user, index) => (
                    <tr
                      key={user.id || index}
                      className={`text-gray-600 text-sm hover:bg-gray-50 transition ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50"
                      }`}
                    >
                      <td className="py-3 px-4 text-center">{user.fullname}</td>
                      <td className="py-3 px-4 text-center">{user.username}</td>
                      <td className="py-3 px-4 text-center">{user.phone}</td>
                      <td className="py-3 px-4 text-center">{user.email}</td>
                      <td className="py-3 px-4 text-center">{user.role}</td>
                      <td className="py-3 px-4 text-center flex items-center justify-center gap-2">
                        <EditUsers/>
                        <button className="py-1 px-2 sm:px-3 bg-red-600 hover:bg-red-700 flex gap-1 items-center justify-center rounded text-white text-xs transition">
                          <Trash2 size={14} />
                          <span className="hidden sm:inline">Delete</span>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="py-6 text-center text-gray-500">
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};
