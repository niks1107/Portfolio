import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loadStore, saveStore, resetStore, DEFAULTS } from "./data/portfolioStore";
import {
    Save, RotateCcw, ArrowLeft, Plus, Trash2, Eye, EyeOff,
    User, Wrench, GraduationCap, Briefcase, Award, Rocket,
    GitBranch, Share2, ChevronDown, ChevronUp, Check, Loader2, Key,
} from "lucide-react";

const SECTION_ICONS = {
    profile: User,
    socials: Share2,
    skills: Wrench,
    education: GraduationCap,
    experience: Briefcase,
    certifications: Award,
    currentProject: Rocket,
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
export default function Admin() {
    const navigate = useNavigate();
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
