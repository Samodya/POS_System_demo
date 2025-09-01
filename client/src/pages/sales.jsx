import { Link } from "react-router-dom";
import StatCard from "../components/statcard";
import Topbar from "../components/topbar";
import {
  Bell,
  ChevronDown,
  Clock,
  DollarSign,
  Search,
  ShoppingBag,
  Wrench,
} from "lucide-react";
import { UseSaleContext } from "../context/salesContext";

export const Sales = () => {
  const { sales } = UseSaleContext();

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
          <Link
            to={"../invoice"}
            className="bg-gradient-to-r from-black via-[#0a0f2c] 
          to-[#013ea0] text-white flex text-sm py-1 px-2 rounded items-center justify-center font-semibold"
          >
            <DollarSign size={16} /> New Sale
          </Link>
        </div>

        {/* Sales Table */}
        <div className="overflow-x-auto">
          <div className="min-w-[600px] sm:min-w-full bg-white shadow-lg rounded-2xl border border-gray-200">
            <table className="w-full border-collapse">
              <thead className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white text-sm">
                <tr>
                  <th className="py-3 px-4 text-center text-sm font-semibold">
                    Invoice Id
                  </th>
                  <th className="py-3 px-4 text-center text-sm font-semibold">
                    Date
                  </th>
                  <th className="py-3 px-4 text-center text-sm font-semibold">
                    Customer
                  </th>
                  <th className="py-3 px-4 text-center text-sm font-semibold">
                    Contact no
                  </th>
                  <th className="py-3 px-4 text-center text-sm font-semibold">
                    Amount
                  </th>
                  <th className="py-3 px-4 text-center text-sm font-semibold">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {sales.length > 0 ? (
                  sales.map((sale, index) => (
                    <tr
                      key={sale.id || index}
                      className={`text-gray-600 text-sm hover:bg-gray-50 transition ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50"
                      }`}
                    >
                      <td className="text-center p-3 font-medium text-gray-700">
                        {sale.invoiceid}
                      </td>
                      <td className="text-center p-3 font-medium text-gray-700">
                        {new Date(sale.sale_date).toISOString().split("T")[0]}
                      </td>
                      <td className="text-center p-3 font-medium text-gray-700">
                        {sale.customer_name}
                      </td>
                      <td className="text-center p-3 font-medium text-gray-700">
                        {sale.phone}
                      </td>
                      <td className="text-center p-3 font-medium text-gray-700">
                        {sale.total_amount}
                      </td>
                      <td className="text-center p-3 font-medium text-gray-700 flex items-center justify-center gap-2">
                        {/* <EditUsers
                            id={user.id}
                        />
                        <DeleteUser
                            id={user.id}
                            fullname={user.fullname}
                        /> */}
                        <Link
                          to={`../sales_info/${sale.id}`}
                          className="py-1 px-2 sm:px-3 bg-blue-600 
                                  hover:bg-blue-700 flex gap-1 items-center justify-center rounded
                                   text-white text-xs transition"
                        >
                          View Details
                        </Link>
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
