import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";

import Home from "../pages/Home/Home";
import Product from "../pages/Product/Product";
import Cart from "../pages/Cart/Cart";
import Checkout from "../pages/Checkout/Checkout";
import OrderSuccess from "../pages/OrderSuccess/OrderSuccess";
import Auth from "../pages/Auth/Auth";
import Admin from "../pages/Admin/Admin";
import Profile from "../pages/Profile/Profile";
import TrackOrder from "../pages/TrackOrder/TrackOrder";
import Contact from "../pages/Contact/Contact";
import Reviews from "../pages/Reviews/Reviews";
import Receipt from "../pages/Receipt/Receipt";
import Doctor from "../pages/Doctor/Doctor";
import Gallery from "../pages/Gallery/Gallery";

function AppContent() {
  const location = useLocation();

  const isAdminPage = location.pathname.startsWith("/admin");

  return (
    <>
      {!isAdminPage && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product" element={<Product />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-success" element={<OrderSuccess />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/track-order" element={<TrackOrder />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/reviews" element={<Reviews />} />
        <Route path="/receipt" element={<Receipt />} />
        <Route path="/doctor" element={<Doctor />} />
        <Route path="/gallery" element={<Gallery />} />
      </Routes>

      {!isAdminPage && <Footer />}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
