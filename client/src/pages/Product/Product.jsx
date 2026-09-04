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

function Product() {
  const images = [pillow1, pillow2, pillow3];
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [selectedImage, setSelectedImage] = useState(images[0]);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/products")
      .then((res) => {
        if (res.data && res.data.length > 0) {
          setProduct(res.data[0]);
        } else {
          setError("המוצר אינו זמין כרגע");
        }
      })
      .catch((err) => {
        console.error("שגיאה בטעינת המוצר:", err);
        setError("אירעה שגיאה בטעינת המוצר");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleAddToCart = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("יש להתחבר כדי להוסיף מוצר לסל");
      navigate("/login");
      return;
    }

    if (!product || Number(product.stock) <= 0) {
      alert("המוצר אינו זמין במלאי");
      return;
    }

    addToCart(product, quantity);
    navigate("/cart");
  };

  const increaseQuantity = () => {
    const availableStock = Number(product?.stock || 0);

    if (quantity < availableStock) {
      setQuantity(quantity + 1);
    }
  };

  const decreaseQuantity = () => {
    setQuantity(Math.max(1, quantity - 1));
  };

  if (loading) {
    return (
      <main className="product-page">
        <div className="product-message">טוען את פרטי המוצר...</div>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="product-page">
        <div className="product-message product-error">
          {error || "המוצר אינו זמין כרגע"}
        </div>
      </main>
    );
  }

  const isInStock = Number(product.stock) > 0;

  return (
    <main className="product-page">
      <section className="product-layout">
        <div className="product-gallery-card">
          <div className="main-image">
            <div className="product-bg" />

            <img src={selectedImage} alt={`כרית ${product.name}`} />
          </div>

          <div className="gallery">
            {images.map((image, index) => (
              <button
                key={index}
                type="button"
                className={selectedImage === image ? "thumb active" : "thumb"}
                onClick={() => setSelectedImage(image)}
                aria-label={`הצגת תמונת מוצר מספר ${index + 1}`}
              >
                <img src={image} alt={`תמונת מוצר מספר ${index + 1}`} />
              </button>
            ))}
          </div>
        </div>

        <div className="product-info">
          <span className="product-tag">כרית ארגונומית איכותית</span>

          <h1>{product.name}</h1>

          <div className="rating">
            <FaStar />
            <FaStar />
            <FaStar />
            <FaStar />
            <FaStar />

            <span>4.9 מתוך 5 | 186 ביקורות</span>
          </div>

          <p>{product.description}</p>

          <div className="price-row">
            <div className="price">
              ₪{Number(product.price).toLocaleString("he-IL")}
            </div>

            <span className={isInStock ? "stock" : "stock out-of-stock"}>
              {isInStock ? "זמין במלאי" : "אזל מהמלאי"}
            </span>
          </div>

          {isInStock && (
            <div className="quantity-row">
              <span>בחירת כמות</span>

              <div className="quantity-control">
                <button
                  type="button"
                  onClick={decreaseQuantity}
                  disabled={quantity <= 1}
                  aria-label="הפחתת כמות"
                >
                  <FaMinus />
                </button>

                <strong>{quantity}</strong>

                <button
                  type="button"
                  onClick={increaseQuantity}
                  disabled={quantity >= Number(product.stock)}
                  aria-label="הוספת כמות"
                >
                  <FaPlus />
                </button>
              </div>
            </div>
          )}

          <button
            type="button"
            className="add-cart-btn"
            onClick={handleAddToCart}
            disabled={!isInStock}
          >
            {isInStock ? "הוספה לסל הקניות" : "המוצר אזל מהמלאי"}
          </button>

          <div className="trust-grid">
            <div>
              <FaTruck />
              <span>משלוח עד הבית או איסוף עצמי</span>
            </div>

            <div>
              <FaCreditCard />
              <span>תשלום מאובטח ונוח</span>
            </div>

            <div>
              <FaShieldAlt />
              <span>מוצר איכותי</span>
            </div>
          </div>
        </div>
      </section>

      <section className="product-details">
        <div className="tabs">
          <button
            type="button"
            className={activeTab === "description" ? "tab active-tab" : "tab"}
            onClick={() => setActiveTab("description")}
          >
            תיאור המוצר
          </button>

          <button
            type="button"
            className={activeTab === "specs" ? "tab active-tab" : "tab"}
            onClick={() => setActiveTab("specs")}
          >
            מפרט המוצר
          </button>

          <button
            type="button"
            className={activeTab === "shipping" ? "tab active-tab" : "tab"}
            onClick={() => setActiveTab("shipping")}
          >
            משלוחים ואיסוף
          </button>
        </div>

        <div className="tab-content">
          {activeTab === "description" && (
            <p>
              כרית Cervica פותחה כדי לספק תמיכה נוחה ויציבה לאזור הצוואר
              והכתפיים. המבנה הארגונומי שלה מסייע לשמור על תנוחת שינה נוחה לאורך
              כל הלילה.
            </p>
          )}

          {activeTab === "specs" && (
            <ul>
              <li>
                <FaCheckCircle />
                <span>מתאימה לשינה על הגב ועל הצד</span>
              </li>

              <li>
                <FaCheckCircle />
                <span>כוללת כיסוי רך ונעים לשימוש יומיומי</span>
              </li>
              <li>
                <FaCheckCircle />
                <span> תומכת בכאבי גב עליון וצוואר</span>
              </li>
              <li>
                <FaCheckCircle />
                <span>עיצוב ארגונומי </span>
              </li>
            </ul>
          )}

          {activeTab === "shipping" && (
            <p>
              ניתן לבחור בין משלוח עד הבית לבין איסוף עצמי. זמן האספקה המשוער
              הוא בין 2 ל־5 ימי עסקים, בהתאם לאזור המשלוח.
            </p>
          )}
        </div>
      </section>
    </main>
  );
}

export default Product;
