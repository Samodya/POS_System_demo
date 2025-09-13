import { useEffect, useState } from "react";
import Topbar from "../topbar";
import apiService from "../../utilities/httpservices";
import Cookies from "js-cookie";
import { UseRepairContext } from "../../context/repairContext";
import { UseCustomerContext } from "../../context/customerContext";
import { UseUserContext } from "../../context/usersContext";

// SVG Icons (same as before)
const SearchIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 text-gray-400"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
      clipRule="evenodd"
    />
  </svg>
);

const UserIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 text-gray-400"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
      clipRule="evenodd"
    />
  </svg>
);

const inputClasses =
  "w-full border border-gray-300 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-300 transition-colors";

export const AddRepair = () => {
  const { repairs, refreshRepairs } = UseRepairContext();
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
      const seq = parseInt(
        r.order_id.slice(prefix.length + datePart.length),
        10
      );
      if (!isNaN(seq) && seq > maxSeq) maxSeq = seq;
    });
    return prefix + datePart + (maxSeq + 1);
  };

  useEffect(() => {
    setOrderId(generateOrderId());
  }, [repairs]);

  useEffect(() => {
    setReceivedDate(new Date().toISOString().split("T")[0]);
    setCompletedDate(new Date().toISOString().split("T")[0]);
  }, []);

  const addnewCustome = async () => {
    try {
      const data = { name: customerName, phone, email, address };
      const results = await apiService.createData("customers", data, token);
      setCustomerid(results.id);
      console.log("Customer Added");
      refreshCustomers();
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
        cost: 3000.0,
        status: "pending",
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

  const statusOptions = [
    { value: "pending", label: "Pending" },
    { value: "in_progress", label: "In Progress" },
    { value: "completed", label: "Completed" },
    { value: "awaiting_parts", label: "Awaiting Parts" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center">
      <Topbar title="Add New Repair" />

      <div className="flex-1 p-6 w-full">
        <div className="bg-white shadow-xl rounded-2xl p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-2 md:mb-0">
              New Repair
            </h2>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-semibold text-gray-600">
                Order ID:
              </span>
              <span className="font-mono text-blue-700 font-medium">
                {orderId}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Customer Selection */}
            <div className="space-y-4">
              <h3 className="text-md font-semibold text-gray-700">
                Customer Details
              </h3>
              <div className="flex gap-2 p-1 bg-gray-200 rounded-full w-fit">
                <button
                  onClick={() => setCustomerType("existing")}
                  className={`px-4 py-2 text-xs font-medium rounded-full transition-all duration-300 ${
                    customerType === "existing"
                      ? "bg-white text-blue-900 shadow-md"
                      : "text-gray-600 hover:text-blue-900"
                  }`}
                >
                  Existing Customer
                </button>
                <button
                  onClick={() => setCustomerType("new")}
                  className={`px-4 py-2 text-xs font-medium rounded-full transition-all duration-300 ${
                    customerType === "new"
                      ? "bg-white text-blue-900 shadow-md"
                      : "text-gray-600 hover:text-blue-900"
                  }`}
                >
                  New Customer
                </button>
              </div>
              {customerType === "existing" && (
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <SearchIcon />
                  </span>
                  <input
                    type="text"
                    placeholder="Search by name or phone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                  />
                  {searchTerm && (
                    <div className="absolute z-10 w-full max-h-36 overflow-y-auto bg-white border border-gray-300 rounded-lg shadow-lg mt-1">
                      {customers
                        .filter(
                          (c) =>
                            c.name
                              .toLowerCase()
                              .includes(searchTerm.toLowerCase()) ||
                            c.phone.includes(searchTerm)
                        )
                        .map((c) => (
                          <div
                            key={c.id}
                            onClick={() => {
                              setCustomerid(c.id);
                              setSearchTerm(c.name);
                            }}
                            className={`px-3 py-2 cursor-pointer text-sm flex items-center gap-2 ${
                              customerid === c.id
                                ? "bg-blue-50 text-blue-800"
                                : "hover:bg-gray-100"
                            }`}
                          >
                            <UserIcon />
                            {c.name} -{" "}
                            <span className="text-gray-500">{c.phone}</span>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              )}
              {customerType === "new" && (
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="block text-xs font-medium text-gray-600">
                        Name
                      </label>
                      <input
                        type="text"
                        placeholder="Customer Name"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className={inputClasses}
                        style={{
                          backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" /></svg>')`,
                          backgroundRepeat: "no-repeat",
                          backgroundPosition: "left 0.5rem center",
                          backgroundSize: "1.25rem",
                        }}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs font-medium text-gray-600">
                        Phone
                      </label>
                      <input
                        type="text"
                        placeholder="Phone Number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className={inputClasses}
                        style={{
                          backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.774a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/></svg>')`,
                          backgroundRepeat: "no-repeat",
                          backgroundPosition: "left 0.5rem center",
                          backgroundSize: "1.25rem",
                        }}
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-gray-600">
                      Email
                    </label>
                    <input
                      type="email"
                      placeholder="Email Address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={inputClasses}
                      style={{
                        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" /><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" /></svg>')`,
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "left 0.5rem center",
                        backgroundSize: "1.25rem",
                      }}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-gray-600">
                      Address
                    </label>
                    <textarea
                      placeholder="Address"
                      rows="1"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-300"
                    />
                  </div>
                  <button
                    onClick={addnewCustome}
                    className="w-full py-2 rounded-lg text-white text-xs font-semibold bg-gradient-to-r from-gray-900 to-blue-900 shadow-md transition-colors hover:from-gray-800 hover:to-blue-800"
                  >
                    Save Customer
                  </button>
                </div>
              )}
            </div>

            {/* Repair Details */}
            <div className="space-y-4">
              <h3 className="text-md font-semibold text-gray-700">
                Repair Details
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-gray-600">
                    Device
                  </label>
                  <input
                    type="text"
                    placeholder="Device"
                    value={device}
                    onChange={(e) => setDevice(e.target.value)}
                    className={inputClasses}
                    style={{
                      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor"><path d="M15 8a3 3 0 10-2.977-2.977l-1.255 1.255a4 4 0 11-1.414 1.414l-1.255-1.255a3 3 0 10-2.977 2.977H12a2 2 0 110 4h-1.586a1 1 0 01-.707-.293l-1.586-1.586a1 1 0 00-1.414 0L5.293 12.293a1 1 0 00-.707.707L4 14.586V16a2 2 0 11-2-2h2a2 2 0 114 0h.586l.293-.293A1 1 0 008 13.586l1.586 1.586a1 1 0 00.707.293H12a4 4 0 10-.001-6.928l-1.255 1.255z"/></svg>')`,
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "left 0.5rem center",
                      backgroundSize: "1.25rem",
                    }}
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-gray-600">
                    Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:ring focus:ring-blue-200 focus:border-blue-500"
                  >
                    {statusOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-gray-600">
                    Received Date
                  </label>
                  <input
                    type="date"
                    value={receivedDate}
                    onChange={(e) => setReceivedDate(e.target.value)}
                    className={inputClasses}
                    style={{
                      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" /></svg>')`,
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "left 0.5rem center",
                      backgroundSize: "1.25rem",
                    }}
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-gray-600">
                    Completed Date
                  </label>
                  <input
                    type="date"
                    value={completedDate}
                    onChange={(e) => setCompletedDate(e.target.value)}
                    className={inputClasses}
                    style={{
                      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" /></svg>')`,
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "left 0.5rem center",
                      backgroundSize: "1.25rem",
                    }}
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-medium text-gray-600">
                  Issue Description
                </label>
                <textarea
                  placeholder="Describe the issue..."
                  rows="2"
                  value={issue}
                  onChange={(e) => setIssue(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-300"
                />
              </div>
              <div className="space-y-1 relative">
                <label className="block text-xs font-medium text-gray-600">
                  Assign To
                </label>
                <input
                  type="text"
                  placeholder="Search user..."
                  value={assignedSearch}
                  onChange={(e) => setAssignedSearch(e.target.value)}
                  className={inputClasses}
                  style={{
                    backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" /></svg>')`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "left 0.5rem center",
                    backgroundSize: "1.25rem",
                  }}
                />
                {assignedSearch && (
                  <div className="absolute z-10 w-full max-h-36 overflow-y-auto bg-white border border-gray-300 rounded-lg shadow-lg mt-1">
                    {users
                      .filter(
                        (u) =>
                          u.fullname
                            .toLowerCase()
                            .includes(assignedSearch.toLowerCase()) ||
                          u.email
                            .toLowerCase()
                            .includes(assignedSearch.toLowerCase())
                      )
                      .map((u) => (
                        <div
                          key={u.id}
                          onClick={() => {
                            setAssignedUserId(u.id);
                            setAssignedSearch(u.fullname);
                          }}
                          className={`px-3 py-2 cursor-pointer text-xs flex items-center gap-2 ${
                            assignedUserId === u.id
                              ? "bg-blue-50 text-blue-800"
                              : "hover:bg-gray-100"
                          }`}
                        >
                          <UserIcon />
                          {u.fullname}
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="mt-8">
            <button
              onClick={handleSubmit}
              className="w-full py-3 rounded-lg text-white text-sm font-semibold bg-gradient-to-r from-gray-900 to-blue-900 shadow-md transition-colors hover:from-gray-800 hover:to-blue-800"
            >
              Create Repair
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
