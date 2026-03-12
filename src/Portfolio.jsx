import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon, ExternalLink, AlertCircle, GitBranch, Star, Award, Briefcase, MapPin, Calendar, Rocket } from "lucide-react";
import { FaInstagram, FaLinkedin, FaTwitter, FaMedium, FaGithub, FaYoutube, FaDribbble } from "react-icons/fa";
import { SiCoursera } from "react-icons/si";
import { loadStore, DEFAULTS } from "./data/portfolioStore";

const SOCIAL_ICON_MAP = {
  Instagram: FaInstagram,
  LinkedIn: FaLinkedin,
  Twitter: FaTwitter,
  Medium: FaMedium,
  YouTube: FaYoutube,
  Dribbble: FaDribbble,
};



const CATEGORY_COLORS = {
  Lang: "border-sky-500/40 bg-sky-500/10 text-sky-300",
  Data: "border-violet-500/40 bg-violet-500/10 text-violet-300",
  ML: "border-cyan-500/40  bg-cyan-500/10  text-cyan-300",
  Web: "border-emerald-500/40 bg-emerald-500/10 text-emerald-300",
  Math: "border-amber-500/40 bg-amber-500/10 text-amber-300",
};

// ─── Framer Motion variants ─────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.55, delay: i * 0.07, ease: "easeOut" },
  }),
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

// ─── Sub-Components ─────────────────────────────────────────────────────────
function NavLink({ href, children }) {
  return (
    <a
      href={href}
      className="text-sm font-medium text-neutral-400 hover:text-cyan-400 transition-colors duration-200"
    >
      {children}
    </a>
  );
}

function SectionHeading({ children }) {
  return (
    <div className="mb-10">
      <motion.h2
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="text-3xl font-bold font-[Outfit] gradient-text inline-block"
      >
        {children}
      </motion.h2>
      <div className="mt-2 h-0.5 w-12 rounded-full bg-cyan-500/60" />
    </div>
  );
}

