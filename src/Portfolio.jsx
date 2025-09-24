import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { FaInstagram, FaLinkedin, FaTwitter, FaMedium } from "react-icons/fa";


const GITHUB_USERNAME_DEFAULT = "niks1107";

export default function Portfolio() {
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "dark");
  const [repos, setRepos] = useState([]);
  const location = "Essen, Germany";

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  // fetch repos (up to 25)
  useEffect(() => {
    let mounted = true;
    async function fetchRepos() {
      try {
        const res = await fetch(`https://api.github.com/users/${GITHUB_USERNAME_DEFAULT}/repos?per_page=100&sort=updated`);
        if (!res.ok) return;
        const data = await res.json();
        if (!mounted) return;
        setRepos(Array.isArray(data) ? data.slice(0, 25) : []);
      } catch (e) {
        console.error(e);
      }
    }
    fetchRepos();
    return () => { mounted = false; };
  }, []);

  const repoCountDisplay = useMemo(() => (repos.length > 25 ? "25+" : `${repos.length}`), [repos.length]);

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  return (
    <div className="min-h-screen bg-background text-white dark:bg-background">
      {/* Navbar */}
      <nav className="fixed top-0 w-full bg-[#0f111a]/90 dark:bg-[#0f111a]/95 border-b border-neutral-800 z-50">
        <div className="max-w-6xl mx-auto flex justify-between items-center px-4 py-3">
          <h1 className="text-xl font-bold text-ocean-300">Nevil Amraniya</h1>
          <div className="flex items-center space-x-6">
            <a href="#about" className="hover:text-ocean-300">About</a>
            <a href="#skills" className="hover:text-ocean-300">Skills</a>
            <a href="#education" className="hover:text-ocean-300">Education</a>
            <a href="#contact" className="hover:text-ocean-300">Contact</a>
            <span className="px-3 py-1 text-xs bg-neutral-900 rounded-full border border-neutral-700">{repoCountDisplay} projects</span>
            <button onClick={toggleTheme} aria-label="Toggle theme" className="p-2 rounded-full bg-neutral-800 hover:bg-neutral-700">
              {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          </div>
        </div>
      </nav>

      <main className="pt-20">
        {/* Hero */}
        <section className="h-[70vh] flex flex-col justify-center items-center text-center px-6">
          <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-4xl md:text-5xl font-bold text-ocean-300">
            Hi, I'm Nevil Amraniya
          </motion.h2>
          <p className="mt-4 text-lg max-w-2xl text-neutral-300">Fresher AI/ML Enthusiast based in Essen, Germany.</p>
        </section>

        {/* About */}
        <section id="about" className="max-w-6xl mx-auto px-6 py-16">
          <h3 className="text-2xl font-bold mb-4 text-ocean-300">About Me</h3>
          <p className="text-neutral-300 leading-relaxed">
            I’m passionate about Artificial Intelligence and Machine Learning, eager to explore data, build predictive models, and create impactful applications.
            Currently pursuing a BSc in Computer Science and Digital Technologies at FOM University of Applied Sciences, Essen, Germany.
          </p>
        </section>

        {/* Skills */}
        <section id="skills" className="max-w-6xl mx-auto px-6 py-16">
          <h3 className="text-2xl font-bold mb-6 text-ocean-300">Skills</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {[
              "Python", "NumPy", "Pandas", "Flask",
              "Java", "scikit-learn", "TensorFlow", "PyTorch",
              "Keras", "Matplotlib", "Statistics", "Calculus"
            ].map((skill) => (
              <div key={skill} className="bg-surface rounded-xl p-4 text-center text-neutral-200 border border-neutral-800">
                {skill}
              </div>
            ))}
          </div>
        </section>

        {/* Education */}
        <section id="education" className="max-w-6xl mx-auto px-6 py-16">
          <h3 className="text-2xl font-bold mb-6 text-ocean-300">Education</h3>
          <div className="space-y-6">
            <div className="rounded-xl p-5 bg-surface border border-neutral-800">
              <div className="font-medium">BSc in Computer Science and Digital Technologies</div>
              <div className="text-sm text-neutral-400">FOM University of Applied Science, Essen, Germany (2025–2028)</div>
            </div>
            <div className="rounded-xl p-5 bg-surface border border-neutral-800">
              <div className="font-medium">Diploma in Computer Engineering</div>
              <div className="text-sm text-neutral-400">Government Polytechnic Jamnagar, India (2019–2023)</div>
            </div>
            <div className="rounded-xl p-5 bg-surface border border-neutral-800">
              <div className="font-medium">Schooling</div>
              <div className="text-sm text-neutral-400">Krishna Science School, Jamnagar (2019)</div>
            </div>
          </div>
        </section>

       {/* Projects */}
<section id="projects" className="max-w-6xl mx-auto px-6 py-16">
  <h3 className="text-2xl font-bold mb-6 text-ocean-300">Notable Projects</h3>
  {repos.length === 0 ? (
    <p className="text-neutral-400">Loading repositories...</p>
  ) : (
    <div className="grid gap-6 sm:grid-cols-2">
      {repos.map((r) => (
        <a
          key={r.id}
          href={r.html_url}
          target="_blank"
          rel="noreferrer"
          className="block p-4 bg-surface rounded-xl border border-neutral-800 hover:border-ocean-300 hover:shadow-lg transition"
        >
          <div className="font-semibold text-ocean-200">{r.name}</div>
        </a>
      ))}
    </div>
  )}
</section>

        {/* Contact */}
        <section id="contact" className="max-w-6xl mx-auto px-6 py-16">
          <h3 className="text-2xl font-bold mb-6 text-ocean-300">Contact</h3>
          <p className="text-neutral-300">Feel free to reach out via email: <a className="text-ocean-300" href="mailto:framesofnevil@gmail.com">framesofnevil@gmail.com</a></p>
      












        </section>
<footer className="py-8 text-center text-neutral-500 flex flex-col items-center gap-3">
  <div>© {new Date().getFullYear()} Nevil Amraniya</div>
  <div className="flex gap-4">
    <a href="https://www.instagram.com/nevilamraniya07" target="_blank" rel="noreferrer" className="hover:text-ocean-300">
      <FaInstagram size={20} />
    </a>
    <a href="https://www.linkedin.com/in/nevil-amraniya-51b202317/" target="_blank" rel="noreferrer" className="hover:text-ocean-300">
      <FaLinkedin size={20} />
    </a>
    <a href="https://twitter.com/nevilamraniya01" target="_blank" rel="noreferrer" className="hover:text-ocean-300">
      <FaTwitter size={20} />
    </a>
    <a href="https://medium.com/@qnztrrfn  " target="_blank" rel="noreferrer" className="hover:text-ocean-300">
      <FaMedium size={20} />
    </a>
  </div>

</footer>

      </main>
    </div>
  );
}