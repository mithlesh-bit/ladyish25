"use client";

import { useState, useEffect } from "react";
import SimpleImageCarousel from "@/components/home/SimpleImageCarousel";
import Banner2 from "@/components/home/Banner2";
import Banner3 from "@/components/home/Banner3";
import Banner from "@/components/home/Banner";
import Whatsapp from "@/components/home/Whatsapp";
import ExpertChoice from "@/components/home/ExpertChoice";
import NewArrivals from "@/components/home/NewArrivals";
import NicheExplorer from "@/components/home/NicheExplorer";
import Steps from "@/components/home/Steps";
import Trending from "@/components/home/Trending";
import Main from "@/components/shared/layouts/Main";
import ComingSoon from "@/components/home/ComingSoon";
import Instagram from "@/components/home/Instagram";

export default function Home() {
  const [isClient, setIsClient] = useState(false);

  // Ensure we only run this code on the client
  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    // <<<<<<< HEAD
    //     <Main>
    //     <main className="flex flex-col gap-y-20 w-full">
    //       <SimpleImageCarousel />
    //       {/* Conditionally render Steps only on the client */}
    //       {isClient && (
    //         <div className="hidden md:block">
    //           <Steps />
    //         </div>
    //       )}
    //       <NewArrivals />
    //       <Banner />
    //       <ExpertChoice />
    //       <NicheExplorer />
    //       <Banner3 />
    //       <Trending />
    //       <Banner2 />
    //       {/* Optional Banner3 */}
    //     </main>
    //   </Main>
    //   );

    // =======
    <>
      <Main>
        <main className="flex flex-col gap-y-10 w-full select-none">
          <SimpleImageCarousel />
          {/* Conditionally render Steps only on the client */}
          {isClient && (
            <div className="hidden md:block">
              <Steps />
            </div>
          )}
          <NewArrivals />
          <Banner />
          <ExpertChoice />
          <NicheExplorer />
          <Banner3 />
          <Trending />
          <Banner2 />
          <Instagram />
          {/* Optional Banner3 */}
        </main>
      </Main>
      ;
    </>
  );

  // >>>>>>> 1c555cb71ef21186a9c44870de193c779fc6a672
}
