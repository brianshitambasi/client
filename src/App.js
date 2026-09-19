import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { AuthProvider } from './context/AuthContext';
import PublicLayout from './components/layout/PublicLayout';
import ProtectedRoute from './components/admin/ProtectedRoute';

import Home from './pages/public/Home';
import About from './pages/public/About';
import HowItWorks from './pages/public/HowItWorks';
import Products from './pages/public/Products';
import ProductDetail from './pages/public/ProductDetail';
import Business from './pages/public/Business';
import FAQ from './pages/public/FAQ';
import Contact from './pages/public/Contact';
import Qualification from './pages/public/Qualification';
import ThankYou from './pages/public/ThankYou';
import NotFound from './pages/public/NotFound';

import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import Prospects from './pages/admin/Prospects';
import ProspectDetail from './pages/admin/ProspectDetail';
import AdminProducts from './pages/admin/Products';
import FollowUps from './pages/admin/FollowUps';
import Analytics from './pages/admin/Analytics';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/*"
            element={
              <PublicLayout>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/how-it-works" element={<HowItWorks />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/products/:id" element={<ProductDetail />} />
                  <Route path="/business" element={<Business />} />
                  <Route path="/faq" element={<FAQ />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/qualification" element={<Qualification />} />
                  <Route path="/thank-you" element={<ThankYou />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </PublicLayout>
            }
          />

          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin" element={<ProtectedRoute role="ceo"><Navigate to="/admin/dashboard" replace /></ProtectedRoute>} />
          <Route path="/admin/dashboard" element={<ProtectedRoute role="ceo"><Dashboard /></ProtectedRoute>} />
          <Route path="/admin/prospects" element={<ProtectedRoute role="ceo"><Prospects /></ProtectedRoute>} />
          <Route path="/admin/prospects/:id" element={<ProtectedRoute role="ceo"><ProspectDetail /></ProtectedRoute>} />
          <Route path="/admin/products" element={<ProtectedRoute role="ceo"><AdminProducts /></ProtectedRoute>} />
          <Route path="/admin/followups" element={<ProtectedRoute role="ceo"><FollowUps /></ProtectedRoute>} />
          <Route path="/admin/analytics" element={<ProtectedRoute role="ceo"><Analytics /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
