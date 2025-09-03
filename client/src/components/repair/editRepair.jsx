import { useEffect, useState } from "react";
import Topbar from "../topbar";
import apiService from "../../utilities/httpservices";
import Cookies from "js-cookie";
import { UseRepairContext } from "../../context/repairContext";
import { UseCustomerContext } from "../../context/customerContext";
import { UseUserContext } from "../../context/usersContext";
import { UseProductContext } from "../../context/productContext";
import { useParams } from "react-router-dom";
import {
  Calendar,
  Computer,
  DollarSign,
  Phone,
  Ticket,
  User,
  UserStarIcon,
  FileText,
} from "lucide-react";

export const EditRepair = () => {
  const { refreshRepairs } = UseRepairContext();
  const { refreshCustomers } = UseCustomerContext();
  const { products } = UseProductContext();
  const { users } = UseUserContext("");
  const token = Cookies.get("token");
  const { id } = useParams();

  const [orderId, setOrderId] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [device, setDevice] = useState("");
  const [issue, setIssue] = useState("");
  const [status, setStatus] = useState("Pending");
  const [cost, setCost] = useState("");
  const [receivedDate, setReceivedDate] = useState("");
  const [completedDate, setCompletedDate] = useState("");
  const [repairNote, setRepairNote] = useState("");
  const [assignedUserId, setAssignedUserId] = useState("");

  // tabs
  const [activeTab, setActiveTab] = useState("form");

  // selected parts
  const [selectedParts, setSelectedParts] = useState([]);

  const getRepair = async () => {
    try {
      const result = await apiService.getDataById("repairs", id, token);
      setOrderId(result.order_id);
      setCustomerName(result.customer_name);
      setPhone(result.contact_no);
      setDevice(result.device);
      setIssue(result.issue);
      setCost(result.cost);
      setStatus(result.status);
      setReceivedDate(result.received_date?.split("T")[0] || "");
      setCompletedDate(result.completed_date?.split("T")[0] || "");
      setAssignedUserId(result.assigned_to || "");
      setRepairNote(result.repair_fix_note || "");
    } catch (error) {
      alert(error);
    }
  };

  useEffect(() => {
    getRepair();
  }, [id]);

  const accessoryProducts = products.filter(
    (product) => product.category === "Accessory"
  );

  const handleSubmit = async () => {
    try {
      const repairData = {
        device,
        issue,
        status,
        cost,
        received_date: receivedDate,
        completed_date: completedDate,
        assigned_to: assignedUserId,
        repair_fix_note: repairNote,
        // include selected parts
      };
      await apiService.updateData("repairs", id, repairData, token);
      alert("Repair updated successfully!");
      refreshRepairs();
    } catch (error) {
      console.error(error);
      alert("Failed to update repair");
    }
    refreshCustomers();
  };

  const handleSaveParts = async () => {
    if (selectedParts.length === 0) {
      alert("No parts selected");
      return;
    }
  
    try {
      for (const part of selectedParts) {
        const payload = {
          repair_id: id,            // current repair
          product_id: part.id,
          quantity: part.quantity,
          price: part.unitPrice,    // selling or dealer price
          total_amount: part.quantity * part.unitPrice, // new field
        };
  
        
        await apiService.createData("repair-items", payload, token);
      }
  
      alert("Parts saved successfully!");
      refreshProducts();
    } catch (error) {
      console.error(error);
      alert("Failed to save parts");
    }
  };
  
  // calculate total amount
  const calculateTotal = () => {
    const partsTotal = selectedParts.reduce(
      (sum, p) => sum + p.quantity * p.unitPrice,
      0
    );
    const serviceCharge = parseFloat(cost) || 0;

    return partsTotal + serviceCharge;
  };
  // add part
  const addPart = (product, priceType) => {
    const existing = selectedParts.find((p) => p.id === product.id);
    if (existing) {
      if (existing.quantity + 1 > product.quantity) {
        alert(`${product.name} is out of stock`);
        return;
      }
      setSelectedParts((prev) =>
        prev.map((p) =>
          p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p
        )
      );
    } else {
      if (product.quantity < 1) {
        alert(`${product.name} is out of stock`);
        return;
      }
      setSelectedParts((prev) => [
        ...prev,
        {
          id: product.id,
          name: product.name,
          quantity: 1,
          unitPrice:
            priceType === "dealer" ? product.dealers_price : product.price,
          stock: product.quantity,
        },
      ]);
    }
  };

  // update quantity
  const updateQuantity = (id, change) => {
    setSelectedParts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const newQty = p.quantity + change;
          if (newQty > p.stock) {
            alert(`${p.name} is out of stock`);
            return p;
          }
          return { ...p, quantity: newQty > 0 ? newQty : 1 };
        }
        return p;
      })
    );
  };

  // remove part
  const removePart = (id) => {
    setSelectedParts((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Topbar title="Edit Repair Details" />

      <div className="max-w-6xl mx-auto w-full px-6 py-4 space-y-8">
        {/* Contact Details */}
        <div className="bg-white rounded-xl shadow-md p-4">
          <h2 className="text-lg font-semibold text-gray-800 border-b pb-3 mb-4">
            Contact Details
          </h2>
          <div className="grid grid-cols-2 gap-y-4 text-sm">
            <p className="flex items-center gap-2 text-gray-700">
              <Ticket size={16} className="text-gray-500" />
              <span className="font-medium">Ticket No:</span> {orderId}
            </p>
            <p className="flex items-center gap-2 text-gray-700">
              <UserStarIcon size={16} className="text-gray-500" />
              <span className="font-medium">Customer Name:</span> {customerName}
            </p>
            <p className="flex items-center gap-2 text-gray-700">
              <Phone size={16} className="text-gray-500" />
              <span className="font-medium">Contact No:</span> {phone}
            </p>
            <p className="flex items-center gap-2 text-gray-700">
              <DollarSign size={16} className="text-gray-500" />
              <span className="font-medium">Service Cost:</span>{" "}
              {cost ? `Rs.${cost}` : "Rs.0.00"}
            </p>
          </div>
        </div>

        {/* Repair Details & Parts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column with tabs */}
          <div className="bg-white rounded-xl shadow-md p-6 lg:col-span-2">
            {/* Tabs */}
            <div className="flex border-b mb-4">
              <button
                className={`px-4 py-2 text-sm font-medium ${
                  activeTab === "form"
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-gray-500"
                }`}
                onClick={() => setActiveTab("form")}
              >
                Repair Form
              </button>
              <button
                className={`px-4 py-2 text-sm font-medium ${
                  activeTab === "accessories"
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-gray-500"
                }`}
                onClick={() => setActiveTab("accessories")}
              >
                Accessories
              </button>
            </div>

            {activeTab === "form" && (
              <div>
                <h2 className="text-lg font-semibold text-gray-800 border-b pb-3 mb-4">
                  Repair Details
                </h2>
                <div className="space-y-5">
                  {/* Device */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                      <Computer size={16} /> Device
                    </label>
                    <input
                      type="text"
                      value={device}
                      onChange={(e) => setDevice(e.target.value)}
                      className="w-full border rounded-lg px-3 py-2 text-sm focus:ring focus:ring-blue-200 focus:border-blue-500"
                    />
                  </div>

                  {/* Issue */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                      <FileText size={16} /> Issue
                    </label>
                    <input
                      type="text"
                      value={issue}
                      onChange={(e) => setIssue(e.target.value)}
                      className="w-full border rounded-lg px-3 py-2 text-sm focus:ring focus:ring-blue-200 focus:border-blue-500"
                    />
                  </div>

                  {/* Dates */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                        <Calendar size={16} /> Received Date
                      </label>
                      <input
                        type="date"
                        value={receivedDate}
                        onChange={(e) => setReceivedDate(e.target.value)}
                        className="w-full border rounded-lg px-3 py-2 text-sm focus:ring focus:ring-blue-200 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                        <Calendar size={16} /> Completed Date
                      </label>
                      <input
                        type="date"
                        value={completedDate}
                        onChange={(e) => setCompletedDate(e.target.value)}
                        className="w-full border rounded-lg px-3 py-2 text-sm focus:ring focus:ring-blue-200 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  {/* Repair Note */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                      <FileText size={16} /> Repair Fixing Description
                    </label>
                    <textarea
                      value={repairNote}
                      onChange={(e) => setRepairNote(e.target.value)}
                      rows="3"
                      className="w-full border rounded-lg px-3 py-2 text-sm focus:ring focus:ring-blue-200 focus:border-blue-500"
                    />
                  </div>

                  {/* Assigned User */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                      <User size={16} /> Assigned User
                    </label>
                    <select
                      value={assignedUserId}
                      onChange={(e) => setAssignedUserId(e.target.value)}
                      className="w-full border rounded-lg px-3 py-2 text-sm focus:ring focus:ring-blue-200 focus:border-blue-500"
                    >
                      <option value="">Select a user</option>
                      {users.map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.fullname}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Save button */}
                <div className="pt-6">
                  <button
                    onClick={handleSubmit}
                    className="w-full py-2 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg shadow hover:from-blue-700 hover:to-indigo-700 transition duration-200"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            )}

            {activeTab === "accessories" && (
              <div>
                <h2 className="text-lg font-semibold text-gray-800 border-b pb-3 mb-4">
                  Accessories
                </h2>
                <div className="space-y-4">
                  {accessoryProducts.map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center justify-between border-b pb-2"
                    >
                      <div>
                        <p className="font-medium text-gray-800">{p.name}</p>
                        <p className="text-sm text-gray-500">
                          Stock: {p.quantity}{" "}
                          {p.quantity <= 2 && (
                            <span className="text-red-500 ml-2 font-medium">
                              Low Stock
                            </span>
                          )}
                        </p>
                        <p className="text-sm text-gray-500">
                          Selling: Rs.{p.price} | Dealer: Rs.{p.dealers_price}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => addPart(p, "selling")}
                          className="px-3 py-1 bg-blue-500 text-white text-sm rounded"
                        >
                          Selling
                        </button>
                        <button
                          onClick={() => addPart(p, "dealer")}
                          className="px-3 py-1 bg-green-500 text-white text-sm rounded"
                        >
                          Dealer
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right column: selected parts */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-800 border-b pb-3 mb-4">
              Required Parts or Accessories
            </h2>
            {selectedParts.length === 0 ? (
              <p className="text-sm text-gray-500">No parts selected yet.</p>
            ) : (
              <div className="space-y-4">
                {selectedParts.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between border-b pb-2"
                  >
                    <div>
                      <p className="font-medium text-gray-800">{p.name}</p>
                      <p className="text-sm text-gray-500">
                        Qty: {p.quantity} / Stock: {p.stock}
                      </p>
                      <p className="text-sm text-gray-500">
                        Unit Price: Rs.{p.unitPrice}
                      </p>
                    </div>
                    <div className="flex gap-2 items-center">
                      <button
                        onClick={() => updateQuantity(p.id, -1)}
                        className="px-2 py-1 bg-gray-200 rounded"
                      >
                        -
                      </button>
                      <span>{p.quantity}</span>
                      <button
                        onClick={() => updateQuantity(p.id, 1)}
                        className="px-2 py-1 bg-gray-200 rounded"
                      >
                        +
                      </button>
                      <button
                        onClick={() => removePart(p.id)}
                        className="px-2 py-1 bg-red-500 text-white rounded"
                      >
                        x
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  onClick={handleSaveParts}
                  className="w-full py-2 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg shadow hover:from-blue-700 hover:to-indigo-700 transition duration-200"
                >
                  Save Components
                </button>

                <div className="pt-4 border-t mt-4">
                  <p className="text-sm font-medium text-gray-700">
                    Parts Total: Rs.
                    {selectedParts.reduce(
                      (sum, p) => sum + p.quantity * p.unitPrice,
                      0
                    )}
                  </p>
                  <p className="text-sm font-medium text-gray-700">
                    Service Charge: Rs.{cost || 0}
                  </p>
                  <p className="text-lg font-semibold text-gray-800 mt-2">
                    Total Amount: Rs.{calculateTotal()}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
