import { Route, Routes } from "react-router-dom"
import { Dashboard } from "./Dashboard"
import Sidebar from "../components/navigation"
import { Sales } from "./sales"
import { Products } from "./products"
// import { TasksManger } from "./taskmanger"
// import { UserProfile } from "./userProfilePage"
// import { UsersPage } from "./Users"

export const LandingPage = () => {
    return(
        <div className="flex">
                    <Sidebar/>
            
            <Routes>
                
                <Route
                    path="/"
                    element={<Dashboard/>}
                />
                <Route
                    path="/sales"
                    element={<Sales/>}
                />
                <Route
                    path="/products"
                    element={<Products/>}
                />
               {/* <Route
                    path="/users"
                    element={<UsersPage/>}
                /> */}
                
            </Routes>
        </div>
    )
}