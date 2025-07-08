import NavBar from '@/components/Admin/navBar/NavBar';
import ProductsOverview from '@/components/Admin/products/Overview';
import ProtectedRoute from '@/lib/ProtectedRoute';
import React from 'react'

function Products() {
  return (
    <div className=" min-h-screen">
      <ProtectedRoute>
        <NavBar />
        <ProductsOverview />
      </ProtectedRoute>
    </div>
  );
}

export default Products