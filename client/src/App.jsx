import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Contact from "./pages/contact";
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";
import Footer from "./components/Footer";
import About from "./pages/about";
import Dashboard from "./pages/AdminDashboard";
import Registration from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import CategoryDetail from "./data/CategoryDetail";
import Login from "./pages/Login";
import Test from "./pages/Test";
import Services from "./pages/services";
const App = () => {
  useEffect(() => {
    AOS.init();
  }, []);
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about-us" element={<About />} />
        <Route path="/test" element={<Test />} />
        <Route
          path="/auth/admin/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/auth/register" element={<Registration />} />
        <Route path="/auth/login" element={<Login />} />
        <Route path="/services" element={<Services />} />
        <Route path="/products/:slug" element={<CategoryDetail />} />
      </Routes>
      <Footer />
    </>
  );
};

export default App;
