import React from "react";
import TechnicianSidebar from "./TechnicianSidebar";
import TechnicianHeader from "./TechnicianHeader";

const TechnicianLayout = ({ children, title, subtitle }) => {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-background-light">
      <TechnicianSidebar />
      <main className="flex-grow p-4 md:p-6 lg:p-8 pt-4 pb-24 lg:pb-8 md:pb-28">
        <TechnicianHeader title={title} subtitle={subtitle} />
        {children}
      </main>
    </div>
  );
};

export default TechnicianLayout;
                                