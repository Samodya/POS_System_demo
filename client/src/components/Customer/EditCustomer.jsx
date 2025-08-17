import {  Edit, X } from "lucide-react";
import { useState } from "react"

export const EditCustomer = ({ id }) => {
    const [showmenu, setShowMenu] = useState(false);
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [address, setAddress] = useState("");

    return (
        <div>
            <button 
                className="py-1 px-2 sm:px-3 bg-blue-600 hover:bg-blue-700 flex gap-1 items-center justify-center rounded text-white text-xs transition"
                onClick={() => setShowMenu(true)}
            >
                <Edit size={14}/> Edit
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
                                    <Edit size={20} />
                                    Edit Customer Information
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
