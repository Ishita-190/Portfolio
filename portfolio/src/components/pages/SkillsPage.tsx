"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { skills } from "@/data/skills";
import { playClick } from "@/lib/sound";

interface SkillsPageProps {
  onBack: () => void;
}

const POSITIONS: Record<string, { top: string; left: string }> = {
  languages: { top: "15%", left: "18%" },
  ml:        { top: "55%", left: "18%" },
  cs:        { top: "35%", left: "42%" },
  web:       { top: "15%", left: "66%" },
  tools:     { top: "55%", left: "66%" },
};

interface LeafGroup {
  catId: string;
  paths: SVGPathElement[];
  circles: SVGCircleElement[];
  labels: SVGTextElement[];
}

export default function SkillsPage({ onBack }: SkillsPageProps) {
  const lettersRef  = useRef<(HTMLSpanElement | null)[]>([]);
  const titleRowRef = useRef<HTMLDivElement>(null);
  const svgRef      = useRef<SVGSVGElement>(null);
  const nodeRefs    = useRef<Record<string, HTMLButtonElement | null>>({});
  const connPathRefs = useRef<SVGPathElement[]>([]);
  const leafGroups  = useRef<Record<string, LeafGroup>>({});
  const prevId      = useRef<string | null>(null);
  const [active, setActive] = useState<string | null>(null);
  const [, setPhase]        = useState<"intro" | "ready">("intro");

  useEffect(() => {
    const validLetters = lettersRef.current.filter(el => el !== null);
    if (validLetters.length > 0) {
      gsap.set(validLetters, { opacity: 0, y: 40, scale: 0.7 });
    }

    const tl = gsap.timeline({ onComplete: () => setPhase("ready") });

    if (validLetters.length > 0) {
      tl.to(validLetters, {
        opacity: 1, y: 0, scale: 1,
        duration: 0.6, stagger: 0.12, ease: "back.out(1.4)",
      });
    }
    if (titleRowRef.current) {
      tl.to(titleRowRef.current, {
        y: -20, duration: 0.7, ease: "power2.inOut", delay: 0.3,
      });
    }

    skills.forEach((s, i) => {
      const el = nodeRefs.current[s.id];
      if (!el) return;
      gsap.fromTo(el,
        { opacity: 0, scale: 0.6, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.5, delay: 0.9 + i * 0.12, ease: "back.out(1.6)" }
      );
    });
  }, []);

  const drawConnLine = useCallback((fromId: string, toId: string) => {
    const svg    = svgRef.current;
    const fromEl = nodeRefs.current[fromId];
    const toEl   = nodeRefs.current[toId];
    if (!svg || !fromEl || !toEl) return;

    const sr  = svg.getBoundingClientRect();
    const fr  = fromEl.getBoundingClientRect();
    const tr  = toEl.getBoundingClientRect();
    const x1  = fr.left + fr.width  / 2 - sr.left;
    const y1  = fr.top  + fr.height / 2 - sr.top;
    const x2  = tr.left + tr.width  / 2 - sr.left;
    const y2  = tr.top  + tr.height / 2 - sr.top;
    const cpx = (x1 + x2) / 2 + (Math.random() - 0.5) * 90;
    const cpy = (y1 + y2) / 2 + (Math.random() - 0.5) * 60;

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", `M ${x1} ${y1} Q ${cpx} ${cpy} ${x2} ${y2}`);
    path.setAttribute("fill", "none");
    path.setAttribute("stroke", "#7A5230");
    path.setAttribute("stroke-width", "2");
    path.setAttribute("stroke-linecap", "round");
    path.style.opacity = "0.8";
    svg.appendChild(path);
    connPathRefs.current.push(path);

    const len = path.getTotalLength();
    path.style.strokeDasharray  = String(len);
    path.style.strokeDashoffset = String(len);
    gsap.to(path, { strokeDashoffset: 0, duration: 0.9, ease: "power2.inOut" });
  }, []);

  const drawBranches = useCallback((catId: string) => {
    const svg  = svgRef.current;
    const btn  = nodeRefs.current[catId];
    if (!svg || !btn) return;

    const cat = skills.find(s => s.id === catId);
    if (!cat) return;

    const sr     = svg.getBoundingClientRect();
    const br     = btn.getBoundingClientRect();
    const ox     = br.left + br.width  / 2 - sr.left;
    const oy     = br.top  + br.height / 2 - sr.top;
    const count  = cat.items.length;

    const cx     = sr.width  / 2;
    const cy     = sr.height / 2;
    const baseDeg = Math.atan2(oy - cy, ox - cx) * (180 / Math.PI);

    const spread = Math.min(140, count * 18);
    const radius = 140;
    const group: LeafGroup = { catId, paths: [], circles: [], labels: [] };

    cat.items.forEach((item, i) => {
      const angleDeg = baseDeg - spread / 2 + (spread / (count - 1 || 1)) * i;
      const angleRad = (angleDeg * Math.PI) / 180;
      const lx = ox + radius * Math.cos(angleRad);
      const ly = oy + radius * Math.sin(angleRad);

      const cpx = ox + (radius * 0.5) * Math.cos(angleRad) + (Math.random() - 0.5) * 20;
      const cpy = oy + (radius * 0.5) * Math.sin(angleRad) + (Math.random() - 0.5) * 20;

      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("d", `M ${ox} ${oy} Q ${cpx} ${cpy} ${lx} ${ly}`);
      path.setAttribute("fill", "none");
      path.setAttribute("stroke", "#7A5230");
      path.setAttribute("stroke-width", "1.5");
      path.setAttribute("stroke-linecap", "round");
      path.style.opacity = "0";
      svg.appendChild(path);
      group.paths.push(path);

      const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      circle.setAttribute("cx", String(lx));
      circle.setAttribute("cy", String(ly));
      circle.setAttribute("r", "5");
      circle.setAttribute("fill", "#4B3621");
      circle.style.opacity = "0";
      svg.appendChild(circle);
      group.circles.push(circle);

      const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
      const textX = lx + (Math.cos(angleRad) > 0 ? 10 : -10);
      text.setAttribute("x", String(textX));
      text.setAttribute("y", String(ly + 5));
      text.setAttribute("font-family", "Georgia, serif");
      text.setAttribute("font-size", "12");
      text.setAttribute("font-style", "italic");
      text.setAttribute("fill", "#4B3621");
      text.setAttribute("text-anchor", Math.cos(angleRad) > 0 ? "start" : "end");
      text.style.opacity = "0";
      text.textContent = item;
      svg.appendChild(text);
      group.labels.push(text);

      const len = path.getTotalLength();
      path.style.strokeDasharray  = String(len);
      path.style.strokeDashoffset = String(len);

      const delay = i * 0.07;

      gsap.to(path,   { strokeDashoffset: 0, opacity: 0.85, duration: 0.5, delay, ease: "power2.out" });
      gsap.to(circle, { opacity: 1, duration: 0.3, delay: delay + 0.4, ease: "power2.out" });
      gsap.to(text,   { opacity: 1, duration: 0.3, delay: delay + 0.45, ease: "power2.out" });
    });

    leafGroups.current[catId] = group;
  }, []);

  const removeBranches = useCallback((catId: string) => {
    const group = leafGroups.current[catId];
    if (!group) return;

    [...group.paths, ...group.circles, ...group.labels].forEach(el => {
      gsap.to(el, { opacity: 0, duration: 0.25, onComplete: () => el.remove() });
    });

    delete leafGroups.current[catId];
  }, []);

  const handleSelect = useCallback((id: string) => {
    playClick();
    const prev = prevId.current;

    if (prev && prev !== id) {
      removeBranches(prev);
      drawConnLine(prev, id);
    }

    if (active === id) {
      removeBranches(id);
      setActive(null);
      prevId.current = id;
      return;
    }

    prevId.current = id;
    setActive(id);
    drawBranches(id);

    const btn = nodeRefs.current[id];
    if (btn) gsap.to(btn, { scale: 1.08, duration: 0.15, yoyo: true, repeat: 1, ease: "power1.inOut" });
  }, [active, drawConnLine, drawBranches, removeBranches]);

  const clearAll = () => {
    skills.forEach(s => removeBranches(s.id));
    connPathRefs.current.forEach(p => {
      gsap.to(p, { opacity: 0, duration: 0.3, onComplete: () => p.remove() });
    });
    connPathRefs.current = [];
    setActive(null);
    prevId.current = null;
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#F3ECE2]" style={{ backgroundImage: "url(/bg.png)", backgroundSize: "cover", backgroundPosition: "center" }}>
      <div className="absolute inset-0 bg-[#F3ECE2]/60 z-0" />

      <div className="relative z-10 w-full min-h-screen">
        <svg width="0" height="0" style={{ position: "absolute" }}>
          <defs>
            <filter id="crayon" x="-10%" y="-10%" width="120%" height="120%">
              <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="5" result="noise" seed="3" />
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" xChannelSelector="R" yChannelSelector="G" />
            </filter>
          </defs>
        </svg>

        <svg
          ref={svgRef}
          className="pointer-events-none absolute inset-0 z-10"
          style={{ width: "100%", height: "100%" }}
        />

        <div ref={titleRowRef} className="relative z-20 flex items-center justify-center pt-8 pb-3">
        {"SKILLS".split("").map((l, i) => (
          <span
            key={i}
            ref={el => { lettersRef.current[i] = el; }}
            className="font-serif italic text-[#4B3621] select-none"
            style={{
              fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)",
              letterSpacing: "0.18em",
              display: "inline-block",
              filter: "url(#crayon)",
              textShadow: "1px 1px 0 rgba(75,54,33,0.1)",
            }}
          >
            {l}
          </span>
        ))}
      </div>

      <div
        className="absolute inset-0 z-20"
        style={{ top: "140px", bottom: 0 }}
      >
        {skills.map(cat => {
          const pos      = POSITIONS[cat.id];
          const isActive = active === cat.id;

          return (
            <div
              key={cat.id}
              className="absolute"
              style={{ top: pos.top, left: pos.left }}
            >
              <button
                ref={el => { nodeRefs.current[cat.id] = el; }}
                onClick={() => handleSelect(cat.id)}
                className="flex items-center gap-2 rounded-full px-4 py-2 font-serif text-sm italic tracking-wide transition-all duration-200"
                style={{
                  background: isActive ? "#4B3621" : "#FAF6F0",
                  border: `2px solid ${isActive ? "#4B3621" : "#7A5230"}`,
                  color: isActive ? "#FAF6F0" : "#4B3621",
                  boxShadow: isActive
                    ? "0 4px 20px rgba(75,54,33,0.35)"
                    : "0 2px 12px rgba(75,54,33,0.15)",
                }}
              >
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ background: isActive ? "#FAF6F0" : "#7A5230" }}
                />
                {cat.label}
              </button>
            </div>
          );
        })}
      </div>

      <div className="absolute bottom-8 left-1/2 z-30 flex -translate-x-1/2 gap-4">
        <button
          onClick={clearAll}
          className="rounded-full border border-[#C9B8A5] bg-[#FAF6F0]/80 px-5 py-2 font-serif text-xs italic tracking-widest text-[#8A7463] backdrop-blur transition-colors hover:text-[#4B3621]"
        >
          Clear
        </button>
        <button
          onClick={onBack}
          className="group relative overflow-hidden rounded-full border border-[#4B3621] px-7 py-2 font-serif text-xs italic tracking-widest text-[#4B3621] transition-colors duration-300 hover:text-[#FAF6F0]"
        >
          <span className="relative z-10">← Back to Menu</span>
          <span className="absolute inset-0 -translate-x-full bg-[#4B3621] transition-transform duration-300 group-hover:translate-x-0" />
        </button>
      </div>
      </div>
    </div>
  );
}
