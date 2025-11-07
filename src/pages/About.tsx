import React from "react";
import { Users, Briefcase, Mail, Sparkles, Compass } from "lucide-react";
import { translations } from '../translations';

type Props = {
  lang: string;
};

export default function AboutAICompass({ lang }: Props) {
  const t = (translations as any)[lang] || translations.en;
  const [active, setActive] = React.useState<string>("users");

  const tabs = [
    { id: "users", label: t.forUsers, icon: <Users className="h-4 w-4" /> },
    { id: "stakeholders", label: t.forStakeholders, icon: <Briefcase className="h-4 w-4" /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-teal-600 text-white">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <div className="flex items-center gap-3">
            <Compass className="h-8 w-8" />
            <h1 className="text-3xl font-semibold">{t.aboutTitle}</h1>
          </div>
          <p className="mt-2 text-white/90">
            {t.aboutSubtitle}
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
                        ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow"
                        : "text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white"
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
        {active === "users" ? <UsersView lang={lang} t={t} /> : <StakeholdersView lang={lang} t={t} />}
      </main>

      {/* Footer */}
      <footer className="py-10 text-center text-sm text-slate-500 dark:text-slate-400">
        {t.footer.replace('{year}', new Date().getFullYear().toString())}
      </footer>
    </div>
  );
}

function Card({ children, className = "" }: React.PropsWithChildren<{ className?: string }>) {
  return (
    <section
      className={`rounded-2xl bg-white dark:bg-slate-800 p-6 shadow-sm ring-1 ring-slate-200 dark:ring-slate-700 animate-fade-in ${className}`}
    >
      {children}
    </section>
  );
}

function SectionTitle({ icon, title, kicker }: { icon?: React.ReactNode; title: string; kicker?: string }) {
  return (
    <div className="mb-4">
      {kicker && <p className="text-xs uppercase tracking-wide text-blue-600 dark:text-blue-400">{kicker}</p>}
      <div className="mt-1 flex items-center gap-2">
        {icon}
        <h2 className="text-xl font-semibold text-blue-600 dark:text-blue-400">{title}</h2>
      </div>
    </div>
  );
}

/* --------------------------- USERS & CONSUMERS --------------------------- */
function UsersView({ lang, t }: { lang: string; t: any }) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <Card className="lg:col-span-2">
        <SectionTitle
          icon={<Sparkles className="h-5 w-5 text-blue-600 dark:text-blue-400" />}
          title={t.aboutProduct}
          kicker={t.forUsers}
        />
        <div className="space-y-4">
          <p className="leading-relaxed">
            {t.aboutProductDesc}
          </p>
          <div className="pl-4 border-l-4 border-blue-500 dark:border-blue-400">
            <p className="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-2">{t.ourMission}</p>
            <p className="leading-relaxed italic">
              {t.missionStatement}
            </p>
          </div>
        </div>
      </Card>

      <Card>
        <SectionTitle title={t.quickFacts} />
        <ul className="list-disc space-y-2 pl-5">
          <li>{t.toolsCataloged}</li>
          <li>{t.builtBySanofians}</li>
          <li>{t.secureByDesign}</li>
          <li>{t.worksAcrossGBUs}</li>
          <li>{t.realTimeComparisons}</li>
          <li>{t.aiPoweredSearch}</li>
        </ul>
      </Card>

      <Card className="lg:col-span-2">
        <SectionTitle title={t.keyFeatures} />
        <ul className="list-disc space-y-3 pl-5">
          <li>
            <strong>🔍 {t.featureCatalog.split(':')[0]}:</strong> {t.featureCatalog.split(':')[1]}
          </li>
          <li>
            <strong>⚖️ {t.featureComparison.split(':')[0]}:</strong> {t.featureComparison.split(':')[1]}
          </li>
          <li>
            <strong>💬 {t.featureAssistant.split(':')[0]}:</strong> {t.featureAssistant.split(':')[1]}
          </li>
          <li>
            <strong>📊 {t.featureAnalytics.split(':')[0]}:</strong> {t.featureAnalytics.split(':')[1]}
          </li>
          <li>
            <strong>🎯 {t.featureFilters.split(':')[0]}:</strong> {t.featureFilters.split(':')[1]}
          </li>
          <li>
            <strong>📚 {t.featureKnowledge.split(':')[0]}:</strong> {t.featureKnowledge.split(':')[1]}
          </li>
          <li>
            <strong>🔄 {t.featureUpdates.split(':')[0]}:</strong> {t.featureUpdates.split(':')[1]}
          </li>
        </ul>
      </Card>

      <Card>
        <SectionTitle title={t.meetTheTeam} />
        <div className="space-y-3">
          <p className="leading-relaxed">
            {t.teamDesc}
          </p>
          <div className="pt-2">
            <p className="font-semibold text-blue-600 dark:text-blue-400">{t.productOwner}</p>
            <p>Sonnil Q. Le</p>
          </div>
          <div className="pt-2 text-sm text-slate-600 dark:text-slate-400">
            <p>{t.teamCollaboration}</p>
          </div>
        </div>
      </Card>

      <Card className="lg:col-span-3">
        <SectionTitle icon={<Mail className="h-5 w-5 text-blue-600 dark:text-blue-400" />} title={t.contactUs} />
        <p>
          {t.contactDesc}{" "}
          <a className="font-medium text-blue-600 dark:text-blue-400 underline hover:text-blue-700 dark:hover:text-blue-300" href="mailto:sonnil.le@sanofi.com">
            sonnil.le@sanofi.com
          </a>
          .
        </p>
      </Card>
    </div>
  );
}

