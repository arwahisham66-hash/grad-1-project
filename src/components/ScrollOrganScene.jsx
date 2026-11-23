import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { motion, useMotionValueEvent, useReducedMotion, useScroll } from "framer-motion";
import { useTranslation } from "react-i18next";
import { ArrowDownRight, Crosshair, Move3D, ScanLine } from "lucide-react";
import organArtwork from "../assets/axiom-organs.png";
import "./ScrollOrganScene.css";

const smoothstep = (a, b, value) => {
  const x = THREE.MathUtils.clamp((value - a) / (b - a), 0, 1);
  return x * x * (3 - 2 * x);
};

function addShell(group, geometry, material, position, scale) {
  const shell = new THREE.Mesh(geometry, material);
  shell.userData.layer = "anatomy";
  shell.position.set(...position);
  shell.scale.set(...scale);
  const contour = new THREE.LineSegments(
    new THREE.WireframeGeometry(geometry),
    new THREE.LineBasicMaterial({ color: 0xa9ff72, transparent: true, opacity: 0.12 })
  );
  shell.add(contour);
  group.add(shell);
  return shell;
}

function addTube(group, points, color = 0x9dff72, opacity = 0.65, radius = 0.012, layer = "anatomy") {
  const curve = new THREE.CatmullRomCurve3(points.map((point) => new THREE.Vector3(...point)));
  const tube = new THREE.Mesh(
    new THREE.TubeGeometry(curve, 48, radius, 6, false),
    new THREE.MeshBasicMaterial({ color, transparent: true, opacity })
  );
  tube.userData.layer = layer;
  group.add(tube);
  return tube;
}

function addTarget(group, x, y, z) {
  const dot = new THREE.Mesh(
    new THREE.SphereGeometry(0.075, 16, 12),
    new THREE.MeshBasicMaterial({ color: 0xd4ff80 })
  );
  dot.position.set(x, y, z);
  dot.userData.layer = "region";
  group.add(dot);
  const halo = new THREE.Mesh(
    new THREE.TorusGeometry(0.22, 0.012, 8, 50),
    new THREE.MeshBasicMaterial({ color: 0xb9ff66, transparent: true, opacity: 0.8 })
  );
  halo.position.set(x, y, z);
  halo.userData.layer = "region";
  group.add(halo);
  return halo;
}

export function makeBrain() {
  const group = new THREE.Group();
  const tissue = new THREE.MeshPhysicalMaterial({
    color: 0x173721, metalness: 0.42, roughness: 0.36, clearcoat: 0.8,
    emissive: 0x1c4b27, emissiveIntensity: 0.28, transparent: true, opacity: 0.95,
  });
  const sphere = new THREE.SphereGeometry(1, 28, 20);
  addShell(group, sphere, tissue, [-0.62, 0.18, 0], [1.05, 1.03, 0.82]);
  addShell(group, sphere, tissue, [0.62, 0.18, 0], [1.05, 1.03, 0.82]);
  addShell(group, sphere, tissue, [-0.62, -0.62, -0.1], [0.78, 0.58, 0.7]);
  addShell(group, sphere, tissue, [0.62, -0.62, -0.1], [0.78, 0.58, 0.7]);
  addShell(group, sphere, tissue, [0, -1.06, -0.16], [0.66, 0.4, 0.6]);
  addShell(group, new THREE.CylinderGeometry(0.18, 0.25, 0.88, 20), tissue, [0, -1.58, -0.28], [1, 1, 1]);

  for (const side of [-1, 1]) {
    const centerX = side * 0.62;
    for (let row = 0; row < 7; row += 1) {
      const lat = -0.85 + row * 0.28;
      const ringRadius = Math.sqrt(Math.max(0.1, 1 - lat * lat));
      const points = [];
      for (let step = 0; step <= 24; step += 1) {
        const angle = Math.PI * (0.1 + (step / 24) * 0.8);
        const wobble = 0.04 * Math.sin(step * 1.35 + row * 2.1);
        points.push([
          centerX + (ringRadius * 1.05 + wobble) * Math.cos(angle),
          0.18 + lat * 1.03 + 0.035 * Math.sin(angle * 8 + row),
          (ringRadius * 0.82 + wobble) * Math.sin(angle) + 0.025,
        ]);
      }
      addTube(group, points, 0x9cff75, 0.46, 0.009);
    }
  }
  addTube(group, [[2.05, 1.1, 0.8], [1.65, 0.75, 1.02], [0.95, 0.38, 1.03], [0.48, 0.08, 1.0]], 0xc7ff6d, 0.9, 0.014, "trajectory");
  const target = addTarget(group, 0.48, 0.08, 1.02);
  return { group, target };
}

