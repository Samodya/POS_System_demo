import { useEffect, useState } from "react";
import { UseProductContext } from "../../context/productContext";
import Topbar from "../topbar";
import logo from "../../assets/logo.png";
import { UseCustomerContext } from "../../context/customerContext";
import { UseSaleContext } from "../../context/salesContext";
import apiService from "../../utilities/httpservices";
import Cookies from "js-cookie";
import { Trash2 } from "lucide-react"; // Import the trash icon
import Loader from "../loader";

export const Invoice = () => {
  const { products, refreshProducts } = UseProductContext();
  const { customers } = UseCustomerContext();
  const { sales, refreshSales } = UseSaleContext();
  const token = Cookies.get("token");

  const [itemArray, setItemArray] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [invoiceid, setInvoiceid] = useState("");
  const [customerid, setCustomerid] = useState("");
  const [loading, setLoading] = useState(false);

  const [dealerPriceStates, setDealerPriceStates] = useState({});
  const toggleDealerPrice = (id, value) => {
    setDealerPriceStates((prev) => ({ ...prev, [id]: value }));
  };

  const handleAdd = (product) => {
    const useDealerPrice = dealerPriceStates[product.id] || false;

    const unitPrice = useDealerPrice
      ? Number(product.dealers_price)
      : Number(product.price);

    setItemArray((prev) => {
      const existingItem = prev.find((item) => item.id === product.id);

      if (existingItem) {
        if (existingItem.count >= product.quantity) return prev;
        const updatedItems = prev.map((item) =>
          item.id === product.id
            ? {
                ...item,
                count: item.count + 1,
                totalPrice: (item.count + 1) * item.unitPrice,
              }
            : item
        );
        return updatedItems;
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

  const updateItemCount = (id, change) => {
    setItemArray((prev) => {
      const updatedArray = prev
        .map((item) => {
          if (item.id === id) {
            const newCount = item.count + change;
            const correspondingProduct = products.find((p) => p.id === id);

            if (newCount > correspondingProduct.quantity) return item;

            return {
              ...item,
              count: newCount,
              totalPrice: newCount * item.unitPrice,
            };
          }
          return item;
        })
        .filter((item) => item.count > 0);

      return updatedArray;
    });
  };

  // NEW: Function to remove an item entirely
  const handleRemove = (id) => {
    setItemArray((prev) => prev.filter((item) => item.id !== id));
  };

  const totalSum = itemArray.reduce(
    (acc, item) => acc + Number(item.totalPrice),
    0
  );

  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showCustomerList, setShowCustomerList] = useState(false);

  const generateInvoiceId = () => {
    const today = new Date();
    const year = String(today.getFullYear()).slice(-2);
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    const datePart = `${year}${month}${day}`;
    const prefix = "Inv";
    const todaySales = sales.filter((r) =>
      r.invoiceid?.startsWith(prefix + datePart)
    );
    let maxSeq = 0;
    todaySales.forEach((r) => {
      const seq = parseInt(
        r.invoiceid.slice(prefix.length + datePart.length),
        10
      );
      if (!isNaN(seq) && seq > maxSeq) maxSeq = seq;
    });
    return prefix + datePart + (maxSeq + 1);
  };

  useEffect(() => {
    setInvoiceid(generateInvoiceId());
  }, [sales]);

  const addSales = async () => {
    const data = {
      invoiceid: invoiceid,
      customer_id: customerid,
      total_amount: totalSum,
      payment_method: "On-Cash",
    };

    try {
      const result = await apiService.createData("sales", data, token);
      return result.id;
    } catch (error) {
      console.error("Error adding sale:", error);
      alert("Failed to add sale.");
      return null;
    }
  };

  const addSaleItems = async (saleId) => {
    if (!saleId) return;

    try {
      await Promise.all(
        itemArray.map((item) =>
          apiService.createData(
            "saleitems",
            {
              sale_id: saleId,
              product_id: item.id,
              price: item.unitPrice,
              quantity: item.count,
              totalprice: item.totalPrice,
            },
            token
          )
        )
      );
      alert("All sale items added successfully!");
    } catch (error) {
      console.error("Error adding sale items:", error);
      alert("Failed to add sale items.");
    }
  };

  const getBill = async (saleid) => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:4000/api/reports/sales/${saleid}`,
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
      const saleId = await addSales();

      if (saleId) {
        await addSaleItems(saleId);
        await getBill(saleId);

        setInvoiceid(generateInvoiceId());

        refreshSales();
        refreshProducts();
        setItemArray([]);
      }
    } catch (error) {
      console.error("Checkout failed!", error);
      alert("Checkout failed! Please try again.");
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
     {loading == true && <Loader/>}
      <Topbar title={"Invoice"} />
      <div className="flex flex-col lg:flex-row p-4 gap-4 max-w-7xl mx-auto">
        {/* Left Section */}
        <div className="flex-2 bg-white rounded-2xl shadow-lg overflow-auto">
          {/* Customer details */}
          <div className="bg-white rounded-xl shadow-md p-4 mb-4">
            <h2 className="text-sm font-semibold mb-3 text-gray-700">
              Customer
            </h2>
            <div className="relative">
              <input
                type="text"
                placeholder="Search by name, phone or address"
                value={customerName}
                onChange={(e) => {
                  setCustomerName(e.target.value);
                  setSelectedCustomer(null);
                  setShowCustomerList(true);
                }}
                onClick={() => setShowCustomerList(true)}
                className="w-full border text-xs border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              {showCustomerList && !selectedCustomer && (
                <div className="absolute z-10 bg-white border border-gray-300 rounded-lg mt-1 w-full max-h-40 overflow-auto shadow-lg">
                  {customers
                    .filter((c) =>
                      customerName
                        ? c.name
                            .toLowerCase()
                            .includes(customerName.toLowerCase()) ||
                          c.phone
                            .toLowerCase()
                            .includes(customerName.toLowerCase()) ||
                          c.address
                            .toLowerCase()
                            .includes(customerName.toLowerCase())
                        : true
                    )
                    .map((c) => (
                      <div
                        key={c.id}
                        onClick={() => {
                          setCustomerName(c.name);
                          setPhone(c.phone);
                          setAddress(c.address);
                          setEmail(c.email);
                          setSelectedCustomer(c);
                          setShowCustomerList(false);
                          setCustomerid(c.id);
                        }}
                        className="px-3 py-2 text-sm cursor-pointer hover:bg-blue-100"
                      >
                        <div className="font-medium">{c.name}</div>
                        <div className="text-xs text-gray-500">
                          {c.phone} • {c.address}
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>

          {/* Product List */}
          <div className="p-2 space-y-1">
            {products.map((product) => {
              const useDealerPrice = dealerPriceStates[product.id] || false;
              const currentInvoiceQty =
                itemArray.find((i) => i.id === product.id)?.count || 0;
              const isAddButtonDisabled =
                product.quantity === 0 || currentInvoiceQty >= product.quantity;
              const isLowStock = product.quantity > 0 && product.quantity <= 5;

              return (
                <div
                  key={product.id}
                  className="px-4 py-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-1 border rounded-lg bg-gray-50"
                >
                  <div className="flex flex-col">
                    <div className="text-sm font-semibold text-gray-700">
                      {product.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      Model: {product.itemmodel_id}
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <div className="text-xs font-medium text-gray-500">
                      Warranty
                    </div>
                    <div className="text-sm text-gray-700">
                      {product.warranty}
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <div className="text-xs font-medium text-gray-500">
                      Quantity
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-700">
                        {product.quantity}
                      </span>
                      {isLowStock && (
                        <span className="text-xs font-bold px-2 py-1 rounded-full bg-yellow-400 text-yellow-900">
                          Low Stock
                        </span>
                      )}
                      {product.quantity === 0 && (
                        <span className="text-xs font-bold px-2 py-1 rounded-full bg-red-400 text-red-900">
                          Out of Stock
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 justify-end md:justify-center">
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
                    <button
                      className={`text-xs px-3 py-1 rounded-lg text-white ${
                        isAddButtonDisabled
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-blue-500 hover:bg-blue-600"
                      }`}
                      onClick={() => handleAdd(product)}
                      disabled={isAddButtonDisabled}
                    >
                      Add
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Section */}
        <div className="flex-1 rounded-2xl bg-white shadow-lg p-4 flex flex-col">
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

          <div className="flex-1 overflow-auto">
            <h2 className="text-sm font-semibold mb-3">
              Invoice : {invoiceid}
            </h2>
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
                        Rs. {Number(item.unitPrice).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 bg-gray-200 rounded-lg px-2 py-1">
                        <button
                          onClick={() => updateItemCount(item.id, -1)}
                          className="text-xs text-gray-600 hover:text-gray-800"
                        >
                          -
                        </button>
                        <span className="text-xs font-semibold text-gray-800 w-4 text-center">
                          {item.count}
                        </span>
                        <button
                          onClick={() => updateItemCount(item.id, 1)}
                          className="text-xs text-gray-600 hover:text-gray-800"
                        >
                          +
                        </button>
                      </div>
                      <span className="text-sm font-semibold w-16 text-right">
                        Rs. {Number(item.totalPrice).toFixed(2)}
                      </span>
                      <button
                        onClick={() => handleRemove(item.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-4 border-t pt-3">
            <div className="flex justify-between text-sm font-medium">
              <span>Total:</span>
              <span>Rs. {totalSum.toFixed(2)}</span>
            </div>
            <button
              onClick={handleCheckout}
              className="mt-3 w-full py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition"
            >
              Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
