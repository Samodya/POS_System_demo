import { Divide } from "lucide-react";
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Topbar from "../components/topbar";
import { UseProductContext } from "../context/productContext";
import { Link } from "react-router-dom";
import { NewCustomer } from "../components/Customer/newCustome";
import { UseSaleContext } from "../context/salesContext";
import { UseExpensesContext } from "../context/expensesContext";
import { UseRepairSaleContext } from "../context/repair_sale_context";


const urgentRepairs = [
  {
    ticket_no: "R-20250807-001",
    device: "Laptop",
    customer: "John Doe",
    priority: "urgent",
  },
  {
    ticket_no: "R-20250807-004",
    device: "Printer",
    customer: "Jane Smith",
    priority: "urgent",
  },
];

const salesData = [
  { month: "Jan", sales: 34000 },
  { month: "Feb", sales: 28000 },
  { month: "Mar", sales: 32000 },
  { month: "Apr", sales: 30000 },
  { month: "May", sales: 41000 },
  { month: "Jun", sales: 39000 },
  { month: "Jul", sales: 45000 },
];

export const Dashboard = () => {

  const { products } = UseProductContext();
  const { calculateOverall  } = UseSaleContext()
  // const { calculateOverallExpenses } = UseExpensesContext();
  // const { calculateOverallRepairs } = UseRepairSaleContext();

  const overallSales = calculateOverall();
  // const overrallExpenses  = calculateOverallExpenses();
  // const overallrepairSales = calculateOverallRepairs();


  return (
    <div className="w-full ">
    <Topbar title={"Dashboard"}/>
      

    <div className="p-6">
          {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2h md:grid-cols-4  gap-6">
        <div className="bg-white shadow-md rounded-2xl p-6">
          <h2 className="text-lg font-medium text-gray-600 mb-2">
            Overall Sales
          </h2>
          <p className="text-3xl font-bold text-indigo-600">Rs.{0.00}</p>
          <span className="text-sm text-gray-400">{"From "+overallSales.count+" Sales"}</span>
        </div>

        <div className="bg-white shadow-md rounded-2xl p-6">
          <h2 className="text-lg font-medium text-gray-600 mb-2">
            Total Expenses
          </h2>
          <p className="text-3xl font-bold text-orange-500">Rs.{0.00}</p>
          <span className="text-sm text-gray-400">3 urgent, 5 not urgent</span>
        </div>

        <div className="bg-white shadow-md rounded-2xl p-6">
          <h2 className="text-lg font-medium text-gray-600 mb-2">
            Available Products
          </h2>
          <p className="text-3xl font-bold text-green-600">{products.length < 10 ? "0"+ products.length: products.length}</p>
          <span className="text-sm text-gray-400">{products.length} new this week</span>
        </div>

        <div className="bg-white shadow-md rounded-2xl p-6">
          <h2 className="text-lg font-medium text-gray-600 mb-2">
            Repair Income
          </h2>
          <p className="text-3xl font-bold text-green-600">Rs.{0}</p>
          <span className="text-sm text-gray-400">From {0} Sales</span>
        </div>
      </div>

      <div className="flex flex-row-reverse gap-1 items-center pt-4 px-4">
        <Link to={'invoice'} 
        className="flex items-center justify-center gap-2 text-sm font-medium text-white bg-gradient-to-r from-black via-[#0a0f2c] to-[#013ea0] px-4 py-2 rounded-lg shadow hover:opacity-90 transition"
       >
          New Invoice
        </Link>
        <NewCustomer/>
      </div>

      {/* Urgent Repairs */}
      <div className=" w-full flex p-6 gap-2">

        <div className="bg-white shadow-md flex-1 rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-red-500 mb-4">
            Urgent Repairs
          </h2>
          <div className="overflow-x-auto ">
            <table className="min-w-full text-sm text-gray-700">
              <thead className="text-xs uppercase bg-gray-100 text-gray-600">
                <tr>
                  <th className="px-4 py-3 text-left">Ticket No</th>
                  <th className="px-4 py-3 text-left">Device</th>
                  <th className="px-4 py-3 text-left">Customer</th>
                </tr>
              </thead>
              <tbody>
                {urgentRepairs.map((repair) => (
                  <tr key={repair.ticket_no} className="border-t">
                    <td className="px-4 py-2">{repair.ticket_no}</td>
                    <td className="px-4 py-2">{repair.device}</td>
                    <td className="px-4 py-2">{repair.customer}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="bg-white shadow-md rounded-2xl p-6 flex-2">
          <h2 className="text-xl font-semibold text-indigo-600 mb-4">
            Monthly Sales (Rs.)
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={salesData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="sales" fill="#6366f1" barSize={30} radius={[4, 4, 4, 4]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    

    </div>
        {/* Monthly Sales Chart */}
      </div>

  );
};
