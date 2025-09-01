import { useEffect, useState } from "react";
import Topbar from "../topbar";
import apiService from "../../utilities/httpservices";
import { useParams } from "react-router-dom";
import Cookies from "js-cookie";

export const ViewSale = () => {
  const [invoiceid, setInvoiceid] = useState("");
  const [saleDate, setSaleDate] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [customer, setCustomer] = useState("");
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [saleItems, setSaleItems] = useState([]);
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
      console.log(result);
    } catch (error) {}
  };

  const getSalesItem = async () => {
    try {
      const result = await apiService.getDataById(
        "saleitems/saleid",
        saleid,
        token
      );
      setSaleItems(result);
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getsaleDetails();
    getSalesItem();
  }, []);

  return (
    <div className="overflow-hidden">
      <Topbar title={"Sale Information"} />
      <div className="p-10 -m-4">
        <div className="p-6 bg-white rounded-2xl shadow-md w-4xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-4 text-sm text-gray-700">
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
      </div>
      <div>
        
      </div>
    </div>
  );
};
