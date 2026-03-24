import React from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "../components/admin/AdminSidebar.jsx";

const AdminLayout = () => {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-background-light">
      {/* Persistent Sidebar */}
      <AdminSidebar />

      {/* Main Content Area */}
      <main className="flex-grow p-4 md:p-6 lg:p-8 pt-4 w-full">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
