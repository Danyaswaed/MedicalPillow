import "./Gallery.css";
import { useState } from "react";
import { FaExpand, FaTimes } from "react-icons/fa";

const galleryImages = [
  {
    src: "/images/gallery/pillow-1.png",
    title: "תמיכה לצוואר",
    text: "עיצוב שנועד להעניק תמיכה נוחה לאזור הצוואר בזמן השינה.",
  },
  {
    src: "/images/gallery/pillow-2.png",
    title: "נוחות יומיומית",
    text: "כרית רכה, יציבה ונעימה לשימוש בכל לילה.",
  },
  {
    src: "/images/gallery/pillow-3.png",
    title: "מבנה ארגונומי",
    text: "צורה מיוחדת שעוזרת לשמור על מנח טבעי ונוח.",
  },
  {
    src: "/images/gallery/pillow-4.png",
    title: "עיצוב נקי",
    text: "מראה אלגנטי שמתאים לחדר שינה מודרני.",
  },
  {
    src: "/images/gallery/pillow-5.png",
    title: "שינה רגועה יותר",
    text: "חוויה נעימה יותר לגוף לאורך הלילה.",
  },
  {
    src: "/images/gallery/pillow-6.png",
    title: "Cervica",
    text: "מוצר שנבנה מתוך מחשבה על נוחות, תמיכה ואיכות.",
  },
];

function Gallery() {
  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <main className="gallery-page">
      <section className="gallery-hero">
        <span>גלריית תמונות</span>
        <h1>הכירו את Cervica מקרוב</h1>
        <p>
          כאן תוכלו לראות את הכרית מזוויות שונות, להבין את המבנה שלה ולהתרשם
          מהעיצוב הנקי והארגונומי שלה.
        </p>
      </section>

      <section className="photo-gallery-grid">
        {galleryImages.map((image, index) => (
          <div className="photo-card" key={index}>
            <div className="photo-image-box">
              <img src={image.src} alt={image.title} />

              <button
                className="photo-view-btn"
                onClick={() => setSelectedImage(image)}
              >
                <FaExpand />
              </button>
            </div>

            <div className="photo-info">
              <h3>{image.title}</h3>
              <p>{image.text}</p>
            </div>
          </div>
        ))}
      </section>

      {selectedImage && (
        <div className="gallery-modal" onClick={() => setSelectedImage(null)}>
          <button
            className="modal-close"
            onClick={() => setSelectedImage(null)}
          >
            <FaTimes />
          </button>

          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <img src={selectedImage.src} alt={selectedImage.title} />
            <h2>{selectedImage.title}</h2>
            <p>{selectedImage.text}</p>
          </div>
        </div>
      )}
    </main>
  );
}

export default Gallery;
