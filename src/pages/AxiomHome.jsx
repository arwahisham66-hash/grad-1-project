import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  Activity, ArrowDown, ArrowRight, ArrowUpRight, Check, ChevronRight,
  Crosshair, FileText, Layers3, Mail, Route, ScanLine, ShieldCheck,
  Sparkles, UploadCloud, X, RotateCcw, Play, Pause,
} from "lucide-react";
import { FaFacebook, FaGithub, FaInstagram, FaLinkedin } from "react-icons/fa";
import organArtwork from "../assets/axiom-organs.png";
import ScrollOrganScene, { OrganCanvas } from "../components/ScrollOrganScene";
import { JourneyField, OrbitSignature, ScanSculpture, SpatialPipeline, useDepthMotion } from "../components/SpatialEffects";
import supervisorImg from "../assets/hanaaimage.jpeg";
import tawfekImg from "../assets/tawfikimage.jpeg";
import adhamImg from "../assets/adhamimage.jpeg";
import arwaImg from "../assets/arwaimage.jpeg";
import mariamImg from "../assets/maryamimage.jpeg";
import malakImg from "../assets/malakimage.jpeg";
import basmalaImg from "../assets/basmalaimage.jpeg";
import Dashboard from "./Dashboard";
import "./AxiomHome.css";


const reveal = { hidden: { opacity: 0, y: 36 }, visible: { opacity: 1, y: 0 } };
const viewport = { once: true, amount: 0.16 };

const members = [
  { img: tawfekImg, name: "Tawfek Mohamed", role: "AI Engineer" },
  { img: adhamImg, name: "Adham Osama", role: "AI Engineer" },
  { img: arwaImg, name: "Arwa Hisham", role: "Frontend Developer" },
  { img: mariamImg, name: "Mariam Salah", role: "Backend Developer" },
  { img: malakImg, name: "Malak Arfa", role: "Flutter Developer" },
  { img: basmalaImg, name: "Basmala Hashim", role: "Flutter Developer" },
];

const socialLinks = [
  { icon: FaLinkedin, label: "LinkedIn", href: "https://www.linkedin.com/in/taw7?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" },
  { icon: FaGithub, label: "GitHub", href: "https://github.com/TawfekMohamed-7" },
  { icon: FaInstagram, label: "Instagram", href: "https://www.instagram.com/taww_7?igsh=aHhweXE0Z2Q1eHlp" },
  { icon: FaFacebook, label: "Facebook", href: "https://www.facebook.com/share/1GbmVJwrdo/" },
];

function Reveal({ children, className = "", delay = 0 }) {
  const spatial = /feature-card|workflow-step|team-card|supervisor-card|upload-panel|contact-card/.test(className);
  const depth = useDepthMotion(spatial, className === "contact-card" ? 3 : 8);
  const reducedMotion = useReducedMotion();
  return (
    <motion.div {...depth} className={`${className}${spatial ? " depth-surface" : ""}`} variants={reveal} initial={reducedMotion ? false : "hidden"} whileInView="visible"
      viewport={viewport} transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  );
}

