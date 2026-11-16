"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { detailedServices, DetailedService } from "@/config/services";
import { pricingConfig } from "@/config/pricing";
import { buildWhatsAppOrderUrl } from "@/lib/whatsapp";
import { Check, ArrowRight, X, Sparkles, ExternalLink, MessageSquare } from "lucide-react";

export function Interactive3DShowcase() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [selectedService, setSelectedService] = useState<DetailedService>(detailedServices[0]);
  const [activeModalService, setActiveModalService] = useState<DetailedService | null>(null);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  // References for Three.js objects
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const modelGroupRef = useRef<THREE.Group | null>(null);
  const mousePosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const handleOrder3DWhatsApp = (service: DetailedService) => {
    const pricing = pricingConfig[service.pricingKey];
    const firstTier = pricing?.tiers?.[0];
    const url = buildWhatsAppOrderUrl({
      serviceName: service.title,
      packageName: firstTier?.label || "3D Interactive Showcase Order",
      price: firstTier?.price,
    });
    window.open(url, "_blank", "noopener,noreferrer");
  };

  // Function to build 3D mesh based on service ID
  const buildObjectMesh = useCallback((serviceId: string): THREE.Group => {
    const group = new THREE.Group();

    // Studio Materials
    const crimsonMat = new THREE.MeshStandardMaterial({
      color: 0xc81e32,
      roughness: 0.3,
      metalness: 0.2,
    });
    const whiteMat = new THREE.MeshStandardMaterial({
      color: 0xf8f9fa,
      roughness: 0.2,
      metalness: 0.1,
    });
    const darkMetalMat = new THREE.MeshStandardMaterial({
      color: 0x1e2229,
      roughness: 0.25,
      metalness: 0.8,
    });
    const screenMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.1,
      metalness: 0.05,
      emissive: 0x111111,
    });
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xeab308,
      roughness: 0.3,
      metalness: 0.7,
    });

    if (serviceId === "notes-and-records") {
      // 3D Academic Notebook
      const coverGeom = new THREE.BoxGeometry(2.2, 3.0, 0.1);
      const coverBack = new THREE.Mesh(coverGeom, crimsonMat);
      const coverFront = new THREE.Mesh(coverGeom, whiteMat);
      coverFront.position.z = 0.2;

      const pagesGeom = new THREE.BoxGeometry(2.0, 2.8, 0.18);
      const pages = new THREE.Mesh(pagesGeom, whiteMat);
      pages.position.z = 0.1;

      // Ribbon bookmark
      const ribbonGeom = new THREE.BoxGeometry(0.12, 1.4, 0.02);
      const ribbon = new THREE.Mesh(ribbonGeom, crimsonMat);
      ribbon.position.set(0, -1.5, 0.15);

      group.add(coverBack, pages, coverFront, ribbon);
    } else if (serviceId === "powerpoint-presentations") {
      // 3D Laptop with presentation slides
      const baseGeom = new THREE.BoxGeometry(3.2, 0.12, 2.2);
      const base = new THREE.Mesh(baseGeom, darkMetalMat);

      const screenGeom = new THREE.BoxGeometry(3.1, 2.0, 0.08);
      const screenHousing = new THREE.Mesh(screenGeom, darkMetalMat);
      screenHousing.position.set(0, 1.0, -1.05);
      screenHousing.rotation.x = -0.2;

      const slideGeom = new THREE.PlaneGeometry(2.8, 1.7);
      const slide = new THREE.Mesh(slideGeom, screenMat);
      slide.position.set(0, 1.0, -1.0);
      slide.rotation.x = -0.2;

      // Decorative slide graph line
      const barGeom = new THREE.BoxGeometry(0.25, 0.8, 0.02);
      const bar1 = new THREE.Mesh(barGeom, crimsonMat);
      bar1.position.set(-0.6, 0.9, -0.98);
      bar1.rotation.x = -0.2;

      const bar2 = new THREE.Mesh(new THREE.BoxGeometry(0.25, 1.2, 0.02), crimsonMat);
      bar2.position.set(-0.2, 1.1, -0.98);
      bar2.rotation.x = -0.2;

      group.add(base, screenHousing, slide, bar1, bar2);
    } else if (serviceId === "academic-project-assistance") {
      // 3D Technical Project Model (Robotic Rover Module)
      const chassis = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.6, 1.8), darkMetalMat);

      // 4 Wheels
      const wheelGeom = new THREE.CylinderGeometry(0.45, 0.45, 0.25, 16);
      wheelGeom.rotateZ(Math.PI / 2);

      const w1 = new THREE.Mesh(wheelGeom, crimsonMat);
      w1.position.set(1.3, -0.15, 0.8);
      const w2 = new THREE.Mesh(wheelGeom, crimsonMat);
      w2.position.set(-1.3, -0.15, 0.8);
      const w3 = new THREE.Mesh(wheelGeom, crimsonMat);
      w3.position.set(1.3, -0.15, -0.8);
      const w4 = new THREE.Mesh(wheelGeom, crimsonMat);
      w4.position.set(-1.3, -0.15, -0.8);

      // Sensor turret
      const turret = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.4, 0.5, 16), whiteMat);
      turret.position.set(0, 0.55, 0);

      // Radar eyes
      const eye1 = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.2, 12), crimsonMat);
      eye1.rotateX(Math.PI / 2);
      eye1.position.set(0.2, 0.65, 0.3);

      const eye2 = eye1.clone();
      eye2.position.set(-0.2, 0.65, 0.3);

      group.add(chassis, w1, w2, w3, w4, turret, eye1, eye2);
    } else if (serviceId === "project-documentation") {
      // Organized Research Documents
      for (let i = 0; i < 4; i++) {
        const sheet = new THREE.Mesh(new THREE.BoxGeometry(2.0, 2.7, 0.04), whiteMat);
        sheet.position.set(i * 0.12 - 0.2, -i * 0.1, i * 0.1 - 0.2);
        sheet.rotation.z = (i - 1.5) * 0.08;
        group.add(sheet);
      }
      // Red document binder clip
      const clip = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.6, 0.5), crimsonMat);
      clip.position.set(-0.9, 1.1, 0.1);
      group.add(clip);
    } else if (serviceId === "custom-magazines") {
      // Rotating Hardcover Magazine
      const coverFront = new THREE.Mesh(new THREE.BoxGeometry(2.3, 3.1, 0.06), whiteMat);
      coverFront.position.z = 0.1;
      const pages = new THREE.Mesh(new THREE.BoxGeometry(2.2, 3.0, 0.16), whiteMat);
      const spine = new THREE.Mesh(new THREE.BoxGeometry(0.12, 3.1, 0.2), crimsonMat);
      spine.position.x = -1.15;

      const titleStripe = new THREE.Mesh(new THREE.PlaneGeometry(1.8, 0.5), crimsonMat);
      titleStripe.position.set(0, 0.9, 0.14);

      group.add(coverFront, pages, spine, titleStripe);
    } else {
      // Web Development Monitor
      const monitor = new THREE.Mesh(new THREE.BoxGeometry(3.4, 2.2, 0.12), darkMetalMat);
      monitor.position.y = 0.5;

      const screen = new THREE.Mesh(new THREE.PlaneGeometry(3.1, 1.9), screenMat);
      screen.position.set(0, 0.5, 0.07);

      const stand = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1.0), darkMetalMat);
      stand.position.set(0, -0.6, 0);

      const base = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 0.06, 24), darkMetalMat);
      base.position.set(0, -1.1, 0);

      group.add(monitor, screen, stand, base);
    }

    return group;
  }, []);

  // Initialize Three.js scene
  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 7.5);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.shadowMap.enabled = true;
    rendererRef.current = renderer;

    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    // Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.2);
    keyLight.position.set(5, 7, 6);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xc81e32, 1.5);
    rimLight.position.set(-6, -3, -4);
    scene.add(rimLight);

    const fillLight = new THREE.DirectionalLight(0xfff5f5, 0.6);
    fillLight.position.set(0, -5, 5);
    scene.add(fillLight);

    // Initial Model Group
    const modelGroup = buildObjectMesh(selectedService.id);
    scene.add(modelGroup);
    modelGroupRef.current = modelGroup;

    // Mouse Tracking for Interactive 3D Orbit
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mousePosRef.current = { x, y };
    };
    container.addEventListener("mousemove", handleMouseMove);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      if (modelGroupRef.current) {
        // Floating motion
        modelGroupRef.current.position.y = Math.sin(elapsedTime * 1.5) * 0.12;

        // Interactive tilt based on mouse position
        const targetRotY = elapsedTime * 0.4 + mousePosRef.current.x * 0.6;
        const targetRotX = mousePosRef.current.y * 0.4;

        modelGroupRef.current.rotation.y += (targetRotY - modelGroupRef.current.rotation.y) * 0.05;
        modelGroupRef.current.rotation.x += (targetRotX - modelGroupRef.current.rotation.x) * 0.05;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      container.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
      container.innerHTML = "";
    };
  }, [buildObjectMesh, selectedService.id]);

  // Handle service selection change
  const selectService = (service: DetailedService) => {
    setSelectedService(service);
    if (sceneRef.current && modelGroupRef.current) {
      sceneRef.current.remove(modelGroupRef.current);
      const newMesh = buildObjectMesh(service.id);
      newMesh.scale.set(0.7, 0.7, 0.7);
      sceneRef.current.add(newMesh);
      modelGroupRef.current = newMesh;

      // Animate scale up
      let scale = 0.7;
      const growInterval = setInterval(() => {
        scale += 0.05;
        if (scale >= 1.0) {
          scale = 1.0;
          clearInterval(growInterval);
        }
        newMesh.scale.set(scale, scale, scale);
      }, 16);
    }
  };

  const currentPricing = pricingConfig[selectedService.pricingKey];

  return (
    <section className="relative py-20 sm:py-28 bg-white overflow-hidden border-b border-zinc-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold tracking-wider uppercase mb-4">
            02 • Interactive 3D Showcase
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-zinc-900 tracking-tight">
            Explore Each Discipline <br />
            <span className="text-red-600">in Real-Time 3D.</span>
          </h2>
          <p className="mt-3 text-base sm:text-lg text-zinc-600 font-normal">
            Interact with our three-dimensional service models. Move your cursor to rotate each object,
            preview exact specifications, and explore package options.
          </p>
        </div>

        {/* Showcase Grid: Selector + Interactive Canvas + Live Detail Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Interactive Service Selector Pills (4 Cols) */}
          <div className="lg:col-span-4 flex flex-col gap-2.5">
            <span className="text-xs font-bold uppercase tracking-widest text-zinc-600 mb-1">
              Select 3D Service
            </span>
            {detailedServices.map((service, idx) => {
              const isSelected = selectedService.id === service.id;
              return (
                <button
                  key={service.id}
                  onClick={() => selectService(service)}
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                  className={`group w-full text-left p-4 rounded-2xl border transition-all duration-200 flex items-center justify-between ${
                    isSelected
                      ? "bg-zinc-900 text-white border-zinc-900 shadow-md translate-x-1"
                      : "bg-white text-zinc-800 border-zinc-200/90 hover:border-red-500/50 hover:bg-zinc-50/80"
                  }`}
                >
                  <div className="flex flex-col">
                    <span
                      className={`text-xs font-bold tracking-wider uppercase ${
                        isSelected ? "text-red-400" : "text-zinc-600"
                      }`}
                    >
                      {service.category}
                    </span>
                    <span className="font-bold text-sm sm:text-base mt-0.5">
                      {service.title}
                    </span>
                    <span
                      className={`text-[11px] mt-1 line-clamp-1 ${
                        isSelected ? "text-zinc-300" : "text-zinc-600"
                      }`}
                    >
                      3D Object: {service.threeDObject}
                    </span>
                  </div>

                  <div
                    className={`h-7 w-7 rounded-full flex items-center justify-center shrink-0 ml-3 transition-colors ${
                      isSelected
                        ? "bg-red-600 text-white"
                        : "bg-zinc-100 text-zinc-400 group-hover:bg-red-50 group-hover:text-red-600"
                    }`}
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Middle Column: Interactive Three.js 3D Viewport (5 Cols) */}
          <div className="lg:col-span-5 relative flex flex-col items-center justify-center">
            <div className="relative w-full h-[360px] sm:h-[420px] rounded-3xl bg-radial from-white via-zinc-50 to-zinc-100 border border-zinc-200/80 shadow-inner flex items-center justify-center overflow-hidden">
              {/* Three.js Canvas Mount */}
              <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

              {/* 3D Model Badge Overlay */}
              <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md border border-zinc-200/60 shadow-xs pointer-events-none">
                <Sparkles className="w-3 h-3 text-red-600" />
                <span className="text-[11px] font-bold tracking-wider text-zinc-700 uppercase">
                  {selectedService.threeDObject}
                </span>
              </div>

              {/* Hover rotation prompt */}
              <div className="absolute bottom-4 z-10 px-3 py-1 rounded-full bg-white/80 backdrop-blur-md border border-zinc-200/60 text-[10px] font-medium text-zinc-500 pointer-events-none">
                Move cursor to rotate • 3D Studio Lighting
              </div>
            </div>
          </div>

          {/* Right Column: Live Service Details & Pricing Card (3 Cols) */}
          <div className="lg:col-span-3 flex flex-col rounded-3xl bg-zinc-900 text-white p-6 sm:p-7 shadow-xl border border-zinc-800">
            <span className="text-xs font-bold tracking-widest text-red-400 uppercase">
              {selectedService.category}
            </span>
            <h3 className="mt-1 text-xl font-bold tracking-tight text-white">
              {selectedService.title}
            </h3>

            <p className="mt-3 text-xs sm:text-sm text-zinc-300 leading-relaxed font-normal">
              {selectedService.description}
            </p>

            {/* Pricing Section */}
            {currentPricing && (
              <div className="mt-5 pt-4 border-t border-zinc-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                    Pricing Model
                  </span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-red-950/80 text-red-400 border border-red-800/60">
                    {currentPricing.pricingType}
                  </span>
                </div>

                <div className="flex flex-col gap-2 mt-2">
                  {currentPricing.tiers?.map((t, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between text-xs bg-zinc-800/60 px-3 py-2 rounded-xl"
                    >
                      <span className="text-zinc-300">{t.label}</span>
                      <span className="font-bold text-red-400">{t.price}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div className="mt-6 flex flex-col gap-2.5">
              <button
                onClick={() => handleOrder3DWhatsApp(selectedService)}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>ORDER ON WHATSAPP</span>
              </button>

              <button
                onClick={() => setActiveModalService(selectedService)}
                className="w-full text-center py-2 text-xs font-semibold text-zinc-400 hover:text-white transition-colors flex items-center justify-center gap-1"
              >
                <span>View Full Specifications</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Detail Modal when CTA clicked */}
      {activeModalService && (
        <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
          <div className="relative w-full max-w-2xl rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-zinc-200 max-h-[90vh] overflow-y-auto">
            {/* Close button */}
            <button
              onClick={() => setActiveModalService(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-700 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="text-xs font-bold tracking-widest text-red-600 uppercase">
              {activeModalService.category}
            </span>
            <h3 className="mt-1 text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight">
              {activeModalService.title}
            </h3>

            <p className="mt-3 text-sm text-zinc-600 leading-relaxed">
              {activeModalService.description}
            </p>

            {/* Features */}
            <div className="mt-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-3">
                Key Deliverables & Specifications
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {activeModalService.features.map((feat, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-zinc-700 font-medium">
                    <Check className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Pricing */}
            {pricingConfig[activeModalService.pricingKey] && (
              <div className="mt-6 p-4 rounded-2xl bg-zinc-50 border border-zinc-200">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-700">
                  Pricing Details ({pricingConfig[activeModalService.pricingKey].pricingType})
                </span>
                <p className="text-xs text-zinc-500 mt-0.5 mb-3">
                  {pricingConfig[activeModalService.pricingKey].summary}
                </p>
                <div className="flex flex-col gap-2">
                  {pricingConfig[activeModalService.pricingKey].tiers?.map((tier, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between bg-white px-3.5 py-2.5 rounded-xl border border-zinc-200/80 text-xs"
                    >
                      <span className="font-medium text-zinc-800">{tier.label}</span>
                      <span className="font-extrabold text-red-600">{tier.price}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Modal CTA */}
            <div className="mt-8 flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={() => {
                  const s = activeModalService;
                  setActiveModalService(null);
                  handleOrder3DWhatsApp(s);
                }}
                className="w-full sm:w-auto flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl text-center shadow-md transition-colors text-sm flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                <span>ORDER NOW ON WHATSAPP (+91 9492801206)</span>
              </button>

              <button
                onClick={() => setActiveModalService(null)}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-zinc-200 text-zinc-700 hover:bg-zinc-100 font-semibold text-sm transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
