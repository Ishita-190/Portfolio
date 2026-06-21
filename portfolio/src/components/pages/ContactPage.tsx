"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import Image from "next/image";
import { socials } from "@/data/socials";

interface ContactPageProps {
  onBack: () => void;
}

export default function ContactPage({ onBack }: ContactPageProps) {
  const titleRef = useRef<HTMLDivElement>(null);
  const stackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const backRef = useRef<HTMLButtonElement>(null);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);
  const currentIndexRef = useRef(0);
  const [phase, setPhase] = useState<"cascade" | "ready">("cascade");

  const applyCoverflow = (activeIdx: number, animate = false) => {
    socials.forEach((_, i) => {
      const el = cardRefs.current[i];
      if (!el) return;
      const offset = i - activeIdx;
      const zIndex = 100 - Math.abs(offset);
      let x = offset * 160;
      let scale = 1 - Math.abs(offset) * 0.2;
      let rotationY = offset * -45;
      let opacity = 1;
      if (Math.abs(offset) > 2) {
        opacity = 0;
      } else if (Math.abs(offset) === 2) {
        opacity = 0.5;
      }
      const props = {
        x: x,
        scale: scale,
        rotateY: rotationY,
        opacity: opacity,
        zIndex: zIndex
      };
      if (animate) {
        gsap.to(el, { ...props, duration: 0.6, ease: "power3.out" });
      } else {
        gsap.set(el, props);
      }
    });
  };

  const startAutoPlay = () => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    autoPlayRef.current = setInterval(() => {
      const nextIdx = (currentIndexRef.current + 1) % socials.length;
      currentIndexRef.current = nextIdx;
      applyCoverflow(nextIdx, true);
    }, 3500);
  };

  const stopAutoPlay = () => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
      autoPlayRef.current = null;
    }
  };

  const handleCardClick = (href: string, id: string) => {
    if (id === "email") {
      window.location.href = href;
    } else {
      window.open(href, "_blank", "noopener,noreferrer");
    }
  };

  useEffect(() => {
    const tl = gsap.timeline();

    if (titleRef.current) {
      gsap.set(titleRef.current, { opacity: 0, y: -24 });
    }
    if (backRef.current) {
      gsap.set(backRef.current, { opacity: 0, y: 10 });
    }
    cardRefs.current.forEach((el, i) => {
      if (el) {
        gsap.set(el, { opacity: 0, y: 80 + i * 16, scale: 0.88 });
      }
    });

    if (titleRef.current) {
      tl.to(titleRef.current, { opacity: 1, y: 0, duration: 0.6, ease: "back.out(1.4)" });
    }

    const validCards = cardRefs.current.filter(el => el !== null) as HTMLDivElement[];
    if (validCards.length > 0) {
      tl.to(validCards.slice().reverse(), {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.5,
        stagger: 0.1,
        ease: "back.out(1.3)",
      }, "-=0.2");
    }

    tl.call(() => {
      applyCoverflow(0);
      setPhase("ready");
    });

    if (backRef.current) {
      tl.to(backRef.current, { opacity: 1, y: 0, duration: 0.3 }, "-=0.1");
    }

    return () => stopAutoPlay();
  }, []);

  useEffect(() => {
    if (phase === "ready") {
      startAutoPlay();
    }
    return () => stopAutoPlay();
  }, [phase]);

  return (
    <div
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#F3ECE2] px-6 py-10"
      style={{ backgroundImage: "url(/bg.png)", backgroundSize: "cover", backgroundPosition: "center" }}
    >
      <div className="absolute inset-0 bg-[#F3ECE2]/60 z-0" />

      <div className="relative z-10 flex flex-col items-center">
        <div
          ref={titleRef}
          className="mb-12 font-serif italic text-[#4B3621] select-none"
          style={{ fontSize: "clamp(1.6rem, 3vw, 2.4rem)", letterSpacing: "0.1em" }}
        >
          Contact
        </div>

        <div
          ref={stackRef}
          className="relative w-full max-w-5xl h-96 flex items-center justify-center overflow-visible"
          style={{ perspective: "1400px" }}
        >
          {socials.map((s, i) => (
            <div
              key={s.id}
              ref={el => { cardRefs.current[i] = el; }}
              className="absolute w-64 h-80 rounded-2xl border border-[#D6C8B5] bg-[#FAF6F0] px-8 py-8 shadow-[0_12px_40px rgba(75,54,33,0.12)] cursor-pointer select-none flex flex-col items-center justify-center gap-4 text-center hover:shadow-[0_16px_50px rgba(75,54,33,0.2)] transition-shadow"
              style={{ transformOrigin: "center center", transformStyle: "preserve-3d" }}
              onClick={() => handleCardClick(s.href, s.id)}
            >
              {s.isImage ? (
                <Image
                  src={s.symbol}
                  alt={s.label}
                  width={64}
                  height={64}
                  className="object-contain"
                />
              ) : (
                <span className="font-serif text-3xl text-[#7A5230]">{s.symbol}</span>
              )}
              <h2 className="font-serif text-xl italic text-[#4B3621]">{s.label}</h2>
            </div>
          ))}
        </div>

        <button
          ref={backRef}
          onClick={onBack}
          className="group relative mt-16 overflow-hidden rounded-full border border-[#4B3621] px-7 py-2.5 font-serif text-xs italic tracking-widest text-[#4B3621] transition-colors duration-300 hover:text-[#FAF6F0]"
        >
          <span className="relative z-10">← Back to Menu</span>
          <span className="absolute inset-0 -translate-x-full bg-[#4B3621] transition-transform duration-300 group-hover:translate-x-0" />
        </button>
      </div>
    </div>
  );
}