export function makeLiver() {
  const group = new THREE.Group();
  const shape = new THREE.Shape();
  shape.moveTo(-1.65, 0.13);
  shape.bezierCurveTo(-1.45, 0.8, -0.54, 0.91, 0.05, 0.65);
  shape.bezierCurveTo(0.62, 0.83, 1.26, 0.51, 1.68, 0.28);
  shape.bezierCurveTo(1.86, 0.1, 1.56, -0.32, 1.18, -0.39);
  shape.bezierCurveTo(0.81, -0.48, 0.62, -0.2, 0.35, -0.35);
  shape.bezierCurveTo(-0.08, -0.72, -0.77, -0.83, -1.34, -0.57);
  shape.bezierCurveTo(-1.68, -0.43, -1.79, -0.13, -1.65, 0.13);
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: 0.48, bevelEnabled: true, bevelSegments: 5,
    bevelSize: 0.2, bevelThickness: 0.2, steps: 1, curveSegments: 20,
  });
  geometry.center();
  const tissue = new THREE.MeshPhysicalMaterial({
    color: 0x143922, metalness: 0.4, roughness: 0.31, clearcoat: 0.9,
    emissive: 0x1e512a, emissiveIntensity: 0.28, transparent: true, opacity: 0.96,
  });
  const liver = new THREE.Mesh(geometry, tissue);
  liver.userData.layer = "anatomy";
  liver.rotation.x = -0.15;
  const edges = new THREE.LineSegments(
    new THREE.EdgesGeometry(geometry, 35),
    new THREE.LineBasicMaterial({ color: 0xb9ff66, transparent: true, opacity: 0.65 })
  );
  liver.add(edges);
  group.add(liver);
  addTube(group, [[-1.2, 0.27, 0.42], [-0.7, 0.1, 0.46], [-0.24, -0.14, 0.49], [0.38, -0.13, 0.5], [1.2, 0.18, 0.42]], 0x79ed9c, 0.65, 0.019);
  addTube(group, [[-0.3, -0.13, 0.49], [-0.15, 0.23, 0.52], [0.18, 0.45, 0.46]], 0x79ed9c, 0.55, 0.012);
  addTube(group, [[0.38, -0.13, 0.5], [0.6, -0.4, 0.45], [0.98, -0.43, 0.39]], 0x79ed9c, 0.55, 0.012);
  addTube(group, [[1.95, 1.05, 0.75], [1.48, 0.65, 0.65], [0.87, 0.12, 0.56], [0.32, -0.14, 0.55]], 0xc7ff6d, 0.9, 0.014, "trajectory");
  const target = addTarget(group, 0.32, -0.14, 0.58);
  return { group, target };
}

const defaultLayers = { anatomy: true, region: true, trajectory: true };

