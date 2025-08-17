import { User, X } from "lucide-react";
import { useState } from "react"
import apiService from "../../utilities/httpservices";
import Cookies from "js-cookie";
import { UseCustomerContext } from "../../context/customerContext";

export const NewCustomer = () => {
    const [showmenu, setShowMenu] = useState(false);
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [address, setAddress] = useState("");
    const { refreshCustomers } = UseCustomerContext();
    const [cusid, setCusid] = useState();
    const token = Cookies.get('token');

    const handleSave = async () => {

        const data = {
            name:name,
            phone:phone,
            email:email,
            address:address
        }

       try {
        const result = await apiService.createData('customers', data, token);
        setShowMenu(false);
        setCusid(result.id);
        refreshCustomers();
       } catch (error) {
        console.log(error);
       }
    }

    return (
        <div>
            <button 
                className="flex items-center justify-center gap-2 text-sm font-medium text-white bg-gradient-to-r from-black via-[#0a0f2c] to-[#013ea0] px-4 py-2 rounded-lg shadow hover:opacity-90 transition"
                onClick={() => setShowMenu(true)}
            >
                New Customer
            </button>

            {showmenu && (
                <>
                    {/* Overlay */}
                    <div
                        className="fixed inset-0 bg-black-900 bg-opacity-40 backdrop-blur-sm transition"
                        style={{ zIndex: 1000 }}
                        onClick={() => setShowMenu(false)}
                    ></div>

                    {/* Modal */}
                    <div
                        className="fixed inset-0 flex items-center justify-center p-4"
                        style={{ zIndex: 1001 }}
                    >
                        <div className="w-full max-w-lg bg-white p-6 rounded-2xl shadow-xl">
                            {/* Header */}
                            <div className="flex justify-between items-center border-b pb-3 mb-5">
                                <div className="text-lg font-semibold flex gap-2 items-center text-gray-800">
                                    <User size={20} />
                                    New Customer
                                </div>
                                <button
                                    className="bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 shadow transition"
                                    onClick={() => {
                                        setShowMenu(false);
                                    }}
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            {/* Form */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1 text-gray-700">
                                        Fullname
                                    </label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 outline-none transition"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1 text-gray-700">
                                        Contact No
                                    </label>
                                    <input
                                        type="text"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 outline-none transition"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1 text-gray-700">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 outline-none transition"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1 text-gray-700">
                                        Address
                                    </label>
                                    <input
                                        type="text"
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 outline-none transition"
                                    />
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="flex flex-row-reverse pt-5 gap-3">
                                <button 
                                    onClick={handleSave}
                                    className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white text-sm font-medium rounded-lg shadow transition"
                                >
                                    Save
                                </button>
                                <button
                                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm font-medium rounded-lg shadow transition"
                                    onClick={() => setShowMenu(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}
