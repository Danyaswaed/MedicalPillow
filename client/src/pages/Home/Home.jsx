import "./Home.css";
import { motion } from "framer-motion";
import { FaShieldAlt, FaMoon, FaBed, FaUserMd, FaBone } from "react-icons/fa";
import pillow from "../../assets/images/Cervica-pillow.png";

function Home() {
  return (
    <main className="home">
      <section className="hero">
        <motion.div
          className="hero-content"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="hero-badge">
            <FaUserMd /> פותחה על ידי פיזיותרפיסט
          </span>

          <h1>
            כרית השינה
            <span>המושלמת</span>
          </h1>

          <h2>התעוררו כל בוקר ללא כאבי צוואר</h2>

          <p>
            Cervica פותחה במיוחד כדי להעניק תמיכה אופטימלית לצוואר, לשפר את
            איכות השינה ולהפחית עומסים בזמן השינה.
          </p>

          <div className="hero-actions">
            <button className="primary-btn">הזמן עכשיו</button>
            <button className="secondary-btn">למידע נוסף</button>
          </div>
        </motion.div>

        <motion.div
          className="hero-image"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9 }}
        >
          <div className="blue-circle"></div>
          <img src={pillow} alt="כרית Cervica" />

          <div className="floating-card">
            <strong>תמיכה לצוואר</strong>
            <span>נוחות חכמה לשינה טובה</span>
          </div>
        </motion.div>
      </section>

      <section className="why">
        <span className="section-tag">למה לבחור Cervica?</span>

        <h2>התמיכה שהצוואר שלכם צריך</h2>

        <p className="section-description">
          כרית Cervica משלבת עיצוב ארגונומי, נוחות ותמיכה נכונה כדי לעזור לכם
          לישון טוב יותר ולהתעורר בתחושה קלה ונוחה יותר.
        </p>

        <div className="cards">
          <div className="card">
            <FaBone />
            <h3>תמיכה לצוואר</h3>
            <p>מסייעת להפחתת עומס ושומרת על מנח תקין בזמן השינה.</p>
          </div>

          <div className="card">
            <FaMoon />
            <h3>שינה עמוקה</h3>
            <p>מבנה נוח שמעניק תחושת יציבות ותומך בשינה רציפה.</p>
          </div>

          <div className="card">
            <FaBed />
            <h3>עיצוב ארגונומי</h3>
            <p>מתאימה לשינה על הגב ועל הצד בצורה טבעית ונוחה.</p>
          </div>

          <div className="card">
            <FaShieldAlt />
            <h3>חומרים איכותיים</h3>
            <p>עשויה מחומרים נעימים ואיכותיים לשימוש יומיומי.</p>
          </div>
        </div>
      </section>

      <section className="about">
        <div className="about-image">
          <img src={pillow} alt="Cervica Pillow" />
        </div>

        <div className="about-content">
          <span className="section-tag">על הכרית</span>

          <h2>למה Cervica שונה?</h2>

          <p>
            כרית Cervica תוכננה במיוחד כדי להעניק תמיכה נכונה לצוואר ולעמוד
            השדרה במהלך השינה. המבנה הארגונומי מסייע להפחית לחץ, לשפר את איכות
            השינה ולהעניק נוחות מרבית.
          </p>

          <div className="features">
            <div className="feature">✔ תמיכה אופטימלית לצוואר</div>
            <div className="feature">✔ מפחיתה עומסים וכאבים</div>
            <div className="feature">✔ Memory Foam איכותי</div>
            <div className="feature">✔ מתאימה לכל תנוחות השינה</div>
          </div>

          <button className="primary-btn">הזמן עכשיו</button>
        </div>
      </section>
    </main>
  );
}

export default Home;
