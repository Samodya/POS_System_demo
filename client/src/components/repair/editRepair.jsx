import { useEffect, useState } from "react";
import Topbar from "../topbar";
import apiService from "../../utilities/httpservices";
import Cookies from "js-cookie";
import { UseRepairContext } from "../../context/repairContext";
import { UseCustomerContext } from "../../context/customerContext";
import { UseUserContext } from "../../context/usersContext";
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
  const { users } = UseUserContext("");
  const token = Cookies.get("token");

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
  const { id } = useParams();

  const getRepair = async () => {
    try {
      const result = await apiService.getDataById("repairs", id, token);
      setOrderId(result.order_id);
      setCustomerName(result.customer_name);
      setPhone(result.contact_no);
      setDevice(result.device);
      setIssue(result.issue);
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
      };
      await apiService.updateData("repairs", id, repairData, token);
      alert("Repair updated successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to update repair");
    }
    refreshCustomers();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
    <Topbar title="Edit Repair Details" />
  
    <div className="max-w-6xl mx-auto w-full px-6 py-8 space-y-8">
      {/* Contact Details card - unchanged */}
      <div className="bg-white rounded-xl shadow-md p-6">
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
            <span className="font-medium">Total Cost:</span>{" "}
            {cost ? `Rs.${cost}` : "Rs.0.00"}
          </p>
        </div>
      </div>
  
      {/* Repair Details section with 2 columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: form */}
        <div className="bg-white rounded-xl shadow-md p-6 lg:col-span-2">
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
  
        {/* Right column: placeholder for future components */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 border-b pb-3 mb-4">
            Required Parts or Acce
          </h2>
          <p className="text-sm text-gray-500">
            Space reserved for additional components later.
          </p>
        </div>
      </div>
    </div>
  </div>
  
  );
};
