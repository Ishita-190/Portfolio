"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import MenuBook from "@/components/menu/MenuBook";
import { playClick } from "@/lib/sound";

const FLOATERS = [
  { left: "6%",  top: "12%", size: 32, delay: 0 },
  { left: "80%", top: "8%",  size: 28, delay: 0.4 },
  { left: "18%", top: "70%", size: 36, delay: 1.1 },
  { left: "75%", top: "65%", size: 30, delay: 0.3 },
  { left: "46%", top: "6%",  size: 26, delay: 0.9 },
  { left: "88%", top: "40%", size: 34, delay: 0.2 },
  { left: "4%",  top: "46%", size: 28, delay: 0.7 },
  { left: "35%", top: "86%", size: 32, delay: 1.4 },
  { left: "62%", top: "80%", size: 26, delay: 0.5 },
  { left: "55%", top: "18%", size: 30, delay: 1.2 },
  { left: "22%", top: "38%", size: 28, delay: 0.8 },
  { left: "70%", top: "30%", size: 34, delay: 1.5 },
  { left: "40%", top: "55%", size: 26, delay: 0.1 },
  { left: "92%", top: "20%", size: 30, delay: 1.0 },
  { left: "12%", top: "88%", size: 28, delay: 0.6 },
  { left: "58%", top: "92%", size: 32, delay: 1.3 },
  { left: "30%", top: "6%",  size: 24, delay: 0.35 },
  { left: "84%", top: "55%", size: 36, delay: 1.6 },
  { left: "2%",  top: "28%", size: 26, delay: 0.95 },
  { left: "48%", top: "76%", size: 30, delay: 0.55 },
];

function CoffeeBean({ size }: { size: number }) {
  return (
    <div style={{
      width: size,
      height: Math.round(size * 0.65),
      background: "radial-gradient(ellipse at 40% 35%, #7A5230 0%, #4B3621 55%, #3A2515 100%)",
      borderRadius: "50%",
      boxShadow: `0 2px 5px rgba(75,54,33,0.3), inset 0 1px 2px rgba(255,255,255,0.1)`,
      position: "relative",
      opacity: 0.7,
    }}>
      <div style={{
        position: "absolute",
        top: "38%", left: "15%", right: "15%",
        height: 1.5,
        background: "rgba(30,15,5,0.5)",
        borderRadius: 2,
      }} />
    </div>
  );
}

