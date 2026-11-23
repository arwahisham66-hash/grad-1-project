import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { useTranslation } from "react-i18next";
import { makeBrain, makeLiver } from "./ScrollOrganScene";
import "./SpatialEffects.css";

export function useDepthMotion(enabled = true, intensity = 6) {
  const ref = useRef(null);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const pointerX = useSpring(0, { stiffness: 140, damping: 24 });
  const pointerY = useSpring(0, { stiffness: 140, damping: 24 });
  const scrollAngle = useTransform(scrollYProgress, [0, 0.5, 1], [5, 0, -5]);
  const rotateX = useTransform([scrollAngle, pointerX], ([scroll, pointer]) => scroll + pointer);
  const active = enabled && !reducedMotion;
  return {
    ref,
    style: active ? { transformPerspective: 1100, rotateX, rotateY: pointerY } : {},
    onPointerMove: (event) => {
      if (!active || event.pointerType === "touch") return;
      const rect = event.currentTarget.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      pointerX.set((0.5 - y) * intensity);
      pointerY.set((x - 0.5) * intensity);
      event.currentTarget.style.setProperty("--glare-x", `${x * 100}%`);
      event.currentTarget.style.setProperty("--glare-y", `${y * 100}%`);
    },
    onPointerLeave: () => { pointerX.set(0); pointerY.set(0); },
  };
}

export function JourneyField() {
  const mountRef = useRef(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount || reducedMotion) return undefined;
    let renderer;
    try { renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false, powerPreference: "low-power" }); }
    catch { return undefined; }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.25));
    mount.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(48, 1, 0.1, 70);
    camera.position.z = 12;

    const particles = new Float32Array(160 * 3);
    for (let i = 0; i < 160; i += 1) {
      particles[i * 3] = Math.sin(i * 137.3) * 12;
      particles[i * 3 + 1] = Math.cos(i * 89.7) * 8;
      particles[i * 3 + 2] = -Math.abs(Math.sin(i * 17.4)) * 9;
    }
    const particlesGeometry = new THREE.BufferGeometry();
    particlesGeometry.setAttribute("position", new THREE.BufferAttribute(particles, 3));
    const field = new THREE.Points(particlesGeometry, new THREE.PointsMaterial({ color: 0xb9ff8c, size: 0.024, transparent: true, opacity: 0.55, sizeAttenuation: true }));
    scene.add(field);

    const orbit = new THREE.Group();
    for (let i = 0; i < 3; i += 1) {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(3.2 + i * 0.38, 0.006, 3, 100), new THREE.MeshBasicMaterial({ color: 0x9be079, transparent: true, opacity: 0.18 - i * 0.035 }));
      ring.rotation.set(0.7 + i * 0.5, 0.3 + i * 0.65, i * 0.4);
      orbit.add(ring);
    }
    scene.add(orbit);
    const floor = new THREE.GridHelper(36, 36, 0x426c3c, 0x233e25);
    floor.position.set(0, -4, -3);
    floor.material.transparent = true;
    floor.material.opacity = 0.22;
    scene.add(floor);

    const brain = makeBrain().group;
    const liver = makeLiver().group;
    const replacedMaterials = new Set();
    [brain, liver].forEach((group) => group.traverse((object) => {
      if (object.userData.layer && object.userData.layer !== "anatomy") object.visible = false;
      if (object.material) (Array.isArray(object.material) ? object.material : [object.material]).forEach((material) => replacedMaterials.add(material));
      if (object.isMesh) {
        object.material = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false });
        if (object.geometry.type === "TubeGeometry") object.visible = false;
      }
      if (object.isLineSegments) {
        object.material = new THREE.LineBasicMaterial({ color: 0xb1f28d, transparent: true, opacity: 0.12, depthWrite: false });
      }
    }));
    replacedMaterials.forEach((material) => material.dispose());
    scene.add(brain, liver);

    const ids = ["model", "overview", "experience", "planner", "workflow", "home", "about", "contact"];
    const frames = [
      { x: 5, y: -0.7, scale: 1.1, organ: 0 }, { x: 5.6, y: 1.6, scale: 1.7, organ: 0 },
      { x: -6.5, y: -1, scale: 0.8, organ: 0 }, { x: -6, y: 1.5, scale: 1.5, organ: 1 },
      { x: 5.8, y: 1.2, scale: 1.6, organ: 0 }, { x: -5.5, y: -1.3, scale: 1.7, organ: 1 },
      { x: 6.2, y: 1.8, scale: 1.5, organ: 0 }, { x: -4.8, y: -0.7, scale: 1.6, organ: 1 },
    ];
    let sections = [];
    let scroll = window.scrollY;
    let pointer = { x: 0, y: 0 };
    let width = window.innerWidth;
    const measure = () => {
      width = window.innerWidth;
      renderer.setSize(width, window.innerHeight, false);
      camera.aspect = width / window.innerHeight;
      camera.updateProjectionMatrix();
      sections = ids.map((id) => {
        const element = document.getElementById(id);
        return element ? element.getBoundingClientRect().top + window.scrollY : 0;
      });
    };
    measure();
    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(document.querySelector(".axiom-site"));
    const onScroll = () => { scroll = window.scrollY; };
    const onPointer = (event) => { pointer = { x: event.clientX / window.innerWidth - 0.5, y: event.clientY / window.innerHeight - 0.5 }; };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("resize", measure);
    let frame;
    let lastTime = 0;
    const render = (time) => {
      frame = window.requestAnimationFrame(render);
      if (document.hidden || time - lastTime < (width < 700 ? 50 : 32)) return;
      lastTime = time;
      const center = scroll + window.innerHeight * 0.35;
      let index = 0;
      sections.forEach((top, i) => { if (center >= top) index = i; });
      const next = Math.min(index + 1, frames.length - 1);
      const amount = next === index ? 0 : THREE.MathUtils.smoothstep(center, sections[index], sections[next]);
      const from = frames[index];
      const to = frames[next];
      const x = THREE.MathUtils.lerp(from.x, to.x, amount);
      const y = THREE.MathUtils.lerp(from.y, to.y, amount);
      const scale = THREE.MathUtils.lerp(from.scale, to.scale, amount);
      const current = amount < 0.5 ? from : to;
      brain.visible = current.organ === 0;
      liver.visible = current.organ === 1;
      [brain, liver].forEach((group) => {
        group.position.set(x, y, -3);
        group.scale.setScalar(width < 700 ? scale * 0.72 : scale);
        group.rotation.set(scroll * 0.00012 + pointer.y * 0.12, scroll * 0.0004 + pointer.x * 0.2, -0.1);
      });
      orbit.position.set(x * 0.55, y * 0.4, -4);
      orbit.rotation.set(scroll * 0.00012, scroll * 0.00017, time * 0.000018);
      field.rotation.y = scroll * 0.00005 + pointer.x * 0.06;
      field.position.y = Math.sin(scroll * 0.0006) * 0.8;
      camera.position.x = THREE.MathUtils.lerp(camera.position.x, pointer.x * 0.25, 0.06);
      camera.position.y = THREE.MathUtils.lerp(camera.position.y, -pointer.y * 0.2, 0.06);
      floor.position.z = -3 + (scroll % 220) / 110;
      renderer.render(scene, camera);
    };
    frame = window.requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("resize", measure);
      scene.traverse((object) => {
        object.geometry?.dispose();
        if (object.material) (Array.isArray(object.material) ? object.material : [object.material]).forEach((material) => material.dispose());
      });
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, [reducedMotion]);
  return <div className="journey-field" ref={mountRef} aria-hidden="true" />;
}