function AxiomHome() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const heroArtY = useTransform(scrollYProgress, [0, 0.28], [0, reducedMotion ? 0 : 130]);
  const heroDepth = useDepthMotion(true, 14);
  const consoleProgressRef = useRef(0);
  const [activeOrgan, setActiveOrgan] = useState("brain");
  const [visibleLayers, setVisibleLayers] = useState({ anatomy: true, region: true, trajectory: true });
  const [autoRotate, setAutoRotate] = useState(true);
  const [resetKey, setResetKey] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [contactSubmitting, setContactSubmitting] = useState(false);
  const [contactFeedback, setContactFeedback] = useState(null);

  useEffect(() => {
    document.title = "AXIOM — Surgical Intelligence";
  }, []);

  useEffect(() => {
    if (!location.hash) return;
    const timer = window.setTimeout(() => {
      document.getElementById(location.hash.slice(1))?.scrollIntoView();
    }, 200);
    return () => window.clearTimeout(timer);
  }, [location.hash]);

  useEffect(() => {
    if (!location.state?.scrollTo) return;
    const timer = window.setTimeout(() => {
      document.querySelector(location.state.scrollTo)?.scrollIntoView({ behavior: "smooth" });
    }, 120);
    return () => window.clearTimeout(timer);
  }, [location]);

  async function handleContactSubmit(event) {
    event.preventDefault();
    setContactFeedback(null);
    const name = contactName.trim();
    const email = contactEmail.trim();
    const message = contactMessage.trim();
    if (!name || !email || !message) {
      setContactFeedback({ type: "error", key: "error_fill" });
      return;
    }
    setContactSubmitting(true);
    try {
      const response = await fetch(CONTACT_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      const data = await response.json().catch(() => ({}));
      if (response.ok && data.success) {
        setContactFeedback({ type: "success", key: "success" });
        setContactName("");
        setContactEmail("");
        setContactMessage("");
      } else {
        const keyMap = {
          fill_fields: "error_fill", invalid_email: "error_email",
          payload_too_large: "error_too_long", email_not_configured: "error_config",
          send_failed: "error_generic",
        };
        setContactFeedback({ type: "error", key: keyMap[data.message] || "error_generic" });
      }
    } catch {
      setContactFeedback({ type: "error", key: "error_generic" });
    } finally {
      setContactSubmitting(false);
    }
  }

  const featureCards = [
    { icon: ScanLine, number: "01", key: "segmentation" },
    { icon: Layers3, number: "02", key: "reconstruction" },
    { icon: Route, number: "03", key: "optimization" },
  ];
  const workflowSteps = ["import", "map", "explore", "review"];

  return (
   <main className="axiom-site" dir="ltr">
      <JourneyField />
      <div className="ambient-grid" aria-hidden="true" />
      <motion.div className="scroll-progress" style={{ scaleX: scrollYProgress }} aria-hidden="true" />

      <section className="axiom-hero axiom-section" id="model">
        <div className="hero-orbit hero-orbit-one" aria-hidden="true" />
        <div className="hero-orbit hero-orbit-two" aria-hidden="true" />
        <div className="axiom-container hero-layout">
          <div className="hero-copy">
            <motion.div className="eyebrow" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <span className="live-dot" /> {t("axiom.hero.eyebrow")}
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.12 }}>
              {t("axiom.hero.line1")}<br /><span>{t("axiom.hero.line2")}</span>
            </motion.h1>
            <motion.p className="hero-description" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.25 }}>
              {t("axiom.hero.description")}
            </motion.p>
            <motion.div className="hero-actions" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.38 }}>
              <a className="button button-primary" href="#experience">{t("axiom.hero.cta")}<ArrowUpRight size={18} /></a>
              <a className="button button-outline" href="#overview">{t("axiom.hero.secondary")}<ArrowRight size={18} /></a>
            </motion.div>
            <motion.div className="hero-meta" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.7 }}>
              <span><Crosshair size={15} /> {t("axiom.hero.meta1")}</span>
              <span><Activity size={15} /> {t("axiom.hero.meta2")}</span>
            </motion.div>
          </div>

          <motion.div className="hero-visual" style={{ y: heroArtY }} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.2, delay: 0.15 }}>
            <motion.div className="hero-depth-object" {...heroDepth}>
            <div className="visual-glow" />
            <div className="visual-ring visual-ring-outer" />
            <div className="visual-ring visual-ring-inner" />
            <div className="visual-scanline" />
            <img src={organArtwork} alt={t("axiom.hero.artAlt")} className="organ-artwork" />
            <div className="hud-label hud-label-top"><span className="hud-marker" />{t("axiom.hero.hudTop")}</div>
            <div className="hud-label hud-label-bottom"><span className="hud-marker" />{t("axiom.hero.hudBottom")}</div>

            <div className="visual-corner visual-corner-tl" /><div className="visual-corner visual-corner-br" />
            </motion.div>
          </motion.div>
        </div>
        <div className="hero-bottom axiom-container">
          <a href="#overview" className="scroll-cue"><span>{t("axiom.hero.scroll")}</span><ArrowDown size={17} /></a>
          
        </div>
      </section>


      <section className="axiom-section overview-section" id="overview">
        <div className="axiom-container">
          <Reveal className="section-heading heading-split">
            <div><p className="section-kicker"><span>01 /</span> {t("axiom.overview.kicker")}</p><h2>{t("axiom.overview.title1")}<br /><em>{t("axiom.overview.title2")}</em></h2></div>
            <p>{t("axiom.overview.description")}</p>
          </Reveal>
          <div className="feature-grid">
            {featureCards.map(({ icon: Icon, number, key }, index) => (
              <Reveal className="feature-card" key={key} delay={index * 0.11}>
                <div className="feature-top"><span className="feature-icon"><Icon size={26} strokeWidth={1.5} /></span><span className="feature-number">{number} / 03</span></div>
                <div className={`feature-graphic feature-graphic-${key}`} aria-hidden="true"><span /><span /><span /></div>
                <h3>{t(`axiom.features.${key}.title`)}</h3>
                <p>{t(`axiom.features.${key}.text`)}</p>
                <span className="feature-arrow"><ArrowUpRight size={17} /></span>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <ScrollOrganScene />

      <section className="axiom-section planner-section" id="planner">
        <div className="axiom-container">
          <Reveal className="section-heading planner-heading">
            <p className="section-kicker"><span>03 /</span> {t("axiom.planner.kicker")}</p>
            <h2>{t("axiom.planner.title1")} <em>{t("axiom.planner.title2")}</em></h2>
            <p>{t("axiom.planner.description")}</p>
          </Reveal>
          <Reveal className="planner-console">
<div className="console-topbar">
  <div className="console-identity">
     {t("axiom.planner.console")}
  </div>
</div>
            <div className="console-body">
              <div className="console-sidebar">
                <div className="console-side-label">{t("axiom.planner.organ")}</div>
                <div className="organ-switch" role="tablist" aria-label={t("axiom.planner.organ")}>
                  {(["brain", "liver"]).map((organ) => <button key={organ} role="tab" aria-selected={activeOrgan === organ} className={activeOrgan === organ ? "selected" : ""} onClick={() => setActiveOrgan(organ)}><span className="organ-switch-icon">{organ === "brain" ? <Activity size={19} /> : <Layers3 size={19} />}</span>{t(`axiom.planner.${organ}`)}<ChevronRight size={16} /></button>)}
                </div>
                <div className="console-divider" />
                <div className="console-side-label">{t("axiom.planner.layers")}</div>
                <div className="layer-list">
                  {[{ key: "anatomy", color: "lime" }, { key: "region", color: "mint" }, { key: "trajectory", color: "white" }].map(({ key, color }, index) => (
                    <button key={key} type="button" aria-pressed={visibleLayers[key]} onClick={() => setVisibleLayers((previous) => ({ ...previous, [key]: !previous[key] }))}>
                      <i className={`layer-${color}`} />{t(`axiom.planner.layer${index + 1}`)}{visibleLayers[key] && <Check size={15} />}
                    </button>
                  ))}
                </div>
                
              </div>
              <div className={`console-stage focus-${activeOrgan}`} role="tabpanel" aria-label={t(`axiom.planner.${activeOrgan}Alt`)}>
                <div className="stage-grid" aria-hidden="true" /><div className="stage-crosshair" aria-hidden="true" />
                <div className="stage-topline"><span><span className="live-dot" /> {t("axiom.planner.view")}</span><span>AXIAL / 3D</span></div>
                <OrganCanvas progressRef={consoleProgressRef} reducedMotion={reducedMotion} organ={activeOrgan} layers={visibleLayers} autoRotate={autoRotate} resetKey={resetKey} />
                <div className="stage-controls">
                  <button type="button" aria-pressed={autoRotate} onClick={() => setAutoRotate((previous) => !previous)}>{autoRotate ? <Pause size={13} /> : <Play size={13} />}{t(autoRotate ? "axiom.spatial.pause" : "axiom.spatial.rotate")}</button>
                  <button type="button" onClick={() => setResetKey((previous) => previous + 1)}><RotateCcw size={13} />{t("axiom.spatial.reset")}</button>
                </div>
                <div className="stage-caption"><span>{t(`axiom.planner.${activeOrgan}`)} / 001</span><span>{t("axiom.spatial.drag")}</span></div>
              </div>
              <div className="console-insights">
                <div className="console-side-label">{t("axiom.planner.panelTitle")}</div>
                <div className="insight-card"><div><Crosshair size={18} /><span>{t("axiom.planner.insight1")}</span></div><p>{t("axiom.planner.insight1Text")}</p></div>
                <div className="insight-card"><div><ShieldCheck size={18} /><span>{t("axiom.planner.insight2")}</span></div><p>{t("axiom.planner.insight2Text")}</p></div>
                <div className="insight-card"><div><Route size={18} /><span>{t("axiom.planner.insight3")}</span></div><p>{t("axiom.planner.insight3Text")}</p></div>
                <a href="#home" className="console-next">{t("axiom.planner.next")}<ArrowUpRight size={17} /></a>
              </div>
            </div>
           
          </Reveal>
        </div>
      </section>

      <section className="axiom-section workflow-section" id="workflow">
        <div className="axiom-container">
          <Reveal className="section-heading heading-split"><div><p className="section-kicker"><span>04 /</span> {t("axiom.workflow.kicker")}</p><h2>{t("axiom.workflow.title1")}<br /><em>{t("axiom.workflow.title2")}</em></h2></div><p>{t("axiom.workflow.description")}</p></Reveal>
          <SpatialPipeline />
          <div className="workflow-grid">{workflowSteps.map((step, index) => <Reveal className="workflow-step" key={step} delay={index * 0.1}><div className="workflow-step-head"><span>0{index + 1}</span><ArrowUpRight size={19} /></div><div className="workflow-line"><span /></div><h3>{t(`axiom.workflow.${step}.title`)}</h3><p>{t(`axiom.workflow.${step}.text`)}</p></Reveal>)}</div>
        </div>
      </section>

      <section className="axiom-section" id="home">
  <div className="axiom-container">
    <Reveal>
     <p className="section-kicker">
  <span>05 /</span> 
</p>

      <Dashboard embedded />
    </Reveal>
  </div>
</section>

      <section className="axiom-section team-section" id="about"><div className="axiom-container"><Reveal className="section-heading heading-split"><div><p className="section-kicker"><span>06 /</span> {t("axiom.team.kicker")}</p><h2>{t("axiom.team.title1")}<br /><em>{t("axiom.team.title2")}</em></h2></div><p>{t("axiom.team.description")}</p></Reveal><Reveal className="supervisor-card"><img src={supervisorImg} alt="Prof. Dr. Hanaa Salem Marie" /><div><span>{t("axiom.team.supervised")}</span><h3>Prof. Dr. Hanaa Salem Marie</h3></div><span className="supervisor-decoration"><Sparkles size={22} /></span></Reveal><div className="team-grid">{members.map((member, index) => <Reveal className="team-card" key={member.name} delay={index * 0.06}><img src={member.img} alt={member.name} /><h3>{member.name}</h3><p>{member.role}</p></Reveal>)}</div></div></section>

      <section className="axiom-section contact-section" id="contact"><div className="axiom-container contact-layout"><Reveal className="contact-intro"><p className="section-kicker"><span>07 /</span> {t("axiom.contact.kicker")}</p><h2>{t("axiom.contact.title1")}<br /><em>{t("axiom.contact.title2")}</em></h2><p>{t("axiom.contact.description")}</p><div className="social-links">{socialLinks.map(({ icon: Icon, label, href }) => <a href={href} target="_blank" rel="noreferrer" key={label} aria-label={label}><Icon size={18} /></a>)}</div><OrbitSignature /></Reveal><Reveal className="contact-card" delay={0.14}><div className="contact-card-heading"><Mail size={20} /><span>{t("contact.send_message")}</span></div><form onSubmit={handleContactSubmit}><label>{t("axiom.contact.name")}<input type="text" value={contactName} onChange={(event) => setContactName(event.target.value)} placeholder={t("contact.name_placeholder")} required /></label><label>{t("axiom.contact.email")}<input type="email" value={contactEmail} onChange={(event) => setContactEmail(event.target.value)} placeholder={t("contact.email_placeholder")} required /></label><label>{t("axiom.contact.message")}<textarea rows="4" value={contactMessage} onChange={(event) => setContactMessage(event.target.value)} placeholder={t("contact.message_placeholder")} required /></label><button type="submit" className="button button-primary" disabled={contactSubmitting}>{contactSubmitting ? t("contact.sending") : t("contact.submit_button")}<ArrowUpRight size={18} /></button>{contactFeedback && <p className={`form-feedback ${contactFeedback.type}`} role="status">{t(`contact.${contactFeedback.key}`)}</p>}</form></Reveal></div></section>

      <footer className="axiom-footer">
  <div className="axiom-container footer-inner">
   

    <a href="#model" className="back-top">
      {t("axiom.footer.top")} <ArrowUpRight size={16} />
    </a>
  </div>
</footer>
    </main>
    
  );
}

export default AxiomHome;