/* ------------------------ STAKEHOLDERS & INVESTORS ----------------------- */
function StakeholdersView({ lang, t }: { lang: string; t: any }) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <Card className="lg:col-span-2">
        <SectionTitle
          icon={<Briefcase className="h-5 w-5 text-blue-600 dark:text-blue-400" />}
          title={t.strategicOverview}
          kicker={t.forStakeholders}
        />
        <p className="leading-relaxed">
          {t.strategicDesc}
        </p>
      </Card>

      <Card>
        <SectionTitle title={t.whyItMatters} />
        <p className="leading-relaxed">
          {t.whyItMattersDesc}
        </p>
      </Card>

      <Card className="lg:col-span-2">
        <SectionTitle title={t.valueForStakeholders} />
        <div className="space-y-4">
          <ul className="list-disc space-y-3 pl-5">
            <li>
              <strong>📈 {t.valueVisibility.split(':')[0]}:</strong> {t.valueVisibility.split(':').slice(1).join(':')}
            </li>
            <li>
              <strong>💰 {t.valueCost.split(':')[0]}:</strong> {t.valueCost.split(':').slice(1).join(':')}
            </li>
            <li>
              <strong>🛡️ {t.valueGovernance.split(':')[0]}:</strong> {t.valueGovernance.split(':').slice(1).join(':')}
            </li>
            <li>
              <strong>🚀 {t.valueInnovation.split(':')[0]}:</strong> {t.valueInnovation.split(':').slice(1).join(':')}
            </li>
            <li>
              <strong>🎯 {t.valueAlignment.split(':')[0]}:</strong> {t.valueAlignment.split(':').slice(1).join(':')}
            </li>
            <li>
              <strong>📊 {t.valueDecisions.split(':')[0]}:</strong> {t.valueDecisions.split(':').slice(1).join(':')}
            </li>
          </ul>
          
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-sm font-semibold text-blue-700 dark:text-blue-300 mb-2">{t.keyBusinessImpact}</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">52+</p>
                <p className="text-xs text-slate-600 dark:text-slate-400">{t.toolsCatalogedCount}</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">100%</p>
                <p className="text-xs text-slate-600 dark:text-slate-400">{t.gbuCoverage}</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">24/7</p>
                <p className="text-xs text-slate-600 dark:text-slate-400">{t.aiAssistant247}</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <SectionTitle title={t.ourCommitment} />
        <p className="leading-relaxed">
          {t.commitmentDesc}
        </p>
      </Card>

      <Card className="lg:col-span-3">
        <SectionTitle 
          icon={<Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />}
          title={t.teamSponsorship} 
        />
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4">
            <Users className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">{t.comingSoon}</h3>
          <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto">
            {t.comingSoonDesc}
          </p>
        </div>
      </Card>
    </div>
  );
}
