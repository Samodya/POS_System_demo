import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Wrench,
  Search,
} from "lucide-react";
import StatCard from "../components/statcard";
import Topbar from "../components/topbar";
import { useState } from "react";
import { AddRepair } from "../components/repair/addRepair";
import { UseRepairContext } from "../context/repairContext";
import { Link } from "react-router-dom";
import { DeleteRepair } from "../components/repair/deleteRepair";

export const Repairs = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { repairs } = UseRepairContext();

  function formatDate(received_date) {
    if (!received_date) return "—";

    // Fix cases like "2025-08-16 18:30:00" (no "T")
    const safeDate = received_date.replace(" ", "T");
    const dateObj = new Date(safeDate);

    if (isNaN(dateObj)) return "—";

    return dateObj.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  return (
    <div>
      <Topbar title={"Repairs"} />

      <div className="flex flex-col flex-1 p-6">
        {/* Stats Cards */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 
        md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8 items-center justify-items-center"
        >
          <StatCard
            title="Total Repairs"
            value={repairs.length}
            icon={<Wrench size={20} />}
          />
          <StatCard title="In Progress" value="15" icon={<Clock size={20} />} />
          <StatCard
            title="Completed Today"
            value="7"
            icon={<CheckCircle size={20} />}
          />
          <StatCard
            title="Awaiting Parts"
            value="4"
            icon={<AlertTriangle size={20} />}
          />
        </div>

        {/* Search Bar */}
        <div className="flex flex-row-reverse px-7 justify-between mb-5">
          <Link
            to={"../new-repairs"}
            className="flex items-center justify-center gap-2 text-sm font-medium text-white bg-gradient-to-r from-black via-[#0a0f2c] to-[#013ea0] px-4 py-2 
            rounded-lg shadow hover:opacity-90 transition"
          >
            <Wrench /> Add New Repair{" "}
          </Link>
          <div className="relative w-full sm:w-80 bg-white rounded-lg shadow-sm">
            <Search
              className="absolute left-3 top-2.5 text-gray-400"
              size={18}
            />
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
                <th className="text-left px-4 py-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {repairs.map((row, i) => (
                <tr key={i} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3 font-medium text-gray-700">
                    {row.order_id}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {row.customer_name}
                  </td>
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
                  <td className="px-4 py-3 text-gray-600">
                    {formatDate(row.received_date)}
                  </td>
                  <td className="px-4 py-3 text-gray-600 flex items-center justify-center gap-2">
                    <Link className="py-1 px-2 sm:px-3 bg-blue-600 hover:bg-blue-700 flex gap-1 items-center justify-center rounded text-white text-xs transition"
                    to={`../edit-repairs/${row.id}`}>View more</Link>
                    <DeleteRepair id={row.id}/>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {repairs.length === 0 && (
            <div className="text-center py-10 text-gray-500 text-sm">
              No repair jobs found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
