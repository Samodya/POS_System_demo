import { useState } from "react";
import { UseProductContext } from "../../context/productContext";
import Topbar from "../topbar";
import logo from "../../assets/logo.png";
import { UseRepairContext } from "../../context/repairContext";
import { UseCustomerContext } from "../../context/customerContext";

export const Invoice = () => {
  const [invoiceItems, setInvoiceItem] = useState("products");
  const { products } = UseProductContext();
  const { repairs } = UseRepairContext();
  const { customers } = UseCustomerContext();
  const [itemArray, setItemArray] = useState([]);

  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");

  // track dealer toggles
  const [dealerPriceStates, setDealerPriceStates] = useState({});
  const toggleDealerPrice = (id, value) => {
    setDealerPriceStates((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  // add product
  const handleAdd = (product) => {
    const useDealerPrice = dealerPriceStates[product.id] || false;
    const unitPrice = useDealerPrice ? product.dealers_price : product.price;

    setItemArray((prev) => {
      const existingItem = prev.find((item) => item.id === product.id);
      if (existingItem) {
        if (product.quantity === 0 || existingItem.count >= product.quantity)
          return prev;

        return prev.map((item) =>
          item.id === product.id
            ? {
                ...item,
                count: item.count + 1,
                totalPrice: (item.count + 1) * unitPrice,
              }
            : item
        );
      } else {
        return [
          ...prev,
          {
            id: product.id,
            type: "product",
            name: product.name,
            unitPrice,
            count: 1,
            totalPrice: unitPrice,
          },
        ];
      }
    });
  };

  // add repair
  // add repair
  const handleRepairsAdd = (repair) => {
    setItemArray((prev) => {
      const exists = prev.find((item) => item.id === repair.order_id);
      if (exists) return prev; // don't add again

      return [
        ...prev,
        {
          id: repair.order_id,
          type: "repair",
          name: `${repair.device} (${repair.issue})`,
          unitPrice: repair.cost,
          count: 1,
          totalPrice: repair.cost,
        },
      ];
    });
  };

  // remove product/repair from bill
  const handleRemove = (id) => {
    setItemArray((prev) => prev.filter((item) => item.id !== id));
  };

  // total
  const totalSum = itemArray.reduce(
    (acc, item) => acc + Number(item.totalPrice),
    0
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      <Topbar title={"Invoice"} />
      <div className="flex flex-col lg:flex-row p-4 gap-4 max-w-7xl mx-auto">
        {/* Left Section */}
        <div className="flex-2 bg-white rounded-2xl shadow-lg overflow-auto">
          {/* Customer details */}
          <div className="bg-white rounded-xl shadow-md p-4 mb-4">
            <h2 className="text-sm font-semibold mb-3 text-gray-700">
              Customer Details
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label className="text-xs font-medium text-gray-600 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Enter customer name"
                  className="border text-xs border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-xs font-medium text-gray-600 mb-1">
                  Phone
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter phone number"
                  className="border text-xs border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-xs font-medium text-gray-600 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email"
                  className="border text-xs border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-xs font-medium text-gray-600 mb-1">
                  Address
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter address"
                  className="border text-xs border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 items-center justify-center border-b bg-gray-100">
            <div
              className={`flex-1 py-2 text-center text-sm font-medium cursor-pointer transition ${
                invoiceItems === "products"
                  ? "text-blue-600 border-b-2 border-blue-600 bg-white"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setInvoiceItem("products")}
            >
              Accessories
            </div>
            <div
              className={`flex-1 py-2 text-center text-sm font-medium cursor-pointer transition ${
                invoiceItems === "Repairs"
                  ? "text-blue-600 border-b-2 border-blue-600 bg-white"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setInvoiceItem("Repairs")}
            >
              Repairs
            </div>
          </div>

          {/* Product List */}
          {invoiceItems === "products" ? (
            <div className="p-4 space-y-2">
              {products.map((product) => {
                const useDealerPrice = dealerPriceStates[product.id] || false;

                return (
                  <div
                    key={product.id}
                    className="px-4 py-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 border rounded-lg bg-gray-50"
                  >
                    {/* Product Info */}
                    <div className="text-sm font-medium text-gray-700">
                      {product.name}
                    </div>

                    {/* Price Selector */}
                    <div className="flex items-center justify-center gap-2">
                      <div
                        onClick={() => toggleDealerPrice(product.id, false)}
                        className={`px-2 py-1 rounded-lg text-xs font-semibold cursor-pointer border ${
                          !useDealerPrice
                            ? "bg-blue-500 text-white border-blue-500"
                            : "bg-white text-gray-600 border-gray-300"
                        }`}
                      >
                        Rs. {product.price}
                      </div>
                      <div
                        onClick={() => toggleDealerPrice(product.id, true)}
                        className={`px-2 py-1 rounded-lg text-xs font-semibold cursor-pointer border ${
                          useDealerPrice
                            ? "bg-green-500 text-white border-green-500"
                            : "bg-white text-gray-600 border-gray-300"
                        }`}
                      >
                        Dealer: Rs. {product.dealers_price}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 justify-center">
                      <button
                        className={`text-xs px-3 py-1 rounded-lg text-white ${
                          product.quantity === 0 ||
                          (itemArray.find((i) => i.id === product.id)?.count ||
                            0) >= product.quantity
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-blue-500 hover:bg-blue-600"
                        }`}
                        onClick={() => handleAdd(product)}
                        disabled={
                          product.quantity === 0 ||
                          (itemArray.find((i) => i.id === product.id)?.count ||
                            0) >= product.quantity
                        }
                      >
                        Add
                      </button>
                      <button
                        className="text-xs px-3 py-1 rounded-lg bg-red-500 text-white hover:bg-red-600"
                        onClick={() => handleRemove(product.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-4 space-y-2">
              <div className="grid grid-cols-6 text-xs font-semibold text-gray-600 border-b pb-2">
                <div>Order No</div>
                <div>Customer</div>
                <div>Device</div>
                <div>Issue</div>
                <div>Cost</div>
                <div>Action</div>
              </div>
              {repairs.map((repair) => {
                const alreadyInList = itemArray.some(
                  (item) => item.id === repair.order_id
                );

                return (
                  <div
                    key={repair.order_id}
                    className="grid grid-cols-6 items-center text-sm border-b py-2"
                  >
                    <div>{repair.order_id}</div>
                    <div>{repair.customer_name}</div>
                    <div>{repair.device}</div>
                    <div>{repair.issue}</div>
                    <div>Rs. {repair.cost}</div>
                    <div>
                      <button
                        onClick={() => handleRepairsAdd(repair)}
                        disabled={alreadyInList}
                        className={`px-2 py-1 rounded text-xs ${
                          alreadyInList
                            ? "bg-gray-400 text-white cursor-not-allowed"
                            : "bg-blue-500 text-white hover:bg-blue-600"
                        }`}
                      >
                        {alreadyInList ? "Added" : "Add"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Section */}
        <div className="flex-1 rounded-2xl bg-white shadow-lg p-4 flex flex-col">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-4">
            <img
              src={logo}
              alt="Logo"
              className="h-14 w-14 rounded-full shadow"
            />
            <div>
              <div className="text-xl font-bold">
                <span className="text-blue-600">Master</span>
                <span className="text-blue-400">Tech</span>
              </div>
              <div className="text-xs font-semibold text-gray-400">
                Computer Solutions
              </div>
            </div>
          </div>

          {/* Bill Summary */}
          <div className="flex-1 overflow-auto">
            <h2 className="text-sm font-semibold mb-3">Invoice : 001</h2>
            <div className="text-xs text-gray-600 mb-3">
              <span className="font-medium">Customer:</span> {customerName}{" "}
              <br />
              <span className="font-medium">Phone:</span> {phone}
            </div>

            {itemArray.length === 0 ? (
              <div className="text-center text-sm text-gray-500">
                No items added yet.
              </div>
            ) : (
              <div className="space-y-2">
                {itemArray.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between border rounded-lg p-2 bg-gray-50"
                  >
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold">{item.name}</span>
                      <span className="text-xs text-gray-500">
                        {item.count} × Rs. {item.unitPrice}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold">
                        Rs. {item.totalPrice}
                      </span>
                      <button
                        onClick={() => handleRemove(item.id)}
                        className="text-red-500 hover:text-red-700 text-xs"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Total + Checkout */}
          <div className="mt-4 border-t pt-3">
            <div className="flex justify-between text-sm font-medium">
              <span>Total:</span>
              <span>Rs. {totalSum}.00</span>
            </div>
            <button className="mt-3 w-full py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition">
              Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
