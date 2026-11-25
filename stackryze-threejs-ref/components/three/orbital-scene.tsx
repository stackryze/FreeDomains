"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

type OrbitalSceneProps = {
  className?: string;
};

/**
 * Lightweight capability check — runs synchronously.
 * Returns true only when a real WebGL context can be created.
 */
function hasWebGL(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl2") ||
      canvas.getContext("webgl") ||
      canvas.getContext("experimental-webgl");
    return !!gl;
  } catch {
    return false;
  }
}

export function OrbitalScene({ className }: OrbitalSceneProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [supported, setSupported] = useState<boolean | null>(null);

  // Capability check (sync, runs in effect before renderer is built)
  useEffect(() => {
    setSupported(hasWebGL());
  }, []);

  useEffect(() => {
    if (supported !== true) return;
    const container = containerRef.current;
    if (!container) return;

    // Respect reduced motion
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
        failIfMajorPerformanceCaveat: false,
      });
    } catch (err) {
      // WebGL context creation can fail synchronously.
      console.warn(
        "[OrbitalScene] WebGL unavailable, falling back to static art:",
        err,
      );
      setSupported(false);
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // Listen for async context-loss events and bail out cleanly.
    const handleContextLost = (e: Event) => {
      e.preventDefault();
      console.warn("[OrbitalScene] WebGL context lost");
      cancelAnimationFrame(raf);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      setSupported(false);
    };
    renderer.domElement.addEventListener(
      "webglcontextlost",
      handleContextLost,
      { passive: false },
    );

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100,
    );
    camera.position.set(0, 0, 7.5);

    // Lights
    const ambient = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambient);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.2);
    keyLight.position.set(5, 5, 5);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xffffff, 0.4);
    rimLight.position.set(-5, -3, -4);
    scene.add(rimLight);

    // Read theme tokens; three.js accepts modern CSS color strings.
    const computed = getComputedStyle(document.documentElement);
    const primaryCol =
      computed.getPropertyValue("--primary").trim() || "#222";
    const signalCol =
      computed.getPropertyValue("--signal").trim() || "#7af0a0";
    const mutedCol =
      computed.getPropertyValue("--muted-foreground").trim() || "#888";

    const centralMaterial = new THREE.MeshStandardMaterial({
      color: primaryCol,
      roughness: 0.35,
      metalness: 0.4,
    });

    const central = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.4, 4),
      centralMaterial,
    );
    scene.add(central);

    // Wireframe overlay
    const wire = new THREE.LineSegments(
      new THREE.WireframeGeometry(new THREE.IcosahedronGeometry(1.42, 2)),
      new THREE.LineBasicMaterial({
        color: mutedCol,
        transparent: true,
        opacity: 0.18,
      }),
    );
    scene.add(wire);

    // Orbital rings + satellites
    const orbits: {
      ring: THREE.Line;
      sat: THREE.Mesh;
      speed: number;
      tilt: number;
      radius: number;
    }[] = [];

    const orbitConfigs = [
      { radius: 2.4, size: 0.18, speed: 0.35, tilt: 0.1, color: signalCol },
      { radius: 3.2, size: 0.13, speed: 0.22, tilt: -0.25, color: mutedCol },
      { radius: 4.1, size: 0.16, speed: 0.14, tilt: 0.35, color: primaryCol },
    ];

    orbitConfigs.forEach((cfg) => {
      const ringGeo = new THREE.BufferGeometry();
      const pts: number[] = [];
      for (let i = 0; i <= 128; i++) {
        const a = (i / 128) * Math.PI * 2;
        pts.push(Math.cos(a) * cfg.radius, 0, Math.sin(a) * cfg.radius);
      }
      ringGeo.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(pts, 3),
      );
      const ring = new THREE.Line(
        ringGeo,
        new THREE.LineBasicMaterial({
          color: cfg.color,
          transparent: true,
          opacity: 0.25,
        }),
      );
      ring.rotation.x = cfg.tilt;
      scene.add(ring);

      const sat = new THREE.Mesh(
        new THREE.SphereGeometry(cfg.size, 24, 24),
        new THREE.MeshStandardMaterial({
          color: cfg.color,
          roughness: 0.2,
          metalness: 0.5,
        }),
      );
      scene.add(sat);

      orbits.push({
        ring,
        sat,
        speed: cfg.speed,
        tilt: cfg.tilt,
        radius: cfg.radius,
      });
    });

    // Star field
    const starGeo = new THREE.BufferGeometry();
    const starCount = 600;
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      const r = 18 + Math.random() * 18;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      starPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      starPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      starPos[i * 3 + 2] = r * Math.cos(phi);
    }
    starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({
      color: mutedCol,
      size: 0.04,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.6,
    });
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    // Pointer parallax
    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
    const onPointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      pointer.tx = ((e.clientX - rect.left) / rect.width - 0.5) * 0.5;
      pointer.ty = ((e.clientY - rect.top) / rect.height - 0.5) * 0.5;
    };
    container.addEventListener("pointermove", onPointerMove);

    // Resize
    const onResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    const ro = new ResizeObserver(onResize);
    ro.observe(container);

    let raf = 0;
    let isVisible = true;
    const clock = new THREE.Clock();

    // Pause rendering when the scene is off-screen. The WebGL context
    // keeps state, so we just stop scheduling frames until visible again.
    // This is the single biggest scroll-perf win — the GPU can focus
    // on compositing the page instead of re-rendering the 3D scene.
    const visibilityObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          isVisible = entry.isIntersecting;
        }
      },
      { rootMargin: "100px" },
    );
    visibilityObserver.observe(container);

    const animate = () => {
      if (!isVisible) {
        raf = requestAnimationFrame(animate);
        return;
      }
      const dt = clock.getDelta();
      const t = clock.elapsedTime;

      if (!prefersReduced) {
        pointer.x += (pointer.tx - pointer.x) * 0.05;
        pointer.y += (pointer.ty - pointer.y) * 0.05;

        central.rotation.y += dt * 0.18;
        central.rotation.x += dt * 0.05;
        wire.rotation.y = central.rotation.y;
        wire.rotation.x = central.rotation.x;

        orbits.forEach((o) => {
          o.ring.rotation.z += dt * o.speed * 0.5;
          const angle = t * o.speed;
          o.sat.position.x = Math.cos(angle) * o.radius;
          o.sat.position.z = Math.sin(angle) * o.radius;
          o.sat.position.y = Math.sin(angle) * 0.3;
          o.sat.rotation.y += dt * 1.2;
        });

        stars.rotation.y += dt * 0.01;
      }

      camera.position.x = pointer.x * 0.6;
      camera.position.y = -pointer.y * 0.6;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      visibilityObserver.disconnect();
      ro.disconnect();
      container.removeEventListener("pointermove", onPointerMove);
      renderer.domElement.removeEventListener(
        "webglcontextlost",
        handleContextLost,
      );
      renderer.dispose();
      central.geometry.dispose();
      centralMaterial.dispose();
      wire.geometry.dispose();
      (wire.material as THREE.Material).dispose();
      starGeo.dispose();
      starMat.dispose();
      orbits.forEach((o) => {
        o.ring.geometry.dispose();
        (o.ring.material as THREE.Material).dispose();
        o.sat.geometry.dispose();
        (o.sat.material as THREE.Material).dispose();
      });
      if (renderer.domElement.parentElement === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [supported]);

  if (supported === false) {
    return <FallbackArt className={className} />;
  }

  return (
    <div
      ref={containerRef}
      className={className}
      aria-hidden
    />
  );
}

