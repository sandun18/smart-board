import { Routes, Route } from "react-router-dom";
import TechnicianDashboard from "../pages/technician/TechnicianDashboard";
import TechnicianProfile from "../pages/technician/TechnicianProfile";
import TechnicianHistory from "../pages/technician/TechnicianHistory";

const TechnicianAppRoutes = () => {
  return (
    <Routes>
       <Route path="dashboard" element={<TechnicianDashboard />} />
       <Route path="profile" element={<TechnicianProfile />} />
       <Route path="history" element={<TechnicianHistory />} />
    </Routes>
  );
};
export default TechnicianAppRoutes;