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

export function useInternalMotion(pathname) {
  useLayoutEffect(() => {
    if (pathname === "/") return undefined;

    const root = document.querySelector(".internal-page");
    if (!root) return undefined;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return undefined;

    const lenis = new Lenis({
      anchors: true,
      duration: 1.22,
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

      const revealElements = (trigger, targets, options = {}) => {
        if (!trigger || !targets.length) return;

        ScrollTrigger.create({
          trigger,
          start: options.start ?? "top 84%",
          once: true,
          onEnter: () => {
            gsap.fromTo(targets, {
              autoAlpha: 0,
              x: options.x ?? 0,
              y: options.y ?? 92,
              scale: options.scale ?? 0.94,
              rotate: options.rotate ?? 0,
              clipPath: options.clipPath ?? "inset(0 0 22% 0)",
            }, {
              autoAlpha: 1,
              x: 0,
              y: 0,
              scale: 1,
              rotate: 0,
              clipPath: "inset(0 0 0% 0)",
              duration: options.duration ?? 1.08,
              stagger: options.stagger ?? 0.12,
              ease: options.ease ?? "power4.out",
              immediateRender: false,
              clearProps: "opacity,visibility,transform,clipPath",
            });
          },
        });
      };

      const revealEach = (triggerSelector, targetSelector, options = {}) => {
        findAll(triggerSelector).forEach((trigger) => {
          const targets = targetSelector === ":self" ? [trigger] : findAll(targetSelector, trigger);
          revealElements(trigger, targets, options);
        });
      };

      const progress = document.querySelector(".page-scroll-progress span");
      if (progress) {
        gsap.set(progress, { scaleX: 0, transformOrigin: "left center" });
        gsap.to(progress, {
          scaleX: 1,
          ease: "none",
          scrollTrigger: { trigger: root, start: "top top", end: "bottom bottom", scrub: 0.18 },
        });
      }

      const hero = find(".internal-hero");
      if (hero) {
        const copy = hero.querySelector(".internal-hero > div:first-child");
        const art = hero.querySelector(".internal-hero-art");
        const heroTimeline = gsap.timeline({ defaults: { ease: "power4.out" } });

        if (copy) {
          heroTimeline
            .fromTo(copy.querySelectorAll(".eyebrow"), { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.62, clearProps: "opacity,visibility,transform" })
            .fromTo(copy.querySelectorAll("h1"), { autoAlpha: 0, y: 100, clipPath: "inset(0 0 100% 0)" }, { autoAlpha: 1, y: 0, clipPath: "inset(0 0 0% 0)", duration: 1.14, clearProps: "opacity,visibility,transform,clipPath" }, "-=0.22")
            .fromTo(copy.querySelectorAll(":scope > p:not(.eyebrow)"), { autoAlpha: 0, y: 50 }, { autoAlpha: 1, y: 0, duration: 0.8, clearProps: "opacity,visibility,transform" }, "-=0.62")
            .fromTo(copy.querySelectorAll(".hero-meta > *"), { autoAlpha: 0, y: 38, scale: 0.9 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.72, stagger: 0.1, clearProps: "opacity,visibility,transform" }, "-=0.44");
        }

        if (art) {
          heroTimeline.fromTo(art, { autoAlpha: 0, x: 120, scale: 0.82, rotate: 5, clipPath: "circle(18% at 50% 50%)" }, { autoAlpha: 1, x: 0, scale: 1, rotate: 0, clipPath: "circle(75% at 50% 50%)", duration: 1.32, clearProps: "opacity,visibility,transform,clipPath" }, 0.1);
          gsap.to(art, {
            yPercent: 14,
            rotate: 4,
            ease: "none",
            scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: 0.7 },
          });
        }

        const metaCounters = findAll(".hero-meta span", hero);
        metaCounters.forEach((element, index) => {
          const finalValue = element.textContent;
          const parsed = parseCounter(finalValue);
          if (!parsed || parsed.number < 2) return;

          const counter = { value: 0 };
          gsap.to(counter, {
            value: parsed.number,
            duration: 1.8,
            delay: 0.72 + index * 0.1,
            ease: "power3.out",
            onStart: () => { element.textContent = `${parsed.prefix}0${parsed.suffix}`; },
            onUpdate: () => { element.textContent = `${parsed.prefix}${Math.round(counter.value).toLocaleString("en-US")}${parsed.suffix}`; },
            onComplete: () => { element.textContent = finalValue; },
          });
        });
      }

      revealEach(".section-heading", ":scope > *", { y: 74, scale: 1, stagger: 0.1 });
      revealEach(".final-cta", ".final-cta-copy, .final-cta-action", { x: -110, y: 0, scale: 0.92, stagger: 0.18, duration: 1.18, clipPath: "inset(0 25% 0 0)" });

      // Team
      findAll(".team-card").forEach((card, index) => {
        revealElements(card, [card], {
          y: 110,
          x: index % 3 === 0 ? -34 : index % 3 === 2 ? 34 : 0,
          scale: 0.9,
          rotate: index % 2 === 0 ? -1.8 : 1.8,
          duration: 1.12,
          start: "top 88%",
          clipPath: "inset(18% 0 0 0 round 22px)",
        });

        const content = card.querySelectorAll(".team-card-heading, .team-content h2, .team-content > strong, .team-content > p, .tag-list");
        ScrollTrigger.create({
          trigger: card,
          start: "top 76%",
          once: true,
          onEnter: () => gsap.fromTo(content, { autoAlpha: 0, y: 28 }, {
            autoAlpha: 1,
            y: 0,
            duration: 0.74,
            stagger: 0.07,
            ease: "power3.out",
            clearProps: "opacity,visibility,transform",
          }),
        });
      });
      revealEach(".background-strip", ":scope > *", { x: -100, y: 0, scale: 0.92, stagger: 0.12, clipPath: "inset(0 24% 0 0)" });

      // Partners
      revealEach(".logo-grid", ":scope > *", { y: 94, scale: 0.76, rotate: -2, stagger: 0.055, duration: 0.9, clipPath: "inset(24% 12% 24% 12%)" });
      revealEach(".filter-row", ":scope > *", { x: -46, y: 0, scale: 0.9, stagger: 0.07, duration: 0.72, clipPath: "inset(0 22% 0 0)" });
      revealEach(".consortium-grid", ".consortium-card", { y: 120, scale: 0.88, rotate: 1.6, stagger: 0.12, duration: 1.12, clipPath: "inset(24% 0 0 0 round 22px)" });
      revealEach(".portfolio-grid.compact", ".portfolio-card", { y: 120, scale: 0.84, rotate: -1.8, stagger: 0.1, duration: 1.15, clipPath: "inset(22% 8% 0 8% round 22px)" });
      revealEach(".track-grid", ":scope > article", { y: 130, scale: 0.86, rotate: 2, stagger: 0.15, duration: 1.18, clipPath: "inset(28% 0 0 0)" });

      // Thesis
      revealEach(".editorial-split", ":scope > div", { x: -110, y: 0, scale: 0.96, stagger: 0.18, duration: 1.15, clipPath: "inset(0 28% 0 0)" });
      revealEach(".thesis-area-layout", ":scope > div > button", { x: -120, y: 0, scale: 0.95, stagger: 0.11, duration: 1.02, clipPath: "inset(0 28% 0 0)" });
      revealEach(".thesis-area-layout", ":scope > aside", { x: 130, y: 0, scale: 0.86, duration: 1.25, clipPath: "inset(0 0 0 30%)" });
      revealEach(".criteria-grid", ":scope > article", { y: 120, scale: 0.84, rotate: -2, stagger: 0.13, duration: 1.12, clipPath: "inset(26% 0 0 0)" });

      // Newsroom
      revealEach(".featured-news > article", ":scope > div", { x: -120, y: 0, scale: 0.9, stagger: 0.18, duration: 1.24, clipPath: "inset(0 26% 0 0)" });
      revealEach(".news-grid", ".news-card", { y: 130, scale: 0.86, rotate: 1.8, stagger: 0.14, duration: 1.2, clipPath: "inset(28% 0 0 0 round 20px)" });

      // Events
      revealEach(".events-grid", ":scope > article", { x: -120, y: 44, scale: 0.9, rotate: -1.4, stagger: 0.15, duration: 1.18, clipPath: "inset(0 26% 0 0 round 22px)" });
      revealEach(".date-panel", ":scope > *", { y: 110, scale: 0.9, stagger: 0.18, duration: 1.15, clipPath: "inset(24% 0 0 0)" });

      // FAQ
      revealEach(".faq-layout > aside", ":scope > *", { x: -100, y: 0, scale: 0.94, stagger: 0.1, duration: 0.9, clipPath: "inset(0 26% 0 0)" });
      revealEach(".faq-group", ":scope > .eyebrow, :scope > h2, :scope > .faq-item", { x: 100, y: 46, scale: 0.95, stagger: 0.1, duration: 1.02, clipPath: "inset(0 0 0 24%)" });

      // Page-specific image movement.
      findAll(".team-image img, .news-art img, .news-card-image").forEach((image, index) => {
        gsap.fromTo(image, { yPercent: -6, scale: 1.07 }, {
          yPercent: index % 2 === 0 ? 10 : 7,
          scale: 1.14,
          ease: "none",
          scrollTrigger: { trigger: image, start: "top bottom", end: "bottom top", scrub: 0.8 },
        });
      });

      const ctaVisual = find(".founder-path-visual");
      if (ctaVisual) {
        const ctaImage = ctaVisual.querySelector("img");
        gsap.fromTo(ctaVisual, { xPercent: 7, yPercent: 5 }, {
          xPercent: -2,
          yPercent: -2,
          ease: "none",
          scrollTrigger: { trigger: ".final-cta", start: "top bottom", end: "bottom bottom", scrub: 0.7 },
        });

        if (ctaImage) {
          gsap.fromTo(ctaImage, { yPercent: -5, scale: 1.05 }, {
            yPercent: 5,
            scale: 1.1,
            ease: "none",
            scrollTrigger: { trigger: ".final-cta", start: "top bottom", end: "bottom bottom", scrub: 0.7 },
          });
        }
      }
    }, root);

    const refreshFrame = window.requestAnimationFrame(() => ScrollTrigger.refresh());
    const safetyTimer = window.setTimeout(() => {
      const heroElements = root.querySelectorAll(".internal-hero > * , .internal-hero > div:first-child > *");
      gsap.set(heroElements, { clearProps: "opacity,visibility,transform,clipPath" });
    }, 2500);

    return () => {
      window.cancelAnimationFrame(refreshFrame);
      window.clearTimeout(safetyTimer);
      context.revert();
      lenis.off("scroll", updateScrollTrigger);
      gsap.ticker.remove(lenisFrame);
      lenis.destroy();
    };
  }, [pathname]);
}
