"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { socials } from "@/data/socials";
import { playClick } from "@/lib/sound";

interface ContactPageProps {
  onBack: () => void;
}

// stack offsets for cards sitting behind the active one
const STACK = [
  { y: 0,   scale: 1,     opacity: 1,    zIndex: 4 },
  { y: 10,  scale: 0.96,  opacity: 0.75, zIndex: 3 },
  { y: 18,  scale: 0.92,  opacity: 0.5,  zIndex: 2 },
  { y: 24,  scale: 0.88,  opacity: 0.3,  zIndex: 1 },
];

export default function ContactPage({ onBack }: ContactPageProps) {
  const titleRef   = useRef<HTMLDivElement>(null);
  const stackRef   = useRef<HTMLDivElement>(null);
  const cardRefs   = useRef<(HTMLDivElement | null)[]>([]);
  const counterRef = useRef<HTMLDivElement>(null);
  const backRef    = useRef<HTMLButtonElement>(null);

  const [index, setIndex]       = useState(0);
  const [phase, setPhase]       = useState<"cascade" | "ready">("cascade");
  const isAnimating             = useRef(false);

  // position all cards according to their slot relative to active index
  const applyStack = (activeIdx: number, animate = false) => {
    socials.forEach((_, i) => {
      const el = cardRefs.current[i];
      if (!el) return;
      const slot = (i - activeIdx + socials.length) % socials.length;
      const s = STACK[slot] ?? { y: 28, scale: 0.85, opacity: 0, zIndex: 0 };
      const props = { y: s.y, scale: s.scale, opacity: s.opacity, zIndex: s.zIndex };
      if (animate) gsap.to(el, { ...props, duration: 0.45, ease: "power3.out" });
      else gsap.set(el, props);
    });
  };

  useEffect(() => {
    // hide everything
    gsap.set(titleRef.current,   { opacity: 0, y: -24 });
    gsap.set(counterRef.current, { opacity: 0 });
    gsap.set(backRef.current,    { opacity: 0, y: 10 });
    cardRefs.current.forEach((el, i) => {
      if (!el) return;
      gsap.set(el, { opacity: 0, y: 80 + i * 16, scale: 0.88 });
    });

    const tl = gsap.timeline();

    // title drops in
    tl.to(titleRef.current, { opacity: 1, y: 0, duration: 0.6, ease: "back.out(1.4)" })
    // cards cascade up one by one
    .to(cardRefs.current.slice().reverse(), {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.5,
      stagger: 0.1,
      ease: "back.out(1.3)",
    }, "-=0.2")
    .call(() => {
      applyStack(0);
      setPhase("ready");
    })
    .to(counterRef.current, { opacity: 1, duration: 0.3 }, "-=0.1")
    .to(backRef.current,    { opacity: 1, y: 0, duration: 0.3 }, "-=0.1");
  }, []);

  const next = () => {
    if (isAnimating.current || phase !== "ready") return;
    isAnimating.current = true;
    playClick();

    const current = cardRefs.current[index];
    // fling active card upward and fade out
    gsap.to(current, {
      y: -120, opacity: 0, scale: 0.92,
      duration: 0.35, ease: "power2.in",
      onComplete: () => {
        const nextIdx = (index + 1) % socials.length;
        setIndex(nextIdx);
        // reset flung card to bottom of stack instantly
        gsap.set(current, { y: 24, scale: 0.88, opacity: 0, zIndex: 0 });
        applyStack(nextIdx, true);
        isAnimating.current = false;
      },
    });
  };

  const prev = () => {
    if (isAnimating.current || phase !== "ready") return;
    isAnimating.current = true;
    playClick();

    const prevIdx = (index - 1 + socials.length) % socials.length;
    const prevCard = cardRefs.current[prevIdx];
    // bring previous card in from top
    gsap.set(prevCard, { y: -100, opacity: 0, scale: 0.92, zIndex: 5 });
    gsap.to(prevCard, {
      y: 0, opacity: 1, scale: 1,
      duration: 0.4, ease: "back.out(1.3)",
      onComplete: () => {
        setIndex(prevIdx);
        applyStack(prevIdx, true);
        isAnimating.current = false;
      },
    });
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#F3ECE2] px-6 py-10">

      <svg width="0" height="0" style={{ position: "absolute" }}>
        <defs>
          <filter id="crayon-c" x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="5" result="noise" seed="9" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>

      {/* title */}
      <div
        ref={titleRef}
        className="mb-12 font-serif italic text-[#4B3621] select-none"
        style={{
          fontSize: "clamp(1.6rem, 3vw, 2.4rem)",
          letterSpacing: "0.1em",
          filter: "url(#crayon-c)",
        }}
      >
        Contact
      </div>

      {/* card stack */}
      <div ref={stackRef} className="relative w-full max-w-sm" style={{ height: "260px" }}>
        {socials.map((s, i) => (
          <div
            key={s.id}
            ref={el => { cardRefs.current[i] = el; }}
            className="absolute inset-x-0 rounded-2xl border border-[#D6C8B5] bg-[#FAF6F0] px-8 py-8 shadow-[0_12px_40px_rgba(75,54,33,0.12)] cursor-pointer select-none"
            style={{ transformOrigin: "center top" }}
            onClick={i === index ? next : undefined}
          >
            <div className="flex flex-col items-center gap-4 text-center">
              <span className="font-serif text-3xl text-[#7A5230]">{s.symbol}</span>
              <h2 className="font-serif text-xl italic text-[#4B3621]">{s.label}</h2>
              <a
                href={s.href}
                target={s.id === "email" ? "_self" : "_blank"}
                rel="noopener noreferrer"
                onClick={e => e.stopPropagation()}
                className="font-serif text-xs italic tracking-widest text-[#7A5230] underline underline-offset-4 hover:text-[#4B3621] transition-colors"
              >
                {s.id === "email" ? s.href.replace("mailto:", "") : s.href.replace("https://", "")}
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* counter + controls */}
      <div ref={counterRef} className="mt-8 flex items-center gap-6">
        <button
          onClick={prev}
          className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#4B3621] font-serif text-[#4B3621] transition-all hover:bg-[#4B3621] hover:text-[#FAF6F0]"
        >
          ↑
        </button>
        <span className="font-serif text-xs italic tracking-[0.3em] text-[#8A7463]">
          {String(index + 1).padStart(2, "0")} / {String(socials.length).padStart(2, "0")}
        </span>
        <button
          onClick={next}
          className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#4B3621] font-serif text-[#4B3621] transition-all hover:bg-[#4B3621] hover:text-[#FAF6F0]"
        >
          ↓
        </button>
      </div>

      {/* back */}
      <button
        ref={backRef}
        onClick={() => { playClick(); onBack(); }}
        className="group relative mt-10 overflow-hidden rounded-full border border-[#4B3621] px-7 py-2.5 font-serif text-xs italic tracking-widest text-[#4B3621] transition-colors duration-300 hover:text-[#FAF6F0]"
      >
        <span className="relative z-10">← Back to Menu</span>
        <span className="absolute inset-0 -translate-x-full bg-[#4B3621] transition-transform duration-300 group-hover:translate-x-0" />
      </button>
    </div>
  );
}
