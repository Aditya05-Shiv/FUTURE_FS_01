import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  Code2,
  Github,
  Linkedin,
  Mail,
  Menu,
  Moon,
  Phone,
  Send,
  Sun,
  X
} from "lucide-react";

const skills = [
  "HTML",
  "CSS",
  "JavaScript",
  "React.js",
  "Node.js",
  "Express.js",
  "MongoDB",
  "REST APIs",
  "Responsive UI",
  "Git & GitHub"
];

const projects = [
  {
    title: "AI-Based Employee Performance Analytics",
    type: "MERN HR analytics platform",
    description:
      "A full-stack HR analytics system for employee management, performance tracking, dashboard rankings, and AI-powered promotion and training recommendations with fallback logic.",
    stack: ["MongoDB", "Express", "React", "Node.js", "JWT", "bcrypt", "OpenAI API"],
    status: "Deployed",
    liveUrl: "https://ai-based-employee-performance-analytics-7p6e.onrender.com/",
    codeUrl:
      "https://github.com/Aditya05-Shiv/AI-Based-Employee-Performance-Analytics-Recommendation-System"
  },
  {
    title: "Professional Portfolio",
    type: "Full-stack website",
    description:
      "A responsive portfolio with interactive resume sections, SEO metadata, and a MongoDB-backed contact form.",
    stack: ["React", "Express", "MongoDB", "Vite"],
    status: "Current build"
  },
  {
    title: "Future Interns Task Hub",
    type: "Internship project tracker",
    description:
      "A project showcase area designed to document internship tasks, technical decisions, and proof of work as new tasks are completed.",
    stack: ["React", "JavaScript", "CSS"],
    status: "In progress"
  },
  {
    title: "Contact Message API",
    type: "Backend service",
    description:
      "An Express API that validates portfolio inquiries, stores them in MongoDB, and can send email notifications through SMTP.",
    stack: ["Node.js", "Express", "Mongoose"],
    status: "Live-ready"
  }
];

const experience = [
  {
    label: "Focus",
    value: "Full Stack Web Development",
    detail: "Building modern interfaces and practical backend services."
  },
  {
    label: "Goal",
    value: "Production-ready developer",
    detail: "Grow through real projects, clean code, and clear communication."
  },
  {
    label: "Interests",
    value: "Web apps, APIs, UI systems",
    detail: "I enjoy turning ideas into usable, responsive digital products."
  }
];

