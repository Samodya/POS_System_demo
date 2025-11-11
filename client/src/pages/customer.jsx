import { Contact, Search, UserRoundCog, UserStar, Users } from "lucide-react";
import Topbar from "../components/topbar";
import { useState } from "react";
import StatCard from "../components/statcard";
import { NewCustomer } from "../components/Customer/newCustome";
import { UseCustomerContext } from "../context/customerContext";
import { EditCustomer } from "../components/Customer/EditCustomer";
import { DeleteCustomer } from "../components/Customer/DeletCustomer";

export const Customer = () => {
  const { customers } = UseCustomerContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const statItems = [
    {
      id: "all",
      title: "All Customers",
      value: customers.length,
      icon: <Users />,
    },
    {
      id: "new",
      title: "Frequent Customers",
      value: customers.length,
      icon: <UserStar />,
    },
    {
      id: "low",
      title: "Urgent Customers",
      value: customers.length,
      icon: <UserRoundCog />,
    },
    {
      id: "recent",
      title: "Recent Customers",
      value: customers.length,
      icon: <Contact />,
    },
  ];

  const filteredCustomers = customers.filter((customer) =>
  customer.name?.toLowerCase().includes(searchTerm.toLowerCase())
);
  return (
    <div className="w-full">
      <Topbar title={"Customers"} />

      {/* Stats */}
      <div className="flex flex-wrap justify-center gap-6 px-4 py-6 md:justify-between max-w-7xl mx-auto">
        {statItems.map((item) => (
          <div
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`cursor-pointer transition-all transform ${
              activeTab === item.id
                ? "scale-105 shadow-md"
                : "opacity-80 hover:opacity-100"
            }`}
          >
            <StatCard icon={item.icon} title={item.title} value={item.value} />
          </div>
        ))}
      </div>

      {/* Search + New Customer */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 py-5 px-4 md:px-10">
        <div className="relative w-full sm:w-80 bg-white rounded-lg shadow-sm">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by username..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
          />
        </div>
        <NewCustomer />
      </div>

      {/* Table */}
      <div className="overflow-x-auto px-4 pb-8">
        <table className="w-full max-w-6xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          <thead className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white text-sm">
            <tr>
              <th className="text-center p-3 font-medium">Fullname</th>
              <th className="text-center p-3 font-medium">Contact Number</th>
              <th className="text-center p-3 font-medium">Email Address</th>
              <th className="text-center p-3 font-medium">Address</th>
              <th className="text-center p-3 font-medium">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 text-sm">
            {filteredCustomers.map((customer) => (
              <tr
                key={customer.id}
                className="hover:bg-gray-50 transition"
              >
                <td className="text-center p-3 font-medium text-gray-700">
                  {customer.name}
                </td>
                <td className="text-center p-3 text-gray-600">
                  {customer.phone}
                </td>
                <td className="text-center p-3 text-gray-600">
                  {customer.email}
                </td>
                <td className="text-center p-3 text-gray-600 break-words max-w-[200px]">
                  {customer.address}
                </td>
                <td className="p-3 flex gap-2 justify-center items-center">
                  <EditCustomer id={customer.id} />
                  <DeleteCustomer id={customer.id} fullname={customer.name} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {customers.length === 0 && (
          <div className="text-center py-10 text-gray-500 text-sm">
            No customers found.
          </div>
        )}
      </div>
    </div>
  );
};
