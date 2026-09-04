import "./Cart.css";
import { Link } from "react-router-dom";
import { FaTrash, FaMinus, FaPlus, FaShoppingCart } from "react-icons/fa";
import { useCart } from "../../context/CartContext";
import fallbackPillow from "../../assets/images/pillow1.png";

function Cart() {
  const {
    cartItems,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    subtotal,
  } = useCart();

  return (
    <main className="cart-page">
      <div className="cart-title">
        <FaShoppingCart />
        <h1>סל הקניות</h1>
      </div>

      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <h2>הסל שלך ריק</h2>
          <p>בחרו את כרית Cervica והוסיפו אותה לסל.</p>
          <Link to="/product">חזרה למוצר</Link>
        </div>
      ) : (
        <section className="cart-layout">
          <div className="cart-items">
            {cartItems.map((item) => (
              <div className="cart-item" key={item.product_id}>
                <img
                  src={fallbackPillow}
                  alt={item.name}
                  className="cart-product-img"
                />

                <div className="item-info">
                  <h3>{item.name}</h3>
                  <p>כרית רפואית ארגונומית לתמיכה בצוואר</p>

                  <div className="item-actions">
                    <button onClick={() => decreaseQuantity(item.product_id)}>
                      <FaMinus />
                    </button>

                    <strong>{item.quantity}</strong>

                    <button onClick={() => increaseQuantity(item.product_id)}>
                      <FaPlus />
                    </button>
                  </div>
                </div>

                <div className="item-price">
                  ₪{(item.price * item.quantity).toFixed(2)}
                </div>

                <button
                  className="delete-btn"
                  onClick={() => removeFromCart(item.product_id)}
                >
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h2>סיכום הזמנה</h2>

            <div className="summary-row">
              <span>מוצרים</span>
              <strong>₪{subtotal.toFixed(2)}</strong>
            </div>

            <div className="summary-row">
              <span>משלוח</span>
              <strong>יחושב בקופה</strong>
            </div>

            <div className="summary-total">
              <span>סה״כ</span>
              <strong>₪{subtotal.toFixed(2)}</strong>
            </div>

            <Link to="/checkout" className="checkout-btn">
              מעבר לתשלום
            </Link>
          </div>
        </section>
      )}
    </main>
  );
}

export default Cart;
