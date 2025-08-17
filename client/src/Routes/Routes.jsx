import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import Login from "../pages/login";
import App from "../App";
import { AuthRoute } from "./protectedRoutes";
import { LandingPage } from "../pages/landingpage";

export const AllRoutes = () => {
  const { user } = useAuthContext();
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={user ? <Navigate to="/pos_sys" /> : <Login />}
        />

        <Route path="/" element={<App />}>
          <Route
            path="pos_sys/*"
            element={<AuthRoute element={<LandingPage />} />}
          />
        </Route>
      </Routes>
    </Router>
  );
};
