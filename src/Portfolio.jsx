import { useState, useEffect, useMemo } from "react";
import { Sun, Moon } from "lucide-react";
import { FaInstagram, FaLinkedin, FaTwitter, FaMedium } from "react-icons/fa";

const GITHUB_USERNAME_DEFAULT = "niks1107";

export default function Portfolio() {
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "dark");
  const [repos, setRepos] = useState([]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  // fetch repos (up to 25)
  useEffect(() => {
    let mounted = true;
    async function fetchRepos() {
      try {
        const res = await fetch(
          `https://api.github.com/users/${GITHUB_USERNAME_DEFAULT}/repos?per_page=100&sort=updated`
        );
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

  const repoCountDisplay = useMemo(
    () => (repos.length > 25 ? "25+" : `${repos.length}`),
    [repos.length]
  );

  const toggleTheme = () =>
    setTheme((t) => (t === "dark" ? "light" : "dark"));

  return (
    <div className="min-h-screen bg-white text-black dark:bg-background dark:text-white transition-colors duration-300">
      {/* Navbar */}
      <nav className="fixed top-0 w-full bg-white/90 dark:bg-[#0f111a]/95 border-b border-neutral-200 dark:border-neutral-800 z-50 transition-colors duration-300">
        <div className="max-w-6xl mx-auto flex flex-wrap md:flex-nowrap justify-between items-center px-4 py-3 gap-2">
          <h1 className={`text-xl font-bold ${theme === "dark" ? "text-ocean-500" : "text-black"}`}>
            Nevil Amraniya
          </h1>
          <div className="flex flex-wrap md:flex-nowrap items-center gap-3 md:gap-6">
            <a href="#about" className={`${theme === "dark" ? "hover:text-ocean-500" : "hover:text-gray-700"} transition-colors duration-300`}>About</a>
            <a href="#skills" className={`${theme === "dark" ? "hover:text-ocean-500" : "hover:text-gray-700"} transition-colors duration-300`}>Skills</a>
            <a href="#education" className={`${theme === "dark" ? "hover:text-ocean-500" : "hover:text-gray-700"} transition-colors duration-300`}>Education</a>
            <a href="#contact" className={`${theme === "dark" ? "hover:text-ocean-500" : "hover:text-gray-700"} transition-colors duration-300`}>Contact</a>
            <span className="px-3 py-1 text-xs bg-neutral-100 dark:bg-neutral-900 rounded-full border border-neutral-300 dark:border-neutral-700 transition-colors duration-300">
              {repoCountDisplay} projects
            </span>
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="p-2 rounded-full bg-neutral-200 hover:bg-neutral-300 dark:bg-neutral-800 dark:hover:bg-neutral-700 transition-colors duration-300"
            >
              {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          </div>
        </div>
      </nav>

      <main className="pt-24 px-4 md:px-6 lg:px-0">
        {/* Hero */}
        <section className="h-[60vh] md:h-[70vh] flex flex-col justify-center items-center text-center px-4 sm:px-6 lg:px-0">
          <h2 className={`text-3xl sm:text-4xl md:text-5xl font-bold ${theme === "dark" ? "text-ocean-500" : "text-black"}`}>
            Hi, I'm Nevil Amraniya
          </h2>
          <p className="mt-3 text-base sm:text-lg md:text-xl max-w-xl">
            Fresher AI/ML Enthusiast based in Essen, Germany.
          </p>
        </section>

        {/* About */}
        <section id="about" className="max-w-6xl mx-auto py-16">
          <h3 className={`text-2xl font-bold mb-4 ${theme === "dark" ? "text-ocean-500" : "text-black"}`}>About Me</h3>
          <p className="leading-relaxed text-base sm:text-lg">
            I’m passionate about Artificial Intelligence and Machine Learning,
            eager to explore data, build predictive models, and create impactful
            applications. Currently pursuing a BSc in Computer Science and
            Digital Technologies at FOM University of Applied Sciences, Essen,
            Germany.
          </p>
        </section>

        {/* Skills */}
        <section id="skills" className="max-w-6xl mx-auto py-16">
          <h3 className={`text-2xl font-bold mb-6 ${theme === "dark" ? "text-ocean-500" : "text-black"}`}>Skills</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              "Python","NumPy","Pandas","Flask","Java","scikit-learn",
              "TensorFlow","PyTorch","Keras","Matplotlib","Statistics","Calculus",
            ].map((skill) => (
              <div key={skill} className="bg-neutral-100 dark:bg-surface rounded-xl p-4 text-center border border-neutral-300 dark:border-neutral-800">
                {skill}
              </div>
            ))}
          </div>
        </section>

        {/* Education */}
        <section id="education" className="max-w-6xl mx-auto py-16">
          <h3 className={`text-2xl font-bold mb-6 ${theme === "dark" ? "text-ocean-500" : "text-black"}`}>Education</h3>
          <div className="space-y-6">
            {[
              { degree: "BSc in Computer Science and Digital Technologies", school: "FOM University of Applied Science, Essen, Germany (2025–2028)" },
              { degree: "Diploma in Computer Engineering", school: "Government Polytechnic Jamnagar, India (2019–2023)" },
              { degree: "Schooling", school: "Krishna Science School, Jamnagar (2019)" }
            ].map((edu, idx) => (
              <div key={idx} className="rounded-xl p-5 bg-neutral-100 dark:bg-surface border border-neutral-300 dark:border-neutral-800">
                <div className="font-medium">{edu.degree}</div>
                <div className="text-sm text-black dark:text-neutral-400">{edu.school}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Projects */}
        <section id="projects" className="max-w-6xl mx-auto py-16">
          <h3 className={`text-2xl font-bold mb-6 ${theme === "dark" ? "text-ocean-500" : "text-black"}`}>Notable Projects</h3>
          {repos.length === 0 ? (
            <p>Loading repositories...</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {repos.map((r) => (
                <a
                  key={r.id}
                  href={r.html_url}
                  target="_blank"
                  rel="noreferrer"
                  className="block p-4 bg-neutral-100 dark:bg-surface rounded-xl border border-neutral-300 dark:border-neutral-800 hover:border-ocean-500 dark:hover:border-ocean-300 hover:shadow-lg transition-all duration-300"
                >
                  <div className={`${theme === "dark" ? "text-ocean-200" : "text-black"} font-semibold`}>
                    {r.name}
                  </div>
                </a>
              ))}
            </div>
          )}
        </section>

        {/* Contact */}
        <section id="contact" className="max-w-6xl mx-auto py-16">
          <h3 className={`text-2xl font-bold mb-6 ${theme === "dark" ? "text-ocean-500" : "text-black"}`}>Contact</h3>
          <p>
            Feel free to reach out via email:{" "}
            <a href="mailto:framesofnevil@gmail.com" className={`${theme === "dark" ? "text-ocean-300" : "text-black"}`}>
              framesofnevil@gmail.com
            </a>
          </p>
        </section>

        {/* Footer */}
        <footer className="py-8 text-center flex flex-col items-center gap-3">
          <div className={`${theme === "dark" ? "text-neutral-500" : "text-black"}`}>© {new Date().getFullYear()} Nevil Amraniya</div>
          <div className="flex gap-4">
            <a href="https://www.instagram.com/nevilamraniya07" target="_blank" rel="noreferrer"> <FaInstagram size={20} /> </a>
            <a href="https://www.linkedin.com/in/nevil-amraniya-51b202317/" target="_blank" rel="noreferrer"> <FaLinkedin size={20} /> </a>
            <a href="https://twitter.com/nevilamraniya01" target="_blank" rel="noreferrer"> <FaTwitter size={20} /> </a>
            <a href="https://medium.com/@qnztrrfn" target="_blank" rel="noreferrer"> <FaMedium size={20} /> </a>
          </div>
        </footer>
      </main>
    </div>
  );
}
