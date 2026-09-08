"use client";

import { useEffect, useRef } from "react";

type Rgb = readonly [number, number, number];

type Star = {
  x: number;
  y: number;
  z: number;
  size: number;
  brightness: number;
  color: number;
};

type Viewport = {
  width: number;
  height: number;
};

const STAR_COUNT = 320;
const SPRITE_SIZE = 64;
const GLOW_SCALE = 4.5;
const DRIFT_SPEED = 0.014;
const BOOST_PER_PIXEL = 0.0018;
const MAX_BOOST = 1.8;
const BOOST_HALF_LIFE = 0.28;
const TRAIL_FRAMES = 2.6;
const MIN_Z = 0.06;
const SPAWN_FADE = 3;

const STAR_COLORS: readonly Rgb[] = [
  [255, 255, 255],
  [220, 232, 255],
  [178, 202, 255],
  [255, 243, 220],
  [255, 214, 168],
];

const clamp = (value: number) => Math.max(0, Math.min(1, value));

const rgba = ([r, g, b]: Rgb, alpha: number) => `rgba(${r}, ${g}, ${b}, ${alpha})`;

const pickWhiteLeaningColor = () => Math.floor(Math.random() ** 2 * STAR_COLORS.length);

function spawn(star: Star, z: number) {
  star.x = Math.random() * 2 - 1;
  star.y = Math.random() * 2 - 1;
  star.z = z;
  star.size = Math.random() * 1.6 + 0.6;
  star.brightness = Math.random() * 0.55 + 0.35;
  star.color = pickWhiteLeaningColor();
}

function createStars(): Star[] {
  return Array.from({ length: STAR_COUNT }, () => {
    const star = { x: 0, y: 0, z: 1, size: 1, brightness: 1, color: 0 };
    spawn(star, Math.random() * 0.94 + MIN_Z);
    return star;
  });
}

function createGlowSprite(color: Rgb): HTMLCanvasElement {
  const sprite = document.createElement("canvas");
  sprite.width = SPRITE_SIZE;
  sprite.height = SPRITE_SIZE;

  const ctx = sprite.getContext("2d");
  if (!ctx) {
    return sprite;
  }

  const half = SPRITE_SIZE / 2;
  const glow = ctx.createRadialGradient(half, half, 0, half, half, half);
  glow.addColorStop(0, rgba(color, 1));
  glow.addColorStop(0.12, rgba(color, 0.8));
  glow.addColorStop(0.35, rgba(color, 0.22));
  glow.addColorStop(0.7, rgba(color, 0.05));
  glow.addColorStop(1, rgba(color, 0));

  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, SPRITE_SIZE, SPRITE_SIZE);

  return sprite;
}

function fitCanvas(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D): Viewport {
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const targetWidth = Math.round(width * dpr);
  const targetHeight = Math.round(height * dpr);

  if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
    canvas.width = targetWidth;
    canvas.height = targetHeight;
  }

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, width, height);

  return { width, height };
}

function projectX(star: Star, view: Viewport, z: number) {
  return view.width / 2 + (star.x / z) * (view.width / 2);
}

function projectY(star: Star, view: Viewport, z: number) {
  return view.height / 2 + (star.y / z) * (view.height / 2);
}

function isOffscreen(x: number, y: number, view: Viewport) {
  const margin = 80;
  return (
    x < -margin || y < -margin || x > view.width + margin || y > view.height + margin
  );
}

function drawStar(
  ctx: CanvasRenderingContext2D,
  star: Star,
  view: Viewport,
  sprite: HTMLCanvasElement,
  trail: number
) {
  const x = projectX(star, view, star.z);
  const y = projectY(star, view, star.z);
  const proximity = Math.min(1 / star.z, 9);
  const radius = 0.3 + star.size * proximity * 0.32;
  const color = STAR_COLORS[star.color];
  const glowSize = radius * GLOW_SCALE * 2;

  ctx.globalAlpha = star.brightness * clamp((1 - star.z) * SPAWN_FADE);

  if (trail > 0.0005) {
    const behind = Math.min(1, star.z + trail);
    ctx.strokeStyle = rgba(color, 0.85);
    ctx.lineWidth = radius * 1.4;
    ctx.beginPath();
    ctx.moveTo(projectX(star, view, behind), projectY(star, view, behind));
    ctx.lineTo(x, y);
    ctx.stroke();
  }

  ctx.drawImage(sprite, x - glowSize / 2, y - glowSize / 2, glowSize, glowSize);

  ctx.fillStyle = rgba(color, 1);
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();

  return isOffscreen(x, y, view);
}

export function StarfieldBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (!canvas || !ctx) {
      return;
    }

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const stars = createStars();
    const sprites = STAR_COLORS.map(createGlowSprite);

    let frame = 0;
    let lastTime = 0;
    let lastScrollY = window.scrollY;
    let boost = 0;

    function render(elapsed: number) {
      if (!canvas || !ctx) {
        return;
      }

      const view = fitCanvas(canvas, ctx);
      const speed = motion.matches ? 0 : DRIFT_SPEED + boost;
      const step = speed * elapsed;
      const trail = step * TRAIL_FRAMES;

      ctx.lineCap = "round";

      for (const star of stars) {
        star.z -= step;
        const gone = drawStar(ctx, star, view, sprites[star.color], trail);

        if (star.z <= MIN_Z || gone) {
          spawn(star, 1);
        }
      }

      ctx.globalAlpha = 1;
    }

    function tick(now: number) {
      const elapsed = lastTime ? Math.min((now - lastTime) / 1000, 0.05) : 0;
      lastTime = now;
      boost *= 0.5 ** (elapsed / BOOST_HALF_LIFE);

      render(elapsed);

      if (motion.matches) {
        frame = 0;
        return;
      }

      frame = requestAnimationFrame(tick);
    }

    function start() {
      if (!frame) {
        lastTime = 0;
        frame = requestAnimationFrame(tick);
      }
    }

    function stop() {
      cancelAnimationFrame(frame);
      frame = 0;
    }

    function accelerate() {
      const travelled = Math.abs(window.scrollY - lastScrollY);
      lastScrollY = window.scrollY;
      boost = Math.min(MAX_BOOST, boost + travelled * BOOST_PER_PIXEL);
    }

    function syncToVisibility() {
      if (document.hidden) {
        stop();
      } else {
        start();
      }
    }

    window.addEventListener("scroll", accelerate, { passive: true });
    window.addEventListener("resize", start);
    document.addEventListener("visibilitychange", syncToVisibility);
    motion.addEventListener("change", start);
    start();

    return () => {
      stop();
      window.removeEventListener("scroll", accelerate);
      window.removeEventListener("resize", start);
      document.removeEventListener("visibilitychange", syncToVisibility);
      motion.removeEventListener("change", start);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 bg-[#080a0f]"
    >
      <canvas ref={canvasRef} tabIndex={-1} className="h-full w-full" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(8,10,15,0.8),transparent_75%)]" />
    </div>
  );
}
