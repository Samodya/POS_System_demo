import React, { useEffect, useState } from "react";
import { UseitemCategoriesContext } from "../../context/itemCategory_context";
import Topbar from "../topbar";
import { AddCategry } from "./add_category";
import { EditCategry } from "./edit_catogory";
import { Link } from "react-router-dom";
import { DeleteCategory } from "./deleteCategory";
import { ArrowBigLeft } from "lucide-react";

export const ManageProductCategory = () => {
  const { itemCategories } = UseitemCategoriesContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const filteredCategories = itemCategories.filter((category) =>
    category.modelCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);

  const displayPageNumbers = () => {
    const start = (currentPage - 1) * itemsPerPage + 1;
    const end = Math.min(currentPage * itemsPerPage, filteredCategories.length);

    return Array.from({ length: end - start }, (_, i) => start + i).map(
      (num) => (
        <span
          key={num}
          className={`mr-2 px-2 py-1 ${
            num === currentPage ? "bg-blue-500 text-white" : ""
          }`}
        >
          {num}
        </span>
      )
    );
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const displayPrevNextButtons = () => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;

    return (
      <>
        {currentPage > 1 && (
          <span
            onClick={() => handlePageChange(currentPage - 1)}
            className="mr-2 px-2 py-1 cursor-pointer"
          >
            Previous
          </span>
        )}
        {end <= filteredCategories.length && (
          <span
            onClick={() => handlePageChange(currentPage + 1)}
            className="ml-2 px-2 py-1 cursor-pointer"
          >
            Next
          </span>
        )}
      </>
    );
  };

  return (
    <div>
      <Topbar title={"Product Categoies"} />
      <div className="flex py-6 px-10 items-center justify-between">
        <input
          type="text"
          placeholder="Search categories by model code..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full md:w-64 px-4 py-2 border bg-white border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <div className="flex gap-2 items-center flex-row-reverse">
          <AddCategry />
          <Link 
            to={'../inventory'}
            className="py-1 rounded px-2 bg-blue-800 text-white flex gap-1 text-sm hover:bg-blue-700 transition"
          >
            <ArrowBigLeft size={16} /> Back
          </Link>
        </div>
      </div>
      <div className="p-6">
        <div className="overflow-x-auto">
          <div className="min-w-[600px] sm:min-w-full bg-white shadow-lg rounded-2xl border border-gray-200">
            <table className="w-full border-collapse">
              <thead className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white text-sm">
                <tr>
                  <th className="py-3 px-4 text-center text-sm font-semibold">
                    Model Code
                  </th>
                  <th className="py-3 px-4 text-center text-sm font-semibold">
                    Buying Price
                  </th>
                  <th className="py-3 px-4 text-center text-sm font-semibold">
                    Dealers Price
                  </th>
                  <th className="py-3 px-4 text-center text-sm font-semibold">
                    Selling Price
                  </th>
                  <th className="py-3 px-4 text-center text-sm font-semibold">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredCategories.length > 0 ? (
                  filteredCategories
                    .slice(
                      (currentPage - 1) * itemsPerPage,
                      currentPage * itemsPerPage
                    )
                    .map((item) => (
                      <tr
                        key={item.id || item.modelCode}
                        className={`text-gray-600 text-sm hover:bg-gray-50 transition ${
                          item.id % 2 === 0 ? "bg-white" : "bg-gray-50"
                        }`}
                      >
                        <td className="text-center p-3 font-medium text-gray-700">
                          {item.modelCode}
                        </td>
                        <td className="text-center p-3 font-medium text-gray-700">
                          {item.buying_price}
                        </td>
                        <td className="text-center p-3 font-medium text-gray-700">
                          {item.dealers_price}
                        </td>
                        <td className="text-center p-3 font-medium text-gray-700">
                          {item.dealers_price}
                        </td>
                        <td className="text-center p-3 font-medium text-gray-700 flex items-center justify-center gap-2">
                          <EditCategry id={item.id} />
                          <DeleteCategory
                            id={item.id}
                            modelCode={item.modelCode}
                          />
                        </td>
                      </tr>
                    ))
                ) : (
                  <tr>
                    <td colSpan="5" className="py-6 text-center text-gray-500">
                      No categories found matching your search
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {filteredCategories.length > 0 && (
        <div className="mt-8 flex justify-between items-center p-10">
          <span>
            Page {currentPage} of {totalPages}
          </span>
          {/* <div>{displayPageNumbers()}</div> */}
          {displayPrevNextButtons()}
        </div>
      )}
    </div>
  );
};
