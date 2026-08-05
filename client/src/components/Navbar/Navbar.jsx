import "./Navbar.css";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/images/logo.png";
import { useCart } from "../../context/CartContext";

function Navbar() {
  const navigate = useNavigate();

  const { cartItems } = useCart();

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <header className="navbar">
      <Link to="/" className="logo">
        <img src={logo} alt="Cervio Logo" className="logo-img" />
      </Link>

      <nav className="nav-links">
        <Link to="/">בית</Link>
        <Link to="/product">המוצר</Link>
        <Link to="/doctor">אודות</Link>
        <Link to="/reviews">ביקורות</Link>
        <Link to="/gallery">גלריה</Link>
        <Link to="/contact">צור קשר</Link>

        {role === "admin" && <Link to="/admin">ניהול</Link>}
      </nav>

      <div className="nav-actions">
        <Link to="/cart" className="cart-btn">
          🛒
          {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
        </Link>

        {!token ? (
          <Link to="/login" className="login-btn">
            התחברות
          </Link>
        ) : (
          <>
            <Link to="/profile" className="profile-btn">
              פרופיל
            </Link>

            <button onClick={handleLogout} className="logout-nav-btn">
              התנתקות
            </button>
          </>
        )}
      </div>
    </header>
  );
}

export default Navbar;
