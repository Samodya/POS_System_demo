import { AlertTriangle, CheckCircle, Clock, Wrench } from "lucide-react";
import StatCard from "../components/statcard";
import Topbar from "../components/topbar";

export const Repairs = () => {
  return (
    <div>
      <Topbar title={"Repairs"} />

      <div className="flex flex-col flex-1 p-6">
        {/* Page Title */}
        <h1 className="text-2xl font-bold mb-6">Repair Center Overview</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Repairs"
            value="128"
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

        {/* Repair Jobs Table */}
        <div className="border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">
                  Job ID
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">
                  Customer
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">
                  Device
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">
                  Issue
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">
                  Status
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">
                  Date In
                </th>
              </tr>
            </thead>
            <tbody>
              {[
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
              ].map((row, i) => (
                <tr key={i} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-2">{row.id}</td>
                  <td className="px-4 py-2">{row.customer}</td>
                  <td className="px-4 py-2">{row.device}</td>
                  <td className="px-4 py-2">{row.issue}</td>
                  <td
                    className={`px-4 py-2 font-medium ${
                      row.status === "Completed"
                        ? "text-green-600"
                        : row.status === "In Progress"
                        ? "text-blue-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {row.status}
                  </td>
                  <td className="px-4 py-2">{row.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
