"use client";

import { useEffect, useRef, useState } from "react";
import { Roboto_Mono } from "next/font/google";
import gsap from "gsap";
import Image from "next/image";

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
});

interface AboutPageProps {
  onBack: () => void;
}

const bio = `Hi, I am Ishita Sati, a Bachelors of Technology sophomore pursuing my degree from Indira Gandhi Delhi Technical University for Women, Delhi, India.
I am a full-stack developer who has worked on multiple projects with diverse tech stacks. I have experience in backend/frontend development, database integration, AI tooling and application development, framework testing and system programming.

I am proficient in Typescript, Javascript and Python.

I am also an open source contributor who has worked on organizations like AsyncAPI and Mofa-Org.`;

export default function AboutPage({ onBack }: AboutPageProps) {
  const [displayText, setDisplayText] = useState("");
  const [showBack, setShowBack] = useState(false);
  const backButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      if (i <= bio.length) {
        setDisplayText(bio.slice(0, i));
        i++;
      } else {
        clearInterval(timer);
        setShowBack(true);
      }
    }, 40);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (showBack && backButtonRef.current) {
      gsap.fromTo(
        backButtonRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "back.out(1.4)" }
      );
    }
  }, [showBack]);

  return (
    <div
      className={`relative min-h-screen overflow-hidden flex items-center px-6 md:px-12 lg:px-24 py-10 ${robotoMono.className}`}
      style={{
        backgroundImage: "url(/bg.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-[#F3ECE2]/60 z-0" />

      <div className="relative z-10 w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="flex flex-col gap-8 lg:ml-12">
          <div
            className="italic text-[#4B3621] select-none"
            style={{ fontSize: "clamp(2rem, 4vw, 3rem)", letterSpacing: "0.1em" }}
          >
            About Me
          </div>

          <div className="bg-[#FAF6F0] border border-[#D6C8B5] rounded-2xl px-8 py-10 shadow-[0_16px_60px rgba(75,54,33,0.12)]">
            <p className="text-[0.75rem] md:text-[0.75rem] leading-relaxed text-[#4B3621]" style={{ whiteSpace: "pre-line" }}>
              {displayText}
              <span className="inline-block w-2 h-3 bg-[#4B3621] ml-1 align-middle animate-pulse" />
            </p>
          </div>

          {showBack && (
            <button
              ref={backButtonRef}
              onClick={onBack}
              className="group relative overflow-hidden rounded-full border border-[#4B3621] px-8 py-3 text-sm italic tracking-widest text-[#4B3621] transition-colors duration-300 hover:text-[#FAF6F0] w-fit"
            >
              <span className="relative z-10">← Back to Menu</span>
              <span className="absolute inset-0 -translate-x-full bg-[#4B3621] transition-transform duration-300 group-hover:translate-x-0" />
            </button>
          )}
        </div>

        <div className="flex justify-center lg:justify-end">
          <div className="relative w-56 h-72 md:w-64 md:h-80 rounded-2xl border-4 border-[#4B3621] bg-[#FAF6F0] shadow-[0_24px_80px rgba(75,54,33,0.18)] overflow-hidden">
            <Image
              src="/images/profile/profile.png"
              alt="Profile Photo"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
}
