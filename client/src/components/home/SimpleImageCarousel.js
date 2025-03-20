import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import axios from "axios";
import styles from './SimpleImageCarousel.module.css';

const SimpleImageCarousel = ({ initialCarouselData = [] }) => {
  const [carouselData, setCarouselData] = useState(initialCarouselData);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!carouselData.length) {
      setIsLoading(true);
      axios
        .get(`${process.env.NEXT_PUBLIC_BASE_URL}/corousel/get-corousel`)
        .then((response) => {
          setCarouselData(response.data);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Failed to fetch data:", error);
          setIsLoading(false);
        });
    }
  }, []);

  const goToNext = useCallback(() => {
    if (carouselData && carouselData.length) {
      setActiveIndex((current) => (current + 1) % carouselData.length);
    }
  }, [carouselData]);

  const goToPrev = useCallback(() => {
    if (carouselData && carouselData.length) {
      setActiveIndex((current) =>
        current === 0 ? carouselData.length - 1 : current - 1
      );
    }
  }, [carouselData]);

  useEffect(() => {
    const interval = setInterval(goToNext, 6000);
    return () => clearInterval(interval);
  }, [goToNext]);

  if (isLoading) {
    return <div></div>;
  }

  // if (!carouselData.length) {
  //   return <div className="loading">No data available.</div>;
  // }

return (
  <div className={styles.carouselContainer}>
    <div className="absolute top-0 left-0 w-full h-full">
      {carouselData.map((item, index) => (
        <div
          key={index}
          className={`absolute w-full h-full transition-all duration-700 ease-in-out ${
            index === activeIndex ? "opacity-100" : "opacity-0"
          }`}
          style={{ transform: `translateX(${(index - activeIndex) * 100}%)` }}
        >
          <a href={item.link} target="_blank" rel="noopener noreferrer">
            <Image
              src={item.image}
              alt={`Slide ${index}`}
              layout="fill"
              className="object-contain sm:object-cover"
            />
          </a>
        </div>
      ))}
    </div>
  </div>
);

};

export default SimpleImageCarousel;