function ScanPlane({ index, progress, reducedMotion }) {
  const z = useTransform(progress, [0, 0.55, 1], [index * 9, index * 37, index * 18]);
  const x = useTransform(progress, [0, 0.5, 1], [0, index * 5, 0]);
  return <motion.div className="scan-plane" style={{ z: reducedMotion ? index * 22 : z, x: reducedMotion ? 0 : x }}><svg viewBox="0 0 220 180" aria-hidden="true"><path d="M109 28C83 12 40 32 33 63C12 87 29 129 54 133C68 158 99 153 110 142C126 158 161 151 170 134C196 124 199 82 182 65C177 35 137 14 109 28Z" /><path d="M110 30V143M49 64Q75 43 97 63M126 62Q151 44 171 66M42 88Q69 70 98 90M124 88Q151 71 180 92M52 116Q76 96 98 117M127 115Q152 99 170 119" /><circle cx="143" cy="81" r="12" /></svg><i className="scan-cross" /><span>{String(index + 1).padStart(2, "0")}</span></motion.div>;
}

export function ScanSculpture({ compact = false }) {
  const depth = useDepthMotion(true, 13);
  const { scrollYProgress } = useScroll({ target: depth.ref, offset: ["start end", "end start"] });
  const turn = useTransform(scrollYProgress, [0, 0.5, 1], [-32, -18, 12]);
  const reducedMotion = useReducedMotion();
  return <div className={`scan-sculpture ${compact ? "is-compact" : ""}`} aria-hidden="true"><motion.div className="scan-assembly" {...depth}><motion.div className="scan-planes" style={{ rotateY: reducedMotion ? -18 : turn, rotateX: 57, rotateZ: -12 }}>{[0, 1, 2, 3, 4].map((index) => <ScanPlane key={index} index={index} progress={scrollYProgress} reducedMotion={reducedMotion} />)}</motion.div></motion.div><div className="scan-shadow" /><span className="sculpture-coordinate">AXM / VOLUME STACK</span></div>;
}

export function SpatialPipeline() {
  const { t } = useTranslation();
  const depth = useDepthMotion(true, 4);
  return <motion.div className="spatial-pipeline" {...depth}>
    <div className="pipeline-station"><ScanSculpture compact /><span>01 / {t("axiom.workflow.import.title")}</span></div>
    <div className="pipeline-connector" aria-hidden="true"><i /><i /><i /></div>
    <div className="pipeline-station"><div className="voxel-system" aria-hidden="true">{Array.from({ length: 9 }, (_, index) => <i key={index} style={{ "--voxel": index }} />)}</div><span>02 / {t("axiom.workflow.map.title")}</span></div>
    <div className="pipeline-connector" aria-hidden="true"><i /><i /><i /></div>
    <div className="pipeline-station"><div className="path-system" aria-hidden="true"><i /><i /><i /><b /><span /></div><span>03 / {t("axiom.workflow.review.title")}</span></div>
  </motion.div>;
}

export function OrbitSignature() {
  const depth = useDepthMotion(true, 15);

  return (
    <motion.div
      className="orbit-signature"
      {...depth}
      aria-hidden="true"
    >
      <div className="signature-core">✳</div>
      <i />
      <i />
      <i />
      <span className="signature-dot" />
    </motion.div>
  );
}
