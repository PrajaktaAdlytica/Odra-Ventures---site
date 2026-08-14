import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

const BRAND = {
  ink: "#2A2733",
  cream: "#FFF7F0",
  orange: "#EA580C",
  lavender: "#E7E3FA",
  mint: "#DFF1EA",
  blue: "#D9E8F7",
  yellow: "#F6E7A6",
};

export default function WireframeDottedGlobe({ className = "" }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!container || !canvas || !context) return undefined;

    let disposed = false;
    let frame = 0;
    let width = 0;
    let height = 0;
    let baseRadius = 0;
    let zoom = 1;
    let autoRotate = true;
    let isVisible = false;
    let pageVisible = !document.hidden;
    let resumeTimer;
    let pointerStart = null;
    let land;
    let dots = [];
    const rotation = [-18, -12, 0];
    const projection = d3.geoOrthographic().clipAngle(90).precision(0.35);
    const path = d3.geoPath(projection, context);
    const graticule = d3.geoGraticule10();

    const syncCanvas = () => {
      const rect = container.getBoundingClientRect();
      width = Math.max(280, Math.round(rect.width));
      height = Math.max(320, Math.round(rect.height));
      baseRadius = Math.min(width * 0.43, height * 0.38);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      projection
        .translate([width / 2, height / 2 - height * 0.025])
        .scale(baseRadius * zoom)
        .rotate(rotation);
    };

    const isFrontFacing = (coordinates) => {
      const center = projection.invert([width / 2, height / 2]);
      return center && d3.geoDistance(center, coordinates) <= Math.PI / 2;
    };

    const dotColor = (lng, lat) => {
      if (lat > 35) return BRAND.lavender;
      if (lng > 15 && lng < 60) return BRAND.orange;
      if (lng < -20) return BRAND.blue;
      if (lat < -10) return BRAND.mint;
      return BRAND.yellow;
    };

    const render = () => {
      context.clearRect(0, 0, width, height);
      projection.scale(baseRadius * zoom).rotate(rotation);
      const radius = projection.scale();
      const centerX = width / 2;
      const centerY = height / 2 - height * 0.025;

      context.save();
      context.beginPath();
      context.arc(centerX, centerY, radius, 0, Math.PI * 2);
      context.fillStyle = BRAND.ink;
      context.shadowColor = "rgba(42, 39, 51, 0.18)";
      context.shadowBlur = 35;
      context.shadowOffsetY = 18;
      context.fill();
      context.restore();

      if (!land) return;

      context.save();
      context.beginPath();
      path(graticule);
      context.strokeStyle = "rgba(255, 247, 240, 0.2)";
      context.lineWidth = 0.8;
      context.stroke();

      context.beginPath();
      path(land);
      context.strokeStyle = "rgba(255, 247, 240, 0.58)";
      context.lineWidth = 0.75;
      context.stroke();

      const scaleFactor = Math.max(0.72, zoom);
      dots.forEach((dot) => {
        if (!isFrontFacing(dot.coordinates)) return;
        const projected = projection(dot.coordinates);
        if (!projected) return;
        context.beginPath();
        context.arc(projected[0], projected[1], 1.35 * scaleFactor, 0, Math.PI * 2);
        context.fillStyle = dot.color;
        context.globalAlpha = dot.color === BRAND.orange ? 0.96 : 0.82;
        context.fill();
      });
      context.globalAlpha = 1;

      context.beginPath();
      context.arc(centerX, centerY, radius, 0, Math.PI * 2);
      context.strokeStyle = "rgba(255, 247, 240, 0.82)";
      context.lineWidth = 1.2;
      context.stroke();
      context.restore();
    };

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const canAnimate = () => !disposed && autoRotate && isVisible && pageVisible && !reduceMotion;

    const animate = () => {
      frame = 0;
      if (!canAnimate()) return;
      rotation[0] += 0.055;
      render();
      frame = window.requestAnimationFrame(animate);
    };

    const startAnimation = () => {
      if (!frame && canAnimate()) frame = window.requestAnimationFrame(animate);
    };

    const pauseThenResume = () => {
      autoRotate = false;
      window.clearTimeout(resumeTimer);
      resumeTimer = window.setTimeout(() => {
        autoRotate = true;
        startAnimation();
      }, 2200);
    };

    const onPointerDown = (event) => {
      pauseThenResume();
      canvas.setPointerCapture?.(event.pointerId);
      pointerStart = { x: event.clientX, y: event.clientY, rotation: [...rotation] };
      canvas.classList.add("is-dragging");
    };

    const onPointerMove = (event) => {
      if (!pointerStart) return;
      rotation[0] = pointerStart.rotation[0] + (event.clientX - pointerStart.x) * 0.32;
      rotation[1] = Math.max(-75, Math.min(75, pointerStart.rotation[1] - (event.clientY - pointerStart.y) * 0.26));
      render();
    };

    const onPointerUp = () => {
      pointerStart = null;
      canvas.classList.remove("is-dragging");
      pauseThenResume();
    };

    const onWheel = (event) => {
      event.preventDefault();
      pauseThenResume();
      zoom = Math.max(0.78, Math.min(1.45, zoom * (event.deltaY > 0 ? 0.94 : 1.06)));
      render();
    };

    const resizeObserver = new ResizeObserver(() => {
      syncCanvas();
      render();
    });

    const intersectionObserver = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
      if (isVisible) {
        render();
        startAnimation();
      } else if (frame) {
        window.cancelAnimationFrame(frame);
        frame = 0;
      }
    }, { rootMargin: "160px 0px" });

    const onVisibilityChange = () => {
      pageVisible = !document.hidden;
      if (pageVisible) startAnimation();
      else if (frame) {
        window.cancelAnimationFrame(frame);
        frame = 0;
      }
    };

    syncCanvas();
    resizeObserver.observe(container);
    intersectionObserver.observe(container);
    document.addEventListener("visibilitychange", onVisibilityChange);
    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("pointercancel", onPointerUp);
    canvas.addEventListener("wheel", onWheel, { passive: false });

    Promise.all([
      fetch("/assets/ne_110m_land.json"),
      fetch("/assets/ne_110m_land_dots.json"),
    ])
      .then(async ([landResponse, dotsResponse]) => {
        if (!landResponse.ok || !dotsResponse.ok) throw new Error("Map data could not be loaded");
        return Promise.all([landResponse.json(), dotsResponse.json()]);
      })
      .then(([featureCollection, dotCoordinates]) => {
        if (disposed) return;
        land = featureCollection;
        dots = dotCoordinates.map(([lng, lat]) => ({
          coordinates: [lng, lat],
          color: dotColor(lng, lat),
        }));
        setIsLoading(false);
        render();
        startAnimation();
      })
      .catch(() => {
        if (!disposed) {
          setError("Globe unavailable");
          setIsLoading(false);
        }
      });

    return () => {
      disposed = true;
      window.cancelAnimationFrame(frame);
      window.clearTimeout(resumeTimer);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointercancel", onPointerUp);
      canvas.removeEventListener("wheel", onWheel);
    };
  }, []);

  return (
    <div ref={containerRef} className={`wireframe-globe ${className}`}>
      <canvas ref={canvasRef} aria-label="Interactive rotating globe showing Odra Venture's global network" role="img" />
      {isLoading && <span className="globe-state" role="status">Loading global network…</span>}
      {error && <span className="globe-state globe-error" role="status">{error}</span>}
      {!isLoading && !error && <span className="globe-hint">Drag to rotate · Scroll to zoom</span>}
    </div>
  );
}
