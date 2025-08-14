import { Link } from "react-router-dom";
import StatCard from "../components/statcard";
import Topbar from "../components/topbar";
import { Bell, ChevronDown, Clock, DollarSign, Search, ShoppingBag, Wrench } from "lucide-react";

export const Sales = () => {
  return (
    <div className="bg-white w-full h-screen">
      <Topbar title={"Sales"} />
      <div className="flex flex-col flex-1 p-6">
        {/* Page Title */}
        <h1 className="text-2xl font-bold mb-6">Sales & Repair Overview</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Repair Orders"
            value="$2000"
            icon={<Wrench size={20} />}
          />
          <StatCard
            title="Accessories Sold"
            value="128"
            icon={<ShoppingBag size={20} />}
          />
          <StatCard
            title="Revenue"
            value="$18,240"
            icon={<DollarSign size={20} />}
          />
          
        </div>

        <div className="flex flex-row-reverse py-2 px-6">
          <Link to={'../invoice'} className="bg-gradient-to-r from-black via-[#0a0f2c] 
          to-[#013ea0] text-white flex text-sm py-1 px-2 rounded items-center justify-center font-semibold">
            <DollarSign size={16}/> New Sale
          </Link>
        </div>

        {/* Sales Table */}
        <div className="border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">
                  Invoice ID
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">
                  Customer
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">
                  Item/Service
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">
                  Amount
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  id: "INV001",
                  customer: "John Doe",
                  item: "Laptop Screen Replacement",
                  amount: "$120",
                  date: "2025-08-08",
                },
                {
                  id: "INV002",
                  customer: "Sarah Lee",
                  item: "Gaming Mouse",
                  amount: "$45",
                  date: "2025-08-08",
                },
                {
                  id: "INV003",
                  customer: "Mike Chan",
                  item: "PC Build Service",
                  amount: "$650",
                  date: "2025-08-07",
                },
              ].map((row, i) => (
                <tr key={i} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-2">{row.id}</td>
                  <td className="px-4 py-2">{row.customer}</td>
                  <td className="px-4 py-2">{row.item}</td>
                  <td className="px-4 py-2">{row.amount}</td>
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
