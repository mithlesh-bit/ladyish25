import Image from "next/image";
import React from "react";
import Container from "../shared/Container";

const Steps = () => {
  const steps = [
    {
      badge: (
        <span className="inline-flex px-2.5 py-1 rounded-secondary text-xs text-red-800 bg-red-100 relative">
          Step 1
        </span>
      ),
      title: "Browse & Discover",
      description: "Find your perfect product with our smart filters",
      thumbnail: "/assets/home/steps/step-1.png",
    },
    {
      badge: (
        <span className="inline-flex px-2.5 py-1 rounded-secondary text-xs text-indigo-800 bg-indigo-100 relative">
          Step 2
        </span>
      ),
      title: "Add to Cart",
      description:
        "Select your favourite item and add it to your shopping cart",
      thumbnail: "/assets/home/steps/step-2.png",
    },
    {
      badge: (
        <span className="inline-flex px-2.5 py-1 rounded-secondary text-xs text-yellow-800 bg-yellow-100 relative">
          Step 3
        </span>
      ),
      title: "Order Confirmation",
      description:
        "We'll keep you updated at every stage after your order is confirmed!",
      thumbnail: "/assets/home/steps/step-3.png",
    },
    {
      badge: (
        <span className="inline-flex px-2.5 py-1 rounded-secondary text-xs text-purple-800 bg-purple-100 relative">
          Step 4
        </span>
      ),
      title: "Enjoy Your Purchase",
      description: "We’d love to hear a feedback!",
      thumbnail: "/assets/home/steps/step-4.png",
    },
  ];

  return (
    <Container>
      <div className="relative grid sm:grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-16 xl:gap-20">
        {/* <picture className="hidden md:block absolute inset-x-0 top-5">
          <source srcSet="/assets/home/steps/step-bg.svg" type="image/svg" />
          <Image src="/assets/home/steps/step-bg.svg" alt="vector" />
        </picture> */}
        {steps.map((step, index) => (
          <div
            key={index}
            className="relative flex flex-col gap-y-8 mt-10 mb-10 items-center max-w-xs mx-auto"
          >
            <div className="max-w-[100px] mx-auto">
              <Image
                src={step.thumbnail}
                alt={step.title}
                height={100}
                width={100}
                className="w-[100px] h-[100px] object-contain"
              />
            </div>
            <div className="flex flex-col gap-y-4 items-center justify-center">
              {step.badge}
              <h2 className="text-base">{step.title}</h2>
              <span className="block text-slate-600 dark:text-slate-400 text-sm leading-6 text-center">
                {step.description}
              </span>
            </div>
          </div>
        ))}
      </div>
    </Container>
  );
};

export default Steps;
