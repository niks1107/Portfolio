/**
 * REPO VISIBILITY CONFIG
 * ─────────────────────────────────────────────────────────────
 * Control which GitHub repositories appear in your portfolio.
 *
 * Set  visible: true   → repo IS shown
 * Set  visible: false  → repo is HIDDEN
 *
 * Any repo not listed here will be HIDDEN by default.
 * To show a new repo, just add it to the list below.
 *
 * Tip: run `npm run dev` and check http://localhost:5173 to preview.
 */

const REPO_CONFIG = [
    { name: "Portfolio", visible: false }, // the portfolio itself — usually hidden
    { name: "Weather-App", visible: true },
    { name: "EverTrack", visible: true },
    { name: "Restaurant", visible: true },
    { name: "paradise-wallpaper", visible: true },
    { name: "deutsch-easy-play", visible: true },
    { name: "FreshMart", visible: true },
    { name: "codingsols", visible: true },
    { name: "the-Air-Cafe", visible: true },
    { name: "Niks1107", visible: false }, // profile README — usually hidden
    { name: "brew", visible: false }, // fork — usually hidden
];

export default REPO_CONFIG;
