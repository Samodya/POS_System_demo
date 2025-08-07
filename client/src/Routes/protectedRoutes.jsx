import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import Cookies from "js-cookie";
 // Make sure your hook is correctly imported

export const AuthRoute = ({ element }) => {
//   const { user } = useAuthContext(); 
  const user = Cookies.get('user')
  const location = useLocation(); 

  
  if (!user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

 
  return element;
};