function SkeletonCard() {
  return <div className="skeleton h-28 w-full" />;
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function Portfolio() {
  const [store, setStore] = useState(DEFAULTS);
  const [storeLoaded, setStoreLoaded] = useState(false);
  const { profile, socials, skills: SKILLS, education, experience: EXPERIENCE, certifications: CERTIFICATIONS, currentProject: CURRENT_PROJECT, repoVisibility } = store;
  const GITHUB_USERNAME = profile.githubUsername;
  const REPO_VISIBILITY = Object.fromEntries(repoVisibility.map((r) => [r.name.toLowerCase(), r.visible]));

  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "dark"
  );
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);
  const [currentProjectLangs, setCurrentProjectLangs] = useState([]);

  // Load portfolio data
  useEffect(() => {
    loadStore().then((d) => { setStore(d); setStoreLoaded(true); });
  }, []);

  // Apply theme class + persist
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.classList.toggle("light", theme === "light");
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Navbar shadow on scroll
  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Fetch languages for current project repo
  useEffect(() => {
    if (!storeLoaded) return;
    let mounted = true;
    async function fetchLangs() {
      try {
        const repoName = CURRENT_PROJECT.url.split("/").slice(-2).join("/");
        const res = await fetch(`https://api.github.com/repos/${repoName}/languages`);
        if (!res.ok) return;
        const data = await res.json();
        if (mounted) setCurrentProjectLangs(Object.keys(data));
      } catch { /* ignore */ }
    }
    fetchLangs();
    return () => { mounted = false; };
  }, [storeLoaded]);

  // Fetch GitHub repos
  useEffect(() => {
    if (!storeLoaded) return;
    let mounted = true;
    async function fetchRepos() {
      try {
        setLoading(true);
        setError(false);
        const res = await fetch(
          `https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`
        );
        if (!res.ok) throw new Error("API error");
        const data = await res.json();
        if (!mounted) return;
        const filtered = Array.isArray(data)
          ? data.filter((r) => REPO_VISIBILITY[r.name.toLowerCase()] === true)
          : [];
        setRepos(filtered);
      } catch {
        if (mounted) setError(true);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    fetchRepos();
    return () => { mounted = false; };
  }, [storeLoaded]);

  const toggleTheme = () =>
    setTheme((t) => (t === "dark" ? "light" : "dark"));

  const isDark = theme === "dark";

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? "bg-[#0a0c12] text-white" : "bg-[#f0f4f8] text-[#1a202c]"}`}>

      {/* ── Navbar ─────────────────────────────────────────────────── */}
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 nav-bg
          backdrop-blur-md border-b
          ${navScrolled
            ? isDark ? "bg-[#0a0c12]/80 border-neutral-800/80 shadow-lg shadow-black/30"
              : "bg-[#f0f4f8]/80 border-neutral-200/80 shadow-md"
            : isDark ? "bg-transparent border-transparent"
              : "bg-transparent border-transparent"
          }`}
      >
        <div className="max-w-6xl mx-auto flex justify-between items-center px-6 py-4">
          <span className="text-lg font-bold font-[Outfit] gradient-text tracking-tight">
            {profile.name}
          </span>

          <div className="flex items-center gap-6">
            <div className="hidden sm:flex items-center gap-6">
              <NavLink href="#about">About</NavLink>
              <NavLink href="#skills">Skills</NavLink>
              <NavLink href="#education">Education</NavLink>
              {EXPERIENCE.length > 0 && <NavLink href="#experience">Experience</NavLink>}
              <NavLink href="#certifications">Certifications</NavLink>
              <NavLink href="#current">Current</NavLink>
              <NavLink href="#filmmaking">Filmmaking</NavLink>
              <NavLink href="#projects">Projects</NavLink>
              <NavLink href="#contact">Contact</NavLink>
            </div>

            <span className={`px-3 py-1 text-xs rounded-full border font-medium
              ${isDark ? "bg-neutral-900/80 border-neutral-700 text-neutral-400"
                : "bg-white border-neutral-300 text-neutral-500"}`}>
              {loading ? "..." : error ? "?" : `${repos.length}`} repos
            </span>

            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className={`p-2 rounded-full transition-all duration-200
                ${isDark ? "bg-neutral-800 hover:bg-neutral-700 text-neutral-300"
                  : "bg-white hover:bg-neutral-100 text-neutral-600 shadow-sm"}`}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={theme}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {isDark ? <Sun size={15} /> : <Moon size={15} />}
                </motion.div>
              </AnimatePresence>
            </button>
          </div>
        </div>
      </nav>

      <main className="pt-20">
        {/* ── Hero ───────────────────────────────────────────────────── */}
        <section className="relative h-[85vh] flex flex-col justify-center items-center text-center px-6 overflow-hidden">
          {/* Animated ambient orbs */}
          <div className="orb orb-1" />
          <div className="orb orb-2" />
          <div className="orb orb-3" />

          {/* Location badge */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={`mb-6 flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium border
              ${isDark ? "bg-neutral-900/60 border-neutral-700/60 text-neutral-400"
                : "bg-white/80 border-neutral-300 text-neutral-500 shadow-sm"}`}
          >
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            {profile.location}
          </motion.div>

          {/* Name */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-5xl md:text-7xl font-extrabold font-[Outfit] gradient-text leading-tight mb-4"
          >
            {profile.name}
          </motion.h1>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45 }}
            className={`text-lg md:text-xl max-w-xl leading-relaxed mb-8
              ${isDark ? "text-neutral-400" : "text-neutral-600"}`}
          >
            {profile.tagline}
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-wrap gap-4 justify-center"
          >
            <a
              href="#projects"
              className="px-6 py-2.5 rounded-full text-sm font-semibold bg-cyan-500 hover:bg-cyan-400 text-black transition-all duration-200 shadow-lg shadow-cyan-500/30 hover:shadow-cyan-400/40"
            >
              View Projects
            </a>
            <a
              href="#contact"
              className={`px-6 py-2.5 rounded-full text-sm font-semibold border transition-all duration-200
                ${isDark ? "border-neutral-700 text-neutral-300 hover:border-cyan-500 hover:text-cyan-400"
                  : "border-neutral-400 text-neutral-700 hover:border-cyan-500 hover:text-cyan-600"}`}
            >
              Get in Touch
            </a>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
          >
            <span className={`text-xs ${isDark ? "text-neutral-600" : "text-neutral-400"}`}>scroll</span>
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              className="w-0.5 h-5 rounded bg-cyan-500/50"
            />
          </motion.div>
        </section>

        {/* ── About ──────────────────────────────────────────────────── */}
        <section id="about" className="max-w-4xl mx-auto px-6 py-20">
          <SectionHeading>About Me</SectionHeading>
          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className={`text-base md:text-lg leading-relaxed ${isDark ? "text-neutral-400" : "text-neutral-600"}`}
          >
            {profile.aboutText}
          </motion.p>
        </section>

        {/* ── Skills ─────────────────────────────────────────────────── */}
        <section id="skills" className={`py-20 ${isDark ? "bg-[#0d0f18]" : "bg-white/60"}`}>
          <div className="max-w-6xl mx-auto px-6">
            <SectionHeading>Skills</SectionHeading>
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3"
            >
              {SKILLS.map((skill, i) => (
                <motion.div
                  key={skill.name}
                  variants={fadeUp}
                  custom={i}
                  className={`skill-pill rounded-xl px-4 py-3 border text-center text-sm font-medium cursor-default
                    ${CATEGORY_COLORS[skill.category]}
                    ${isDark ? "" : "bg-white/70 border-neutral-200 text-neutral-700"}`}
                >
                  {skill.name}
                  <div className="mt-1 text-[10px] opacity-60 font-normal">{skill.category}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── Education ──────────────────────────────────────────────── */}
        <section id="education" className="max-w-4xl mx-auto px-6 py-20">
          <SectionHeading>Education</SectionHeading>
          <div className="space-y-4">
            {education.map((edu, i) => (
              <motion.div
                key={edu.degree}
                variants={fadeUp}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className={`glow-card surface-card rounded-2xl p-5 border flex gap-4
                  ${isDark ? "bg-[#131620] border-neutral-800" : "bg-white border-neutral-200"}`}
              >
                <div className="timeline-dot mt-1.5" />
                <div>
                  <div className="font-semibold text-base">{edu.degree}</div>
                  <div className={`text-sm mt-0.5 ${isDark ? "text-neutral-400" : "text-neutral-500"}`}>
                    {edu.school} · {edu.location}
                  </div>
                  <div className="mt-1.5 inline-block text-xs px-2.5 py-0.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 font-medium">
                    {edu.years}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── Experience (only renders when EXPERIENCE array has entries) ── */}
        {EXPERIENCE.length > 0 && (
          <section id="experience" className={`py-20 ${isDark ? "bg-[#0d0f18]" : "bg-white/60"}`}>
            <div className="max-w-4xl mx-auto px-6">
              <SectionHeading>Work Experience</SectionHeading>
              <div className="space-y-5">
                {EXPERIENCE.map((job, i) => (
                  <motion.div
                    key={`${job.company}-${i}`}
                    variants={fadeUp}
                    custom={i}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className={`glow-card surface-card rounded-2xl p-6 border
                      ${isDark ? "bg-[#131620] border-neutral-800" : "bg-white border-neutral-200"}`}
                  >
                    {/* Header */}
                    <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <Briefcase size={15} className="text-cyan-500" />
                          <span className="font-semibold text-base">{job.title}</span>
                        </div>
                        <div className={`flex items-center gap-3 mt-1 text-sm
                          ${isDark ? "text-neutral-400" : "text-neutral-500"}`}>
                          {job.url ? (
                            <a href={job.url} target="_blank" rel="noreferrer"
                              className="hover:text-cyan-400 transition-colors font-medium">
                              {job.company}
                            </a>
                          ) : (
                            <span className="font-medium">{job.company}</span>
                          )}
                          <span className="flex items-center gap-1">
                            <MapPin size={11} /> {job.location}
                          </span>
                        </div>
                      </div>
                      <span className={`flex items-center gap-1.5 text-xs px-3 py-1 rounded-full border flex-shrink-0
                        ${isDark ? "bg-neutral-800 border-neutral-700 text-neutral-400"
                          : "bg-neutral-100 border-neutral-200 text-neutral-500"}`}>
                        <Calendar size={11} /> {job.from} – {job.to}
                      </span>
                    </div>

                    {/* Bullet points */}
                    {job.bullets?.length > 0 && (
                      <ul className="space-y-1.5 mt-3">
                        {job.bullets.map((b, bi) => (
                          <li key={bi} className={`flex items-start gap-2 text-sm
                            ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
                            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-cyan-500 flex-shrink-0" />
                            {b}
                          </li>
                        ))}
                      </ul>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Certifications ─────────────────────────────────────────── */}
        <section id="certifications" className="max-w-4xl mx-auto px-6 py-20">
          <SectionHeading>Certifications</SectionHeading>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid gap-4 sm:grid-cols-2"
          >
            {CERTIFICATIONS.map((cert, i) => (
              <motion.a
                key={cert.url}
                variants={fadeUp}
                custom={i}
                href={cert.url}
                target="_blank"
                rel="noreferrer"
                className={`glow-card group surface-card rounded-2xl p-6 border flex flex-col gap-3
                  ${isDark ? "bg-[#131620] border-neutral-800" : "bg-white border-neutral-200"}`}
              >
                {/* Header row */}
                <div className="flex items-center justify-between">
                  <div className={`flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-full border
                    ${cert.platform === "coursera"
                      ? "bg-[#0056d2]/15 border-[#0056d2]/40 text-[#4d9fff]"
                      : "bg-cyan-500/10 border-cyan-500/30 text-cyan-400"
                    }`}>
                    {cert.platform === "coursera" ? <SiCoursera size={13} /> : <Award size={13} />}
                    {cert.issuer}
                  </div>
                  <ExternalLink
                    size={14}
                    className={`opacity-0 group-hover:opacity-100 transition-opacity
                      ${isDark ? "text-neutral-500" : "text-neutral-400"}`}
                  />
                </div>

                {/* Title */}
                <div className="font-semibold text-base leading-snug">{cert.title}</div>

                {/* Org + date */}
                <div className={`flex items-center justify-between text-xs mt-auto
                  ${isDark ? "text-neutral-500" : "text-neutral-400"}`}>
                  <span>{cert.org}</span>
                  <span className={`px-2 py-0.5 rounded-full border
                    ${isDark ? "border-neutral-700 bg-neutral-800" : "border-neutral-200 bg-neutral-100"}`}>
                    {cert.date}
                  </span>
                </div>
              </motion.a>
            ))}
          </motion.div>
        </section>

        {/* ── Currently Working On ────────────────────────────────────── */}
        <section id="current" className="max-w-4xl mx-auto px-6 py-20">
          <SectionHeading>Currently Working On</SectionHeading>
          <motion.a
            href={CURRENT_PROJECT.url}
            target="_blank"
            rel="noreferrer"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className={`glow-card surface-card group block rounded-2xl p-6 border cursor-pointer transition
              ${isDark ? "bg-[#131620] border-neutral-800" : "bg-white border-neutral-200"}`}
          >
            {/* Status badge */}
            <div className="flex items-center justify-between mb-4">
              <span className="flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-full border bg-emerald-500/15 border-emerald-500/40 text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                {CURRENT_PROJECT.status}
              </span>
              <ExternalLink size={14} className={`opacity-0 group-hover:opacity-100 transition-opacity ${isDark ? "text-neutral-500" : "text-neutral-400"}`} />
            </div>

            {/* Title */}
            <div className="flex items-center gap-2 mb-3">
              <Rocket size={18} className="text-cyan-500" />
              <h3 className="font-semibold text-lg">{CURRENT_PROJECT.title}</h3>
            </div>

            {/* Description */}
            <p className={`text-sm leading-relaxed mb-4 ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
              {CURRENT_PROJECT.description}
            </p>

            {/* Tech stack (from GitHub) */}
            {currentProjectLangs.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {currentProjectLangs.map((t) => (
                  <span
                    key={t}
                    className={`text-xs px-2.5 py-1 rounded-full border font-medium
                      ${isDark ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-400"
                        : "bg-cyan-50 border-cyan-200 text-cyan-700"}`}
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}
          </motion.a>
        </section>

        {/* ── Beyond the Code — Filmmaking ─────────────────────────── */}
        <section id="filmmaking" className={`py-20 ${isDark ? "bg-[#0d0f18]" : "bg-white/60"}`}>
          <div className="max-w-4xl mx-auto px-6">
            <SectionHeading>Beyond the Code</SectionHeading>
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="relative overflow-hidden rounded-2xl border group"
              style={{
                background: isDark
                  ? "linear-gradient(135deg, #0a0c12 0%, #1a1025 50%, #0a0c12 100%)"
                  : "linear-gradient(135deg, #f0f4f8 0%, #e8e0f0 50%, #f0f4f8 100%)",
                borderColor: isDark ? "rgba(139,92,246,0.3)" : "rgba(139,92,246,0.2)",
              }}
            >
              {/* Film grain overlay */}
              <div
                className="absolute inset-0 opacity-[0.04] pointer-events-none"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                }}
              />

              {/* Letterbox bars */}
              <div className={`h-3 w-full ${isDark ? "bg-black" : "bg-neutral-900"}`} />

              <div className="relative px-8 py-12 sm:px-12 sm:py-16 flex flex-col sm:flex-row items-center gap-8">
                {/* Play button */}
                <div className="flex-shrink-0">
                  <div className={`w-20 h-20 rounded-full flex items-center justify-center border-2 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg
                    ${isDark
                      ? "border-violet-400/60 bg-violet-500/10 shadow-violet-500/20 group-hover:shadow-violet-500/40"
                      : "border-violet-400 bg-violet-50 shadow-violet-300/30 group-hover:shadow-violet-400/40"}`}
                  >
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" className={`ml-1 ${isDark ? "text-violet-300" : "text-violet-500"}`}>
                      <polygon points="5,3 19,12 5,21" />
                    </svg>
                  </div>
                </div>

                {/* Content */}
                <div className="text-center sm:text-left flex-1">
                  <div className={`text-xs font-medium tracking-[0.2em] uppercase mb-2 ${isDark ? "text-violet-400/80" : "text-violet-500"}`}>
                    Another side of me
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold font-[Outfit] mb-2" style={{
                    background: "linear-gradient(135deg, #c084fc, #f472b6)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}>
                    Frames of Nevil
                  </h3>
                  <p className={`text-sm leading-relaxed max-w-md mb-6 ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
                    When I'm not building AI models, I'm behind a camera — crafting stories, one frame at a time.
                  </p>
                  <a
                    href="#"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 shadow-lg
                      bg-gradient-to-r from-violet-500 to-pink-500 hover:from-violet-400 hover:to-pink-400 text-white shadow-violet-500/30 hover:shadow-violet-400/40"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="5,3 19,12 5,21" />
                    </svg>
                    Explore My Work
                  </a>
                </div>
              </div>

              {/* Letterbox bar bottom */}
              <div className={`h-3 w-full ${isDark ? "bg-black" : "bg-neutral-900"}`} />
            </motion.div>
          </div>
        </section>

        {/* ── Projects ───────────────────────────────────────────────── */}
        <section id="projects" className={`py-20 ${isDark ? "bg-[#0d0f18]" : "bg-white/60"}`}>
          <div className="max-w-6xl mx-auto px-6">
            <SectionHeading>GitHub Projects</SectionHeading>

            {loading && (
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            )}

            {error && (
              <div className={`flex items-center gap-3 p-5 rounded-2xl border
                ${isDark ? "bg-red-900/20 border-red-700/40 text-red-400"
                  : "bg-red-50 border-red-200 text-red-500"}`}>
                <AlertCircle size={20} />
                <span className="text-sm">
                  Couldn't load repositories. Check your connection or visit{" "}
                  <a
                    href={`https://github.com/${GITHUB_USERNAME}`}
                    target="_blank"
                    rel="noreferrer"
                    className="underline"
                  >
                    GitHub directly
                  </a>
                  .
                </span>
              </div>
            )}

            {!loading && !error && (
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="grid gap-4 sm:grid-cols-2 md:grid-cols-3"
              >
                {repos.map((repo, i) => (
                  <motion.a
                    key={repo.id}
                    variants={fadeUp}
                    custom={i % 6}
                    href={repo.html_url}
                    target="_blank"
                    rel="noreferrer"
                    className={`glow-card surface-card group block rounded-2xl p-5 border transition
                      ${isDark ? "bg-[#131620] border-neutral-800" : "bg-white border-neutral-200"}`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <GitBranch size={14} className="text-cyan-500 flex-shrink-0" />
                        <span className={`font-semibold text-sm truncate
                          ${isDark ? "text-cyan-300 group-hover:text-cyan-200"
                            : "text-cyan-700 group-hover:text-cyan-600"}`}>
                          {repo.name}
                        </span>
                      </div>
                      <ExternalLink size={13} className={`flex-shrink-0 transition-opacity opacity-0 group-hover:opacity-100 ${isDark ? "text-neutral-500" : "text-neutral-400"}`} />
                    </div>

                    {repo.description && (
                      <p className={`text-xs leading-relaxed line-clamp-2 mb-3
                        ${isDark ? "text-neutral-500" : "text-neutral-500"}`}>
                        {repo.description}
                      </p>
                    )}

                    <div className="flex items-center gap-3 mt-auto">
                      {repo.language && (
                        <span className={`text-xs px-2 py-0.5 rounded-full border
                          ${isDark ? "bg-neutral-800 border-neutral-700 text-neutral-400"
                            : "bg-neutral-100 border-neutral-200 text-neutral-500"}`}>
                          {repo.language}
                        </span>
                      )}
                      {repo.stargazers_count > 0 && (
                        <span className="flex items-center gap-1 text-xs text-amber-400">
                          <Star size={11} /> {repo.stargazers_count}
                        </span>
                      )}
                    </div>
                  </motion.a>
                ))}
              </motion.div>
            )}

            {!loading && !error && (
              <motion.div
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="mt-8 text-center"
              >
                <a
                  href={`https://github.com/${GITHUB_USERNAME}`}
                  target="_blank"
                  rel="noreferrer"
                  className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium border transition
                    ${isDark ? "border-neutral-700 text-neutral-400 hover:border-cyan-500 hover:text-cyan-400"
                      : "border-neutral-300 text-neutral-500 hover:border-cyan-500 hover:text-cyan-600"}`}
                >
                  <FaGithub size={16} /> View all on GitHub
                </a>
              </motion.div>
            )}
          </div>
        </section>

        {/* ── Contact ────────────────────────────────────────────────── */}
        <section id="contact" className="max-w-4xl mx-auto px-6 py-20">
          <SectionHeading>Get in Touch</SectionHeading>
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className={`rounded-2xl p-8 border text-center glow-card
              ${isDark ? "bg-[#131620] border-neutral-800" : "bg-white border-neutral-200"}`}
          >
            <p className={`mb-4 text-base ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
              I'm open to internships, collaborations, and interesting AI/ML projects.
              Drop me a line!
            </p>
            <a
              href={`mailto:${profile.email}`}
              className="inline-block px-8 py-3 rounded-full font-semibold text-sm bg-cyan-500 hover:bg-cyan-400 text-black transition-all duration-200 shadow-lg shadow-cyan-500/30 hover:shadow-cyan-400/40"
            >
              {profile.email}
            </a>
          </motion.div>
        </section>

        {/* ── Footer ─────────────────────────────────────────────────── */}
        <footer className={`py-10 border-t ${isDark ? "border-neutral-800/60" : "border-neutral-200"}`}>
          <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className={`text-sm ${isDark ? "text-neutral-600" : "text-neutral-400"}`}>
              © {new Date().getFullYear()} {profile.name} — Built with React &amp; Tailwind
            </span>
            <div className="flex gap-5">
              {socials.map(({ platform, url }) => {
                const Icon = SOCIAL_ICON_MAP[platform];
                if (!Icon) return null;
                return (
                  <a
                    key={platform}
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={platform}
                    className={`social-icon ${isDark ? "text-neutral-500" : "text-neutral-400"}`}
                  >
                    <Icon size={20} />
                  </a>
                );
              })}
              <a
                href={`https://github.com/${GITHUB_USERNAME}`}
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
                className={`social-icon ${isDark ? "text-neutral-500" : "text-neutral-400"}`}
              >
                <FaGithub size={20} />
              </a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}