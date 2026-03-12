import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Play, Mail, MapPin, Camera, Film, Clapperboard, Sparkles, X, Image, CheckCircle } from "lucide-react";
import { FaInstagram, FaYoutube } from "react-icons/fa";
import { loadStore, DEFAULTS } from "./data/portfolioStore";

// ─── Motion variants ────────────────────────────────────────────────────────
const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (i = 0) => ({
        opacity: 1, y: 0,
        transition: { duration: 0.6, delay: i * 0.1, ease: "easeOut" },
    }),
};

const curtainReveal = {
    hidden: { scaleY: 1 },
    visible: { scaleY: 0, transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } },
};

const stagger = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08 } },
};

// ─── Helpers ────────────────────────────────────────────────────────────────
function SectionHeading({ children }) {
    return (
        <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-3xl font-bold mb-8"
            style={{
                fontFamily: "'Playfair Display', serif",
                background: "linear-gradient(135deg, #c9a84c, #f5d98a)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
            }}
        >
            {children}
        </motion.h2>
    );
}

// ─── Main Component ─────────────────────────────────────────────────────────
export default function Filmmaking() {
    const navigate = useNavigate();
    const [fm, setFm] = useState(DEFAULTS.filmmaking || {});
    const [loaded, setLoaded] = useState(false);
    const [galleryFilter, setGalleryFilter] = useState("all");
    const [lightbox, setLightbox] = useState(null);
    const [projectFilter, setProjectFilter] = useState("all");

    useEffect(() => {
        loadStore().then((d) => {
            if (d.filmmaking) setFm(d.filmmaking);
            setLoaded(true);
        });
    }, []);

    const {
        brandName = "Frames of Nevil",
        tagline = "Stories told through frames",
        about = "When I'm not building AI models, I'm behind a camera — crafting cinematic stories, exploring visual narratives, and turning everyday moments into art. I also love working with models, capturing their essence through creative portrait and fashion photography.",
        roles = ["Director", "Cinematographer", "Editor", "Model Photographer"],
        equipment = ["Sony A7III", "DJI RS3", "DaVinci Resolve", "85mm f/1.4 Lens", "Studio Lighting Kit"],
        services = [],
        projects = [
            { title: "Urban Echoes", category: "Short Film", year: "2025", description: "A visual poem exploring solitude in city life.", thumbnail: "" },
            { title: "Golden Hour", category: "Music Video", year: "2025", description: "Cinematic music video shot during golden hour across three locations.", thumbnail: "" },
            { title: "Wanderlust", category: "Travel Film", year: "2024", description: "A travel documentary capturing the spirit of backpacking through Europe.", thumbnail: "" },
        ],
        socialInstagram = "",
        socialYouTube = "",
        contactEmail = "framesofnevil@gmail.com",
        availability = "Currently booking for 2026",
        showreelUrl = "",
        gallery = [],
    } = fm;

    const filteredGallery = gallery.filter((item) =>
        galleryFilter === "all" ? true : item.type === galleryFilter
    );

    const projectCategories = ["all", ...new Set(projects.map((p) => p.category))];
    const filteredProjects = projects.filter((p) =>
        projectFilter === "all" ? true : p.category === projectFilter
    );

    const serviceIcons = { camera: Camera, film: Film, sparkles: Sparkles };

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-[#f5f0e8] overflow-hidden filmmaking-page">
            {/* ── Film grain overlay (global) ──────────────────────────── */}
            <div className="film-grain" />

            {/* ── Cinematic cursor glow ────────────────────────────────── */}

            {/* ── Hero ─────────────────────────────────────────────────── */}
            <section className="relative min-h-screen flex flex-col justify-center items-center text-center px-6">
                {/* Ambient orbs */}
                <div className="absolute w-[500px] h-[500px] rounded-full top-[-150px] left-[-100px] pointer-events-none"
                    style={{ background: "radial-gradient(circle, rgba(201,168,76,0.12) 0%, transparent 70%)", filter: "blur(80px)" }} />
                <div className="absolute w-[400px] h-[400px] rounded-full bottom-[-100px] right-[-80px] pointer-events-none"
                    style={{ background: "radial-gradient(circle, rgba(245,217,138,0.08) 0%, transparent 70%)", filter: "blur(80px)" }} />

                {/* Back to portfolio */}
                <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 }}
                    onClick={() => navigate("/")}
                    className="absolute top-6 left-6 flex items-center gap-2 text-sm text-[#f5f0e8]/50 hover:text-[#c9a84c] transition-colors z-10"
                >
                    <ArrowLeft size={16} /> Back to Portfolio
                </motion.button>

                {/* Curtain reveal */}
                <motion.div
                    variants={curtainReveal}
                    initial="hidden"
                    animate="visible"
                    className="absolute inset-0 bg-[#0a0a0a] origin-top z-20 pointer-events-none"
                />

                {/* Letterbox top */}
                <div className="absolute top-0 left-0 right-0 h-16 bg-black z-10" />

                {/* Brand */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.8 }}
                    className="relative z-[5]"
                >
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <div className="h-px w-12 bg-[#c9a84c]/40" />
                        <Camera size={16} className="text-[#c9a84c]/60" />
                        <div className="h-px w-12 bg-[#c9a84c]/40" />
                    </div>

                    <h1
                        className="text-5xl md:text-8xl font-bold tracking-tight mb-4"
                        style={{
                            fontFamily: "'Playfair Display', serif",
                            background: "linear-gradient(135deg, #c9a84c 0%, #f5d98a 40%, #c9a84c 100%)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                        }}
                    >
                        {brandName}
                    </h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.2, duration: 0.8 }}
                        className="text-lg md:text-xl text-[#f5f0e8]/50 tracking-[0.15em] uppercase font-light"
                    >
                        {tagline}
                    </motion.p>

                    {/* Role pills */}
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.5 }}
                        className="flex flex-wrap justify-center gap-3 mt-8"
                    >
                        {roles.map((role) => (
                            <span
                                key={role}
                                className="px-4 py-1.5 rounded-full text-xs font-medium tracking-wider uppercase border border-[#c9a84c]/30 bg-[#c9a84c]/8 text-[#c9a84c]"
                            >
                                {role}
                            </span>
                        ))}
                    </motion.div>
                </motion.div>

                {/* Scroll indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2, duration: 0.8 }}
                    className="absolute bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-[5]"
                >
                    <span className="text-[10px] tracking-[0.3em] uppercase text-[#f5f0e8]/30">scroll</span>
                    <motion.div
                        animate={{ y: [0, 8, 0] }}
                        transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
                        className="w-px h-8 bg-gradient-to-b from-[#c9a84c]/60 to-transparent"
                    />
                </motion.div>

                {/* Letterbox bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-black z-10" />
            </section>

            {/* ── Showreel ─────────────────────────────────────────────── */}
            {showreelUrl && (
                <section className="max-w-5xl mx-auto px-6 py-24">
                    <SectionHeading>Showreel</SectionHeading>
                    <motion.div
                        variants={fadeUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="relative aspect-video rounded-2xl overflow-hidden border border-[#c9a84c]/20 shadow-2xl shadow-[#c9a84c]/5"
                    >
                        <iframe
                            src={showreelUrl}
                            title="Showreel"
                            className="w-full h-full"
                            allow="autoplay; fullscreen"
                            allowFullScreen
                        />
                    </motion.div>
                </section>
            )}

            {/* ── About ────────────────────────────────────────────────── */}
            <section className="max-w-4xl mx-auto px-6 py-24">
                <SectionHeading>The Story</SectionHeading>
                <motion.div
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid md:grid-cols-2 gap-12 items-start"
                >
                    {/* Text */}
                    <div>
                        <p className="text-base leading-relaxed text-[#f5f0e8]/60 mb-8">
                            {about}
                        </p>

                        {/* Equipment */}
                        {equipment.length > 0 && (
                            <div>
                                <h3 className="text-sm font-medium tracking-wider uppercase text-[#c9a84c]/60 mb-3">Gear & Tools</h3>
                                <div className="flex flex-wrap gap-2">
                                    {equipment.map((item) => (
                                        <span
                                            key={item}
                                            className="px-3 py-1 rounded-full text-xs border border-[#f5f0e8]/10 bg-[#f5f0e8]/5 text-[#f5f0e8]/50"
                                        >
                                            {item}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Stats card */}
                    <motion.div
                        variants={fadeUp}
                        custom={1}
                        className="rounded-2xl border border-[#c9a84c]/15 bg-gradient-to-br from-[#c9a84c]/5 to-transparent p-8"
                    >
                        <div className="space-y-6">
                            {[
                                { icon: Film, label: "Projects", value: `${projects.length}+` },
                                { icon: Clapperboard, label: "Focus", value: roles[0] || "Filmmaking" },
                                { icon: Sparkles, label: "Status", value: availability },
                            ].map(({ icon: Icon, label, value }) => (
                                <div key={label} className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full flex items-center justify-center border border-[#c9a84c]/20 bg-[#c9a84c]/8">
                                        <Icon size={16} className="text-[#c9a84c]" />
                                    </div>
                                    <div>
                                        <div className="text-[10px] tracking-wider uppercase text-[#f5f0e8]/30">{label}</div>
                                        <div className="text-sm font-medium text-[#f5f0e8]/80">{value}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </motion.div>
            </section>

            {/* ── Services ───────────────────────────────────────────── */}
            {services.length > 0 && (
                <section className="py-24 bg-[#0d0d0d]">
                    <div className="max-w-6xl mx-auto px-6">
                        <SectionHeading>What I Offer</SectionHeading>
                        <motion.div
                            variants={stagger}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
                        >
                            {services.map((svc, i) => {
                                const Icon = serviceIcons[svc.icon] || Camera;
                                return (
                                    <motion.div
                                        key={svc.title}
                                        variants={fadeUp}
                                        custom={i}
                                        className="rounded-2xl border border-[#c9a84c]/15 bg-gradient-to-br from-[#c9a84c]/5 to-transparent p-7 hover:border-[#c9a84c]/30 transition-colors duration-300"
                                    >
                                        <div className="w-12 h-12 rounded-full flex items-center justify-center border border-[#c9a84c]/20 bg-[#c9a84c]/8 mb-5">
                                            <Icon size={20} className="text-[#c9a84c]" />
                                        </div>
                                        <h3
                                            className="text-lg font-semibold mb-3 text-[#f5f0e8]/90"
                                            style={{ fontFamily: "'Playfair Display', serif" }}
                                        >
                                            {svc.title}
                                        </h3>
                                        <p className="text-sm text-[#f5f0e8]/40 leading-relaxed mb-5">{svc.description}</p>
                                        {svc.features && svc.features.length > 0 && (
                                            <ul className="space-y-2">
                                                {svc.features.map((feat) => (
                                                    <li key={feat} className="flex items-center gap-2 text-xs text-[#f5f0e8]/50">
                                                        <CheckCircle size={12} className="text-[#c9a84c]/60 flex-shrink-0" />
                                                        {feat}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </motion.div>
                                );
                            })}
                        </motion.div>
                    </div>
                </section>
            )}

            {/* ── Work / Projects ──────────────────────────────────────── */}
            <section className="py-24">
                <div className="max-w-6xl mx-auto px-6">
                    <SectionHeading>Selected Work</SectionHeading>

                    {/* Category filter */}
                    <motion.div
                        variants={fadeUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="flex flex-wrap gap-3 mb-8"
                    >
                        {projectCategories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setProjectFilter(cat)}
                                className={`px-4 py-1.5 rounded-full text-xs font-medium tracking-wider uppercase transition-all duration-200 border ${projectFilter === cat
                                        ? "border-[#c9a84c] bg-[#c9a84c]/15 text-[#c9a84c]"
                                        : "border-[#f5f0e8]/10 text-[#f5f0e8]/30 hover:border-[#f5f0e8]/20 hover:text-[#f5f0e8]/50"
                                    }`}
                            >
                                {cat === "all" ? "All" : cat}
                            </button>
                        ))}
                    </motion.div>

                    <motion.div
                        variants={stagger}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
                    >
                        {filteredProjects.map((proj, i) => (
                            <motion.div
                                key={proj.title}
                                variants={fadeUp}
                                custom={i}
                                className="group relative rounded-2xl overflow-hidden border border-[#f5f0e8]/8 bg-[#111] film-card cursor-default"
                            >
                                {/* Thumbnail / placeholder */}
                                <div className="aspect-[16/10] bg-gradient-to-br from-[#1a1a1a] to-[#111] flex items-center justify-center relative overflow-hidden">
                                    {proj.thumbnail ? (
                                        <img src={proj.thumbnail} alt={proj.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="flex flex-col items-center gap-2 text-[#f5f0e8]/10">
                                            {proj.category === "Model Shoot" ? <Camera size={32} /> : <Film size={32} />}
                                            <span className="text-xs tracking-wider uppercase">{proj.category}</span>
                                        </div>
                                    )}
                                    {/* Hover overlay */}
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                        <div className="w-12 h-12 rounded-full border-2 border-[#c9a84c] flex items-center justify-center">
                                            <Play size={18} className="text-[#c9a84c] ml-0.5" fill="currentColor" />
                                        </div>
                                    </div>
                                </div>

                                {/* Info */}
                                <div className="p-5">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-[10px] tracking-wider uppercase text-[#c9a84c]/60">{proj.category}</span>
                                        <span className="text-[10px] text-[#f5f0e8]/30">{proj.year}</span>
                                    </div>
                                    <h3 className="font-semibold text-base text-[#f5f0e8]/90 mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
                                        {proj.title}
                                    </h3>
                                    <p className="text-xs text-[#f5f0e8]/40 leading-relaxed">{proj.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ── Gallery ──────────────────────────────────────────────── */}
            {gallery.length > 0 && (
                <section className="py-24">
                    <div className="max-w-6xl mx-auto px-6">
                        <SectionHeading>Gallery</SectionHeading>

                        {/* Filter tabs */}
                        <motion.div
                            variants={fadeUp}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            className="flex gap-3 mb-8"
                        >
                            {["all", "photo", "video"].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setGalleryFilter(tab)}
                                    className={`px-4 py-1.5 rounded-full text-xs font-medium tracking-wider uppercase transition-all duration-200 border ${galleryFilter === tab
                                        ? "border-[#c9a84c] bg-[#c9a84c]/15 text-[#c9a84c]"
                                        : "border-[#f5f0e8]/10 text-[#f5f0e8]/30 hover:border-[#f5f0e8]/20 hover:text-[#f5f0e8]/50"
                                        }`}
                                >
                                    {tab === "all" ? "All" : tab === "photo" ? "Photos" : "Videos"}
                                </button>
                            ))}
                        </motion.div>

                        {/* Grid */}
                        <motion.div
                            variants={stagger}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            className="columns-2 sm:columns-3 lg:columns-4 gap-3 space-y-3"
                        >
                            {filteredGallery.map((item, i) => (
                                <motion.div
                                    key={item.url + i}
                                    variants={fadeUp}
                                    custom={i}
                                    className="break-inside-avoid group relative rounded-xl overflow-hidden border border-[#f5f0e8]/8 bg-[#111] cursor-pointer"
                                    onClick={() => setLightbox(item)}
                                >
                                    <img
                                        src={item.thumbnail || item.url}
                                        alt={item.title || ""}
                                        className="w-full block transition-transform duration-500 group-hover:scale-105"
                                        loading="lazy"
                                    />
                                    {item.type === "video" && (
                                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                            <div className="w-10 h-10 rounded-full bg-black/50 border border-[#c9a84c]/40 flex items-center justify-center backdrop-blur-sm">
                                                <Play size={14} className="text-[#c9a84c] ml-0.5" fill="currentColor" />
                                            </div>
                                        </div>
                                    )}
                                    {item.title && (
                                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-3 py-2">
                                            <span className="text-[11px] text-[#f5f0e8]/70">{item.title}</span>
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </section>
            )}

            {/* ── Lightbox ─────────────────────────────────────────────── */}
            <AnimatePresence>
                {lightbox && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
                        onClick={() => setLightbox(null)}
                    >
                        <button
                            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition z-10"
                            onClick={() => setLightbox(null)}
                        >
                            <X size={20} />
                        </button>
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="max-w-5xl max-h-[85vh] relative"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {lightbox.type === "video" ? (
                                <video
                                    src={lightbox.url}
                                    controls
                                    autoPlay
                                    className="max-w-full max-h-[85vh] rounded-xl"
                                />
                            ) : (
                                <img
                                    src={lightbox.url}
                                    alt={lightbox.title || ""}
                                    className="max-w-full max-h-[85vh] rounded-xl object-contain"
                                />
                            )}
                            {lightbox.title && (
                                <div className="text-center mt-3 text-sm text-[#f5f0e8]/50">{lightbox.title}</div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Contact ──────────────────────────────────────────────── */}
            <section className="max-w-4xl mx-auto px-6 py-24 text-center">
                <SectionHeading>Let's Create Together</SectionHeading>
                <motion.div
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    <p className="text-[#f5f0e8]/40 mb-8 max-w-lg mx-auto">
                        Have a project in mind? Whether it's a model photo shoot, short film, music video, or brand story — I'd love to hear about it.
                    </p>

                    <div className="flex flex-wrap justify-center gap-4 mb-10">
                        <a
                            href={`mailto:${contactEmail}`}
                            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 shadow-lg
                bg-gradient-to-r from-[#c9a84c] to-[#f5d98a] text-[#0a0a0a] hover:shadow-[#c9a84c]/30"
                        >
                            <Mail size={14} /> Get in Touch
                        </a>
                        {socialInstagram && (
                            <a href={socialInstagram} target="_blank" rel="noreferrer"
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium border border-[#f5f0e8]/15 text-[#f5f0e8]/60 hover:border-[#c9a84c]/40 hover:text-[#c9a84c] transition">
                                <FaInstagram size={14} /> Instagram
                            </a>
                        )}
                        {socialYouTube && (
                            <a href={socialYouTube} target="_blank" rel="noreferrer"
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium border border-[#f5f0e8]/15 text-[#f5f0e8]/60 hover:border-[#c9a84c]/40 hover:text-[#c9a84c] transition">
                                <FaYoutube size={14} /> YouTube
                            </a>
                        )}
                    </div>

                    <p className="text-xs text-[#f5f0e8]/20 tracking-wider">{availability}</p>
                </motion.div>
            </section>

            {/* ── Footer ───────────────────────────────────────────────── */}
            <footer className="border-t border-[#f5f0e8]/5 py-6 text-center">
                <button
                    onClick={() => navigate("/")}
                    className="text-xs text-[#f5f0e8]/20 hover:text-[#c9a84c]/60 transition"
                >
                    ← Back to Developer Portfolio
                </button>
            </footer>
        </div>
    );
}
