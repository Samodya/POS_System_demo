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
  Trash2,
  Download,
  ShoppingCart,
} from "lucide-react";
import { UseRepairSaleContext } from "../../context/repair_sale_context";
import Loader from "../loader";

export const EditRepair = () => {
  const { refreshRepairs } = UseRepairContext();
  const { refreshCustomers } = UseCustomerContext();
  const { repairsales, refreshRepairSales } = UseRepairSaleContext();
  const { products, refreshProducts } = UseProductContext();
  const { users } = UseUserContext("");
  const token = Cookies.get("token");
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [customer_id, setCustomer_id] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [device, setDevice] = useState("");
  const [issue, setIssue] = useState("");
  const [status, setStatus] = useState("pending");
  const [cost, setCost] = useState("");
  const [receivedDate, setReceivedDate] = useState("");
  const [completedDate, setCompletedDate] = useState("");
  const [repairNote, setRepairNote] = useState("");
  const [assignedUserId, setAssignedUserId] = useState("");
  const [totalCost, setTotalCost] = useState(0);

  // Tabs state for left column
  const [activeTab, setActiveTab] = useState("form");

  // State for parts management
  const [existingParts, setExistingParts] = useState([]);
  const [newParts, setNewParts] = useState([]);
  const [accessoryProducts, setAccessoryProducts] = useState([]);

  // Tab state for right column
  const [activePartsTab, setActivePartsTab] = useState("new");

  // Fetch initial repair data
  const getRepair = async () => {
    try {
      const result = await apiService.getDataById("repairs", id, token);
      console.log(result);

      setOrderId(result.order_id);
      setCustomerName(result.customer_name);
      setCustomer_id(result.customer_id);
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

  const statusOptions = [
    { value: "pending", label: "Pending" },
    { value: "in_progress", label: "In Progress" },
    { value: "completed", label: "Completed" },
    { value: "awaiting_parts", label: "Awaiting Parts" },
  ];

  // Fetch and set existing parts
  const getRepairItems = async () => {
    try {
      const result = await apiService.getDataById(
        "repair-items/repair",
        id,
        token
      );
      setExistingParts(
        result.map((item) => ({
          id: item.product_id,
          name: item.name,
          quantity: item.quantity,
          unitPrice: item.price,
        }))
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getRepair();
    getRepairItems();
    refreshRepairSales();
  }, [id]);

  const generateOrderId = async () => {
    await refreshRepairSales(); // ensure repairsales is fresh

    const today = new Date();
    const year = String(today.getFullYear()).slice(-2);
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    const datePart = `${year}${month}${day}`;
    const prefix = "ORD";

    const todayRepairs = repairsales.filter((r) =>
      r.invoiceid?.startsWith(prefix + datePart)
    );

    let maxSeq = 0;
    todayRepairs.forEach((r) => {
      const seq = parseInt(
        r.invoiceid.slice(prefix.length + datePart.length),
        10
      );
      if (!isNaN(seq) && seq > maxSeq) maxSeq = seq;
    });

    return prefix + datePart + (maxSeq + 1);
  };

  const getBill = async (id) => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:4000/api/reports/repairs/${id}`,
        {
          method: "GET",
        }
      );

      if (!response.ok) throw new Error("Failed to fetch PDF");

      // Convert response to blob
      const blob = await response.blob();

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `sale-${saleid}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error fetching PDF:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = async () => {
    try {
      let existingSales = null;
      try {
        existingSales = await apiService.getDataById(
          "repair-sales/repair",
          id,
          token
        );
      } catch (err) {
        if (err.response?.status !== 404) {
          throw err; // only swallow 404, rethrow other errors
        }
      }
  
      const invoiceid = await generateOrderId();
      const data = {
        invoiceid,
        repair_id: id,
        customer_id,
        total_amount: totalCost,
        payment_method: "Cash",
      };
  
      if (existingSales) {
        // ✅ Update if found
        try {
          await apiService.updateData("repair-sales", existingSales.id, data, token);
          refreshRepairSales();
        } catch (error) {
          console.log(error);
        }
      } else {
        // ✅ Create if not found
        try {
          const result = await apiService.createData("repair-sales", data, token);
          if (result) {
            alert("Checkout completed!");
            // getBill(id); // pass invoiceid to keep file name unique
          }
          refreshRepairSales();
        } catch (error) {
          console.log(error.response?.data?.error?.message || error.message);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  

  // Sync products from context with local state on initial load or refresh
  useEffect(() => {
    if (products) {
      setAccessoryProducts(products.filter((p) => p.category === "Accessory"));
    }
  }, [products]);

  const handleUpdateRepair = async () => {
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
      };
      const result = await apiService.updateData(
        "repairs",
        id,
        repairData,
        token
      );
      alert("Repair updated successfully!");
      console.log(result);
      refreshRepairs();
    } catch (error) {
      console.error(error);
      alert("Failed to update repair");
    }
    refreshCustomers();
  };

  const handleSaveNewParts = async () => {
    if (newParts.length === 0) {
      alert("No new parts to save.");
      return;
    }

    try {
      for (const part of newParts) {
        const payload = {
          repair_id: id,
          product_id: part.id,
          quantity: part.quantity,
          price: part.unitPrice,
          total_amount: part.quantity * part.unitPrice,
        };
        await apiService.createData("repair-items", payload, token);
      }

      alert("New parts saved successfully!");
      setExistingParts((prev) => [...prev, ...newParts]);
      setNewParts([]);
      refreshProducts(); // Refresh stock data
    } catch (error) {
      console.error(error);
      alert("Failed to save new parts");
    }
  };

  // Add a new part to the newParts list or increment existing one
  const addPart = (product, priceType) => {
    const existingNewPart = newParts.find((p) => p.id === product.id);
    const updatedProduct = accessoryProducts.find((p) => p.id === product.id);

    // Check if there's stock available before adding
    if (updatedProduct.quantity <= 0) {
      alert(`${product.name} is out of stock`);
      return;
    }

    if (existingNewPart) {
      setNewParts((prev) =>
        prev.map((p) =>
          p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p
        )
      );
    } else {
      setNewParts((prev) => [
        ...prev,
        {
          id: product.id,
          name: product.name,
          quantity: 1,
          unitPrice:
            priceType === "dealer" ? product.dealers_price : product.price,
        },
      ]);
    }

    // Decrement local stock for real-time visual feedback
    setAccessoryProducts((prev) =>
      prev.map((p) =>
        p.id === product.id ? { ...p, quantity: p.quantity - 1 } : p
      )
    );
  };

  // update quantity of a new part
  const updateNewPartQuantity = (id, change) => {
    const partToUpdate = newParts.find((p) => p.id === id);
    if (!partToUpdate) return;
    const newQty = partToUpdate.quantity + change;

    if (newQty < 1) return; // Prevent quantity from dropping below 1

    const correspondingProduct = accessoryProducts.find((p) => p.id === id);
    if (change > 0 && correspondingProduct.quantity <= 0) {
      alert("Cannot add more, out of stock.");
      return;
    }

    setNewParts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, quantity: newQty } : p))
    );

    // Update local stock for visual feedback
    setAccessoryProducts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, quantity: p.quantity - change } : p
      )
    );
  };

  // remove a new part and increase the stock
  const removeNewPart = (id) => {
    const removedPart = newParts.find((p) => p.id === id);
    if (!removedPart) return;

    setAccessoryProducts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, quantity: p.quantity + removedPart.quantity } : p
      )
    );
    setNewParts((prev) => prev.filter((p) => p.id !== id));
  };

  // calculate total amount
  const calculateTotal = () => {
    const allParts = [...existingParts, ...newParts];
    const partsTotal = allParts.reduce(
      (sum, p) => sum + p.quantity * p.unitPrice,
      0
    );
    const serviceCharge = parseFloat(cost) || 0;
    const totalamount = partsTotal + serviceCharge;

    return totalamount;
  };

  useEffect(() => {
    setTotalCost(calculateTotal());
  }, [existingParts, newParts, cost]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {loading && <Loader />}
      <Topbar title="Edit Repair Details" />

      <div className="max-w-6xl mx-auto w-full px-6 py-4 space-y-3">
        {/* Contact Details */}
        <div className="bg-white rounded-xl shadow-md p-4">
          <div className="border-b pb-2 flex justify-between mb-2">
            <h2 className="text-lg font-semibold text-gray-800  pb-2 mb-2">
              Contact Details
            </h2>
            <div>
              <button
                className="text-sm rounded font-bold bg-blue-900 text-white flex items-center justify-center gap-2 p-2"
                onClick={handleCheckout}
              >
                <ShoppingCart size={16} />
                Checkout
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-y-2 text-sm">
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
              <input
                type="number"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                className="w-24 border rounded-md px-2 py-1 text-sm"
              />
            </p>
          </div>
        </div>

        {/* Repair Details & Parts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column with tabs */}
          <div className="bg-white rounded-xl shadow-md p-6 lg:col-span-2">
            {/* Tabs */}
            <div className="flex border-b mb-2">
              <button
                className={`px-4 py-1 text-sm font-medium ${
                  activeTab === "form"
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-gray-500"
                }`}
                onClick={() => setActiveTab("form")}
              >
                Repair Form
              </button>
              <button
                className={`px-4 py-1 text-sm font-medium ${
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
                <h2 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-2">
                  Repair Details
                </h2>
                {/* Form fields with compacted spacing */}
                <div className="space-y-2">
                  {/* Device */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-0.5">
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
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-0.5">
                      <FileText size={16} /> Issue
                    </label>
                    <input
                      type="text"
                      value={issue}
                      onChange={(e) => setIssue(e.target.value)}
                      className="w-full border rounded-lg px-3 py-1 text-sm focus:ring focus:ring-blue-200 focus:border-blue-500"
                    />
                  </div>

                  {/* Dates */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-0.5">
                        <Calendar size={16} /> Received Date
                      </label>
                      <input
                        type="date"
                        value={receivedDate}
                        onChange={(e) => setReceivedDate(e.target.value)}
                        className="w-full border rounded-lg px-3 py-1 text-sm focus:ring focus:ring-blue-200 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-0.5">
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
                  {/* Status */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                      <FileText size={16} /> Status
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
                    onClick={handleUpdateRepair}
                    className="w-full py-2 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg shadow hover:from-blue-700 hover:to-indigo-700 transition duration-200"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            )}

            {activeTab === "accessories" && (
              <div>
                <h2 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-3">
                  Accessories
                </h2>
                <div className="space-y-4 max-h-96 overflow-y-auto">
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
                          Selling: Rs.{p.price} | Dealer: Rs.
                          {p.dealers_price}
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
            <h2 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-3">
              Required Parts
            </h2>
            {/* Tab navigation for parts */}
            <div className="flex border-b mb-3">
              <button
                className={`px-4 py-2 text-sm font-medium ${
                  activePartsTab === "existing"
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-gray-500"
                }`}
                onClick={() => setActivePartsTab("existing")}
              >
                Existing
              </button>
              <button
                className={`px-4 py-2 text-sm font-medium ${
                  activePartsTab === "new"
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-gray-500"
                }`}
                onClick={() => setActivePartsTab("new")}
              >
                New
              </button>
            </div>

            {activePartsTab === "existing" && (
              <div>
                {existingParts.length === 0 ? (
                  <p className="text-sm text-gray-500 py-2">
                    No parts on this repair yet.
                  </p>
                ) : (
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {existingParts.map((p) => (
                      <div
                        key={p.id}
                        className="flex items-center justify-between border-b pb-1"
                      >
                        <div>
                          <p className="font-medium text-gray-800">{p.name}</p>
                          <p className="text-sm text-gray-500">
                            Qty: {p.quantity} | Price: Rs.{p.unitPrice}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activePartsTab === "new" && (
              <div>
                {newParts.length === 0 ? (
                  <p className="text-sm text-gray-500 py-2">
                    No new parts added.
                  </p>
                ) : (
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {newParts.map((p) => (
                      <div
                        key={p.id}
                        className="flex items-center justify-between border-b pb-1"
                      >
                        <div>
                          <p className="font-medium text-gray-800">{p.name}</p>
                          <p className="text-sm text-gray-500">
                            Qty: {p.quantity} | Price: Rs.{p.unitPrice}
                          </p>
                        </div>
                        <div className="flex gap-2 items-center">
                          <button
                            onClick={() => updateNewPartQuantity(p.id, -1)}
                            className="px-2 py-1 bg-gray-200 rounded text-sm hover:bg-gray-300"
                          >
                            -
                          </button>
                          <span>{p.quantity}</span>
                          <button
                            onClick={() => updateNewPartQuantity(p.id, 1)}
                            className="px-2 py-1 bg-gray-200 rounded text-sm hover:bg-gray-300"
                          >
                            +
                          </button>
                          <button
                            onClick={() => removeNewPart(p.id)}
                            className="px-2 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <div className="mt-8">
                  <button
                    onClick={handleSaveNewParts}
                    disabled={newParts.length === 0}
                    className={`w-full py-2 px-4 font-semibold rounded-lg shadow transition duration-200 ${
                      newParts.length > 0
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700"
                        : "bg-gray-300 text-gray-600 cursor-not-allowed"
                    }`}
                  >
                    Save New Components
                  </button>
                </div>
              </div>
            )}

            <div className="pt-4 border-t mt-4">
              <p className="text-sm font-medium text-gray-700">
                Parts Total: Rs.
                {[...existingParts, ...newParts].reduce(
                  (sum, p) => sum + p.quantity * p.unitPrice,
                  0
                )}
              </p>
              <p className="text-sm font-medium text-gray-700">
                Service Charge: Rs.{cost || 0}
              </p>
              <p className="text-lg font-semibold text-gray-800 mt-2">
                Total Amount: Rs.{totalCost}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
