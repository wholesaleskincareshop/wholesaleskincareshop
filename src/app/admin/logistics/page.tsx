import NavBar from "@/components/Admin/navBar/NavBar";
import Overview from "@/components/Admin/logistics/Overview";
import ProtectedRoute from "@/lib/ProtectedRoute";
import React from "react";

function Logistics() {
  return (
    <div className=" min-h-screen">
      <ProtectedRoute>
        <NavBar />
        <Overview />
      </ProtectedRoute>
    </div>
  );
}

export default Logistics;
