import { BoxIcon, Files, User, X } from "lucide-react";
import { useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { UseProductContext } from "../../context/productContext";
import { UseCustomerContext } from "../../context/customerContext";
import { UseitemCategoriesContext } from "../../context/itemCategory_context";

export const AddProduct = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [preview, setPreview] = useState(null);
  const [files, setFiles] = useState(null);
  const token = Cookies.get("token");
  const { refreshProducts } = UseProductContext();
  const { itemCategories } = UseitemCategoriesContext();

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
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      setFiles(file);
    }
  };

  const handleModelSelect = (item) => {
    setFormData((prev) => ({
      ...prev,
      itemmodel_id: item.id,                 // ✅ model id
      buyingPrice: item.buying_price || "",  // ✅ autofill
      sellingPrice: item.selling_price || "",        // ✅ autofill
      dealerPrice: item.dealers_price || "", // ✅ autofill
    }));
    setModelSearch(item.modelCode); // show selected code in input
    setShowModelList(false);
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
            className="fixed inset-0 flex items-center justify-center p-4"
            style={{ zIndex: 1001 }}
          >
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 relative">
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
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
                <div className="flex flex-col relative">
                  <label className="mb-1 font-medium text-gray-700">Model Code</label>
                  <input
                    type="text"
                    value={modelSearch}
                    onChange={(e) => {
                      setModelSearch(e.target.value);
                      setShowModelList(true);
                    }}
                    onClick={() => setShowModelList(true)}
                    placeholder="Search model..."
                    className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#013ea0]"
                  />

                  {showModelList && (
                    <ul
                      className="absolute left-0 right-0 top-[55px] bg-white border border-gray-300 rounded-md mt-1 max-h-40 overflow-y-auto shadow-lg"
                      style={{ zIndex: 2000 }}
                    >
                      {itemCategories
                        .filter((item) =>
                          item.modelCode.toLowerCase().includes(modelSearch.toLowerCase())
                        )
                        .map((item) => (
                          <li
                            key={item.id}
                            onClick={() => handleModelSelect(item)}
                            className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                          >
                            {item.modelCode}
                          </li>
                        ))}
                      {itemCategories.filter((item) =>
                        item.modelCode.toLowerCase().includes(modelSearch.toLowerCase())
                      ).length === 0 && (
                        <li className="px-3 py-2 text-gray-500">No results</li>
                      )}
                    </ul>
                  )}
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
                  className="w-full py-3 bg-gradient-to-r from-[#0a0f2c] via-[#013ea0] to-black text-white rounded-xl text-lg font-semibold hover:brightness-110 transition"
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

function InputGroup({ name, label, type, value, onChange, placeholder, options = [] }) {
  return (
    <div className="flex flex-col">
      <label className="mb-1 font-medium text-gray-700">{label}</label>
      {type === "select" ? (
        <select
          name={name}
          className="border border-gray-300 rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-[#013ea0]"
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
          className="border border-gray-300 rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-[#013ea0]"
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
        className="border border-gray-300 rounded-md p-3 resize-none focus:outline-none focus:ring-2 focus:ring-[#013ea0]"
      />
    </div>
  );
}