export default function CoverPage() {
  const welcomeRef    = useRef<HTMLDivElement>(null);
  const dividerTopRef = useRef<HTMLDivElement>(null);
  const servingRef    = useRef<HTMLDivElement>(null);
  const itemsRef      = useRef<HTMLDivElement>(null);
  const estRef        = useRef<HTMLDivElement>(null);
  const dividerBotRef = useRef<HTMLDivElement>(null);
  const btnRef        = useRef<HTMLButtonElement>(null);
  const containerRef  = useRef<HTMLDivElement>(null);
  const floatersRef   = useRef<(HTMLDivElement | null)[]>([]);

  const [menuOpen, setMenuOpen] = useState(false);

  const runAnimations = () => {
    gsap.killTweensOf([
      welcomeRef.current, dividerTopRef.current, servingRef.current,
      estRef.current, dividerBotRef.current, btnRef.current,
      ...floatersRef.current,
      ...(itemsRef.current ? Array.from(itemsRef.current.children) : []),
    ]);

    gsap.set(welcomeRef.current,    { opacity: 0, y: -30 });
    gsap.set(dividerTopRef.current,  { scaleX: 0 });
    gsap.set(servingRef.current,     { opacity: 0, y: 20 });
    gsap.set(estRef.current,         { opacity: 0 });
    gsap.set(dividerBotRef.current,  { scaleX: 0 });
    gsap.set(btnRef.current,         { opacity: 0, y: 16 });
    if (itemsRef.current) {
      gsap.set(itemsRef.current.children, { opacity: 0, y: 24 });
    }
    floatersRef.current.forEach(el => { if (el) gsap.set(el, { opacity: 0, y: 20 }); });

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.fromTo(welcomeRef.current,    { opacity: 0, y: -30 }, { opacity: 1, y: 0, duration: 1 })
      .fromTo(dividerTopRef.current,  { scaleX: 0 },          { scaleX: 1, duration: 0.7, ease: "power2.inOut" }, "-=0.3")
      .fromTo(servingRef.current,     { opacity: 0, y: 20 },  { opacity: 1, y: 0, duration: 0.7 }, "-=0.2")
      .fromTo(
        itemsRef.current!.children,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.15 },
        "-=0.3"
      )
      .fromTo(estRef.current,        { opacity: 0 },          { opacity: 1, duration: 0.8 }, "-=0.1")
      .fromTo(dividerBotRef.current,  { scaleX: 0 },          { scaleX: 1, duration: 0.7, ease: "power2.inOut" }, "-=0.4")
      .fromTo(btnRef.current,        { opacity: 0, y: 16 },   { opacity: 1, y: 0, duration: 0.7 }, "-=0.2");

    floatersRef.current.forEach((el, i) => {
      if (!el) return;
      const f = FLOATERS[i];
      gsap.fromTo(el, { opacity: 0, y: 20 }, {
        opacity: 1, y: 0, duration: 0.8, delay: f.delay + 0.5, ease: "power2.out",
      });
      gsap.to(el, {
        y:        `+=${10 + (i % 3) * 6}`,
        x:        `+=${(i % 2 === 0 ? 1 : -1) * (5 + (i % 4) * 3)}`,
        rotation: (i % 2 === 0 ? 1 : -1) * (8 + (i % 3) * 6),
        duration: 3 + (i % 5) * 0.7,
        repeat:   -1,
        yoyo:     true,
        ease:     "sine.inOut",
        delay:    f.delay,
      });
    });

    gsap.to(containerRef.current, {
      boxShadow: "0 24px 80px rgba(75,54,33,0.18)",
      duration:  2.5,
      repeat:    -1,
      yoyo:      true,
      ease:      "sine.inOut",
    });
  };

  useEffect(() => { runAnimations(); }, []);

  useEffect(() => {
    if (!menuOpen) runAnimations();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menuOpen]);

  const handleOpenMenu = () => {
    playClick();
    gsap.to(btnRef.current, {
      scale: 0.94, duration: 0.12, yoyo: true, repeat: 1,
      onComplete: () => setMenuOpen(true),
    });
  };

  if (menuOpen) return <MenuBook onBack={() => setMenuOpen(false)} />;

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#F3ECE2]">

      {FLOATERS.map((f, i) => (
        <div
          key={i}
          ref={el => { floatersRef.current[i] = el; }}
          className="pointer-events-none absolute opacity-0"
          style={{ left: f.left, top: f.top }}
        >
          <CoffeeBean size={f.size} />
        </div>
      ))}

      <span className="pointer-events-none absolute left-6 top-6 font-serif text-4xl text-[#C9B8A5] opacity-60 select-none">❧</span>
      <span className="pointer-events-none absolute right-6 top-6 font-serif text-4xl text-[#C9B8A5] opacity-60 select-none" style={{ transform: "scaleX(-1)" }}>❧</span>
      <span className="pointer-events-none absolute bottom-6 left-6 font-serif text-4xl text-[#C9B8A5] opacity-60 select-none" style={{ transform: "scaleY(-1)" }}>❧</span>
      <span className="pointer-events-none absolute bottom-6 right-6 font-serif text-4xl text-[#C9B8A5] opacity-60 select-none" style={{ transform: "scale(-1)" }}>❧</span>

      <div
        ref={containerRef}
        className="relative flex w-full max-w-md flex-col items-center rounded-2xl border border-[#D6C8B5] bg-[#FAF6F0] px-8 py-10 shadow-[0_16px_60px_rgba(75,54,33,0.12)]"
        style={{ minHeight: "480px" }}
      >
        <div ref={welcomeRef} className="mb-6 text-center">
          <p className="font-serif text-sm tracking-[0.35em] text-[#8A7463] uppercase">Welcome!</p>
          <h1 className="mt-1 font-serif text-4xl italic text-[#4B3621]">Ishita Sati</h1>
        </div>

        <div ref={dividerTopRef} className="mb-10 h-px w-full origin-center bg-[#C9B8A5]" />

        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <p ref={servingRef} className="mb-6 font-serif text-xs tracking-[0.3em] text-[#8A7463] uppercase">
            Serving
          </p>

          <div ref={itemsRef} className="flex flex-col items-center gap-3">
            <span className="font-serif text-xl italic text-[#4B3621]">Full Stack Development</span>
            <span className="font-serif text-xl italic text-[#4B3621]">Open-Source Work</span>
            <span className="font-serif text-xl italic text-[#4B3621]">Interactive Experiences</span>
          </div>

          <p ref={estRef} className="mt-10 font-serif text-sm tracking-[0.4em] text-[#A0917E]">
            EST. 2026
          </p>
        </div>

        <div ref={dividerBotRef} className="mb-10 mt-10 h-px w-full origin-center bg-[#C9B8A5]" />

        <button
          ref={btnRef}
          onClick={handleOpenMenu}
          className="group relative overflow-hidden rounded-full border border-[#4B3621] px-10 py-3 font-serif text-sm italic tracking-widest text-[#4B3621] transition-colors duration-300 hover:bg-[#4B3621] hover:text-[#FAF6F0]"
        >
          <span className="relative z-10">Open Menu</span>
          <span className="absolute inset-0 -translate-x-full bg-[#4B3621] transition-transform duration-300 group-hover:translate-x-0" />
        </button>
      </div>
    </div>
  );
}
