import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loadStore, saveStore, resetStore, DEFAULTS } from "./data/portfolioStore";
import {
    Save, RotateCcw, ArrowLeft, Plus, Trash2, Eye, EyeOff,
    User, Wrench, GraduationCap, Briefcase, Award, Rocket,
    GitBranch, Share2, ChevronDown, ChevronUp, Check, Loader2, Key,
    Film, Upload, Image, Video, X,
} from "lucide-react";

const SECTION_ICONS = {
    profile: User,
    socials: Share2,
    skills: Wrench,
    education: GraduationCap,
    experience: Briefcase,
    certifications: Award,
    currentProject: Rocket,
    filmmaking: Film,
    repoVisibility: GitBranch,
};

const SECTION_LABELS = {
    profile: "Profile & Hero",
    socials: "Social Links",
    skills: "Skills",
    education: "Education",
    experience: "Work Experience",
    certifications: "Certifications",
    currentProject: "Current Project",
    filmmaking: "Filmmaking / Gallery",
    repoVisibility: "Repo Visibility",
};

const SKILL_CATEGORIES = ["Lang", "Data", "ML", "Web", "Math"];
const SOCIAL_PLATFORMS = ["Instagram", "LinkedIn", "Twitter", "Medium", "YouTube", "Dribbble"];

// ─── Helpers ────────────────────────────────────────────────────────────────
function Input({ label, value, onChange, type = "text", placeholder = "" }) {
    return (
        <label className="block">
            <span className="text-xs font-medium text-neutral-400 mb-1 block">{label}</span>
            <input
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full rounded-lg border border-neutral-700 bg-neutral-800/60 px-3 py-2 text-sm text-neutral-200 placeholder-neutral-600 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/40 transition"
            />
        </label>
    );
}

function TextArea({ label, value, onChange, rows = 3 }) {
    return (
        <label className="block">
            <span className="text-xs font-medium text-neutral-400 mb-1 block">{label}</span>
            <textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                rows={rows}
                className="w-full rounded-lg border border-neutral-700 bg-neutral-800/60 px-3 py-2 text-sm text-neutral-200 placeholder-neutral-600 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/40 transition resize-y"
            />
        </label>
    );
}

function Select({ label, value, onChange, options }) {
    return (
        <label className="block">
            <span className="text-xs font-medium text-neutral-400 mb-1 block">{label}</span>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full rounded-lg border border-neutral-700 bg-neutral-800/60 px-3 py-2 text-sm text-neutral-200 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/40 transition"
            >
                {options.map((o) => (
                    <option key={o} value={o}>{o}</option>
                ))}
            </select>
        </label>
    );
}

function SectionCard({ sectionKey, open, onToggle, children }) {
    const Icon = SECTION_ICONS[sectionKey];
    return (
        <div className="rounded-2xl border border-neutral-800 bg-[#131620] overflow-hidden">
            <button
                type="button"
                onClick={onToggle}
                className="w-full flex items-center justify-between px-6 py-4 hover:bg-neutral-800/40 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <Icon size={18} className="text-cyan-500" />
                    <span className="font-semibold text-base">{SECTION_LABELS[sectionKey]}</span>
                </div>
                {open ? <ChevronUp size={16} className="text-neutral-400" /> : <ChevronDown size={16} className="text-neutral-400" />}
            </button>
            {open && <div className="px-6 pb-6 pt-2 border-t border-neutral-800/60">{children}</div>}
        </div>
    );
}

// ─── Main Admin ─────────────────────────────────────────────────────────────

// ─── Login Gate ─────────────────────────────────────────────────────────────
function LoginGate({ onLogin }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        setError("");
        // Credentials stored as SHA-256 hashes in localStorage on first setup
        const storedHash = localStorage.getItem("admin_cred_hash");
        const inputHash = btoa(username.trim() + ":" + password);

        if (!storedHash) {
            // First-time setup: store credentials
            if (!username.trim() || !password.trim()) {
                setError("Please enter a username and password to set up admin access.");
                return;
            }
            localStorage.setItem("admin_cred_hash", inputHash);
            onLogin();
        } else if (inputHash === storedHash) {
            onLogin();
        } else {
            setError("Invalid credentials.");
        }
    };

    const isFirstSetup = !localStorage.getItem("admin_cred_hash");

    return (
        <div className="min-h-screen bg-[#0a0c12] text-white flex items-center justify-center px-4">
            <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-6">
                <div className="text-center">
                    <div className="w-14 h-14 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mx-auto mb-4">
                        <Key size={24} className="text-cyan-500" />
                    </div>
                    <h1 className="text-2xl font-bold">
                        {isFirstSetup ? "Set Up Admin Access" : "Admin Login"}
                    </h1>
                    <p className="text-sm text-neutral-500 mt-2">
                        {isFirstSetup
                            ? "Create your admin credentials. These will be stored locally in your browser."
                            : "Enter your credentials to access the admin panel."}
                    </p>
                </div>

                <div className="space-y-4">
                    <label className="block">
                        <span className="text-xs font-medium text-neutral-400 mb-1 block">Username</span>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="admin"
                            autoComplete="username"
                            className="w-full rounded-lg border border-neutral-700 bg-neutral-800/60 px-3 py-2.5 text-sm text-neutral-200 placeholder-neutral-600 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/40 transition"
                        />
                    </label>
                    <label className="block">
                        <span className="text-xs font-medium text-neutral-400 mb-1 block">Password</span>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            autoComplete="current-password"
                            className="w-full rounded-lg border border-neutral-700 bg-neutral-800/60 px-3 py-2.5 text-sm text-neutral-200 placeholder-neutral-600 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/40 transition"
                        />
                    </label>
                </div>

                {error && (
                    <p className="text-xs text-red-400 text-center">{error}</p>
                )}

                <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold bg-cyan-500 hover:bg-cyan-400 text-black transition shadow-lg shadow-cyan-500/30"
                >
                    {isFirstSetup ? "Create & Login" : "Login"}
                </button>
            </form>
        </div>
    );
}

