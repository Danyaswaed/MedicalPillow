import { useEffect, useState } from "react";
import api from "../../../services/api";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";

function ProductsAdmin() {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);

  const token = localStorage.getItem("token");

  const fetchProducts = async () => {
    const res = await api.get("/products");
    setProducts(res.data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const saveProduct = async () => {
    if (editingProduct.product_id) {
      await api.put(`/products/${editingProduct.product_id}`, editingProduct, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } else {
      await api.post("/products", editingProduct, {
        headers: { Authorization: `Bearer ${token}` },
      });
    }

    setEditingProduct(null);
    fetchProducts();
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("למחוק את המוצר?")) return;

    await api.delete(`/products/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    fetchProducts();
  };

  const uploadProductImage = async (file) => {
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    const res = await api.post("/upload/product", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    setEditingProduct({
      ...editingProduct,
      image: res.data.filename,
    });
  };

  const getStockStatus = (stock) => {
    const amount = Number(stock);

    if (amount === 0) {
      return {
        label: "אזל מהמלאי",
        className: "out-stock-badge",
      };
    }

    if (amount <= 5) {
      return {
        label: "מלאי נמוך",
        className: "low-stock-badge",
      };
    }

    return {
      label: "במלאי",
      className: "stock-badge",
    };
  };

  return (
    <section className="dashboard-section">
      <div className="section-title">
        <h2>מוצרים</h2>

        <button
          className="add-product-btn"
          onClick={() =>
            setEditingProduct({
              name: "",
              description: "",
              price: "",
              stock: "",
              weight: "",
              warranty: "",
              image: "",
              is_active: true,
            })
          }
        >
          <FaPlus /> הוספת מוצר
        </button>
      </div>

      <table>
        <thead>
          <tr>
            <th>שם מוצר</th>
            <th>מחיר</th>
            <th>מלאי</th>
            <th>מצב מלאי</th>
            <th>אחריות</th>
            <th>סטטוס</th>
            <th>פעולות</th>
          </tr>
        </thead>

        <tbody>
          {products.length === 0 ? (
            <tr>
              <td colSpan="7" style={{ textAlign: "center" }}>
                אין מוצרים להצגה
              </td>
            </tr>
          ) : (
            products.map((product) => {
              const stockStatus = getStockStatus(product.stock);

              return (
                <tr
                  key={product.product_id}
                  className={
                    Number(product.stock) === 0
                      ? "product-row-out"
                      : Number(product.stock) <= 5
                        ? "product-row-low"
                        : ""
                  }
                >
                  <td>{product.name}</td>

                  <td>₪{product.price}</td>

                  <td>
                    <strong>{product.stock}</strong>
                  </td>

                  <td>
                    <span className={stockStatus.className}>
                      {stockStatus.label}
                    </span>
                  </td>

                  <td>{product.warranty || "-"}</td>

                  <td>
                    <span
                      className={
                        product.is_active
                          ? "product-active-badge"
                          : "product-inactive-badge"
                      }
                    >
                      {product.is_active ? "פעיל" : "לא פעיל"}
                    </span>
                  </td>

                  <td>
                    <button
                      className="table-btn"
                      onClick={() => setEditingProduct(product)}
                    >
                      <FaEdit />
                    </button>

                    <button
                      className="table-btn danger"
                      onClick={() => deleteProduct(product.product_id)}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>

      {editingProduct && (
        <div className="product-modal">
          <div className="product-modal-card">
            <h2>{editingProduct.product_id ? "עריכת מוצר" : "הוספת מוצר"}</h2>

            <input
              placeholder="שם המוצר"
              value={editingProduct.name}
              onChange={(e) =>
                setEditingProduct({ ...editingProduct, name: e.target.value })
              }
            />

            <textarea
              placeholder="תיאור המוצר"
              value={editingProduct.description}
              onChange={(e) =>
                setEditingProduct({
                  ...editingProduct,
                  description: e.target.value,
                })
              }
            />

            <input
              type="number"
              placeholder="מחיר"
              value={editingProduct.price}
              onChange={(e) =>
                setEditingProduct({ ...editingProduct, price: e.target.value })
              }
            />

            <input
              type="number"
              placeholder="מלאי"
              value={editingProduct.stock}
              onChange={(e) =>
                setEditingProduct({ ...editingProduct, stock: e.target.value })
              }
            />

            <input
              type="number"
              placeholder="משקל"
              value={editingProduct.weight || ""}
              onChange={(e) =>
                setEditingProduct({ ...editingProduct, weight: e.target.value })
              }
            />

            <input
              placeholder="אחריות"
              value={editingProduct.warranty || ""}
              onChange={(e) =>
                setEditingProduct({
                  ...editingProduct,
                  warranty: e.target.value,
                })
              }
            />

            <label className="upload-box">
              העלאת תמונת מוצר
              <input
                type="file"
                accept="image/*"
                onChange={(e) => uploadProductImage(e.target.files[0])}
              />
            </label>

            {editingProduct.image && (
              <img
                className="product-preview"
                src={`http://localhost:5050/uploads/products/${editingProduct.image}`}
                alt="תצוגה מקדימה"
              />
            )}

            <div className="modal-actions">
              <button onClick={saveProduct}>שמירה</button>
              <button onClick={() => setEditingProduct(null)}>ביטול</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default ProductsAdmin;
