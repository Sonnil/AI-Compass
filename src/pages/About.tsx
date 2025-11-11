import React from "react";
import { Users, Briefcase, Mail, Sparkles, Compass, Code2, ZoomIn, ZoomOut, Maximize2 } from "lucide-react";
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
    { id: "developers", label: t.forDevelopers || "For Community & Developers", icon: <Code2 className="h-4 w-4" /> },
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
        {active === "users" ? <UsersView lang={lang} t={t} /> : active === "stakeholders" ? <StakeholdersView lang={lang} t={t} /> : <DevelopersView lang={lang} t={t} />}
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

/* ----------------------- COMMUNITY & DEVELOPERS ----------------------- */
function DevelopersView({ lang, t }: { lang: string; t: any }) {
  const [scale, setScale] = React.useState(1);
  const [position, setPosition] = React.useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = React.useState(false);
  const [dragStart, setDragStart] = React.useState({ x: 0, y: 0 });
  const containerRef = React.useRef<HTMLDivElement>(null);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setScale(prev => Math.min(Math.max(0.5, prev * delta), 3));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPosition({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const resetView = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  React.useEffect(() => {
    // Load Mermaid library
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js';
    script.async = true;
    script.onload = () => {
      // @ts-ignore
      if (window.mermaid) {
        // @ts-ignore
        window.mermaid.initialize({ 
          startOnLoad: true,
          theme: 'base',
          themeVariables: {
            primaryColor: '#f4f4f5',
            primaryTextColor: '#18181b',
            lineColor: '#71717a',
            textColor: '#3f3f46'
          }
        });
        // @ts-ignore
        window.mermaid.contentLoaded();
      }
    };
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
    <div className="grid grid-cols-1 gap-6">
      <Card className="lg:col-span-full">
        <SectionTitle
          icon={<Code2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />}
          title={t.visionArchitecture || "Vision & Architecture"}
          kicker={t.forDevelopers || "For Community & Developers"}
        />
        <p className="leading-relaxed mb-6">
          {t.architectureDesc || "Explore the technical architecture and vision behind AI-COMPASS. Our platform is built on modern technologies with enterprise-grade security and scalability in mind."}
        </p>
        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 mb-4">
          <a 
            href="https://www.figma.com/board/DaD9rmUqCpiqML5XMDA2jM/AI-COMPASS-Multi-Agent-Hub---Physical-AI--Future-?node-id=0-1&t=MPN32Ud8iYRdYniF-1"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            <Sparkles className="h-4 w-4" />
            {t.viewFigmaBoard || "View Full Vision Concept on Figma"}
          </a>
        </div>
      </Card>

      {/* High-Level Architecture */}
      <Card className="lg:col-span-full">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            {t.highLevelArchitecture || "High-Level Landscape Diagram"}
          </h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setScale(prev => Math.max(0.5, prev - 0.1))}
              className="p-2 rounded-lg border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              aria-label="Zoom out"
            >
              <ZoomOut className="h-4 w-4" />
            </button>
            <button
              onClick={() => setScale(prev => Math.min(3, prev + 0.1))}
              className="p-2 rounded-lg border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              aria-label="Zoom in"
            >
              <ZoomIn className="h-4 w-4" />
            </button>
            <button
              onClick={resetView}
              className="p-2 rounded-lg border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              aria-label="Reset view"
            >
              <Maximize2 className="h-4 w-4" />
            </button>
            <span className="text-sm text-slate-600 dark:text-slate-400 ml-2">
              {Math.round(scale * 100)}%
            </span>
          </div>
        </div>
        
        <div 
          ref={containerRef}
          className="relative overflow-hidden rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
          style={{ height: '600px', cursor: isDragging ? 'grabbing' : 'grab' }}
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <div 
            style={{
              transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
              transformOrigin: 'center center',
              transition: isDragging ? 'none' : 'transform 0.1s ease-out',
              padding: '40px',
              userSelect: 'none'
            }}
          >
            <pre className="mermaid text-xs">
{`graph TD
    subgraph "User Groups"
        direction LR
        U1[QA Ops]
        U2[HSE]
        U3[PMs]
        U4[Analysts]
    end

    subgraph "Azure Platform"
        direction TB
        subgraph "AI-COMPASS"
            UI[AI-COMPASS UI <br/>(React/Vite)]
            SONA[SONA Agent <br/>(TypeScript)]
        end
        
        subgraph "Azure AI Services"
            AOS[Azure OpenAI <br/>(Model Hosting)]
            AIS[Azure AI Search <br/>(Indexing)]
        end

        subgraph "Security & Operations"
            KV[Key Vault <br/>(Secrets)]
            AAD[Azure Active Directory <br/>(SSO)]
            AI[App Insights <br/>(Logging/Tracing)]
        end

        UI --> SONA;
    end

    subgraph "M365 & Data Platforms"
        direction TB
        SP[SharePoint <br/>(Document Storage)]
        PBI[Power BI <br/>(Analytics)]
        M365[M365 Graph API <br/>(User Context)]
        SNOW[Snowflake <br/>(Data Warehouse)]
    end

    U1 & U2 & U3 & U4 --> UI;
    SONA --> AOS;
    SONA --> AIS;
    SONA -.-> M365;
    
    SONA -- "Parameterized SQL (Read-Only)" --> SNOW;
    SONA -- "Read/Write to Project Library" --> SP;
    SONA -- "Semantic Query (Read-Only)" --> PBI;

    UI & SONA --> AAD;
    SONA --> KV;
    SONA --> AI;

    classDef azure fill:#0078d4,color:#fff,stroke:#005a9e;
    classDef data fill:#7fba00,color:#fff,stroke:#5a8300;
    classDef users fill:#f25022,color:#fff,stroke:#c83c13;
    class UI,SONA,AOS,AIS,KV,AAD,AI azure;
    class SP,PBI,M365,SNOW data;
    class U1,U2,U3,U4 users;`}
            </pre>
          </div>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-3">
          {t.panZoomHint || "💡 Tip: Use mouse wheel to zoom, click and drag to pan"}
        </p>
      </Card>

      {/* SONA Detailed Architecture */}
      <Card className="lg:col-span-full">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            {t.sonaArchitecture || "SONA Agent - Detailed Architecture"}
          </h3>
        </div>
        
        <div className="relative overflow-auto rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6">
          <pre className="mermaid text-xs">
{`sequenceDiagram
    actor User
    participant Agent as EnhancedSONAAgent
    participant Trace as tracingService
    participant Intent as IntentClassifier
    participant Learn as learningService
    participant Reason as reasoningService
    participant Respond as ResponseGenerator

    User->>Agent: processMessage(query)
    activate Agent
    Agent->>Trace: startTrace(query)
    activate Trace
    Trace-->>Agent: traceId
    deactivate Trace

    Agent->>Intent: classify(query)
    activate Intent
    Intent-->>Agent: IntentResult
    deactivate Intent
    
    opt Complex Query (e.g., Recommendation/Comparison)
        Agent->>Learn: getUserPreferences()
        activate Learn
        Learn-->>Agent: UserProfile
        deactivate Learn
        
        Agent->>Reason: reason(query, intent, tools)
        activate Reason
        Reason-->>Agent: reasoningChain
        deactivate Reason
    end

    Agent->>Respond: generateResponse(intent, query)
    activate Respond
    Respond-->>Agent: responseText
    deactivate Respond

    Agent->>Learn: recordInteraction(query, intent, response)
    activate Learn
    Learn-->>Agent: 
    deactivate Learn

    Agent->>Trace: endTrace(result)
    activate Trace
    Trace-->>Agent: 
    deactivate Trace

    Agent-->>User: responseText
    deactivate Agent`}
          </pre>
        </div>
      </Card>

      {/* Tech Stack */}
      <Card className="lg:col-span-full">
        <SectionTitle title={t.techStack || "Technology Stack"} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
            <h4 className="font-semibold text-blue-700 dark:text-blue-300 mb-2">Frontend</h4>
            <ul className="text-sm space-y-1 text-slate-700 dark:text-slate-300">
              <li>• React 18</li>
              <li>• TypeScript</li>
              <li>• Vite</li>
              <li>• Tailwind CSS</li>
            </ul>
          </div>
          <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
            <h4 className="font-semibold text-purple-700 dark:text-purple-300 mb-2">AI Services</h4>
            <ul className="text-sm space-y-1 text-slate-700 dark:text-slate-300">
              <li>• Azure OpenAI</li>
              <li>• Azure AI Search</li>
              <li>• Intent Classification</li>
              <li>• RAG Pipeline</li>
            </ul>
          </div>
          <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
            <h4 className="font-semibold text-green-700 dark:text-green-300 mb-2">Data & Storage</h4>
            <ul className="text-sm space-y-1 text-slate-700 dark:text-slate-300">
              <li>• Snowflake</li>
              <li>• SharePoint</li>
              <li>• Power BI</li>
              <li>• M365 Graph API</li>
            </ul>
          </div>
          <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
            <h4 className="font-semibold text-amber-700 dark:text-amber-300 mb-2">Security & Ops</h4>
            <ul className="text-sm space-y-1 text-slate-700 dark:text-slate-300">
              <li>• Azure AD SSO</li>
              <li>• Key Vault</li>
              <li>• App Insights</li>
              <li>• GitHub Actions</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Key Features for Developers */}
      <Card className="lg:col-span-full">
        <SectionTitle title={t.keyCapabilities || "Key Capabilities"} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white mb-3">🤖 Enhanced SONA Agent</h4>
            <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
              <li>• <strong>Intent Classification:</strong> Understands user intent beyond keyword matching</li>
              <li>• <strong>Multi-Step Reasoning:</strong> Complex query decomposition and analysis</li>
              <li>• <strong>Learning Service:</strong> Tracks interactions and learns from user feedback</li>
              <li>• <strong>Tracing Service:</strong> Full observability and transparency</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white mb-3">🔐 Enterprise Security</h4>
            <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
              <li>• <strong>Azure AD Integration:</strong> Enterprise SSO authentication</li>
              <li>• <strong>Key Vault:</strong> Secure secrets management</li>
              <li>• <strong>Audit Logging:</strong> Complete activity tracking via App Insights</li>
              <li>• <strong>Read-Only Access:</strong> Parameterized SQL queries to Snowflake</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white mb-3">📊 Analytics & Insights</h4>
            <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
              <li>• <strong>Tool Analytics:</strong> Usage patterns and adoption metrics</li>
              <li>• <strong>Learning Dashboard:</strong> User behavior and preferences</li>
              <li>• <strong>Performance Tracking:</strong> Response times and confidence scores</li>
              <li>• <strong>Reasoning History:</strong> Decision-making transparency</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white mb-3">🚀 Developer Experience</h4>
            <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
              <li>• <strong>TypeScript:</strong> Type-safe codebase</li>
              <li>• <strong>Modular Architecture:</strong> Service-oriented design</li>
              <li>• <strong>CI/CD Pipeline:</strong> Automated deployments via GitHub Actions</li>
              <li>• <strong>Hot Module Replacement:</strong> Fast development iteration</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* GitHub Repository */}
      <Card className="lg:col-span-full">
        <SectionTitle 
          icon={<Code2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />}
          title={t.openSource || "Open Source & Community"} 
        />
        <div className="space-y-4">
          <p className="leading-relaxed">
            {t.openSourceDesc || "AI-COMPASS is built with modern open-source technologies and follows enterprise-grade development practices. The codebase demonstrates best practices in TypeScript, React, and AI integration."}
          </p>
          <div className="flex items-center gap-4">
            <a 
              href="https://github.com/Sonnil/AI-Compass"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-700 dark:hover:bg-slate-100 transition-colors"
            >
              <Code2 className="h-4 w-4" />
              {t.viewOnGitHub || "View on GitHub"}
            </a>
            <span className="text-sm text-slate-600 dark:text-slate-400">
              {t.builtWithLove || "Built with ❤️ by Sonnil Le"}
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
}

