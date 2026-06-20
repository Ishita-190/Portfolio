"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { projects } from "@/data/projects";
import { playClick } from "@/lib/sound";

interface ProjectsPageProps {
  onBack: () => void;
}

export default function ProjectsPage({ onBack }: ProjectsPageProps) {
  const titleRef     = useRef<HTMLDivElement>(null);
  const rolodexRef   = useRef<HTMLDivElement>(null);
  const cardRef      = useRef<HTMLDivElement>(null);
  const stackRef     = useRef<HTMLDivElement>(null);
  const counterRef   = useRef<HTMLDivElement>(null);
  const controlsRef  = useRef<HTMLDivElement>(null);
  const backRef      = useRef<HTMLButtonElement>(null);
  const cascadeRefs  = useRef<(HTMLDivElement | null)[]>([]);
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<"cascade" | "ready">("cascade");
  const isAnimating       = useRef(false);

  useEffect(() => {
    gsap.set(cascadeRefs.current, { opacity: 0, y: 200, rotation: 0, scale: 0.85 });
    gsap.set(titleRef.current,    { opacity: 0, y: -30 });
    gsap.set(rolodexRef.current,  { opacity: 0 });
    gsap.set(cardRef.current,     { opacity: 0, y: 30 });
    gsap.set(stackRef.current,    { opacity: 0 });
    gsap.set(counterRef.current,  { opacity: 0 });
    gsap.set(controlsRef.current, { opacity: 0, y: 12 });
    gsap.set(backRef.current,     { opacity: 0 });

    const angles = [-12, -6, 0, 6, 12];
    const yOff   = [-8, -4, 0, 4, 8];

    gsap.timeline()
      .to(cascadeRefs.current, {
        opacity: 1,
        y: (i) => yOff[i] ?? 0,
        rotation: (i) => angles[i] ?? 0,
        scale: (i) => 1 - i * 0.03,
        duration: 0.6,
        stagger: 0.12,
        ease: "back.out(1.4)",
      })
      .to(cascadeRefs.current, {
        rotation: 0,
        y: 0,
        scale: 1,
        duration: 0.55,
        stagger: 0.07,
        ease: "power3.out",
        delay: 0.3,
      })
      .to(titleRef.current, {
        opacity: 1, y: 0,
        duration: 0.6, ease: "back.out(1.3)",
      }, "-=0.3")
      .to(cascadeRefs.current, {
        opacity: 0,
        y: -50,
        scale: 0.92,
        stagger: 0.06,
        duration: 0.4,
        ease: "power2.in",
        delay: 0.35,
      })
      .to(rolodexRef.current, {
        opacity: 1, duration: 0.5, ease: "power2.out",
      }, "-=0.25")
      .to(cardRef.current,     { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }, "-=0.35")
      .to(stackRef.current,    { opacity: 1, duration: 0.35 }, "-=0.1")
      .to(counterRef.current,  { opacity: 1, duration: 0.35 }, "<")
      .to(controlsRef.current, { opacity: 1, y: 0, duration: 0.35 }, "-=0.1")
      .to(backRef.current,     { opacity: 1, duration: 0.3 }, "-=0.1")
      .call(() => setPhase("ready"));
  }, []);

  const flipTo = (dir: 1 | -1) => {
    if (isAnimating.current || phase !== "ready") return;
    isAnimating.current = true;
    playClick();
    const next = (index + dir + projects.length) % projects.length;

    gsap.timeline()
      .to(cardRef.current, {
        rotationX: dir === 1 ? -80 : 80,
        opacity: 0, y: dir === 1 ? -16 : 16,
        duration: 0.3, ease: "power2.in",
        transformPerspective: 900,
      })
      .call(() => setIndex(next))
      .fromTo(cardRef.current,
        { rotationX: dir === 1 ? 80 : -80, opacity: 0, y: dir === 1 ? 16 : -16 },
        {
          rotationX: 0, opacity: 1, y: 0,
          duration: 0.42, ease: "back.out(1.3)",
          transformPerspective: 900,
          onComplete: () => { isAnimating.current = false; },
        }
      )
      .fromTo(stackRef.current,   { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.28 }, "-=0.2")
      .fromTo(counterRef.current, { opacity: 0 },       { opacity: 1, duration: 0.25 }, "<");
  };

  const project = projects[index];

  return (
    <div className="relative flex min-h-screen flex-col items-center overflow-hidden bg-[#F3ECE2] px-8 py-10">

      <svg width="0" height="0" style={{ position: "absolute" }}>
        <defs>
          <filter id="crayon-p" x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="5" result="noise" seed="5" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>

      <div
        ref={titleRef}
        className="relative z-20 mb-5 font-serif italic text-[#4B3621] select-none"
        style={{
          fontSize: "clamp(1.6rem, 3vw, 2.4rem)",
          letterSpacing: "0.1em",
          filter: "url(#crayon-p)",
          textShadow: "1px 1px 0 rgba(75,54,33,0.1)",
        }}
      >
        Projects
      </div>

      {phase === "cascade" && (
        <div className="absolute inset-0 flex items-center justify-center">
          {projects.map((p, i) => (
            <div
              key={p.id}
              ref={el => { cascadeRefs.current[i] = el; }}
              className="absolute w-full max-w-lg rounded-2xl border border-[#D6C8B5] bg-[#FAF6F0] px-8 py-6 shadow-[0_20px_60px_rgba(75,54,33,0.14)]"
              style={{ zIndex: projects.length - i }}
            >
              <div className="mb-3 font-serif text-[10px] tracking-[0.4em] text-[#8A7463] uppercase">
                {String(i + 1).padStart(2, "0")}
              </div>
              <h2 className="font-serif text-3xl italic text-[#4B3621]">{p.title}</h2>
            </div>
          ))}
        </div>
      )}

      <div ref={rolodexRef} className="relative z-20 flex w-full max-w-lg flex-col items-center">

        <div ref={counterRef} className="mb-4 self-start font-serif text-xs italic tracking-[0.3em] text-[#8A7463]">
          {String(index + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
        </div>

        <div
          ref={cardRef}
          className="w-full rounded-2xl border border-[#D6C8B5] bg-[#FAF6F0] shadow-[0_20px_70px_rgba(75,54,33,0.13)]"
          style={{ transformStyle: "preserve-3d" }}
        >
          <div className="px-8 pt-8 pb-5">
            <h2 className="mb-3 font-serif text-2xl italic text-[#4B3621]">{project.title}</h2>
            <p className="font-serif text-sm leading-7 text-[#6B5744]">{project.description}</p>
            <div className="mt-7 flex gap-5">
              <a href={project.live} target="_blank" rel="noopener noreferrer"
                className="font-serif text-sm italic tracking-widest text-[#7A5230] underline underline-offset-4 hover:text-[#4B3621] transition-colors">
                Live ↗
              </a>
              <a href={project.github} target="_blank" rel="noopener noreferrer"
                className="font-serif text-sm italic tracking-widest text-[#7A5230] underline underline-offset-4 hover:text-[#4B3621] transition-colors">
                GitHub ↗
              </a>
            </div>
          </div>

          <div className="mx-8 h-px bg-[#D6C8B5]" />

          <div ref={stackRef} className="flex flex-wrap gap-2 px-8 py-4">
            {project.stack.map(s => (
              <span key={s}
                className="rounded-full border border-[#D6C8B5] bg-[#F3ECE2] px-3.5 py-1.5 font-serif text-xs italic text-[#4B3621]">
                {s}
              </span>
            ))}
          </div>
        </div>

        <div ref={controlsRef} className="mt-7 flex w-full items-center justify-between">
          <div className="flex items-center gap-5">
            <button onClick={() => flipTo(-1)}
              className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#4B3621] font-serif text-lg text-[#4B3621] transition-all hover:bg-[#4B3621] hover:text-[#FAF6F0]">
              ←
            </button>
            <div className="flex gap-2">
              {projects.map((_, i) => (
                <div key={i} className="h-1.5 rounded-full transition-all duration-300"
                  style={{ width: i === index ? "22px" : "7px", background: i === index ? "#4B3621" : "#C9B8A5" }} />
              ))}
            </div>
            <button onClick={() => flipTo(1)}
              className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#4B3621] font-serif text-lg text-[#4B3621] transition-all hover:bg-[#4B3621] hover:text-[#FAF6F0]">
              →
            </button>
          </div>

          <button ref={backRef} onClick={onBack}
            className="group relative overflow-hidden rounded-full border border-[#4B3621] px-7 py-2.5 font-serif text-xs italic tracking-widest text-[#4B3621] transition-colors duration-300 hover:text-[#FAF6F0]">
            <span className="relative z-10">← Back to Menu</span>
            <span className="absolute inset-0 -translate-x-full bg-[#4B3621] transition-transform duration-300 group-hover:translate-x-0" />
          </button>
        </div>
      </div>
    </div>
  );
}
