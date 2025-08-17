import { AlertTriangle, CheckCircle, Clock, Wrench, Search } from "lucide-react";
import StatCard from "../components/statcard";
import Topbar from "../components/topbar";
import { useState } from "react";

export const Repairs = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const jobs = [
    {
      id: "R001",
      customer: "John Doe",
      device: "Laptop",
      issue: "No Power",
      status: "In Progress",
      date: "2025-08-07",
    },
    {
      id: "R002",
      customer: "Sarah Lee",
      device: "Desktop PC",
      issue: "Overheating",
      status: "Awaiting Parts",
      date: "2025-08-06",
    },
    {
      id: "R003",
      customer: "Mike Chan",
      device: "Gaming Laptop",
      issue: "Broken Screen",
      status: "Completed",
      date: "2025-08-06",
    },
  ];

  const filteredJobs = jobs.filter(
    (row) =>
      row.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.device.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.issue.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <Topbar title={"Repairs"} />

      <div className="flex flex-col flex-1 p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
          <StatCard title="Total Repairs" value="128" icon={<Wrench size={20} />} />
          <StatCard title="In Progress" value="15" icon={<Clock size={20} />} />
          <StatCard title="Completed Today" value="7" icon={<CheckCircle size={20} />} />
          <StatCard title="Awaiting Parts" value="4" icon={<AlertTriangle size={20} />} />
        </div>

        {/* Search Bar */}
        <div className="flex justify-end mb-5">
          <div className="relative w-full sm:w-80 bg-white rounded-lg shadow-sm">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search repairs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            />
          </div>
        </div>

        {/* Repair Jobs Table */}
        <div className="overflow-x-auto">
          <table className="w-full max-w-6xl mx-auto bg-white rounded-lg shadow-md overflow-hidden text-sm">
            <thead className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Job ID</th>
                <th className="text-left px-4 py-3 font-medium">Customer</th>
                <th className="text-left px-4 py-3 font-medium">Device</th>
                <th className="text-left px-4 py-3 font-medium">Issue</th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
                <th className="text-left px-4 py-3 font-medium">Date In</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredJobs.map((row, i) => (
                <tr key={i} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3 font-medium text-gray-700">{row.id}</td>
                  <td className="px-4 py-3 text-gray-600">{row.customer}</td>
                  <td className="px-4 py-3 text-gray-600">{row.device}</td>
                  <td className="px-4 py-3 text-gray-600">{row.issue}</td>
                  <td
                    className={`px-4 py-3 font-medium ${
                      row.status === "Completed"
                        ? "text-green-600"
                        : row.status === "In Progress"
                        ? "text-blue-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {row.status}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{row.date}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredJobs.length === 0 && (
            <div className="text-center py-10 text-gray-500 text-sm">
              No repair jobs found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
