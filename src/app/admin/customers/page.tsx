import Overview from '@/components/Admin/customers/Overview';
import NavBar from '@/components/Admin/navBar/NavBar';
import ProtectedRoute from '@/lib/ProtectedRoute';
import React from 'react'

function Products() {
  return (
    <div className=" min-h-screen bg-bg_gray">
      <ProtectedRoute>
        <NavBar />
        <Overview />
      </ProtectedRoute>
    </div>
  );
}

export default Products