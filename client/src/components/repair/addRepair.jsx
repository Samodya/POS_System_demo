import { useEffect, useState } from "react";
import { UseCustomerContext } from "../../context/customerContext";
import { UseRepairContext } from "../../context/repairContext";
import Topbar from "../topbar";
import apiService from "../../utilities/httpservices";
import Cookies from "js-cookie";

export const AddRepair = () => {
  const { repairs } = UseRepairContext();
  const { customers } = UseCustomerContext();
  const [customerType, setCustomerType] = useState("existing");
  const [orderId, setOrderId] = useState("");
  const [customerid, setCustomerid] = useState("");

  // new customer states
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("1");
  const token = Cookies.get("token");

  // order id generator
  const generateOrderId = () => {
    const today = new Date();
    const year = String(today.getFullYear()).slice(-2);
    const month = String(today.getMonth() + 1);
    const day = String(today.getDate());
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
    if (repairs.length) {
      setOrderId(generateOrderId());
    }
  }, [repairs]);

  const addnewCustome = async () => {
    try {
      const data = {
        name: customerName,
        phone: phone,
        email: email,
        address: address,
      };

      const results = await apiService.createData("customers", data, token);
      setCustomerid(results.id);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Topbar title={"Add New Repair"} />

      <div className="flex-1 p-4 max-w-2xl mx-auto w-full">
        {/* Main card */}
        <div className="bg-white rounded-xl shadow p-4 space-y-4">
          {/* Order ID */}
          <div>
            <label className="text-sm text-gray-600">Order ID</label>
            <input
              type="text"
              value={orderId}
              readOnly
              className="w-full border rounded px-2 py-1 text-sm bg-gray-100"
            />
          </div>

          {/* Customer Selector */}
          <div>
            <label className="text-sm text-gray-600">Customer</label>
            <div className="flex gap-2 mt-1">
              <button
                onClick={() => setCustomerType("existing")}
                className={`px-3 py-1 text-xs rounded ${
                  customerType === "existing"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100"
                }`}
              >
                Existing
              </button>
              <button
                onClick={() => setCustomerType("new")}
                className={`px-3 py-1 text-xs rounded ${
                  customerType === "new"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100"
                }`}
              >
                New
              </button>
            </div>
          </div>

          {/* Existing Customer Dropdown */}
          {customerType === "existing" && (
            <div>
              <select
                className="w-full border rounded px-2 py-1 text-sm"
                value={customerid}
                onChange={(e) => setCustomerid(e.target.value)} // <-- here
              >
                <option value="">Select customer...</option>
                {customers?.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} - {c.phone}
                  </option>
                ))}
              </select>
              <div> customer id: {customerid}</div>
            </div>
          )}

          {/* New Customer Compact Form */}
          {customerType === "new" && (
            <div className="bg-gray-50 border rounded-lg p-3 space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="border rounded px-2 py-1 text-sm"
                />
                <input
                  type="text"
                  placeholder="Phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="border rounded px-2 py-1 text-sm"
                />
              </div>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border rounded px-2 py-1 text-sm"
              />
              <textarea
                placeholder="Address"
                rows="2"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full border rounded px-2 py-1 text-sm"
              />
              <button
                onClick={addnewCustome}
                className="w-full bg-green-600 text-white text-xs py-1 rounded hover:bg-green-700"
              >
                Save Customer
              </button>
            </div>
          )}

          

          {/* Submit Repair Button */}
          <button className="w-full bg-blue-600 text-white py-2 rounded text-sm hover:bg-blue-700">
            Create Repair
          </button>
        </div>
      </div>
    </div>
  );
};
