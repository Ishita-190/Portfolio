"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { experiences } from "@/data/experience";
import { playClick } from "@/lib/sound";

interface ExperiencePageProps {
  onBack: () => void;
}

function YearLabel({ period }: { period: string }) {
  const [start, end] = period.split("–").map(s => s.trim());
  return (
    <>
      <span className="font-serif text-xs italic tracking-widest text-[#8A7463] leading-tight block">{start}</span>
      {end && <span className="font-serif text-[10px] tracking-widest text-[#B0A090] leading-tight block">– {end}</span>}
    </>
  );
}

function CardContent({ exp }: { exp: import("@/data/experience").Experience }) {
  return (
    <>
      <div className="flex flex-wrap items-start justify-between gap-1 mb-1">
        <h2 className="font-serif text-sm italic text-[#4B3621] leading-snug">{exp.org}</h2>
        <span className="font-serif text-[10px] tracking-[0.25em] text-[#A0917E] uppercase shrink-0">{exp.location}</span>
      </div>
      <p className="mb-3 font-serif text-xs tracking-wide text-[#7A5230] italic">{exp.role}</p>
      <ul className="flex flex-col gap-1.5">
        {exp.bullets.map((b, j) => (
          <li key={j} className="flex gap-2 font-serif text-xs leading-relaxed text-[#6B5744]">
            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[#C9B8A5]" />
            {b}
          </li>
        ))}
      </ul>
    </>
  );
}

const TITLE = "Experience";
// arc offsets — each letter sits on a gentle upward curve
const ARC_Y = [18, 10, 4, 0, -2, 0, 4, 10, 18];
const ARC_R = [-6, -3, -1, 0, 0, 0, 1, 3, 6];

export default function ExperiencePage({ onBack }: ExperiencePageProps) {
  const letterRefs  = useRef<(HTMLSpanElement | null)[]>([]);
  const lineRef     = useRef<HTMLDivElement>(null);
  const entryRefs   = useRef<(HTMLDivElement | null)[]>([]);
  const yearRefs    = useRef<(HTMLDivElement | null)[]>([]);
  const cardRefs    = useRef<(HTMLDivElement | null)[]>([]);
  const dotRefs     = useRef<(HTMLDivElement | null)[]>([]);
  const backRef     = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // initial hidden states
    gsap.set(letterRefs.current,  { opacity: 0, y: 40, rotation: 0 });
    gsap.set(lineRef.current,     { scaleY: 0, transformOrigin: "top center" });
    gsap.set(backRef.current,     { opacity: 0, y: 10 });
    entryRefs.current.forEach((_, i) => {
      const isLeft = i % 2 === 0;
      gsap.set(yearRefs.current[i],  { opacity: 0, y: -30, scale: 1.4 });
      gsap.set(dotRefs.current[i],   { opacity: 0, scale: 0 });
      gsap.set(cardRefs.current[i],  { opacity: 0, x: isLeft ? -30 : 30 });
    });

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    // 1. letters arc in one by one
    tl.to(letterRefs.current, {
      opacity: 1,
      y: (i) => ARC_Y[i] ?? 0,
      rotation: (i) => ARC_R[i] ?? 0,
      duration: 0.55,
      stagger: 0.06,
      ease: "back.out(1.6)",
    })
    // 2. letters settle flat
    .to(letterRefs.current, {
      y: 0,
      rotation: 0,
      duration: 0.45,
      stagger: 0.04,
      ease: "power2.inOut",
    }, "-=0.2")
    // 3. timeline spine grows down
    .to(lineRef.current, {
      scaleY: 1,
      duration: 0.7,
      ease: "power2.inOut",
    }, "-=0.1");

    // 4. each entry: year drops → dot pops → card slides in from its side
    experiences.forEach((_, i) => {
      const isLeft = i % 2 === 0;
      const offset = i === 0 ? "-=0.3" : "-=0.1";
      tl
        .to(yearRefs.current[i], {
          opacity: 1, y: 0, scale: 1,
          duration: 0.45, ease: "back.out(1.8)",
        }, offset)
        .to(dotRefs.current[i], {
          opacity: 1, scale: 1,
          duration: 0.3, ease: "back.out(2.5)",
        }, "-=0.25")
        .to(cardRefs.current[i], {
          opacity: 1, x: 0,
          duration: 0.5, ease: "power3.out",
        }, "-=0.2");
    });

    tl.to(backRef.current, { opacity: 1, y: 0, duration: 0.35 }, "-=0.1");
  }, []);

  return (
    <div className="relative flex min-h-screen flex-col items-center overflow-hidden bg-[#F3ECE2] px-6 py-10">

      <svg width="0" height="0" style={{ position: "absolute" }}>
        <defs>
          <filter id="crayon-exp" x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="5" result="noise" seed="7" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>

      {/* curved arc title */}
      <div
        className="relative z-20 mb-10 flex items-end select-none"
        style={{ filter: "url(#crayon-exp)", height: "3.5rem" }}
      >
        {TITLE.split("").map((ch, i) => (
          <span
            key={i}
            ref={el => { letterRefs.current[i] = el; }}
            className="font-serif italic text-[#4B3621] inline-block"
            style={{
              fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)",
              letterSpacing: "0.06em",
              lineHeight: 1,
            }}
          >
            {ch}
          </span>
        ))}
      </div>

      {/* timeline container */}
      <div className="relative w-full max-w-4xl">

        {/* vertical spine */}
        <div
          ref={lineRef}
          className="absolute left-1/2 top-0 bottom-0 w-px bg-[#C9B8A5] -translate-x-1/2"
          style={{ transformOrigin: "top center" }}
        />

        <div className="flex flex-col gap-10">
          {experiences.map((exp, i) => {
            const isLeft = i % 2 === 0;
            return (
              <div key={exp.id} ref={el => { entryRefs.current[i] = el; }} className="flex items-start">

                {/* left side: card or year */}
                <div className="flex-1 flex justify-end pr-5">
                  {isLeft ? (
                    <div
                      ref={el => { cardRefs.current[i] = el; }}
                      className="w-full rounded-xl border border-[#D6C8B5] bg-[#FAF6F0] px-5 py-4 shadow-[0_8px_32px_rgba(75,54,33,0.09)]"
                    >
                      <CardContent exp={exp} />
                    </div>
                  ) : (
                    <div ref={el => { yearRefs.current[i] = el; }} className="pt-1 text-right">
                      <YearLabel period={exp.period} />
                    </div>
                  )}
                </div>

                {/* dot on spine */}
                <div className="relative flex flex-col items-center shrink-0 w-5 mt-2">
                  <div
                    ref={el => { dotRefs.current[i] = el; }}
                    className="h-2.5 w-2.5 rounded-full border-2 border-[#7A5230] bg-[#F3ECE2] z-10"
                  />
                </div>

                {/* right side: year or card */}
                <div className="flex-1 pl-5">
                  {!isLeft ? (
                    <div
                      ref={el => { cardRefs.current[i] = el; }}
                      className="w-full rounded-xl border border-[#D6C8B5] bg-[#FAF6F0] px-5 py-4 shadow-[0_8px_32px_rgba(75,54,33,0.09)]"
                    >
                      <CardContent exp={exp} />
                    </div>
                  ) : (
                    <div ref={el => { yearRefs.current[i] = el; }} className="pt-1">
                      <YearLabel period={exp.period} />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* back button */}
      <button
        ref={backRef}
        onClick={() => { playClick(); onBack(); }}
        className="group relative mt-12 overflow-hidden rounded-full border border-[#4B3621] px-7 py-2.5 font-serif text-xs italic tracking-widest text-[#4B3621] transition-colors duration-300 hover:text-[#FAF6F0]"
      >
        <span className="relative z-10">← Back to Menu</span>
        <span className="absolute inset-0 -translate-x-full bg-[#4B3621] transition-transform duration-300 group-hover:translate-x-0" />
      </button>
    </div>
  );
}
