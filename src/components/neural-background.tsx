"use client";

import { useEffect, useRef } from "react";

type Particle = { x: number; y: number; vx: number; vy: number; phase: number };
type Packet = { ax: number; ay: number; bx: number; by: number; t: number };

const MIN_PARTICLES = 80;
const MAX_PARTICLES = 190;
const LINK_DISTANCE = 130;
const MOUSE_RADIUS = 170;
const MAX_PACKETS = 5;
const PACKET_SPEED = 0.012;
const PACKET_SPAWN_INTERVAL = 45;

export function NeuralBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const isDark = () => document.documentElement.classList.contains("dark");

    let width = 0;
    let height = 0;
    let dpr = 1;
    const mouse = { x: -9999, y: -9999 };
    let particles: Particle[] = [];
    let packets: Packet[] = [];
    let packetSpawnTimer = 0;
    let frame = 0;
    let rafId = 0;

    const resize = () => {
      const parent = canvas.parentElement;
      width = parent?.clientWidth ?? window.innerWidth;
      height = parent?.clientHeight ?? window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const initParticles = () => {
      const count = Math.round(
        Math.min(MAX_PARTICLES, Math.max(MIN_PARTICLES, (width * height) / 9000))
      );
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        phase: Math.random() * Math.PI * 2,
      }));
      packets = [];
    };

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const onMouseLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };

    const spawnPacket = () => {
      for (let attempt = 0; attempt < 10; attempt++) {
        const i = Math.floor(Math.random() * particles.length);
        const j = Math.floor(Math.random() * particles.length);
        if (i === j) continue;
        const a = particles[i];
        const b = particles[j];
        const dist = Math.hypot(a.x - b.x, a.y - b.y);
        if (dist < LINK_DISTANCE) {
          packets.push({ ax: a.x, ay: a.y, bx: b.x, by: b.y, t: 0 });
          return;
        }
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      const dark = isDark();
      const dotColor = dark ? "rgba(196, 181, 253, 0.7)" : "rgba(124, 58, 237, 0.55)";
      const lineColor = dark ? "139, 92, 246" : "124, 58, 237";
      const packetColor = dark ? "rgba(196, 181, 253, 0.95)" : "rgba(124, 58, 237, 0.85)";
      frame++;

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.hypot(dx, dy);
        if (dist < MOUSE_RADIUS) {
          const force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS;
          p.x += (dx / (dist || 1)) * force * 0.6;
          p.y += (dy / (dist || 1)) * force * 0.6;
        }
      }

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < LINK_DISTANCE) {
            ctx.strokeStyle = `rgba(${lineColor}, ${0.14 * (1 - dist / LINK_DISTANCE)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      if (!prefersReducedMotion) {
        packetSpawnTimer++;
        if (packetSpawnTimer > PACKET_SPAWN_INTERVAL && packets.length < MAX_PACKETS) {
          packetSpawnTimer = 0;
          spawnPacket();
        }

        packets = packets.filter((p) => p.t < 1);
        for (const p of packets) {
          p.t += PACKET_SPEED;
          const px = p.ax + (p.bx - p.ax) * p.t;
          const py = p.ay + (p.by - p.ay) * p.t;
          const fade = Math.sin(Math.min(p.t, 1) * Math.PI);
          ctx.fillStyle = packetColor;
          ctx.shadowColor = packetColor;
          ctx.shadowBlur = 8;
          ctx.globalAlpha = fade;
          ctx.beginPath();
          ctx.arc(px, py, 2, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = 1;
        }
      }

      ctx.fillStyle = dotColor;
      ctx.shadowColor = dotColor;
      ctx.shadowBlur = 6;
      for (const p of particles) {
        const radius = prefersReducedMotion ? 1.6 : 1.6 + Math.sin(frame * 0.02 + p.phase) * 0.5;
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.shadowBlur = 0;

      rafId = requestAnimationFrame(draw);
    };

    resize();
    initParticles();

    if (prefersReducedMotion) {
      draw();
    } else {
      rafId = requestAnimationFrame(draw);
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseleave", onMouseLeave);
    }

    const onResize = () => {
      resize();
      initParticles();
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0 h-full w-full"
    />
  );
}
