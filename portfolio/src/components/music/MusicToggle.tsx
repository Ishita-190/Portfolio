"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function MusicToggle() {
  const vinylRef    = useRef<HTMLDivElement>(null);
  const glowRef     = useRef<HTMLDivElement>(null);
  const barRef      = useRef<HTMLDivElement>(null);
  const bar1        = useRef<HTMLDivElement>(null);
  const bar2        = useRef<HTMLDivElement>(null);
  const bar3        = useRef<HTMLDivElement>(null);
  const audioRef    = useRef<HTMLAudioElement | null>(null);
  const spinTween   = useRef<gsap.core.Tween | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    audioRef.current = new Audio("/music/Sade.mp3");
    audioRef.current.loop = true;
    audioRef.current.volume = 0.4;

    spinTween.current = gsap.to(vinylRef.current, {
      rotation: 360,
      duration: 20,
      repeat: -1,
      ease: "none",
    });

    gsap.set([bar1.current, bar2.current, bar3.current], { scaleY: 0.2 });

    gsap.to(glowRef.current, {
      opacity: 0.5,
      scale: 1.1,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    return () => {
      audioRef.current?.pause();
      gsap.killTweensOf([vinylRef.current, glowRef.current, bar1.current, bar2.current, bar3.current]);
    };
  }, []);

  const animateBarsOn = () => {
    [bar1, bar2, bar3].forEach((b, i) => {
      gsap.to(b.current, {
        scaleY: 1,
        duration: 0.3 + i * 0.05,
        ease: "power2.out",
        onComplete: () => {
          gsap.to(b.current, {
            scaleY: 0.2 + Math.random() * 0.8,
            duration: 0.4 + Math.random() * 0.3,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          });
        },
      });
    });
  };

  const animateBarsOff = () => {
    gsap.killTweensOf([bar1.current, bar2.current, bar3.current]);
    gsap.to([bar1.current, bar2.current, bar3.current], {
      scaleY: 0.2,
      duration: 0.3,
      ease: "power2.out",
    });
  };

  const toggleMusic = async () => {
    if (!audioRef.current) return;

    if (playing) {
      audioRef.current.pause();

      gsap.killTweensOf(vinylRef.current);
      gsap.to(vinylRef.current, {
        rotation: "+=60",
        duration: 1.2,
        ease: "power2.out",
        onComplete: () => {
          spinTween.current = gsap.to(vinylRef.current, {
            rotation: "+=360",
            duration: 20,
            repeat: -1,
            ease: "none",
          });
        },
      });

      animateBarsOff();
      setPlaying(false);
    } else {
      try {
        await audioRef.current.play();

        gsap.killTweensOf(vinylRef.current);
        spinTween.current = gsap.to(vinylRef.current, {
          rotation: "+=360",
          duration: 3.5,
          repeat: -1,
          ease: "none",
        });

        animateBarsOn();
        setPlaying(true);
      } catch (e) {
        console.error(e);
      }
    }
  };

  return (
    <div className="fixed top-5 right-5 z-50">
      <div
        className="flex items-center gap-3 rounded-full px-4 py-2.5 shadow-lg"
        style={{
          background: "rgba(250,246,240,0.92)",
          border: "1px solid #D6C8B5",
          backdropFilter: "blur(12px)",
        }}
      >
        <div ref={glowRef} className="pointer-events-none absolute inset-0 rounded-full bg-[#C9B8A5] opacity-0 blur-lg" />

        <div
          ref={vinylRef}
          className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#1a1a1a] shadow-md"
        >
          <div className="absolute h-[85%] w-[85%] rounded-full border border-neutral-700/60" />
          <div className="absolute h-[60%] w-[60%] rounded-full border border-neutral-700/60" />
          <div className="relative flex h-[26%] w-[26%] items-center justify-center rounded-full bg-[#D9C3A5]">
            <div className="h-[40%] w-[40%] rounded-full bg-[#4B3621]" />
          </div>
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/8 via-transparent to-transparent" />
        </div>

        <div className="flex flex-col leading-tight">
          <span className="font-serif text-xs font-medium italic text-[#4B3621]">Sade</span>
          <span className="text-[10px] tracking-wide text-[#8A7463]">
            {playing ? "Now playing" : "Paused"}
          </span>
        </div>

        <div ref={barRef} className="flex items-end gap-[3px] h-4 mx-1">
          {[bar1, bar2, bar3].map((b, i) => (
            <div
              key={i}
              ref={b}
              className="w-[3px] rounded-full origin-bottom"
              style={{
                height: "100%",
                background: "#4B3621",
                opacity: 0.7,
              }}
            />
          ))}
        </div>

        <button
          onClick={toggleMusic}
          aria-label="Toggle music"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#4B3621] text-[#FAF6F0] shadow transition-transform duration-150 hover:scale-105 active:scale-95"
        >
          {playing ? (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
              <rect x="1.5" y="1" width="3.5" height="10" rx="1" />
              <rect x="7" y="1" width="3.5" height="10" rx="1" />
            </svg>
          ) : (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
              <path d="M2.5 1.5 L10.5 6 L2.5 10.5 Z" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
