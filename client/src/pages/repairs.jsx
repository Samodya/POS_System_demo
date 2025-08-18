import { AlertTriangle, CheckCircle, Clock, Wrench, Search } from "lucide-react";
import StatCard from "../components/statcard";
import Topbar from "../components/topbar";
import { useState } from "react";
import { AddRepair } from "../components/repair/addRepair";
import { UseRepairContext } from "../context/repairContext";
import { Link } from "react-router-dom";

export const Repairs = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { repairs } = UseRepairContext();

  

  return (
    <div>
      <Topbar title={"Repairs"} />

      <div className="flex flex-col flex-1 p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 
        md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8 items-center justify-items-center">
          <StatCard title="Total Repairs" value={repairs.length} icon={<Wrench size={20} />} />
          <StatCard title="In Progress" value="15" icon={<Clock size={20} />} />
          <StatCard title="Completed Today" value="7" icon={<CheckCircle size={20} />} />
          <StatCard title="Awaiting Parts" value="4" icon={<AlertTriangle size={20} />} />
        </div>

        {/* Search Bar */}
        <div className="flex flex-row-reverse px-7 justify-between mb-5">
          <Link 
            to={"../new-repairs"}
            className="flex items-center justify-center gap-2 text-sm font-medium text-white bg-gradient-to-r from-black via-[#0a0f2c] to-[#013ea0] px-4 py-2 
            rounded-lg shadow hover:opacity-90 transition"
          ><Wrench/> Add New Repair </Link>
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
