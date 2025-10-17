import { useState } from "react";
import axios from "axios";
import { Image, Upload, XCircle, Save, Package } from "lucide-react";

export const AddProduct = ({ token, refreshProducts }) => {
  const [formData, setFormData] = useState({
    productName: "",
    category: "",
    itemmodel_id: "",
    dealerPrice: "",
  });

  const [preview, setPreview] = useState(null);
  const [files, setFiles] = useState(null);
  const [modelSearch, setModelSearch] = useState("");
  const [product_id, setProduct_id] = useState("");
  const [serial_no, setSerial_No] = useState("");
  const [buying_price, setBuyingPrice] = useState("");
  const [retail_price, setretailPrice] = useState("");
  const [dealers_price, setDealersPrice] = useState("");
  const [warranty_period, setWarranty_period] = useState("");
  const [conditions, setConditions] = useState("");

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

  const saveProduct = async (e) => {
    e.preventDefault();

    const form = new FormData();
    form.append("name", formData.productName);
    form.append("category", formData.category);
    form.append("itemmodel_id", formData.itemmodel_id);
    form.append("description", formData.description);
    form.append("image", files);

    try {
      const results = await axios.post(`http://localhost:4000/api/products`, form, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setProduct_id(results.data.id);
      clearData();
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
      description: "",
     
    });
    setPreview(null);
    setFiles(null);
    setModelSearch("");
  }

  return (
    <div className="min-h-screen items-center justify-center bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-2xl w-full max-w-3xl p-6">
        {/* Header */}
        <div className="flex items-center gap-3 border-b pb-3 mb-6">
          <Package className="text-indigo-600 w-6 h-6" />
          <h2 className="text-xl font-semibold text-gray-700">Add New Product</h2>
        </div>

        <form className="space-y-4" onSubmit={saveProduct}>
          {/* Product Name */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Product Name
            </label>
            <input
              type="text"
              name="productName"
              value={formData.productName}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
              placeholder="Enter product name"
              required
            />
          </div>

          {/* Category & Item Model */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Category
              </label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
                placeholder="Enter category"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Item Model ID
              </label>
              <input
                type="text"
                name="itemmodel_id"
                value={formData.itemmodel_id}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
                placeholder="Enter model ID"
                required
              />
            </div>
          </div>         

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
              placeholder="Enter product description"
            />
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Upload Image
            </label>
            <div className="flex items-center gap-4">
              <label className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition">
                <Upload className="w-4 h-4" />
                <span>Choose File</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>

              {preview && (
                <div className="relative">
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-20 h-20 object-cover rounded-lg border"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setPreview(null);
                      setFiles(null);
                    }}
                    className="absolute -top-2 -right-2 bg-white rounded-full shadow hover:text-red-500"
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={clearData}
              className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
            >
              <XCircle className="w-4 h-4" /> Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              <Save className="w-4 h-4" /> Save Product
            </button>
          </div>
        </form>
      </div>
      {product_id ? <div>
        <div>Add Items</div>
        <div>
          <form>
            <div>
              <label>Serial No:</label>
              <input
                type="text"

              />
            </div>
          </form>
        </div>
      </div>:""}
    </div>
  );
};