/**
 * Static fallback — pure CSS/SVG orbital diagram shown when WebGL is
 * unavailable (sandboxed iframes, headless browsers, or disabled GPUs).
 * Preserves the hero layout so the page never looks broken.
 */
function FallbackArt({ className }: { className?: string }) {
  return (
    <div
      className={className}
      aria-hidden
      role="presentation"
    >
      <svg
        viewBox="0 0 400 400"
        className="h-full w-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <radialGradient id="core" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.9" />
            <stop offset="60%" stopColor="currentColor" stopOpacity="0.4" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Concentric orbits */}
        <ellipse
          cx="200"
          cy="200"
          rx="96"
          ry="32"
          fill="none"
          stroke="currentColor"
          strokeOpacity="0.18"
          strokeWidth="1"
          transform="rotate(-12 200 200)"
        />
        <ellipse
          cx="200"
          cy="200"
          rx="128"
          ry="44"
          fill="none"
          stroke="currentColor"
          strokeOpacity="0.14"
          strokeWidth="1"
          transform="rotate(20 200 200)"
        />
        <ellipse
          cx="200"
          cy="200"
          rx="160"
          ry="56"
          fill="none"
          stroke="currentColor"
          strokeOpacity="0.10"
          strokeWidth="1"
          transform="rotate(-32 200 200)"
        />

        {/* Satellites */}
        <circle cx="296" cy="200" r="4" fill="currentColor" opacity="0.7" />
        <circle cx="328" cy="200" r="3" fill="currentColor" opacity="0.5" />
        <circle cx="360" cy="200" r="3.5" fill="currentColor" opacity="0.6" />

        {/* Central icosahedron-ish core */}
        <circle cx="200" cy="200" r="56" fill="url(#core)" />
        <polygon
          points="200,160 232,180 232,220 200,240 168,220 168,180"
          fill="none"
          stroke="currentColor"
          strokeOpacity="0.6"
          strokeWidth="1.2"
        />
        <polygon
          points="200,176 220,188 220,212 200,224 180,212 180,188"
          fill="none"
          stroke="currentColor"
          strokeOpacity="0.3"
          strokeWidth="1"
        />
      </svg>
    </div>
  );
}
