import { useEffect, useState } from "react";
import Topbar from "../topbar";
import apiService from "../../utilities/httpservices";
import Cookies from "js-cookie";
import { UseRepairContext } from "../../context/repairContext";
import { UseCustomerContext } from "../../context/customerContext";
import { UseUserContext } from "../../context/usersContext";

export const AddRepair = () => {
  const { repairs,refreshRepairs } = UseRepairContext();
  const { customers, refreshCustomers } = UseCustomerContext();
  const { users } = UseUserContext("");
  const token = Cookies.get("token");

  const [customerType, setCustomerType] = useState("existing");
  const [orderId, setOrderId] = useState("");
  const [customerid, setCustomerid] = useState("");

  // new customer states
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");

  // repair detail states
  const [device, setDevice] = useState("");
  const [issue, setIssue] = useState("");
  const [status, setStatus] = useState("Pending");
  const [receivedDate, setReceivedDate] = useState("");
  const [completedDate, setCompletedDate] = useState("");
  const [assignedUserId, setAssignedUserId] = useState("");
  const [assignedSearch, setAssignedSearch] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const generateOrderId = () => {
    const today = new Date();
    const year = String(today.getFullYear()).slice(-2);
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    const datePart = `${year}${month}${day}`;
    const prefix = "ORD";
    const todayRepairs = repairs.filter((r) =>
      r.order_id?.startsWith(prefix + datePart)
    );
    let maxSeq = 0;
    todayRepairs.forEach((r) => {
      const seq = parseInt(r.order_id.slice(prefix.length + datePart.length), 10);
      if (!isNaN(seq) && seq > maxSeq) maxSeq = seq;
    });
    return prefix + datePart + (maxSeq + 1);
  };

  

  useEffect(() => {
    setOrderId(generateOrderId());
  }, [repairs]);

  const addnewCustome = async () => {
    try {
      const data = { name: customerName, phone, email, address };
      const results = await apiService.createData("customers", data, token);
      setCustomerid(results.id);
      refreshCustomers()
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async () => {
    if (!customerid) {
      alert("Please select or add a customer first");
      return;
    }
    try {
      const repairData = {
        order_id: orderId,
        customer_id: customerid,
        device,
        issue,
        status,
        received_date: receivedDate,
        completed_date: completedDate,
        assigned_to: assignedUserId,
      };
      await apiService.createData("repairs", repairData, token);
      alert("Repair created successfully!");
      
    } catch (error) {
      console.error(error);
      alert("Failed to create repair");
    }
    refreshRepairs();
    
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Topbar title="Add New Repair" />

      <div className="flex-1 p-4 max-w-3xl mx-auto w-full">
        <div className="bg-white shadow-xl rounded-2xl p-6 space-y-8">
          {/* Order ID */}
          <div>
            <label className="text-sm font-semibold text-gray-600">Order ID</label>
            <input
              type="text"
              value={orderId}
              readOnly
              className="w-full mt-2 border border-gray-300 rounded-lg px-4 py-1 text-sm bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>

          {/* Customer Selection */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-600">Customer</label>
            <div className="flex gap-3">
              <button
                onClick={() => setCustomerType("existing")}
                className={`px-4 py-2 text-sm font-medium rounded-lg ${
                  customerType === "existing"
                    ? "bg-gradient-to-r from-black to-blue-900 text-white shadow-lg"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                Existing
              </button>
              <button
                onClick={() => setCustomerType("new")}
                className={`px-4 py-2 text-sm font-medium rounded-lg ${
                  customerType === "new"
                    ? "bg-gradient-to-r from-black to-blue-900 text-white shadow-lg"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                New
              </button>
            </div>

            {/* Existing Customer */}
            {customerType === "existing" && (
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Search customer..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
                <div className="max-h-40 overflow-y-auto border rounded-lg">
                  {customers
                    .filter(
                      (c) =>
                        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        c.phone.includes(searchTerm)
                    )
                    .map((c) => (
                      <div
                        key={c.id}
                        onClick={() => setCustomerid(c.id)}
                        className={`px-3 py-2 cursor-pointer text-sm ${
                          customerid === c.id ? "bg-blue-100" : "hover:bg-gray-100"
                        }`}
                      >
                        {c.name} - {c.phone}
                      </div>
                    ))}
                </div>
                
              </div>
            )}

            {/* New Customer */}
            {customerType === "new" && (
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="border rounded-lg px-3 py-1 text-sm"
                  />
                  <input
                    type="text"
                    placeholder="Phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="border rounded-lg px-3 py-1 text-sm"
                  />
                </div>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border rounded-lg px-3 py-1 text-sm"
                />
                <textarea
                  placeholder="Address"
                  rows="2"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full border rounded-lg px-3 py-1 text-sm"
                />
                <button
                  onClick={addnewCustome}
                  className="w-full py-2 rounded-lg text-white text-sm font-medium bg-gradient-to-r from-black to-blue-900 hover:from-gray-900 hover:to-blue-800 shadow-lg"
                >
                  Save Customer
                </button>
              </div>
            )}
          </div>

          {/* Repair Details */}
          <div className="space-y-4">
            <label className="text-sm font-semibold text-gray-600">Repair Details</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Device"
                value={device}
                onChange={(e) => setDevice(e.target.value)}
                className="border rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
             
              <div className="flex flex-col">
                <label className="block text-xs font-medium text-gray-500">Status:</label>
                <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="border rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                <option>Pending</option>
                <option>In Progress</option>
                <option>Completed</option>
                <option>Cancelled</option>
              </select>
                
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="block text-xs font-medium text-gray-500">Received Date</label>
                  <input
                    type="date"
                    value={receivedDate}
                    onChange={(e) => setReceivedDate(e.target.value)}
                    className="w-full border rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-medium text-gray-500">Completed Date</label>
                  <input
                    type="date"
                    value={completedDate}
                    onChange={(e) => setCompletedDate(e.target.value)}
                    className="w-full border rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                  />
                </div>
              </div>
              <input
                type="text"
                placeholder="Issue"
                value={issue}
                onChange={(e) => setIssue(e.target.value)}
                className="col-span-1 md:col-span-2 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
              {/* Assigned To */}
              <div className="col-span-1 md:col-span-2 space-y-2">
                <label className="block text-xs font-medium text-gray-500">Assign To</label>
                <input
                  type="text"
                  placeholder="Search user..."
                  value={assignedSearch}
                  onChange={(e) => setAssignedSearch(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
                <div className="max-h-36 overflow-y-auto border rounded-lg">
                  {users
                    .filter(
                      (u) =>
                        u.fullname.toLowerCase().includes(assignedSearch.toLowerCase()) ||
                        u.email.toLowerCase().includes(assignedSearch.toLowerCase())
                    )
                    .map((u) => (
                      <div
                        key={u.id}
                        onClick={() => {
                          setAssignedUserId(u.id);
                          setAssignedSearch(u.fullname);
                        }}
                        className={`px-3 py-2 cursor-pointer text-sm ${
                          assignedUserId === u.id ? "bg-blue-100" : "hover:bg-gray-100"
                        }`}
                      >
                        {u.fullname} - {u.email}
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            className="w-full py-3 rounded-lg text-white text-sm font-medium bg-gradient-to-r from-black to-blue-900 hover:from-gray-900 hover:to-blue-800 shadow-lg"
          >
            Create Repair
          </button>
        </div>
      </div>
    </div>
  );
};
