import { useLayoutEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function parseCounter(value) {
  const match = value.match(/^([^0-9]*)([0-9,.]+)(.*)$/);
  if (!match) return null;

  return {
    prefix: match[1],
    number: Number(match[2].replaceAll(",", "")),
    suffix: match[3],
  };
}

export function useHomeMotion(scope) {
  useLayoutEffect(() => {
    const root = scope.current;
    if (!root) return undefined;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return undefined;

    const lenis = new Lenis({
      anchors: true,
      duration: 1.24,
      easing: (value) => Math.min(1, 1.001 - 2 ** (-10 * value)),
      smoothWheel: true,
      syncTouch: false,
      touchMultiplier: 1.1,
      wheelMultiplier: 0.92,
    });

    const updateScrollTrigger = () => ScrollTrigger.update();
    const lenisFrame = (time) => lenis.raf(time * 1000);
    lenis.on("scroll", updateScrollTrigger);
    gsap.ticker.add(lenisFrame);

    const context = gsap.context(() => {
      const find = (selector) => root.querySelector(selector);
      const findAll = (selector, parent = root) => Array.from(parent.querySelectorAll(selector));

      const reveal = (triggerSelector, targetSelector, options = {}) => {
        const trigger = find(triggerSelector);
        if (!trigger) return;

        const targets = findAll(targetSelector, trigger);
        if (!targets.length) return;

        ScrollTrigger.create({
          trigger,
          start: options.start ?? "top 82%",
          once: true,
          onEnter: () => {
            gsap.fromTo(targets, {
              autoAlpha: 0,
              x: options.x ?? 0,
              y: options.y ?? 86,
              scale: options.scale ?? 0.96,
              rotate: options.rotate ?? 0,
              clipPath: options.clipPath ?? "inset(0 0 18% 0)",
            }, {
              autoAlpha: 1,
              x: 0,
              y: 0,
              scale: 1,
              rotate: 0,
              clipPath: "inset(0 0 0% 0)",
              duration: options.duration ?? 1.05,
              stagger: options.stagger ?? 0.12,
              ease: options.ease ?? "power4.out",
              immediateRender: false,
              clearProps: "opacity,visibility,transform,clipPath",
            });
          },
        });
      };

      const progress = find(".home-scroll-progress span");
      if (progress) {
        gsap.set(progress, { scaleX: 0, transformOrigin: "left center" });
        gsap.to(progress, {
          scaleX: 1,
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.18,
          },
        });
      }

      // The homepage hero intentionally stays static. Motion begins below it.

      reveal(".news-strip", ".news-strip > *", { x: -72, y: 0, scale: 1, clipPath: "inset(0 12% 0 0)", duration: 0.9, start: "top 94%" });

      reveal(".proof-section", ".section-heading > *", { y: 72, scale: 1, stagger: 0.1 });
      reveal(".proof-section", ".metric-grid article", { y: 110, scale: 0.88, rotate: -1.8, stagger: 0.14, duration: 1.18, clipPath: "inset(24% 0 0 0)" });

      const counters = findAll(".proof-section .metric-grid strong[data-count-value]");
      if (counters.length) {
        ScrollTrigger.create({
          trigger: ".proof-section .metric-grid",
          start: "top 78%",
          once: true,
          onEnter: () => {
            counters.forEach((element, index) => {
              const finalValue = element.dataset.countValue;
              const parsed = parseCounter(finalValue);
              if (!parsed) return;

              const counter = { value: 0 };
              gsap.to(counter, {
                value: parsed.number,
                duration: 2,
                delay: 0.16 + index * 0.13,
                ease: "power3.out",
                onStart: () => {
                  element.textContent = `${parsed.prefix}0${parsed.suffix}`;
                },
                onUpdate: () => {
                  const number = Math.round(counter.value).toLocaleString("en-US");
                  element.textContent = `${parsed.prefix}${number}${parsed.suffix}`;
                },
                onComplete: () => {
                  element.textContent = finalValue;
                },
              });
            });
          },
        });
      }

      reveal(".support-section", ".section-heading > *", { y: 76, scale: 1 });
      reveal(".support-section", ".support-card", { y: 130, scale: 0.9, rotate: 2.2, stagger: 0.18, duration: 1.22, clipPath: "inset(28% 0 0 0)" });

      reveal(".home-editorial", ".home-editorial-intro > *", { x: -100, y: 0, scale: 1, stagger: 0.12, clipPath: "inset(0 28% 0 0)" });
      reveal(".home-editorial", ".home-editorial-card", { x: 74, y: 70, scale: 0.9, stagger: 0.16, duration: 1.12, clipPath: "inset(18% 0 0 18%)" });
      findAll(".home-editorial-card img").forEach((image) => {
        gsap.fromTo(image, { yPercent: -6, scale: 1.08 }, {
          yPercent: 9,
          scale: 1.14,
          ease: "none",
          scrollTrigger: { trigger: image, start: "top bottom", end: "bottom top", scrub: 0.8 },
        });
      });

      reveal(".alliances-section", ".section-heading > *", { y: 76, scale: 1 });
      reveal(".alliances-section", ".alliance-card", { x: -130, y: 0, scale: 0.97, stagger: 0.09, duration: 1.02, clipPath: "inset(0 32% 0 0)" });

      reveal(".thesis-preview", ".section-heading > *", { y: 76, scale: 1 });
      reveal(".thesis-preview", ".sector-list article", { x: -120, y: 0, scale: 0.96, stagger: 0.11, duration: 1, clipPath: "inset(0 24% 0 0)" });
      reveal(".thesis-preview", ".sector-focus-visual", { x: 120, y: 0, scale: 0.9, duration: 1.25, clipPath: "inset(0 0 0 28%)" });

      const sectorVisual = find(".sector-focus-visual");
      if (sectorVisual) {
        gsap.to(sectorVisual, {
          yPercent: -7,
          ease: "none",
          scrollTrigger: { trigger: ".thesis-preview", start: "top bottom", end: "bottom top", scrub: 0.7 },
        });
      }

      reveal(".partner-rail", ".eyebrow, .arrow-link", { y: 62, scale: 1, stagger: 0.12 });
      reveal(".partner-rail", ".logo-grid > *", { y: 90, scale: 0.78, rotate: -2, duration: 0.9, stagger: 0.065, clipPath: "inset(22% 12% 22% 12%)" });

      reveal(".ecosystem-section", ".section-heading > *", { y: 76, scale: 1 });
      reveal(".ecosystem-section", ".ecosystem-map", { x: -150, y: 0, scale: 0.88, duration: 1.3, clipPath: "circle(32% at 50% 50%)" });
      reveal(".ecosystem-section", ".chapter-list article", { x: 130, y: 0, scale: 0.96, stagger: 0.14, duration: 1.05, clipPath: "inset(0 0 0 26%)" });

      const globe = find(".wireframe-globe");
      if (globe) {
        gsap.fromTo(globe, { yPercent: 6, rotate: -1.5 }, {
          yPercent: -6,
          rotate: 1.5,
          ease: "none",
          scrollTrigger: { trigger: ".ecosystem-section", start: "top bottom", end: "bottom top", scrub: 0.75 },
        });
      }

      reveal(".portfolio-section", ".section-heading > *", { y: 76, scale: 1 });
      reveal(".portfolio-section", ".portfolio-card", { y: 130, scale: 0.84, rotate: 1.8, stagger: 0.12, duration: 1.2, clipPath: "inset(24% 8% 0 8% round 24px)" });

      reveal(".testimonials-section", ".section-heading > *", { y: 76, scale: 1 });
      reveal(".testimonials-section", ".testimonial-grid article", { y: 140, scale: 0.88, rotate: -2.2, stagger: 0.16, duration: 1.2, clipPath: "inset(28% 0 0 0 round 22px)" });

      reveal(".home-newsletter", ".home-newsletter > *", { y: 100, scale: 0.92, stagger: 0.18, duration: 1.15, clipPath: "inset(24% 0 0 0)" });
      reveal(".final-cta", ".final-cta-copy, .final-cta-action", { x: -110, y: 0, scale: 0.92, stagger: 0.2, duration: 1.2, clipPath: "inset(0 26% 0 0)" });

      const ctaVisual = find(".founder-path-visual");
      if (ctaVisual) {
        gsap.fromTo(ctaVisual, { xPercent: 10, yPercent: 7, rotate: 2 }, {
          xPercent: -4,
          yPercent: -4,
          rotate: -1,
          ease: "none",
          scrollTrigger: { trigger: ".final-cta", start: "top bottom", end: "bottom bottom", scrub: 0.7 },
        });
      }
    }, root);

    const refreshFrame = window.requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => {
      window.cancelAnimationFrame(refreshFrame);
      context.revert();
      lenis.off("scroll", updateScrollTrigger);
      gsap.ticker.remove(lenisFrame);
      lenis.destroy();
    };
  }, [scope]);
}
