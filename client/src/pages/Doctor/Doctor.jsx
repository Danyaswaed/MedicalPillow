import "./Doctor.css";
import { Link } from "react-router-dom";
import {
  FaGraduationCap,
  FaUserMd,
  FaHeartbeat,
  FaHandsHelping,
  FaCheckCircle,
  FaArrowLeft,
} from "react-icons/fa";

function Doctor() {
  return (
    <main className="doctor-page">
      <section className="doctor-hero">
        <div className="doctor-hero-content">
          <span className="doctor-badge">הפיזיותרפיסט שמאחורי Cervica</span>

          <h1>כרית שתוכננה מתוך הבנה אמיתית של גוף האדם, יציבה ושינה נכונה.</h1>

          <p>
            Cervica נבנתה בהשראת ידע מקצועי בפיזיותרפיה, מתוך מטרה לתת תמיכה
            טובה יותר לצוואר, לשפר את תנוחת השינה ולעזור לגוף להרגיש מאוזן
            ונינוח יותר לאורך הלילה.
          </p>

          <div className="doctor-actions">
            <Link to="/product">
              צפייה במוצר <FaArrowLeft />
            </Link>

            <Link to="/contact" className="secondary">
              יצירת קשר
            </Link>
          </div>
        </div>

        <div className="doctor-hero-card">
          <div className="doctor-image-placeholder">
            <FaUserMd />
          </div>

          <h2>עדנאן סואעד</h2>
          <p>פיזיותרפיסט מוסמך</p>

          <div className="doctor-mini-info">
            <span>בוגר אוניברסיטת ברגן, נורבגיה</span>
            <span>ניסיון רב בקופת חולים לאומית</span>
          </div>
        </div>
      </section>

      <section className="doctor-about-section">
        <div className="doctor-section-title">
          <span>אודות</span>
          <h2>ניסיון מקצועי עם גישה אישית</h2>
        </div>

        <div className="doctor-about-grid">
          <div className="doctor-about-text">
            <p>
              עדנאן סואעד הוא פיזיותרפיסט מוסמך, בוגר אוניברסיטת ברגן בנורבגיה,
              עם ניסיון מקצועי של שנים רבות בעבודה עם מטופלים במסגרת קופת חולים
              לאומית.
            </p>

            <p>
              הגישה הטיפולית שלו מבוססת על אבחון מדויק של מקור הכאב, יחס אישי
              ותשומת לב מלאה לכל מטופל. מתוך ההבנה הזו נולדה גם החשיבות לתמיכה
              נכונה בזמן שינה, במיוחד באזור הצוואר והכתפיים.
            </p>

            <p>
              Cervica לא נועדה להיות רק כרית רגילה, אלא מוצר שמחבר בין נוחות,
              יציבה נכונה וחשיבה טיפולית מקצועית.
            </p>
          </div>

          <div className="doctor-values-card">
            <h3>מה מוביל את הגישה?</h3>

            <ul>
              <li>
                <FaCheckCircle />
                אבחון מדויק של מקור הכאב
              </li>

              <li>
                <FaCheckCircle />
                יחס אישי ואנושי לכל מטופל
              </li>

              <li>
                <FaCheckCircle />
                הבנה עמוקה של תנועה, יציבה ושיקום
              </li>

              <li>
                <FaCheckCircle />
                פתרונות שמכבדים את הגוף ולא עובדים נגדו
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="doctor-expertise">
        <div className="doctor-section-title center">
          <span>תחומי מומחיות</span>
          <h2>ידע מקצועי שמחזק את הפיתוח של Cervica</h2>
        </div>

        <div className="expertise-grid">
          <div className="expertise-card">
            <FaHeartbeat />
            <h3>שיקום אורתופדי ונוירולוגי</h3>
            <p>
              עבודה עם הגוף בתהליכי שיקום, שיפור תנועה וחזרה הדרגתית לתפקוד.
            </p>
          </div>

          <div className="expertise-card">
            <FaHandsHelping />
            <h3>כאבי גב וצוואר</h3>
            <p>הבנה של עומסים, תנוחות ותמיכה נכונה באזורים הרגישים של הגוף.</p>
          </div>

          <div className="expertise-card">
            <FaUserMd />
            <h3>סחרחורות וורטיגו</h3>
            <p>טיפול במצבים הקשורים לשיווי משקל, יציבות ותחושת תנועה.</p>
          </div>

          <div className="expertise-card">
            <FaGraduationCap />
            <h3>לימודים בנורבגיה</h3>
            <p>
              רקע אקדמי מאוניברסיטת ברגן בנורבגיה, עם חשיבה מקצועית ומדויקת.
            </p>
          </div>
        </div>
      </section>

      <section className="doctor-Cervica-section">
        <div>
          <span>למה Cervica?</span>
          <h2>כי שינה טובה מתחילה בתמיכה נכונה</h2>

          <p>
            בזמן השינה הגוף צריך תמיכה שמאפשרת לצוואר ולכתפיים להישאר במנח טבעי
            ונוח. Cervica פותחה מתוך מחשבה על נוחות יומיומית, איכות שינה ותמיכה
            שמרגישה יציבה בלי להיות קשה מדי.
          </p>

          <Link to="/product">
            מעבר למוצר <FaArrowLeft />
          </Link>
        </div>
      </section>
    </main>
  );
}

export default Doctor;
