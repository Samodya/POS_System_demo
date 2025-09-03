import { useEffect, useState } from "react";
import Topbar from "../topbar";
import apiService from "../../utilities/httpservices";
import { Link, useParams } from "react-router-dom";
import Cookies from "js-cookie";
import Loader from "../loader";

export const ViewSale = () => {
  const [invoiceid, setInvoiceid] = useState("");
  const [saleDate, setSaleDate] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [customer, setCustomer] = useState("");
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [saleItems, setSaleItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const { saleid } = useParams();
  const token = Cookies.get("token");

  const getsaleDetails = async () => {
    try {
      const result = await apiService.getDataById("sales", saleid, token);
      setInvoiceid(result.invoiceid);
      setSaleDate(result.sale_date);
      setCustomer(result.customer_name);
      setPhone(result.phone);
      setAmount(result.total_amount);
    } catch (error) {
      console.log(error);
    }
  };

  const getSalesItem = async () => {
    try {
      const result = await apiService.getDataById(
        "saleitems/saleid",
        saleid,
        token
      );
      setSaleItems(result);
    } catch (error) {
      console.log(error);
    }
  };

  const getBill = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:4000/api/reports/sales/${saleid}`, {
        method: "GET",
      });
  
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
    }finally{
      setLoading(false);
    }
  };
  

  useEffect(() => {
    getsaleDetails();
    getSalesItem();
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen">
    {loading == true && <Loader/>}
    <Topbar title={"Sale Information"} />
  
    <div className="p-4 sm:p-6 lg:p-10 max-w-4xl mx-auto space-y-6">
  
      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <Link
          to={"../sales"}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition"
        >
          ← Go Back
        </Link>
        <button
          onClick={getBill}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition"
        >
          Download Bill
        </button>
      </div>
  
      {/* Sale Details */}
      <div className="p-6 bg-white rounded-2xl shadow-md">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-gray-700">
          <div>
            <span className="block text-xs text-gray-500 uppercase font-semibold">
              Invoice Id
            </span>
            <span className="font-medium">{invoiceid}</span>
          </div>
  
          <div>
            <span className="block text-xs text-gray-500 uppercase font-semibold">
              Date
            </span>
            <span className="font-medium">
              {new Date(saleDate).toLocaleDateString("en-US", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              })}
            </span>
          </div>
  
          <div>
            <span className="block text-xs text-gray-500 uppercase font-semibold">
              Time
            </span>
            <span className="font-medium">
              {new Date(saleDate).toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: true,
              })}
            </span>
          </div>
  
          <div>
            <span className="block text-xs text-gray-500 uppercase font-semibold">
              Customer Name
            </span>
            <span className="font-medium">{customer}</span>
          </div>
  
          <div>
            <span className="block text-xs text-gray-500 uppercase font-semibold">
              Contact
            </span>
            <span className="font-medium">{phone}</span>
          </div>
  
          <div>
            <span className="block text-xs text-gray-500 uppercase font-semibold">
              Total Amount
            </span>
            <span className="font-bold text-green-600">Rs.{amount}</span>
          </div>
        </div>
      </div>
  
      {/* Sale Items */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Sale Items</h2>
        <div className="space-y-4">
          {saleItems.length === 0 ? (
            <div className="text-gray-500 text-sm text-center">
              No items found for this sale.
            </div>
          ) : (
            saleItems.map((item) => (
              <div
                key={item.id}
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-center p-3 bg-gray-50 rounded-lg shadow-sm"
              >
                <div>
                  <span className="text-xs text-gray-500 uppercase">Product</span>
                  <div className="font-medium">{item.name}</div>
                </div>
                <div>
                  <span className="text-xs text-gray-500 uppercase">Unit Price</span>
                  <div className="font-medium">Rs.{item.price}</div>
                </div>
                <div>
                  <span className="text-xs text-gray-500 uppercase">Quantity</span>
                  <div className="font-medium">{item.quantity}</div>
                </div>
                <div>
                  <span className="text-xs text-gray-500 uppercase">Total</span>
                  <div className="font-bold text-green-600">Rs.{item.totalprice}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  </div>
  
  );
};