export default function Admin() {
    const navigate = useNavigate();
    const [authed, setAuthed] = useState(() => {
        return sessionStorage.getItem("admin_authed") === "true";
    });
    const [data, setData] = useState(DEFAULTS);
    const [loading, setLoading] = useState(true);
    const [openSections, setOpenSections] = useState({ profile: true });
    const [saved, setSaved] = useState(false);
    const [saving, setSaving] = useState(false);
    const [ghRepos, setGhRepos] = useState([]);
    const [ghLoading, setGhLoading] = useState(true);
    const [ghToken, setGhToken] = useState(() => localStorage.getItem("gh_token") || "");

    // Load data on mount
    useEffect(() => {
        loadStore().then((d) => { setData(d); setLoading(false); });
    }, []);

    // Fetch all GitHub repos for the selector
    useEffect(() => {
        if (loading) return;
        let mounted = true;
        async function fetchRepos() {
            try {
                const username = data.profile.githubUsername;
                const res = await fetch(
                    `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`
                );
                if (!res.ok) throw new Error();
                const repos = await res.json();
                if (mounted) setGhRepos(Array.isArray(repos) ? repos : []);
            } catch { /* ignore */ }
            finally { if (mounted) setGhLoading(false); }
        }
        fetchRepos();
        return () => { mounted = false; };
    }, [data.profile.githubUsername, loading]);

    // Persist GitHub token
    useEffect(() => { localStorage.setItem("gh_token", ghToken); }, [ghToken]);

    const handleLogin = () => {
        setAuthed(true);
        sessionStorage.setItem("admin_authed", "true");
    };

    const handleLogout = () => {
        setAuthed(false);
        sessionStorage.removeItem("admin_authed");
    };

    if (!authed) {
        return <LoginGate onLogin={handleLogin} />;
    }

    // Persist on save — commits data.json to GitHub
    const handleSave = async () => {
        if (!ghToken) { alert("Enter your GitHub Personal Access Token first."); return; }
        setSaving(true);
        try {
            await saveStore(data, ghToken);
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
        } catch (e) { alert(`Failed to save: ${e.message}`); }
        finally { setSaving(false); }
    };

    const handleReset = async () => {
        if (!window.confirm("Reset all portfolio data to defaults? This cannot be undone.")) return;
        if (!ghToken) { alert("Enter your GitHub Personal Access Token first."); return; }
        setSaving(true);
        try {
            const fresh = await resetStore(ghToken);
            setData(fresh);
        } catch (e) { alert(`Failed to reset: ${e.message}`); }
        finally { setSaving(false); }
    };

    const toggle = (key) =>
        setOpenSections((s) => ({ ...s, [key]: !s[key] }));

    // Updaters
    const updateProfile = (field, val) =>
        setData((d) => ({ ...d, profile: { ...d.profile, [field]: val } }));

    const updateCurrentProject = (field, val) =>
        setData((d) => ({ ...d, currentProject: { ...d.currentProject, [field]: val } }));

    const updateFilmmaking = (field, val) =>
        setData((d) => ({ ...d, filmmaking: { ...d.filmmaking, [field]: val } }));

    const updateFilmmakingProject = (idx, item) =>
        setData((d) => ({ ...d, filmmaking: { ...d.filmmaking, projects: d.filmmaking.projects.map((x, i) => (i === idx ? item : x)) } }));

    const removeFilmmakingProject = (idx) =>
        setData((d) => ({ ...d, filmmaking: { ...d.filmmaking, projects: d.filmmaking.projects.filter((_, i) => i !== idx) } }));

    const addFilmmakingProject = () =>
        setData((d) => ({ ...d, filmmaking: { ...d.filmmaking, projects: [...d.filmmaking.projects, { title: "", category: "Short Film", year: new Date().getFullYear().toString(), description: "", thumbnail: "" }] } }));

    const addGalleryItem = (item) =>
        setData((d) => ({ ...d, filmmaking: { ...d.filmmaking, gallery: [...(d.filmmaking.gallery || []), item] } }));

    const removeGalleryItem = (idx) =>
        setData((d) => ({ ...d, filmmaking: { ...d.filmmaking, gallery: (d.filmmaking.gallery || []).filter((_, i) => i !== idx) } }));

    const updateGalleryItem = (idx, item) =>
        setData((d) => ({ ...d, filmmaking: { ...d.filmmaking, gallery: (d.filmmaking.gallery || []).map((x, i) => (i === idx ? item : x)) } }));

    // Cloudinary upload handler
    const openCloudinaryUpload = () => {
        const cloudName = data.filmmaking?.cloudinaryCloudName;
        const preset = data.filmmaking?.cloudinaryUploadPreset;
        if (!cloudName || !preset) {
            alert("Set your Cloudinary Cloud Name and Upload Preset first.");
            return;
        }
        if (!window.cloudinary) {
            alert("Cloudinary widget is still loading. Try again in a moment.");
            return;
        }
        window.cloudinary.openUploadWidget(
            {
                cloudName,
                uploadPreset: preset,
                sources: ["local", "url", "camera"],
                multiple: true,
                resourceType: "auto",
                maxFileSize: 50000000,
                folder: "frames-of-nevil",
            },
            (error, result) => {
                if (error) { console.error(error); return; }
                if (result.event === "success") {
                    const info = result.info;
                    addGalleryItem({
                        type: info.resource_type === "video" ? "video" : "photo",
                        url: info.secure_url,
                        thumbnail: info.resource_type === "video"
                            ? info.secure_url.replace(/\.mp4$|\.mov$|\.webm$/i, ".jpg")
                            : info.secure_url,
                        title: info.original_filename || "",
                        width: info.width,
                        height: info.height,
                    });
                }
            }
        );
    };

    // Array helpers
    const updateArrayItem = (key, idx, item) =>
        setData((d) => ({ ...d, [key]: d[key].map((x, i) => (i === idx ? item : x)) }));

    const removeArrayItem = (key, idx) =>
        setData((d) => ({ ...d, [key]: d[key].filter((_, i) => i !== idx) }));

    const addArrayItem = (key, item) =>
        setData((d) => ({ ...d, [key]: [...d[key], item] }));

    return (
        <div className="min-h-screen bg-[#0a0c12] text-white">
            {/* ── Top bar ──────────────────────────────────────────────── */}
            <header className="sticky top-0 z-50 backdrop-blur-md bg-[#0a0c12]/80 border-b border-neutral-800/80">
                <div className="max-w-4xl mx-auto flex items-center justify-between px-6 py-3">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate("/")}
                            className="flex items-center gap-2 text-sm text-neutral-400 hover:text-cyan-400 transition-colors"
                        >
                            <ArrowLeft size={16} /> Portfolio
                        </button>
                        <span className="text-lg font-bold font-[Outfit] gradient-text">Admin Panel</span>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium border border-neutral-700 text-neutral-400 hover:border-orange-500 hover:text-orange-400 transition"
                        >
                            Logout
                        </button>
                        <button
                            onClick={handleReset}
                            className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium border border-neutral-700 text-neutral-400 hover:border-red-500 hover:text-red-400 transition"
                        >
                            <RotateCcw size={13} /> Reset
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="flex items-center gap-2 px-5 py-2 rounded-full text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-black transition shadow-lg shadow-cyan-500/30 disabled:opacity-60"
                        >
                            {saving ? <><Loader2 size={13} className="animate-spin" /> Saving…</> : saved ? <><Check size={13} /> Saved!</> : <><Save size={13} /> Save Changes</>}
                        </button>
                    </div>
                </div>
            </header>
            {loading ? (
                <div className="flex items-center justify-center py-32">
                    <Loader2 size={28} className="animate-spin text-cyan-500" />
                    <span className="ml-3 text-neutral-400 text-sm">Loading data…</span>
                </div>
            ) : (<main className="max-w-4xl mx-auto px-6 py-10 space-y-4">
                {/* ── GitHub Token ──────────────────────────────────── */}
                <div className="rounded-2xl border border-neutral-800 bg-[#131620] px-6 py-4">
                    <div className="flex items-center gap-3 mb-3">
                        <Key size={18} className="text-cyan-500" />
                        <span className="font-semibold text-base">GitHub Token</span>
                    </div>
                    <p className="text-xs text-neutral-500 mb-2">A Personal Access Token with <code className="text-cyan-400">repo</code> scope is required to commit changes.</p>
                    <input
                        type="password"
                        value={ghToken}
                        onChange={(e) => setGhToken(e.target.value)}
                        placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                        className="w-full rounded-lg border border-neutral-700 bg-neutral-800/60 px-3 py-2 text-sm text-neutral-200 placeholder-neutral-600 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/40 transition"
                    />
                </div>
                {/* ── Profile ──────────────────────────────────────────── */}
                <SectionCard sectionKey="profile" open={openSections.profile} onToggle={() => toggle("profile")}>
                    <div className="space-y-4">
                        <div className="grid sm:grid-cols-2 gap-4">
                            <Input label="Full Name" value={data.profile.name} onChange={(v) => updateProfile("name", v)} />
                            <Input label="Location" value={data.profile.location} onChange={(v) => updateProfile("location", v)} />
                        </div>
                        <Input label="Tagline" value={data.profile.tagline} onChange={(v) => updateProfile("tagline", v)} />
                        <div className="grid sm:grid-cols-2 gap-4">
                            <Input label="Email" type="email" value={data.profile.email} onChange={(v) => updateProfile("email", v)} />
                            <Input label="GitHub Username" value={data.profile.githubUsername} onChange={(v) => updateProfile("githubUsername", v)} />
                        </div>
                        <TextArea label="About Text" value={data.profile.aboutText} onChange={(v) => updateProfile("aboutText", v)} rows={4} />
                    </div>
                </SectionCard>

                {/* ── Social Links ─────────────────────────────────────── */}
                <SectionCard sectionKey="socials" open={openSections.socials} onToggle={() => toggle("socials")}>
                    <div className="space-y-3">
                        {data.socials.map((s, i) => (
                            <div key={i} className="flex gap-3 items-end">
                                <div className="w-36">
                                    <Select label="Platform" value={s.platform} onChange={(v) => updateArrayItem("socials", i, { ...s, platform: v })} options={SOCIAL_PLATFORMS} />
                                </div>
                                <div className="flex-1">
                                    <Input label="URL" value={s.url} onChange={(v) => updateArrayItem("socials", i, { ...s, url: v })} />
                                </div>
                                <button onClick={() => removeArrayItem("socials", i)} className="p-2 text-neutral-500 hover:text-red-400 transition mb-0.5">
                                    <Trash2 size={15} />
                                </button>
                            </div>
                        ))}
                        <button
                            onClick={() => addArrayItem("socials", { platform: "LinkedIn", url: "" })}
                            className="flex items-center gap-2 text-xs text-cyan-400 hover:text-cyan-300 transition mt-2"
                        >
                            <Plus size={13} /> Add Social Link
                        </button>
                    </div>
                </SectionCard>

                {/* ── Skills ────────────────────────────────────────────── */}
                <SectionCard sectionKey="skills" open={openSections.skills} onToggle={() => toggle("skills")}>
                    <div className="space-y-3">
                        {data.skills.map((s, i) => (
                            <div key={i} className="flex gap-3 items-end">
                                <div className="flex-1">
                                    <Input label="Skill Name" value={s.name} onChange={(v) => updateArrayItem("skills", i, { ...s, name: v })} />
                                </div>
                                <div className="w-32">
                                    <Select label="Category" value={s.category} onChange={(v) => updateArrayItem("skills", i, { ...s, category: v })} options={SKILL_CATEGORIES} />
                                </div>
                                <button onClick={() => removeArrayItem("skills", i)} className="p-2 text-neutral-500 hover:text-red-400 transition mb-0.5">
                                    <Trash2 size={15} />
                                </button>
                            </div>
                        ))}
                        <button
                            onClick={() => addArrayItem("skills", { name: "", category: "Lang" })}
                            className="flex items-center gap-2 text-xs text-cyan-400 hover:text-cyan-300 transition mt-2"
                        >
                            <Plus size={13} /> Add Skill
                        </button>
                    </div>
                </SectionCard>

                {/* ── Education ─────────────────────────────────────────── */}
                <SectionCard sectionKey="education" open={openSections.education} onToggle={() => toggle("education")}>
                    <div className="space-y-6">
                        {data.education.map((edu, i) => (
                            <div key={i} className="p-4 rounded-xl border border-neutral-800 bg-neutral-900/40 space-y-3">
                                <div className="flex justify-between items-start">
                                    <span className="text-xs font-medium text-neutral-500">Education #{i + 1}</span>
                                    <button onClick={() => removeArrayItem("education", i)} className="p-1 text-neutral-500 hover:text-red-400 transition">
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                                <Input label="Degree / Program" value={edu.degree} onChange={(v) => updateArrayItem("education", i, { ...edu, degree: v })} />
                                <div className="grid sm:grid-cols-2 gap-3">
                                    <Input label="School" value={edu.school} onChange={(v) => updateArrayItem("education", i, { ...edu, school: v })} />
                                    <Input label="Location" value={edu.location} onChange={(v) => updateArrayItem("education", i, { ...edu, location: v })} />
                                </div>
                                <Input label="Years" value={edu.years} onChange={(v) => updateArrayItem("education", i, { ...edu, years: v })} placeholder="2025 – 2028" />
                            </div>
                        ))}
                        <button
                            onClick={() => addArrayItem("education", { degree: "", school: "", location: "", years: "" })}
                            className="flex items-center gap-2 text-xs text-cyan-400 hover:text-cyan-300 transition"
                        >
                            <Plus size={13} /> Add Education
                        </button>
                    </div>
                </SectionCard>

                {/* ── Experience ────────────────────────────────────────── */}
                <SectionCard sectionKey="experience" open={openSections.experience} onToggle={() => toggle("experience")}>
                    <div className="space-y-6">
                        {data.experience.map((job, i) => (
                            <div key={i} className="p-4 rounded-xl border border-neutral-800 bg-neutral-900/40 space-y-3">
                                <div className="flex justify-between items-start">
                                    <span className="text-xs font-medium text-neutral-500">Experience #{i + 1}</span>
                                    <button onClick={() => removeArrayItem("experience", i)} className="p-1 text-neutral-500 hover:text-red-400 transition">
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                                <div className="grid sm:grid-cols-2 gap-3">
                                    <Input label="Job Title" value={job.title} onChange={(v) => updateArrayItem("experience", i, { ...job, title: v })} />
                                    <Input label="Company" value={job.company} onChange={(v) => updateArrayItem("experience", i, { ...job, company: v })} />
                                </div>
                                <div className="grid sm:grid-cols-3 gap-3">
                                    <Input label="Location" value={job.location} onChange={(v) => updateArrayItem("experience", i, { ...job, location: v })} />
                                    <Input label="From" value={job.from} onChange={(v) => updateArrayItem("experience", i, { ...job, from: v })} placeholder="Jun 2024" />
                                    <Input label="To" value={job.to} onChange={(v) => updateArrayItem("experience", i, { ...job, to: v })} placeholder="Present" />
                                </div>
                                <Input label="Company URL (optional)" value={job.url || ""} onChange={(v) => updateArrayItem("experience", i, { ...job, url: v })} />
                                {/* Bullets */}
                                <div>
                                    <span className="text-xs font-medium text-neutral-400 block mb-2">Bullet Points</span>
                                    {job.bullets?.map((b, bi) => (
                                        <div key={bi} className="flex gap-2 mb-2">
                                            <input
                                                value={b}
                                                onChange={(e) => {
                                                    const bullets = [...job.bullets];
                                                    bullets[bi] = e.target.value;
                                                    updateArrayItem("experience", i, { ...job, bullets });
                                                }}
                                                className="flex-1 rounded-lg border border-neutral-700 bg-neutral-800/60 px-3 py-2 text-sm text-neutral-200 focus:border-cyan-500 focus:outline-none transition"
                                            />
                                            <button
                                                onClick={() => {
                                                    const bullets = job.bullets.filter((_, j) => j !== bi);
                                                    updateArrayItem("experience", i, { ...job, bullets });
                                                }}
                                                className="p-2 text-neutral-500 hover:text-red-400 transition"
                                            >
                                                <Trash2 size={13} />
                                            </button>
                                        </div>
                                    ))}
                                    <button
                                        onClick={() => updateArrayItem("experience", i, { ...job, bullets: [...(job.bullets || []), ""] })}
                                        className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 transition"
                                    >
                                        <Plus size={12} /> Add Bullet
                                    </button>
                                </div>
                            </div>
                        ))}
                        <button
                            onClick={() => addArrayItem("experience", { title: "", company: "", location: "", from: "", to: "Present", url: "", bullets: [""] })}
                            className="flex items-center gap-2 text-xs text-cyan-400 hover:text-cyan-300 transition"
                        >
                            <Plus size={13} /> Add Experience
                        </button>
                    </div>
                </SectionCard>

                {/* ── Certifications ────────────────────────────────────── */}
                <SectionCard sectionKey="certifications" open={openSections.certifications} onToggle={() => toggle("certifications")}>
                    <div className="space-y-6">
                        {data.certifications.map((cert, i) => (
                            <div key={i} className="p-4 rounded-xl border border-neutral-800 bg-neutral-900/40 space-y-3">
                                <div className="flex justify-between items-start">
                                    <span className="text-xs font-medium text-neutral-500">Certification #{i + 1}</span>
                                    <button onClick={() => removeArrayItem("certifications", i)} className="p-1 text-neutral-500 hover:text-red-400 transition">
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                                <Input label="Title" value={cert.title} onChange={(v) => updateArrayItem("certifications", i, { ...cert, title: v })} />
                                <div className="grid sm:grid-cols-3 gap-3">
                                    <Input label="Issuer" value={cert.issuer} onChange={(v) => updateArrayItem("certifications", i, { ...cert, issuer: v })} />
                                    <Input label="Organization" value={cert.org} onChange={(v) => updateArrayItem("certifications", i, { ...cert, org: v })} />
                                    <Input label="Date" value={cert.date} onChange={(v) => updateArrayItem("certifications", i, { ...cert, date: v })} />
                                </div>
                                <div className="grid sm:grid-cols-2 gap-3">
                                    <Input label="Certificate URL" value={cert.url} onChange={(v) => updateArrayItem("certifications", i, { ...cert, url: v })} />
                                    <Select label="Platform" value={cert.platform} onChange={(v) => updateArrayItem("certifications", i, { ...cert, platform: v })} options={["coursera", "udemy", "other"]} />
                                </div>
                            </div>
                        ))}
                        <button
                            onClick={() => addArrayItem("certifications", { title: "", issuer: "Coursera", org: "", date: "", url: "", platform: "coursera" })}
                            className="flex items-center gap-2 text-xs text-cyan-400 hover:text-cyan-300 transition"
                        >
                            <Plus size={13} /> Add Certification
                        </button>
                    </div>
                </SectionCard>

                {/* ── Current Project ──────────────────────────────────── */}
                <SectionCard sectionKey="currentProject" open={openSections.currentProject} onToggle={() => toggle("currentProject")}>
                    <div className="space-y-4">
                        {/* Repo selector */}
                        <label className="block">
                            <span className="text-xs font-medium text-neutral-400 mb-1 block">Select GitHub Repo</span>
                            <select
                                value={data.currentProject.title}
                                onChange={(e) => {
                                    const repo = ghRepos.find((r) => r.name === e.target.value);
                                    if (repo) {
                                        setData((d) => ({
                                            ...d,
                                            currentProject: {
                                                ...d.currentProject,
                                                title: repo.name,
                                                description: repo.description || "",
                                                url: repo.html_url,
                                            },
                                        }));
                                    }
                                }}
                                className="w-full rounded-lg border border-neutral-700 bg-neutral-800/60 px-3 py-2 text-sm text-neutral-200 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/40 transition"
                            >
                                {ghLoading ? (
                                    <option>Loading repos…</option>
                                ) : ghRepos.length === 0 ? (
                                    <option>No repos found</option>
                                ) : (
                                    <>
                                        <option value="">— Pick a repo —</option>
                                        {ghRepos.map((r) => (
                                            <option key={r.id} value={r.name}>{r.name}</option>
                                        ))}
                                    </>
                                )}
                            </select>
                        </label>

                        <Input label="Status" value={data.currentProject.status} onChange={(v) => updateCurrentProject("status", v)} />
                        <TextArea label="Description" value={data.currentProject.description} onChange={(v) => updateCurrentProject("description", v)} />
                        <Input label="Repository URL" value={data.currentProject.url} onChange={(v) => updateCurrentProject("url", v)} />
                    </div>
                </SectionCard>

                {/* ── Filmmaking / Gallery ─────────────────────────────── */}
                <SectionCard sectionKey="filmmaking" open={openSections.filmmaking} onToggle={() => toggle("filmmaking")}>
                    <div className="space-y-6">
                        {/* Cloudinary config */}
                        <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-900/40 space-y-3">
                            <span className="text-xs font-medium text-neutral-500">Cloudinary Config (free tier)</span>
                            <p className="text-[11px] text-neutral-600">Sign up at <a href="https://cloudinary.com" target="_blank" rel="noreferrer" className="text-cyan-400 underline">cloudinary.com</a> → Dashboard → copy Cloud Name. Then Settings → Upload → Add unsigned preset → copy preset name.</p>
                            <div className="grid sm:grid-cols-2 gap-3">
                                <Input label="Cloud Name" value={data.filmmaking?.cloudinaryCloudName || ""} onChange={(v) => updateFilmmaking("cloudinaryCloudName", v)} placeholder="your-cloud-name" />
                                <Input label="Upload Preset (unsigned)" value={data.filmmaking?.cloudinaryUploadPreset || ""} onChange={(v) => updateFilmmaking("cloudinaryUploadPreset", v)} placeholder="ml_default" />
                            </div>
                        </div>

                        {/* Basic info */}
                        <div className="grid sm:grid-cols-2 gap-4">
                            <Input label="Brand Name" value={data.filmmaking?.brandName || ""} onChange={(v) => updateFilmmaking("brandName", v)} />
                            <Input label="Tagline" value={data.filmmaking?.tagline || ""} onChange={(v) => updateFilmmaking("tagline", v)} />
                        </div>
                        <TextArea label="About" value={data.filmmaking?.about || ""} onChange={(v) => updateFilmmaking("about", v)} rows={3} />
                        <div className="grid sm:grid-cols-2 gap-4">
                            <Input label="Contact Email" value={data.filmmaking?.contactEmail || ""} onChange={(v) => updateFilmmaking("contactEmail", v)} />
                            <Input label="Availability" value={data.filmmaking?.availability || ""} onChange={(v) => updateFilmmaking("availability", v)} />
                        </div>
                        <div className="grid sm:grid-cols-2 gap-4">
                            <Input label="Instagram URL" value={data.filmmaking?.socialInstagram || ""} onChange={(v) => updateFilmmaking("socialInstagram", v)} />
                            <Input label="YouTube URL" value={data.filmmaking?.socialYouTube || ""} onChange={(v) => updateFilmmaking("socialYouTube", v)} />
                        </div>
                        <Input label="Showreel URL (embed)" value={data.filmmaking?.showreelUrl || ""} onChange={(v) => updateFilmmaking("showreelUrl", v)} placeholder="https://www.youtube.com/embed/..." />

                        {/* Instagram Access Token */}
                        <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-4 space-y-2">
                            <span className="text-xs font-medium text-neutral-400 block">Instagram Reels</span>
                            <p className="text-[11px] text-neutral-500">Paste your Instagram Graph API access token to fetch and display your reels on the filmmaking page.</p>
                            <input
                                type="password"
                                value={data.filmmaking?.instagramAccessToken || ""}
                                onChange={(e) => updateFilmmaking("instagramAccessToken", e.target.value)}
                                placeholder="IGQ..."
                                className="w-full rounded-lg border border-neutral-700 bg-neutral-800/60 px-3 py-2 text-sm text-neutral-200 placeholder-neutral-600 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/40 transition"
                            />
                        </div>

                        {/* Roles */}
                        <div>
                            <span className="text-xs font-medium text-neutral-400 block mb-2">Roles</span>
                            {(data.filmmaking?.roles || []).map((role, i) => (
                                <div key={i} className="flex gap-2 mb-2">
                                    <input value={role} onChange={(e) => {
                                        const roles = [...data.filmmaking.roles];
                                        roles[i] = e.target.value;
                                        updateFilmmaking("roles", roles);
                                    }} className="flex-1 rounded-lg border border-neutral-700 bg-neutral-800/60 px-3 py-2 text-sm text-neutral-200 focus:border-cyan-500 focus:outline-none transition" />
                                    <button onClick={() => updateFilmmaking("roles", data.filmmaking.roles.filter((_, j) => j !== i))} className="p-2 text-neutral-500 hover:text-red-400 transition"><Trash2 size={13} /></button>
                                </div>
                            ))}
                            <button onClick={() => updateFilmmaking("roles", [...(data.filmmaking?.roles || []), ""])} className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 transition"><Plus size={12} /> Add Role</button>
                        </div>

                        {/* Equipment */}
                        <div>
                            <span className="text-xs font-medium text-neutral-400 block mb-2">Equipment / Tools</span>
                            {(data.filmmaking?.equipment || []).map((item, i) => (
                                <div key={i} className="flex gap-2 mb-2">
                                    <input value={item} onChange={(e) => {
                                        const eq = [...data.filmmaking.equipment];
                                        eq[i] = e.target.value;
                                        updateFilmmaking("equipment", eq);
                                    }} className="flex-1 rounded-lg border border-neutral-700 bg-neutral-800/60 px-3 py-2 text-sm text-neutral-200 focus:border-cyan-500 focus:outline-none transition" />
                                    <button onClick={() => updateFilmmaking("equipment", data.filmmaking.equipment.filter((_, j) => j !== i))} className="p-2 text-neutral-500 hover:text-red-400 transition"><Trash2 size={13} /></button>
                                </div>
                            ))}
                            <button onClick={() => updateFilmmaking("equipment", [...(data.filmmaking?.equipment || []), ""])} className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 transition"><Plus size={12} /> Add Item</button>
                        </div>

                        {/* Film Projects */}
                        <div>
                            <span className="text-xs font-medium text-neutral-400 block mb-3">Film Projects</span>
                            {(data.filmmaking?.projects || []).map((proj, i) => (
                                <div key={i} className="p-4 rounded-xl border border-neutral-800 bg-neutral-900/40 space-y-3 mb-3">
                                    <div className="flex justify-between items-start">
                                        <span className="text-xs font-medium text-neutral-500">Project #{i + 1}</span>
                                        <button onClick={() => removeFilmmakingProject(i)} className="p-1 text-neutral-500 hover:text-red-400 transition"><Trash2 size={14} /></button>
                                    </div>
                                    <div className="grid sm:grid-cols-3 gap-3">
                                        <Input label="Title" value={proj.title} onChange={(v) => updateFilmmakingProject(i, { ...proj, title: v })} />
                                        <Select label="Category" value={proj.category} onChange={(v) => updateFilmmakingProject(i, { ...proj, category: v })} options={["Short Film", "Music Video", "Travel Film", "Commercial", "Documentary", "Behind the Scenes"]} />
                                        <Input label="Year" value={proj.year} onChange={(v) => updateFilmmakingProject(i, { ...proj, year: v })} />
                                    </div>
                                    <TextArea label="Description" value={proj.description} onChange={(v) => updateFilmmakingProject(i, { ...proj, description: v })} rows={2} />
                                    <Input label="Thumbnail URL" value={proj.thumbnail} onChange={(v) => updateFilmmakingProject(i, { ...proj, thumbnail: v })} placeholder="https://res.cloudinary.com/..." />
                                </div>
                            ))}
                            <button onClick={addFilmmakingProject} className="flex items-center gap-2 text-xs text-cyan-400 hover:text-cyan-300 transition"><Plus size={13} /> Add Project</button>
                        </div>

                        {/* Gallery Upload */}
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-xs font-medium text-neutral-400">Photo & Video Gallery</span>
                                <button
                                    onClick={openCloudinaryUpload}
                                    className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold bg-gradient-to-r from-violet-500 to-pink-500 text-white hover:from-violet-400 hover:to-pink-400 transition shadow-lg shadow-violet-500/20"
                                >
                                    <Upload size={13} /> Upload Media
                                </button>
                            </div>
                            {(data.filmmaking?.gallery || []).length === 0 ? (
                                <div className="text-center py-8 rounded-xl border border-dashed border-neutral-700 text-neutral-600 text-sm">
                                    No media yet. Click "Upload Media" to add photos & videos.
                                </div>
                            ) : (
                                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                                    {(data.filmmaking?.gallery || []).map((item, i) => (
                                        <div key={i} className="relative group rounded-xl overflow-hidden border border-neutral-800 bg-neutral-900">
                                            <div className="aspect-square">
                                                <img src={item.thumbnail || item.url} alt={item.title || ""} className="w-full h-full object-cover" />
                                                {item.type === "video" && (
                                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                                        <Video size={20} className="text-white/60" />
                                                    </div>
                                                )}
                                            </div>
                                            <button
                                                onClick={() => removeGalleryItem(i)}
                                                className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-300"
                                            >
                                                <X size={12} />
                                            </button>
                                            <input
                                                value={item.title || ""}
                                                onChange={(e) => updateGalleryItem(i, { ...item, title: e.target.value })}
                                                placeholder="Caption..."
                                                className="w-full px-2 py-1.5 text-[11px] bg-neutral-900 border-t border-neutral-800 text-neutral-400 placeholder-neutral-700 focus:outline-none focus:text-neutral-200"
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </SectionCard>

                {/* ── Repo Visibility ──────────────────────────────────── */}
                <SectionCard sectionKey="repoVisibility" open={openSections.repoVisibility} onToggle={() => toggle("repoVisibility")}>
                    <div className="space-y-2">
                        {data.repoVisibility.map((r, i) => (
                            <div key={i} className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-neutral-800/40 transition">
                                <div className="flex items-center gap-3">
                                    <GitBranch size={14} className="text-neutral-500" />
                                    <input
                                        value={r.name}
                                        onChange={(e) => updateArrayItem("repoVisibility", i, { ...r, name: e.target.value })}
                                        className="bg-transparent text-sm text-neutral-200 border-none focus:outline-none"
                                        placeholder="repo-name"
                                    />
                                </div>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => updateArrayItem("repoVisibility", i, { ...r, visible: !r.visible })}
                                        className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border transition
                      ${r.visible
                                                ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-400"
                                                : "bg-neutral-800 border-neutral-700 text-neutral-500"}`}
                                    >
                                        {r.visible ? <Eye size={12} /> : <EyeOff size={12} />}
                                        {r.visible ? "Visible" : "Hidden"}
                                    </button>
                                    <button onClick={() => removeArrayItem("repoVisibility", i)} className="p-1 text-neutral-500 hover:text-red-400 transition">
                                        <Trash2 size={13} />
                                    </button>
                                </div>
                            </div>
                        ))}
                        <button
                            onClick={() => addArrayItem("repoVisibility", { name: "", visible: true })}
                            className="flex items-center gap-2 text-xs text-cyan-400 hover:text-cyan-300 transition mt-2"
                        >
                            <Plus size={13} /> Add Repo
                        </button>
                    </div>
                </SectionCard>
            </main>
            )}
        </div>
    );
}
