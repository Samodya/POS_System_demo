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
} from "lucide-react";

export const EditRepair = () => {
  const { refreshRepairs } = UseRepairContext();
  const { refreshCustomers } = UseCustomerContext();
  const { users } = UseUserContext("");
  const token = Cookies.get("token");

  const [orderId, setOrderId] = useState("");
  const [customerid, setCustomerid] = useState("");

  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");

  const [device, setDevice] = useState("");
  const [issue, setIssue] = useState("");
  const [status, setStatus] = useState("Pending");
  const [cost, setCost] = useState("");
  const [receivedDate, setReceivedDate] = useState("");
  const [completedDate, setCompletedDate] = useState("");
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
      setCost(result.cost);
      setReceivedDate(result.received_date?.split("T")[0] || "");
      setCompletedDate(result.completed_date?.split("T")[0] || "");
      setAssignedUserId(result.assigned_to || "");
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
      };
      await apiService.updateData("repairs",id, repairData, token);
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

      <div className="max-w-3xl mx-auto w-full p-6 space-y-6">
        {/* Contact Info Card */}
        <div className="bg-white rounded-2xl shadow p-6 space-y-3 ">
          <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">
            Contact Details
          </h2>
          <div className="grid grid-cols-2">
            <p className="flex items-center gap-2 text-sm text-gray-700 mb-2">
              <Ticket size={16} className="text-gray-500" />
              <span className="font-medium">Ticket No:</span> {orderId}
            </p>
            <p className="flex items-center gap-2 text-sm text-gray-700 mb-2">
              <UserStarIcon size={16} className="text-gray-500" />
              <span className="font-medium">Customer Name:</span> {customerName}
            </p>
            <p className="flex items-center gap-2 text-sm text-gray-700 mb-2">
              <Phone size={16} className="text-gray-500" />
              <span className="font-medium">Contact No:</span> {phone}
            </p>
          </div>
        </div>

        {/* Repair Details Card */}
        <div className="bg-white rounded-2xl shadow p-6 space-y-5">
          <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">
            Repair Details
          </h2>

          <div className="space-y-4 ">
            {/* Device */}
            <div className="grid grid-cols-2 gap-2">
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

              {/* Cost */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                  <DollarSign size={16} /> Cost
                </label>
                <input
                  type="number"
                  value={cost}
                  onChange={(e) => setCost(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:ring focus:ring-blue-200 focus:border-blue-500"
                />
              </div>
            </div>
            {/* Issue */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                <Computer size={16} /> Issue
              </label>
              <input
                type="text"
                value={issue}
                onChange={(e) => setIssue(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:ring focus:ring-blue-200 focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              {/* Received Date */}
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

              {/* Completed Date */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                  <Calendar size={16} /> Completing Date
                </label>
                <input
                  type="date"
                  value={completedDate}
                  onChange={(e) => setCompletedDate(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:ring focus:ring-blue-200 focus:border-blue-500"
                />
              </div>
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
                <option value={assignedUserId}>Select a user</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.fullname}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Save Button */}
          <div className="pt-4">
            <button
              onClick={handleSubmit}
              className="w-full py-2 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg shadow hover:from-blue-700 hover:to-indigo-700 transition duration-200"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