export function OrganCanvas({ progressRef, reducedMotion, organ = null, layers = defaultLayers, autoRotate = false, resetKey = 0 }) {
  const { t } = useTranslation();
  const mountRef = useRef(null);
  const pointerRef = useRef({ x: 0, y: 0 });
  const dragRef = useRef({ active: false, x: 0, y: 0, yaw: 0, pitch: 0 });
  const settingsRef = useRef({ organ, layers, autoRotate, resetKey });
  settingsRef.current = { organ, layers, autoRotate, resetKey };
  const [fallback, setFallback] = useState(false);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return undefined;
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "low-power" });
    } catch {
      setFallback(true);
      return undefined;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.8));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(43, 1, 0.1, 100);
    camera.position.set(0, 0, 7.4);
    scene.add(new THREE.AmbientLight(0x8cd29a, 1.5));
    const keyLight = new THREE.DirectionalLight(0xb9ff8e, 3.5);
    keyLight.position.set(-2, 3, 5);
    scene.add(keyLight);
    const rimLight = new THREE.DirectionalLight(0x44d99a, 2.2);
    rimLight.position.set(3, -1, -3);
    scene.add(rimLight);

    const brain = makeBrain();
    const liver = makeLiver();
    scene.add(brain.group, liver.group);
    const orbit = new THREE.Mesh(
      new THREE.TorusGeometry(2.17, 0.008, 4, 120),
      new THREE.MeshBasicMaterial({ color: 0x8bdb76, transparent: true, opacity: 0.29 })
    );
    orbit.rotation.x = 0.28;
    scene.add(orbit);

    const resize = () => {
      const width = Math.max(1, mount.clientWidth);
      const height = Math.max(1, mount.clientHeight);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(mount);
    let visible = true;
    const visibilityObserver = new IntersectionObserver((entries) => {
      visible = entries[0]?.isIntersecting ?? true;
    }, { rootMargin: "180px" });
    visibilityObserver.observe(mount);

    let frame;
    let current = progressRef.current;
    let pointerX = 0;
    let pointerY = 0;
    let appliedLayers = null;
    let appliedReset = settingsRef.current.resetKey;
    let idleAngle = 0;
    let previousTime = 0;
    const animate = (time) => {
      const settings = settingsRef.current;
      const targetProgress = settings.organ ? (settings.organ === "liver" ? 1 : 0) : progressRef.current;
      const elapsed = Math.min((time - previousTime) / 1000 || 0, 0.05);
      previousTime = time;
      if (!visible || document.hidden) {
        current = targetProgress;
        frame = window.requestAnimationFrame(animate);
        return;
      }
      if (appliedLayers !== settings.layers) {
        [brain.group, liver.group].forEach((group) => group.traverse((object) => {
          if (object.userData.layer) object.visible = settings.layers[object.userData.layer] !== false;
        }));
        appliedLayers = settings.layers;
      }
      if (appliedReset !== settings.resetKey) {
        dragRef.current.yaw = 0;
        dragRef.current.pitch = 0;
        idleAngle = 0;
        appliedReset = settings.resetKey;
      }
      if (settings.autoRotate && !reducedMotion && !dragRef.current.active) idleAngle += elapsed * 0.13;
      current = THREE.MathUtils.lerp(current, targetProgress, reducedMotion ? 1 : 0.065);
      pointerX = THREE.MathUtils.lerp(pointerX, pointerRef.current.x, 0.05);
      pointerY = THREE.MathUtils.lerp(pointerY, pointerRef.current.y, 0.05);
      const transition = smoothstep(0.28, 0.72, current);
      brain.group.position.x = -transition * 5.2;
      liver.group.position.x = (1 - transition) * 5.2;
      const yaw = dragRef.current.yaw + idleAngle + (reducedMotion ? 0 : pointerX * 0.22);
      const pitch = dragRef.current.pitch - (reducedMotion ? 0 : pointerY * 0.15);
      brain.group.rotation.y = -0.3 + current * 2.1 + yaw;
      brain.group.rotation.x = 0.12 + current * 0.38 + pitch;
      liver.group.rotation.y = -0.65 + current * 1.45 + yaw;
      liver.group.rotation.x = -0.18 + current * 0.24 + pitch;
      const floatAmount = reducedMotion ? 0 : Math.sin(time * 0.00065) * 0.07;
      brain.group.position.y = floatAmount;
      liver.group.position.y = -floatAmount;
      brain.target.scale.setScalar(reducedMotion ? 1 : 1 + Math.sin(time * 0.003) * 0.1);
      liver.target.scale.setScalar(reducedMotion ? 1 : 1 + Math.sin(time * 0.003) * 0.1);
      orbit.rotation.z = current * Math.PI * 0.7 + (reducedMotion ? 0 : time * 0.00006);
      orbit.scale.setScalar(1 + 0.08 * Math.sin(current * Math.PI));
      renderer.render(scene, camera);
      frame = window.requestAnimationFrame(animate);
    };
    frame = window.requestAnimationFrame(animate);

    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      visibilityObserver.disconnect();
      scene.traverse((object) => {
        if (object.geometry) object.geometry.dispose();
        if (object.material) {
          (Array.isArray(object.material) ? object.material : [object.material]).forEach((material) => material.dispose());
        }
      });
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, [progressRef, reducedMotion]);

  const handlePointerMove = (event) => {
    const rect = mountRef.current?.getBoundingClientRect();
    if (!rect) return;
    if (dragRef.current.active) {
      dragRef.current.yaw += (event.clientX - dragRef.current.x) * 0.008;
      dragRef.current.pitch = THREE.MathUtils.clamp(dragRef.current.pitch + (event.clientY - dragRef.current.y) * 0.006, -0.7, 0.7);
      dragRef.current.x = event.clientX;
      dragRef.current.y = event.clientY;
    }
    pointerRef.current = {
      x: ((event.clientX - rect.left) / rect.width - 0.5) * 2,
      y: ((event.clientY - rect.top) / rect.height - 0.5) * 2,
    };
  };

  return (
    <div className="immersive-render" onPointerMove={handlePointerMove} tabIndex={organ ? 0 : undefined} role={organ ? "group" : undefined} aria-label={organ ? t("axiom.spatial.keyboard") : undefined}
      onKeyDown={(event) => {
        if (!organ || !["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) return;
        event.preventDefault();
        if (event.key === "ArrowLeft") dragRef.current.yaw -= 0.15;
        if (event.key === "ArrowRight") dragRef.current.yaw += 0.15;
        if (event.key === "ArrowUp") dragRef.current.pitch = Math.max(-0.7, dragRef.current.pitch - 0.1);
        if (event.key === "ArrowDown") dragRef.current.pitch = Math.min(0.7, dragRef.current.pitch + 0.1);
      }}
      onPointerDown={(event) => {
        if (event.pointerType === "mouse" && event.button !== 0) return;
        dragRef.current.active = true;
        dragRef.current.x = event.clientX;
        dragRef.current.y = event.clientY;
        event.currentTarget.setPointerCapture(event.pointerId);
      }}
      onPointerUp={() => { dragRef.current.active = false; }}
      onPointerCancel={() => { dragRef.current.active = false; }}
      onLostPointerCapture={() => { dragRef.current.active = false; }}
      onPointerLeave={() => { pointerRef.current = { x: 0, y: 0 }; }}>
      <div className="immersive-canvas" ref={mountRef} aria-hidden="true" />
      {fallback && <img className="immersive-fallback" src={organArtwork} alt="" />}
    </div>
  );
}

function ScrollOrganScene() {
  const { t } = useTranslation();
  const sectionRef = useRef(null);
  const progressRef = useRef(0);
  const reducedMotion = useReducedMotion();
  const [phase, setPhase] = useState(0);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    progressRef.current = latest;
    const nextPhase = latest < 0.32 ? 0 : latest < 0.7 ? 1 : 2;
    setPhase((previous) => previous === nextPhase ? previous : nextPhase);
  });

  const phases = ["brain", "transition", "liver"];
  return (
    <section className="immersive-section axiom-section" id="experience" ref={sectionRef}>
      <div className="immersive-sticky">
        <div className="immersive-grid" aria-hidden="true" />
        <div className="axiom-container immersive-layout">
          <div className="immersive-copy">
            <p className="section-kicker"><span>02 /</span> {t("axiom.experience.kicker")}</p>
            <div className="immersive-title" aria-live="polite">
              <motion.div key={phases[phase]} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
                <div className="immersive-phase"><span className="live-dot" /> {t(`axiom.experience.${phases[phase]}.label`)}</div>
                <h2>{t(`axiom.experience.${phases[phase]}.title1`)}<br /><em>{t(`axiom.experience.${phases[phase]}.title2`)}</em></h2>
                <p>{t(`axiom.experience.${phases[phase]}.text`)}</p>
              </motion.div>
            </div>
            <div className="immersive-footer-copy"><Move3D size={17} /><span>{t("axiom.experience.hint")}</span></div>
          </div>
          <div className="immersive-view">
            <div className="immersive-view-glow" aria-hidden="true" />
            <OrganCanvas progressRef={progressRef} reducedMotion={reducedMotion} />
            <div className="immersive-hud immersive-hud-top"><ScanLine size={15} /> {t("axiom.experience.view")}</div>
            <div className="immersive-hud immersive-hud-bottom"><Crosshair size={15} /> {t("axiom.experience.target")}</div>
            <span className="immersive-axis immersive-axis-x">X</span><span className="immersive-axis immersive-axis-y">Y</span>
          </div>
        </div>
        <div className="axiom-container immersive-bottom"><div className="immersive-track"><motion.span style={{ scaleX: scrollYProgress }} /></div><div className="immersive-step-list"><span className={phase === 0 ? "active" : ""}>01 / {t("axiom.planner.brain")}</span><span className={phase === 1 ? "active" : ""}>02 / {t("axiom.experience.transition.short")}</span><span className={phase === 2 ? "active" : ""}>03 / {t("axiom.planner.liver")}</span></div><a href="#planner">{t("axiom.experience.continue")} <ArrowDownRight size={16} /></a></div>
      </div>
    </section>
  );
}

export default ScrollOrganScene;
