/**
 * PORTFOLIO DATA STORE
 * ─────────────────────────────────────────────────────────────
 * Central store backed by a JSON file committed to the repo.
 * Admin changes are pushed via the GitHub Contents API, which
 * creates a commit so the hosted site updates on rebuild.
 */

const GITHUB_OWNER = "niks1107";
const GITHUB_REPO = "Portfolio";
const DATA_PATH = "public/data.json";                // path inside the repo
const GITHUB_API = "https://api.github.com";

const DEFAULTS = {
    profile: {
        name: "Nevil Amraniya",
        tagline:
            "AI / ML Enthusiast & CS Student — building intelligent systems, one model at a time.",
        location: "Essen, Germany",
        email: "framesofnevil@gmail.com",
        githubUsername: "niks1107",
        aboutText:
            "I'm passionate about Artificial Intelligence and Machine Learning — eager to explore data, build predictive models, and create impactful applications. Currently pursuing a BSc in Computer Science and Digital Technologies at FOM University of Applied Sciences, Essen, Germany. I love turning complex data into tangible solutions and I'm constantly looking to collaborate on open-source AI projects.",
    },

    socials: [
        { platform: "Instagram", url: "https://www.instagram.com/nevilamraniya07" },
        { platform: "LinkedIn", url: "https://www.linkedin.com/in/nevil-amraniya-51b202317/" },
        { platform: "Twitter", url: "https://twitter.com/nevilamraniya01" },
        { platform: "Medium", url: "https://medium.com/@qnztrrfn" },
    ],

    skills: [
        { name: "Python", category: "Lang" },
        { name: "Java", category: "Lang" },
        { name: "NumPy", category: "Data" },
        { name: "Pandas", category: "Data" },
        { name: "Matplotlib", category: "Data" },
        { name: "scikit-learn", category: "ML" },
        { name: "TensorFlow", category: "ML" },
        { name: "PyTorch", category: "ML" },
        { name: "Keras", category: "ML" },
        { name: "Flask", category: "Web" },
        { name: "Statistics", category: "Math" },
        { name: "Calculus", category: "Math" },
    ],

    education: [
        {
            degree: "BSc in Computer Science and Digital Technologies",
            school: "FOM University of Applied Sciences",
            location: "Essen, Germany",
            years: "2025 – 2028",
        },
        {
            degree: "Diploma in Computer Engineering",
            school: "Government Polytechnic Jamnagar",
            location: "India",
            years: "2019 – 2023",
        },
    ],

    experience: [
        {
            title: "Machine Learning Intern",
            company: "Acme Corp",
            location: "Berlin, Germany",
            from: "Jun 2024",
            to: "Aug 2024",
            url: "https://acme.com",
            bullets: [
                "Built a recommendation engine with PyTorch, improving CTR by 12%.",
                "Automated data-cleaning pipeline reducing preprocessing time by 40%.",
                "Collaborated with a cross-functional team of 6 engineers.",
            ],
        },
    ],

    certifications: [
        {
            title: "Programming for Everybody (Getting Started with Python)",
            issuer: "Coursera",
            org: "University of Michigan",
            date: "2024",
            url: "https://coursera.org/share/d86f4ffa4d9ec06db9ae38498592457c",
            platform: "coursera",
        },
    ],

    currentProject: {
        title: "QLess",
        description:
            "A queue management system designed to reduce wait times and improve customer experience through smart scheduling and real-time updates.",
        url: "https://github.com/niks1107/QLess",
        status: "In Progress",
    },

    repoVisibility: [
        { name: "Portfolio", visible: false },
        { name: "Weather-App", visible: true },
        { name: "EverTrack", visible: true },
        { name: "Restaurant", visible: true },
        { name: "paradise-wallpaper", visible: true },
        { name: "deutsch-easy-play", visible: true },
        { name: "FreshMart", visible: true },
        { name: "codingsols", visible: true },
        { name: "the-Air-Cafe", visible: true },
        { name: "Niks1107", visible: false },
        { name: "brew", visible: false },
    ],
};

/** Load store from local data.json — returns DEFAULTS on failure */
export async function loadStore() {
    try {
        const res = await fetch("/data.json");
        if (res.ok) return await res.json();
    } catch { /* network error → use defaults */ }
    return structuredClone(DEFAULTS);
}

/**
 * Save store by committing data.json to GitHub via the Contents API.
 * @param {object} data  – full portfolio data object
 * @param {string} token – GitHub Personal Access Token (fine-grained or classic with `repo` scope)
 */
export async function saveStore(data, token) {
    // 1. Get the current file's SHA (required for updates)
    const fileUrl = `${GITHUB_API}/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${DATA_PATH}`;
    const headers = {
        Authorization: `token ${token}`,
        Accept: "application/vnd.github.v3+json",
    };

    const existing = await fetch(fileUrl, { headers });
    let sha;
    if (existing.ok) {
        const meta = await existing.json();
        sha = meta.sha;
    }

    // 2. Commit the updated file
    const body = {
        message: "Update portfolio data",
        content: btoa(unescape(encodeURIComponent(JSON.stringify(data, null, 2)))),
        ...(sha && { sha }),
    };

    const res = await fetch(fileUrl, {
        method: "PUT",
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });

    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "GitHub API error");
    }
}

/** Reset to factory defaults (commits defaults to GitHub) */
export async function resetStore(token) {
    const fresh = structuredClone(DEFAULTS);
    await saveStore(fresh, token);
    return fresh;
}

export { DEFAULTS };
