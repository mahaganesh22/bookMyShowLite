// function Advertisement1() {
//     const posters = ["poster1.png",
//     "poster2.png",
//     "poster3.png",
//     "poster4.png"];
//     return (
//     <section className="poster-section">
//       <div className="poster-row">
//         {posters.map((poster, index) => (
//           <img
//             key={index}
//             className="poster"
//             src={`../public/${poster}`}
//             alt={`Poster ${index + 1}`}
//           />
//         ))}
//       </div>
//     </section>
//   );
// }

// export default Advertisement1




import { useEffect, useRef, useState } from "react";

function Advertisement1() {
  const posters = [
    "poster1.png",
    "poster2.png",
    "poster3.png",
    "poster4.png"
  ];


  const [currentIndex, setCurrentIndex] = useState(0);
  const total = posters.length;

  const posterWidth = 100; // width + margin/gap
  const autoSlideRef = useRef();

  // Auto scroll every 3s
  useEffect(() => {
    autoSlideRef.current = nextSlide;
  });

  useEffect(() => {
    const play = () => {
      autoSlideRef.current();
    };
    const interval = setInterval(play, 3000);
    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % total);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? total - 1 : prevIndex - 1
    );
  };

  return (
    <section className="poster-section">
      <div className="poster-container">
        <div
          className="poster-row"
          style={{ transform: `translateX(-${currentIndex * posterWidth}%)` }}
        >
          {posters.map((poster, index) => (
            <img
              key={index}
              className="poster"
              src={`/${poster}`}
              alt={`Poster ${index + 1}`}
            />
          ))}
        </div>

        <button className="nav-button left-button" onClick={prevSlide}>
          ◀
        </button>
        <button className="nav-button right-button" onClick={nextSlide}>
          ▶
        </button>
      </div>
    </section>
  );
} 

export default Advertisement1;
