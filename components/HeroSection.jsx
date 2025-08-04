"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import React, { useRef, useEffect } from "react";
import { Button } from "./ui/button";
import { MoveRight } from "lucide-react";
import Image from "next/image";

const HeroSection = () => {
  const refImage = useRef(null);

  useEffect(() => {
    const imageElement = refImage.current;
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const scrollThreshold = 100;

      if (imageElement) {
        if (scrollPosition > scrollThreshold) {
          imageElement.classList.add("scrolled");
        } else {
          imageElement.classList.remove("scrolled");
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="overflow-x-hidden">
      <div
        className={cn(
          "absolute inset-0",
          "[background-size:20px_20px]",
          "[background-image:radial-gradient(#d4d4d4_1px,transparent_1px)]",
          "dark:[background-image:radial-gradient(#404040_1px,transparent_1px)]",
          "md:min-h-[85rem] min-h-[48rem]"
        )}
      />
      <div className="md:mt-40 mt-25 pb-20 px-3">
        <div className="container mx-auto text-center relative z-20">
          <h1 className="text-5xl md:text-7xl lg:text-[105px] pb-6 gradiant-title">
            Simplify Your Finances <br /> Using Intelligence
          </h1>
          <p className="md:text-xl text-md max-w-4xl text-gray-600 mx-auto mb-8">
            Take control of your finances with an AI-powered platform that
            tracks, analyzes, and optimizes your spending — delivering real-time
            insights and smarter decisions.
          </p>
          <div className="pb-8">
            <Link href={"/dashboard"}>
              <Button
                size={"lg"}
                className="cursor-pointer border border-transparent hover:border-[#7f5efd] hover:shadow-xl/80 hover:shadow-[#d5caff] hover:bg-transparent bg-[#7f5efd] hover:text-[#7f5efd] transition-all duration-500 ease-in-out text-lg"
              >
                Get Started
                <MoveRight size={18} />
              </Button>
            </Link>
          </div>
          <div className="hero-image-wrapper ">
            <div ref={refImage} className="hero-image">
              <Image
                src={"/banner.jpeg"}
                alt="Finance dashboard"
                height={720}
                width={1280}
                className="rounded-lg shadow-2xl border mx-auto"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
