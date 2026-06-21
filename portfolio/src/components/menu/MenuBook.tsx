"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { playClick } from "@/lib/sound";
import SkillsPage from "@/components/pages/SkillsPage";
import ProjectsPage from "@/components/pages/ProjectsPage";
import ExperiencePage from "@/components/pages/ExperiencePage";
import ContactPage from "@/components/pages/ContactPage";
import AboutPage from "@/components/pages/AboutPage";

interface MenuBookProps {
  onBack: () => void;
}

type Page = "menu" | "about" | "skills" | "projects" | "experience" | "contact";

const ITEMS: { label: string; page: Page | null }[] = [
  { label: "About",      page: "about" as Page },
  { label: "Skills",     page: "skills" as Page },
  { label: "Projects",   page: "projects" as Page },
  { label: "Experience", page: "experience" as Page },
  { label: "Contact",    page: "contact" as Page },
];

export default function MenuBook({ onBack }: MenuBookProps) {
  const wrapperRef     = useRef<HTMLDivElement>(null);
  const peelRef        = useRef<HTMLDivElement>(null);
  const peelFaceRef    = useRef<HTMLDivElement>(null);
  const shadowRef      = useRef<HTMLDivElement>(null);
  const menuContentRef = useRef<HTMLDivElement>(null);
  const backBtnRef     = useRef<HTMLButtonElement>(null);
  const itemRefs       = useRef<(HTMLButtonElement | null)[]>([]);
  const underlineRefs  = useRef<(HTMLSpanElement | null)[]>([]);
  const [page, setPage] = useState<Page>("menu");

  useEffect(() => {
    if (page !== "menu") return;

    const tl = gsap.timeline({ defaults: { ease: "power3.inOut" } });

    if (peelRef.current) gsap.set(peelRef.current, { x: "0%" });
    if (menuContentRef.current) gsap.set(menuContentRef.current, { opacity: 0 });
    if (shadowRef.current) gsap.set(shadowRef.current, { opacity: 0, x: "0%" });
    if (backBtnRef.current) gsap.set(backBtnRef.current, { opacity: 0, y: 10 });

    const validItems = itemRefs.current.filter(el => el !== null) as HTMLButtonElement[];
    if (validItems.length > 0) gsap.set(validItems, { opacity: 0, y: 12 });

    const validUnderlines = underlineRefs.current.filter(el => el !== null) as HTMLSpanElement[];
    if (validUnderlines.length > 0) gsap.set(validUnderlines, { scaleX: 0, transformOrigin: "left center" });

    if (shadowRef.current) {
      tl.to(shadowRef.current, { opacity: 1, duration: 0.2 });
    }

    if (peelRef.current) {
      tl.to(peelRef.current, { x: "-100%", duration: 1.1, ease: "power2.inOut" }, "-=0.1");
    }

    if (shadowRef.current) {
      tl.to(shadowRef.current, { x: "-100%", duration: 1.1, ease: "power2.inOut" }, "<");
    }

    if (peelFaceRef.current) {
      tl.to(peelFaceRef.current, { skewY: -4, duration: 0.4, ease: "power1.in" }, 0.3);
    }

    if (menuContentRef.current) {
      tl.to(menuContentRef.current, { opacity: 1, duration: 0.5, ease: "power2.out" }, "-=0.4");
    }

    if (validItems.length > 0) {
      tl.to(validItems, {
        opacity: 1, y: 0, duration: 0.4, stagger: 0.08, ease: "power2.out",
      }, "-=0.2");
    }

    if (backBtnRef.current) {
      tl.to(backBtnRef.current, { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }, "-=0.2");
    }
  }, [page]);

  const handleBack = () => {
    playClick();
    const tl = gsap.timeline({ onComplete: onBack });
    if (backBtnRef.current) {
      tl.to(backBtnRef.current, { opacity: 0, y: 10, duration: 0.25, ease: "power2.in" });
    }
    if (menuContentRef.current) {
      tl.to(menuContentRef.current, { opacity: 0, duration: 0.3, ease: "power2.in" }, "<");
    }
    if (peelRef.current) tl.set(peelRef.current, { x: "-100%" });
    if (shadowRef.current) tl.set(shadowRef.current, { x: "-100%", opacity: 1 });
    if (peelRef.current) {
      tl.to(peelRef.current, { x: "0%", duration: 1.0, ease: "power2.inOut" });
    }
    if (shadowRef.current) {
      tl.to(shadowRef.current, { x: "0%", duration: 1.0, ease: "power2.inOut" }, "<");
    }
  };

  const handleItemClick = (idx: number, targetPage: Page | null) => {
    playClick();
    const btn       = itemRefs.current[idx];
    const underline = underlineRefs.current[idx];
    if (!btn || !underline) return;

    const tl = gsap.timeline({
      onComplete: () => {
        if (targetPage) {
          gsap.to(menuContentRef.current, {
            opacity: 0, duration: 0.3, ease: "power2.in",
            onComplete: () => setPage(targetPage),
          });
        }
      },
    });

    tl
      .to(btn, { scale: 1.08, color: "#7A5230", duration: 0.15, ease: "power2.out" })
      .to(underline, { scaleX: 1, duration: 0.35, ease: "power2.out" }, "<")
      .to(btn, { scale: 1, duration: 0.2, ease: "back.out(2)" }, "-=0.1")
      .to(underline, { opacity: 0, duration: 0.3, ease: "power2.in" }, "-=0.1")
      .set(underline, { scaleX: 0, opacity: 1 });
  };

  if (page === "about")      return <AboutPage      onBack={() => setPage("menu")} />;
  if (page === "skills")     return <SkillsPage     onBack={() => setPage("menu")} />;
  if (page === "projects")   return <ProjectsPage   onBack={() => setPage("menu")} />;
  if (page === "experience") return <ExperiencePage onBack={() => setPage("menu")} />;
  if (page === "contact")    return <ContactPage    onBack={() => setPage("menu")} />;

  return (
    <div
      ref={wrapperRef}
      className="relative min-h-screen overflow-hidden bg-[#F3ECE2]"
      style={{ backgroundImage: "url(/bg.png)", backgroundSize: "cover", backgroundPosition: "center" }}
    >
      <div className="absolute inset-0 bg-[#F3ECE2]/60 z-0" />
      <div ref={menuContentRef} className="absolute inset-0 flex items-center justify-center z-10">
        <div className="mx-auto w-full max-w-md rounded-2xl border border-[#D6C8B5] bg-[#FAF6F0] px-8 py-8 shadow-[0_16px_60px_rgba(75,54,33,0.12)]">
          <p className="mb-2 text-center font-serif text-xs tracking-[0.35em] text-[#8A7463] uppercase">The</p>
          <h1 className="mb-6 text-center font-serif text-3xl italic text-[#4B3621]">Menu</h1>

          <div className="flex flex-col gap-3 text-center font-serif text-base text-[#4B3621]">
            {ITEMS.map((item, i) => (
              <div key={item.label}>
                {i > 0 && <div className="h-px bg-[#C9B8A5] mb-3" />}
                <button
                  ref={el => { itemRefs.current[i] = el; }}
                  onClick={() => handleItemClick(i, item.page)}
                  className="relative inline-block italic tracking-wide transition-colors duration-200 hover:text-[#7A5230]"
                >
                  {item.label}
                  <span
                    ref={el => { underlineRefs.current[i] = el; }}
                    className="absolute -bottom-0.5 left-0 h-[1.5px] w-full rounded-full bg-[#7A5230]"
                    style={{ transformOrigin: "left center" }}
                  />
                </button>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-center">
            <button
              ref={backBtnRef}
              onClick={handleBack}
              className="group relative overflow-hidden rounded-full border border-[#4B3621] px-8 py-2.5 font-serif text-sm italic tracking-widest text-[#4B3621] transition-colors duration-300 hover:text-[#FAF6F0]"
            >
              <span className="relative z-10">← Back to Cover</span>
              <span className="absolute inset-0 -translate-x-full bg-[#4B3621] transition-transform duration-300 group-hover:translate-x-0" />
            </button>
          </div>
        </div>
      </div>

      <div
        ref={shadowRef}
        className="pointer-events-none absolute inset-y-0 right-0 w-16 z-10"
        style={{ background: "linear-gradient(to right, rgba(75,54,33,0.18), transparent)" }}
      />

      <div ref={peelRef} className="absolute inset-0 z-20 overflow-hidden">
        <div
          ref={peelFaceRef}
          className="h-full w-full bg-[#FAF6F0] flex items-center justify-center"
          style={{ borderRight: "1px solid #D6C8B5" }}
        >
          <div
            className="pointer-events-none absolute inset-y-0 right-0 w-6"
            style={{ background: "linear-gradient(to left, rgba(75,54,33,0.08), transparent)" }}
          />
          <div className="text-center select-none">
            <p className="font-serif text-sm tracking-[0.35em] text-[#8A7463] uppercase">Welcome!</p>
            <h1 className="mt-1 font-serif text-3xl italic text-[#4B3621]">Ishita Sati</h1>
          </div>
        </div>
      </div>
    </div>
  );
}