function App() {
  const [isDark, setIsDark] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState({ type: "idle", message: "" });

  const apiBase = useMemo(
    () => import.meta.env.VITE_API_URL || (import.meta.env.DEV ? "http://localhost:5050" : ""),
    []
  );

  useEffect(() => {
    document.title = "Aditya Shivhare | Full Stack Web Developer";
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ type: "loading", message: "Sending your message..." });

    try {
      const response = await fetch(`${apiBase}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to send message.");
      }

      setForm({ name: "", email: "", subject: "", message: "" });
      setStatus({ type: "success", message: data.message });
    } catch (error) {
      setStatus({ type: "error", message: error.message });
    }
  };

  const navItems = ["Projects", "About", "Contact"];

  return (
    <div className={isDark ? "app theme-dark" : "app theme-light"}>
      <header className="site-header">
        <a className="brand" href="#home" aria-label="Aditya Shivhare home">
          AS
        </a>

        <nav className={menuOpen ? "nav-links open" : "nav-links"} aria-label="Primary navigation">
          {navItems.map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setMenuOpen(false)}>
              {item}
            </a>
          ))}
        </nav>

        <div className="header-actions">
          <button
            className="icon-button"
            type="button"
            onClick={() => setIsDark((value) => !value)}
            aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
            title={isDark ? "Light theme" : "Dark theme"}
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button
            className="icon-button menu-toggle"
            type="button"
            onClick={() => setMenuOpen((value) => !value)}
            aria-label="Toggle navigation menu"
            title="Menu"
          >
            {menuOpen ? <X size={19} /> : <Menu size={19} />}
          </button>
        </div>
      </header>

      <main>
        <section className="hero section-shell" id="home">
          <div className="hero-copy">
            <h1>Aditya Shivhare</h1>
            <p className="hero-text">
              I build clean, responsive web applications with React, Node.js, and MongoDB. This
              portfolio is my working resume: part proof of skill, part project journal, and part
              invitation to collaborate.
            </p>
            <div className="hero-actions">
              <a className="primary-button" href="#projects">
                <BriefcaseBusiness size={18} />
                View Work
              </a>
              <a className="secondary-button" href="#contact">
                <Mail size={18} />
                Contact Me
              </a>
            </div>
          </div>

          <aside
            className="profile-panel"
            aria-label="Developer profile summary"
          >
            <div className="portrait" aria-hidden="true">
              <img src="/profile-photo.jpeg" alt="" />
            </div>
            <div>
              <p className="panel-label">Available for</p>
              <h2>Internships, freelance projects, and web app builds.</h2>
            </div>
            <div className="stat-grid">
              <div>
                <strong>10+</strong>
                <span>Core skills</span>
              </div>
              <div>
                <strong>3</strong>
                <span>Featured builds</span>
              </div>
              <div>
                <strong>100%</strong>
                <span>Responsive</span>
              </div>
            </div>
          </aside>
        </section>

        <section className="section-shell" id="projects">
          <div className="section-heading">
            <p className="eyebrow">
              <Code2 size={16} />
              Proof of work
            </p>
            <h2>Projects</h2>
            <p>
              A focused set of portfolio-ready work, including Future Interns tasks as they are
              completed and documented.
            </p>
          </div>
          <div className="project-grid">
            {projects.map((project) => (
              <article className="project-card" key={project.title}>
                <div className="project-topline">
                  <span>{project.type}</span>
                  <span>{project.status}</span>
                </div>
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <div className="tag-row">
                  {project.stack.map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                </div>
                <div className="project-links">
                  {project.liveUrl && (
                    <a href={project.liveUrl} target="_blank" rel="noreferrer">
                      Live Demo <ArrowUpRight size={16} />
                    </a>
                  )}
                  {project.codeUrl && (
                    <a href={project.codeUrl} target="_blank" rel="noreferrer">
                      GitHub <ArrowUpRight size={16} />
                    </a>
                  )}
                  {!project.liveUrl && !project.codeUrl && (
                    <a href="#contact" aria-label={`Discuss ${project.title}`}>
                      Discuss project <ArrowUpRight size={16} />
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section-shell about-layout" id="about">
          <div className="section-heading">
            <p className="eyebrow">
              <BriefcaseBusiness size={16} />
              Resume snapshot
            </p>
            <h2>About</h2>
            <p>
              Aditya, is a Full Stack Developer skilled in building fast, scalable, and modern web applications using Next.js, React.js, Node.js, and MongoDB. 
              He has experience in both frontend and backend development, along with API integration and deployment on platforms like Vercel and Render. Currently, he is strengthening his problem-solving skills and exploring new technologies in software development. Always eager to learn , innovate and collaborate on exciting tech solutions. Let's connect!!
            </p>
          </div>
          <div className="resume-grid">
            {experience.map((item) => (
              <article className="resume-item" key={item.label}>
                <span>{item.label}</span>
                <h3>{item.value}</h3>
                <p>{item.detail}</p>
              </article>
            ))}
          </div>
          <div className="skills-panel">
            <h3>Tech Stack</h3>
            <div className="skill-list">
              {skills.map((skill) => (
                <span key={skill}>{skill}</span>
              ))}
            </div>
          </div>
        </section>

        <section className="section-shell contact-layout" id="contact">
          <div className="section-heading">
            <p className="eyebrow">
              <Mail size={16} />
              Let us talk
            </p>
            <h2>Contact</h2>
            <p>
              Send a message for internship opportunities, freelance work, or collaboration. Your
              message is saved securely in MongoDB and can trigger email notifications when SMTP is
              configured.
            </p>
            <div className="social-links" aria-label="Social links">
              <a href="tel:+918303486083">
                <Phone size={18} />
                +91 8303486083
              </a>
              <a href="mailto:shivhareaditya92@gmail.com">
                <Mail size={18} />
                Email
              </a>
              <a href="https://github.com/Aditya05-Shiv" target="_blank" rel="noreferrer">
                <Github size={18} />
                GitHub
              </a>
              <a
                href="https://www.linkedin.com/in/aditya-shivhare-8aa827328"
                target="_blank"
                rel="noreferrer"
              >
                <Linkedin size={18} />
                LinkedIn
              </a>
            </div>
          </div>

          <form className="contact-form" onSubmit={handleSubmit}>
            <label>
              Name
              <input
                required
                type="text"
                value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
                placeholder="Your name"
              />
            </label>
            <label>
              Email
              <input
                required
                type="email"
                value={form.email}
                onChange={(event) => setForm({ ...form, email: event.target.value })}
                placeholder="you@example.com"
              />
            </label>
            <label>
              Subject
              <input
                required
                type="text"
                value={form.subject}
                onChange={(event) => setForm({ ...form, subject: event.target.value })}
                placeholder="Internship opportunity"
              />
            </label>
            <label>
              Message
              <textarea
                required
                rows="5"
                value={form.message}
                onChange={(event) => setForm({ ...form, message: event.target.value })}
                placeholder="Tell me what you are building or hiring for..."
              />
            </label>
            <button className="primary-button submit-button" type="submit" disabled={status.type === "loading"}>
              <Send size={18} />
              {status.type === "loading" ? "Sending..." : "Send Message"}
            </button>
            {status.message && <p className={`form-status ${status.type}`}>{status.message}</p>}
          </form>
        </section>
      </main>

      <footer className="footer">
        <p>Designed and built by Aditya Shivhare.</p>
        <a href="#home">Back to top</a>
      </footer>
    </div>
  );
}

export default App;
