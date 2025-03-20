import { useEffect, useState } from "react";
import Image from "next/image";

export default function Home() {
  const [isMounted, setIsMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState({});

  useEffect(() => {
    setIsMounted(true); // Component is now mounted, and this runs only on client
    const timer = setInterval(() => {
      // Set up a timer for re-calculating time left every second
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer); // Cleanup the interval on component unmount
  }, []);

  const calculateTimeLeft = () => {
    const difference = +new Date("2024-11-01") - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  };

  return (
    <div className="h-screen flex flex-col justify-center items-center bg-[#FAF1E4]">
      <div className="w-full md:w-1/2 flex justify-center">
        <Image
          src="/logo.png"
          alt="Handmade product"
          width={200} // Set desired image width
          height={200} // Set desired image height to maintain aspect ratio
          quality={100}
          className="rounded-lg"
        />
      </div>
      <h1 className="mt-5 text-4xl md:text-6xl font-bold">Launching Soon!</h1>
      <div className="mt-10">
        {isMounted && Object.keys(timeLeft).length ? (
          Object.keys(timeLeft).map((interval) => (
            <span
              key={interval}
              className="text-xl md:text-3xl font-semibold mx-2"
            >
              {timeLeft[interval]} {interval}{" "}
            </span>
          ))
        ) : (
          <span>Loading...</span>
        )}
      </div>
    </div>
  );
}
