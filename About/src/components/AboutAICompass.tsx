import React from "react";
import { motion } from "framer-motion";
import { Users, Briefcase, Mail, Sparkles, Compass } from "lucide-react";

// If you're using shadcn/ui, you can swap the simple Tabs below with
// their Tabs component. This file stays dependency-light on purpose.

const tabs = [
  { id: "users", label: "For Users & Consumers", icon: <Users className="h-4 w-4" /> },
  { id: "stakeholders", label: "For Stakeholders & Investors", icon: <Briefcase className="h-4 w-4" /> },
];

export default function AboutAICompass() {
  const [active, setActive] = React.useState<string>("users");
  const [isDark, setIsDark] = React.useState(false);

  // Detect dark mode
  React.useEffect(() => {
    const checkDarkMode = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };
    checkDarkMode();
    
    // Watch for theme changes
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100">
      {/* Header */}
      <header className="pt-2" style={{ backgroundColor: isDark ? '#1e293b' : '#004b93' }}>
        <div className="mx-auto max-w-6xl px-4 py-12">
          <div className="flex items-center gap-3 text-white">
            <Compass className="h-8 w-8" />
            <h1 className="text-3xl font-semibold">About AI-Compass</h1>
          </div>
          <p className="mt-2 text-white opacity-90">
            Guiding Sanofians through the world of AI innovation
          </p>
        </div>
      </header>

      {/* Tabs */}
      <nav className="sticky top-0 z-10 bg-slate-100/80 dark:bg-slate-800/80 backdrop-blur border-b border-slate-200 dark:border-slate-700">
        <div className="mx-auto max-w-6xl px-4">
          <ul className="flex items-center gap-2 py-3">
            {tabs.map((t) => {
              const selected = active === t.id;
              return (
                <li key={t.id}>
                  <button
                    onClick={() => setActive(t.id)}
                    className={`group inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition ${
                      selected
                        ? "bg-white dark:bg-slate-700 text-[#004b93] dark:text-blue-400 shadow"
                        : "text-[#004b93] dark:text-blue-300 hover:bg-[#004b93] hover:text-white dark:hover:bg-slate-700"
                    }`}
                    aria-current={selected ? "page" : undefined}
                  >
                    {t.icon}
                    <span>{t.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      {/* Content */}
      <main className="mx-auto max-w-6xl px-4 py-10">
        {active === "users" ? <UsersView /> : <StakeholdersView />}
      </main>

      {/* Footer */}
      <footer className="py-10 text-center text-sm text-slate-500 dark:text-slate-400">
        © {new Date().getFullYear()} Sanofi · Built by the AI-Compass Team
      </footer>
    </div>
  );
}

function Card({ children, className = "" }: React.PropsWithChildren<{ className?: string }>) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={`rounded-2xl bg-white dark:bg-slate-800 p-6 shadow-sm ring-1 ring-slate-200 dark:ring-slate-700 ${className}`}
    >
      {children}
    </motion.section>
  );
}

function SectionTitle({ icon, title, kicker }: { icon?: React.ReactNode; title: string; kicker?: string }) {
  return (
    <div className="mb-4">
      {kicker && <p className="text-xs uppercase tracking-wide text-[#004b93] dark:text-blue-400">{kicker}</p>}
      <div className="mt-1 flex items-center gap-2">
        {icon}
        <h2 className="text-xl font-semibold text-[#004b93] dark:text-blue-300">{title}</h2>
      </div>
    </div>
  );
}

/* --------------------------- USERS & CONSUMERS --------------------------- */
function UsersView() {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <Card className="lg:col-span-2">
        <SectionTitle
          icon={<Sparkles className="h-5 w-5 text-[#004b93] dark:text-blue-400" />}
          title="About the Product"
          kicker="For Users & Consumers"
        />
        <p className="leading-relaxed">
          <strong>AI-Compass</strong> is Sanofi's next-generation intelligence platform that makes AI exploration
          intuitive. It centralizes internal and external AI tools, benchmarks capabilities, and enables
          <em> Agentic AI</em> interaction—all within a secure, user‑friendly environment.
        </p>
      </Card>

      <Card>
        <SectionTitle title="Quick Facts" />
        <ul className="list-disc space-y-2 pl-5">
          <li>Built for Sanofians by Sanofians</li>
          <li>Secure by design, enterprise‑ready</li>
          <li>Works across GBUs and functions</li>
        </ul>
      </Card>

      <Card className="lg:col-span-2">
        <SectionTitle title="Key Features" />
        <ul className="list-disc space-y-3 pl-5">
          <li>
            <strong>AI Discovery:</strong> Explore Sanofi’s global AI initiatives and external innovations.
          </li>
          <li>
            <strong>Smart Comparison:</strong> Benchmark internal tools against industry standards.
          </li>
          <li>
            <strong>Natural Language Q&A:</strong> Ask questions and let AI-Compass retrieve contextual insights.
          </li>
          <li>
            <strong>Analytics Dashboards:</strong> Visualize AI usage, maturity, and impact across teams.
          </li>
          <li>
            <strong>Knowledge Hub:</strong> Learn from success stories, reusable assets, and best practices.
          </li>
        </ul>
      </Card>

      <Card>
        <SectionTitle title="Meet the Team" />
        <p className="leading-relaxed">
          AI-Compass is developed by Sanofi’s <strong>Quality Data Analytics & Digital Team</strong> led by Product
          Owner <strong>Sonnil Q. Le</strong>, bringing together experts across Data, AI, and Digital Transformation.
        </p>
      </Card>

      <Card className="lg:col-span-3">
        <SectionTitle icon={<Mail className="h-5 w-5 text-[#004b93] dark:text-blue-400" />} title="Contact Us" />
        <p>
          Have questions, feedback, or ideas for collaboration? Email us at{" "}
          <a className="font-medium text-[#004b93] dark:text-blue-400 underline hover:text-blue-600 dark:hover:text-blue-300 transition-colors" href="mailto:ai-compass@sanofi.com">
            ai-compass@sanofi.com
          </a>
          .
        </p>
      </Card>
    </div>
  );
}

/* ------------------------ STAKEHOLDERS & INVESTORS ----------------------- */
function StakeholdersView() {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <Card className="lg:col-span-2">
        <SectionTitle
          icon={<Briefcase className="h-5 w-5 text-[#004b93] dark:text-blue-400" />}
          title="Strategic Overview"
          kicker="For Stakeholders & Investors"
        />
        <p className="leading-relaxed">
          Our mission is to make Sanofi's AI ecosystem transparent, actionable, and scalable—empowering every Sanofian
          to harness AI responsibly and effectively in their daily work.
        </p>
      </Card>

      <Card>
        <SectionTitle title="Why It Matters" />
        <p className="leading-relaxed">
          AI‑Compass acts as Sanofi’s <strong>North Star</strong> for AI governance and innovation, ensuring alignment
          between our digital ambitions and operational execution to deliver measurable impact for patients and
          stakeholders.
        </p>
      </Card>

      <Card className="lg:col-span-2">
        <SectionTitle title="Value for Stakeholders" />
        <ul className="list-disc space-y-3 pl-5">
          <li>
            <strong>Visibility:</strong> Unified view of global AI initiatives, maturity, and investments.
          </li>
          <li>
            <strong>Efficiency:</strong> Promote reuse of existing AI assets, eliminate duplication of effort.
          </li>
          <li>
            <strong>Governance:</strong> Reinforce responsible AI via maturity scoring and data lineage.
          </li>
          <li>
            <strong>Innovation Acceleration:</strong> Connect cross‑functional teams with external partners and tech.
          </li>
          <li>
            <strong>Strategic Alignment:</strong> Bridge data strategy with execution across GBUs.
          </li>
        </ul>
      </Card>

      <Card>
        <SectionTitle title="Our Commitment" />
        <p className="leading-relaxed">
          We’re building a transparent, ethical, and data‑driven culture that advances healthcare through insight,
          collaboration, and intelligent automation.
        </p>
      </Card>
    </div>
  );
}
