import { BoxIcon, Files, User, X } from "lucide-react";
import { useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { UseProductContext } from "../../context/productContext";

export const AddProduct = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [preview, setPreview] = useState(null);
  const [files, setFiles] = useState(null);
  const token = Cookies.get("token");
  const { refreshProducts } = UseProductContext();

  const [modelSearch, setModelSearch] = useState("");
  const [showModelList, setShowModelList] = useState(false);

  const [formData, setFormData] = useState({
    productName: "",
    category: "",
    itemmodel_id: "",
    buyingPrice: "",
    sellingPrice: "",
    dealerPrice: "",
    quantity: "",
    description: "",
    warranty: "",
    conditions: "",
    serial_no: "",
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      setFiles(file);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData();
    form.append("name", formData.productName);
    form.append("category", formData.category);
    form.append("itemmodel_id", formData.itemmodel_id);
    form.append("buying_price", formData.buyingPrice);
    form.append("price", formData.sellingPrice);
    form.append("dealers_price", formData.dealerPrice);
    form.append("quantity", formData.quantity);
    form.append("description", formData.description);
    form.append("warranty", formData.warranty);
    form.append("conditions", formData.conditions);
    form.append("serial_no", formData.serial_no);
    form.append("image", files);

    try {
      await axios.post(`http://localhost:4000/api/products`, form, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      clearData();
      setShowMenu(false);
      refreshProducts();
    } catch (err) {
      console.error("Upload failed", err);
    }
  };

  function clearData() {
    setFormData({
      productName: "",
      category: "",
      itemmodel_id: "",
      buyingPrice: "",
      sellingPrice: "",
      dealerPrice: "",
      quantity: "",
      description: "",
      warranty: "",
      conditions: "",
      serial_no: "",
    });
    setPreview(null);
    setFiles(null);
    setModelSearch("");
  }

  return (
    <div>
      <button
        className="bg-gradient-to-r from-black via-[#0a0f2c] to-[#013ea0] text-white flex p-2 
        rounded cursor-pointer items-center justify-center gap-2 hover:brightness-110 transition"
        onClick={() => setShowMenu(true)}
      >
        <BoxIcon size={20} /> Add Product
      </button>

      {showMenu && (
        <>
          {/* Background overlay */}
          <div
            className="fixed inset-0 bg-black-800 bg-opacity-10 backdrop-blur-sm"
            style={{ zIndex: 1000 }}
            onClick={() => setShowMenu(false)}
          ></div>

          {/* Modal */}
          <div
            className="fixed inset-0 flex items-center justify-center p-3"
            style={{ zIndex: 1001 }}
          >
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-4 relative">
              {/* Header */}
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Add Item</h2>
                <button
                  onClick={() => setShowMenu(false)}
                  className="p-2 rounded-full hover:bg-gray-200 transition"
                  aria-label="Close modal"
                >
                  <X size={20} className="text-gray-700" />
                </button>
              </div>

              {/* Form */}
              <form
                className="space-y-6"
                onSubmit={handleSubmit}
                encType="multipart/form-data"
              >
                {/* Image upload */}
                <div className="flex flex-col items-center gap-4">
                  <div className="w-28 h-28 rounded-xl border text-gray-600 border-gray-300 bg-gray-100 flex items-center justify-center overflow-hidden">
                    {preview ? (
                      <img
                        src={preview}
                        alt="Preview"
                        className="object-cover w-full h-full"
                        onLoad={() => URL.revokeObjectURL(preview)}
                      />
                    ) : (
                      <BoxIcon size={60} />
                    )}
                  </div>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="block w-full text-sm text-gray-600
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-gradient-to-r file:from-black file:via-[#0a0f2c] file:to-[#013ea0]
                    file:text-white
                    hover:file:brightness-110
                    cursor-pointer"
                  />
                </div>

                {/* Model Code Search */}
                <div className="grid grid-cols-2 gap-6 ">
                  <div className="flex flex-col relative">
                    <label className="mb-1 font-medium text-gray-700">
                      Model Code
                    </label>
                    <input
                      name="itemmodel_id"
                      type="text"
                      value={formData.itemmodel_id}
                      onChange={handleChange}
                      placeholder="enter model..."
                      className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#013ea0]"
                    />
                  </div>
                  <div className="flex flex-col relative">
                    <label className="mb-1 font-medium text-gray-700">
                      Serial Number
                    </label>
                    <input
                      name="serial_no"
                      type="text"
                      value={formData.serial_no}
                      onChange={handleChange}
                      placeholder="enter model..."
                      className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#013ea0]"
                    />
                  </div>
                </div>

                {/* Inputs */}
                <div className="grid grid-cols-2 gap-6 ">
                  <InputGroup
                    name="productName"
                    label="Product Name"
                    value={formData.productName}
                    onChange={handleChange}
                    type="text"
                    placeholder="Enter product name"
                  />
                  <InputGroup
                    name="category"
                    label="Category"
                    value={formData.category}
                    onChange={handleChange}
                    type="select"
                    options={["", "Laptop", "Accessory", "Repair Service"]}
                  />

                  <InputGroup
                    name="warranty"
                    label="Warranty"
                    value={formData.warranty}
                    onChange={handleChange}
                    type="select"
                    options={["", "3-months", "6-months", "1-year", "2-years"]}
                  />

                  <InputGroup
                    name="conditions"
                    label="Condition"
                    value={formData.conditions}
                    onChange={handleChange}
                    type="select"
                    options={["", "Brand-new", "Second-hand"]}
                  />

                  <InputGroup
                    name="buyingPrice"
                    label="Buying Price"
                    value={formData.buyingPrice}
                    onChange={handleChange}
                    type="number"
                    placeholder="Enter buying price"
                  />
                  <InputGroup
                    name="sellingPrice"
                    label="Selling Price"
                    value={formData.sellingPrice}
                    onChange={handleChange}
                    type="number"
                    placeholder="Enter selling price"
                  />
                  <InputGroup
                    name="dealerPrice"
                    label="Dealer Price"
                    value={formData.dealerPrice}
                    onChange={handleChange}
                    type="number"
                    placeholder="Enter dealer price"
                  />
                  <InputGroup
                    name="quantity"
                    label="Quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    type="number"
                    placeholder="Enter quantity"
                  />
                </div>

                <TextareaGroup
                  name="description"
                  label="Description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Add a description..."
                />

                {/* Submit */}
                <button
                  type="submit"
                  className="w-full py-2 bg-gradient-to-r from-[#0a0f2c] via-[#013ea0] to-black text-white rounded-xl text-lg font-semibold hover:brightness-110 transition"
                >
                  Save Product
                </button>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

function InputGroup({
  name,
  label,
  type,
  value,
  onChange,
  placeholder,
  options = [],
}) {
  return (
    <div className="flex flex-col">
      <label className="mb-1 font-medium text-gray-700">{label}</label>
      {type === "select" ? (
        <select
          name={name}
          className="border border-gray-300 rounded-md text-sm p-0.5 focus:outline-none focus:ring-2 focus:ring-[#013ea0]"
          value={value}
          onChange={onChange}
        >
          {options.map((opt, i) => (
            <option key={i} value={opt}>
              {opt || "Select..."}
            </option>
          ))}
        </select>
      ) : (
        <input
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="border border-gray-300 rounded-md p-0.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#013ea0]"
        />
      )}
    </div>
  );
}

function TextareaGroup({ name, label, placeholder, value, onChange }) {
  return (
    <div className="flex flex-col">
      <label className="mb-2 font-medium text-gray-700">{label}</label>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={4}
        className="border border-gray-300 rounded-md p-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#013ea0]"
      />
    </div>
  );
}
