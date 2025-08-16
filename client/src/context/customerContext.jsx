import { createContext, useContext, useEffect, useState } from "react";
import apiService from "../utilities/httpservices";
import Cookies from "js-cookie";

const CustomerContext = createContext();

export const UseCustomerContext = () => useContext(CustomerContext);

export const CustomerContextProvider = ({ children}) =>{
    return(
        <CustomerContext.Provider>
            {children}
        </CustomerContext.Provider>
    )
}
