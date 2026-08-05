import "./Product.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { useCart } from "../../context/CartContext";
import {
  FaCheckCircle,
  FaTruck,
  FaShieldAlt,
  FaCreditCard,
  FaMinus,
  FaPlus,
  FaStar,
} from "react-icons/fa";

import pillow1 from "../../assets/images/pillow1.png";
import pillow2 from "../../assets/images/pillow2.png";
import pillow3 from "../../assets/images/pillow3.png";
import pillow4 from "../../assets/images/pillow2.png";

function Product() {
  const images = [pillow1, pillow2, pillow3, pillow4];
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [selectedImage, setSelectedImage] = useState(images[0]);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [product, setProduct] = useState(null);

  useEffect(() => {
    api
      .get("/products")
      .then((res) => {
        setProduct(res.data[0]);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  if (!product) {
    return <div className="product-page">טוען מוצר...</div>;
  }

  return (
    <main className="product-page">
      <section className="product-layout">
        <div className="product-gallery-card">
          <div className="main-image">
            <div className="product-bg"></div>
            <img src={selectedImage} alt="כרית Cervio" />
          </div>

          <div className="gallery">
            {images.map((image, index) => (
              <button
                key={index}
                className={selectedImage === image ? "thumb active" : "thumb"}
                onClick={() => setSelectedImage(image)}
              >
                <img src={image} alt={`תמונה ${index + 1}`} />
              </button>
            ))}
          </div>
        </div>

        <div className="product-info">
          <span className="product-tag">כרית רפואית ארגונומית</span>

          <h1>{product.name}</h1>

          <div className="rating">
            <FaStar />
            <FaStar />
            <FaStar />
            <FaStar />
            <FaStar />
            <span>4.9 | 186 ביקורות</span>
          </div>

          <p>{product.description}</p>

          <div className="price-row">
            <div className="price">₪{product.price}</div>
            <span className="stock">במלאי</span>
          </div>

          <div className="quantity-row">
            <span>כמות</span>

            <div className="quantity-control">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                <FaMinus />
              </button>

              <strong>{quantity}</strong>

              <button onClick={() => setQuantity(quantity + 1)}>
                <FaPlus />
              </button>
            </div>
          </div>

          <button
            className="add-cart-btn"
            onClick={() => {
              addToCart(product, quantity);
              navigate("/cart");
            }}
          >
            הוסף לסל
          </button>

          <div className="trust-grid">
            <div>
              <FaTruck />
              <span>משלוח או איסוף עצמי</span>
            </div>

            <div>
              <FaCreditCard />
              <span>תשלום מאובטח</span>
            </div>

            <div>
              <FaShieldAlt />
              <span>אחריות ושירות</span>
            </div>
          </div>
        </div>
      </section>

      <section className="product-details">
        <div className="tabs">
          <button
            className={activeTab === "description" ? "tab active-tab" : "tab"}
            onClick={() => setActiveTab("description")}
          >
            תיאור
          </button>

          <button
            className={activeTab === "specs" ? "tab active-tab" : "tab"}
            onClick={() => setActiveTab("specs")}
          >
            מפרט
          </button>

          <button
            className={activeTab === "shipping" ? "tab active-tab" : "tab"}
            onClick={() => setActiveTab("shipping")}
          >
            משלוחים
          </button>
        </div>

        <div className="tab-content">
          {activeTab === "description" && (
            <p>
              Cervio נועדה להפחית עומסים באזור הצוואר והכתפיים באמצעות מבנה
              ארגונומי שמסייע לשמור על תמיכה יציבה ונוחה לאורך כל הלילה.
            </p>
          )}

          {activeTab === "specs" && (
            <ul>
              <li>
                <FaCheckCircle /> חומר: Memory Foam איכותי
              </li>
              <li>
                <FaCheckCircle /> מתאים לשינה על הגב ועל הצד
              </li>
              <li>
                <FaCheckCircle /> כיסוי נעים ונוח לשימוש יומיומי
              </li>
              <li>
                <FaCheckCircle /> עיצוב תומך לצוואר ולכתפיים
              </li>
            </ul>
          )}

          {activeTab === "shipping" && (
            <p>
              ניתן לבחור איסוף עצמי או משלוח עד הבית. זמן אספקה משוער: 2-5 ימי
              עסקים, בהתאם לאזור המשלוח.
            </p>
          )}
        </div>
      </section>
    </main>
  );
}

export default Product;
