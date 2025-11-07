import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { GitCompare, ArrowDown } from 'lucide-react';
import { Tool } from '@/types';
import { translations } from '@/translations';
import { useComparisonStore } from '@/stores/comparison';

import { resolveLogoUrl } from '@/utils/url';

// AccessLink component (could be moved to a common components file)
const AccessLink: React.FC<{ href: string; label: string; toolName: string; linkType: string }> = ({ href, label, toolName, linkType }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-lg border border-blue-200 dark:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
    onClick={(e) => {
      e.stopPropagation();
      // Assuming analytics is imported and available
      // analytics.trackExternalLink(toolName, linkType);
    }}
  >
    {label}
    <span className="text-xs">↗</span>
  </a>
);

const InfoRow: React.FC<{label: string, value: any}> = ({ label, value }) => {
  const [showTooltip, setShowTooltip] = React.useState(false);
  const [tooltipStyle, setTooltipStyle] = React.useState<React.CSSProperties>({});
  const [arrowPosition, setArrowPosition] = React.useState<'top' | 'bottom' | 'left' | 'right'>('top');
  const rowRef = React.useRef<HTMLDivElement>(null);
  const displayValue = typeof value === 'boolean' ? (value ? 'Yes' : 'No') : (value ?? '—');
  // Show tooltip for text longer than 15 chars or if it contains special chars that might wrap badly
  const isTruncated = displayValue.length > 15 || /[,;:]/.test(displayValue);
  
  const updateTooltipPosition = () => {
    if (!rowRef.current) return;
    
    const rect = rowRef.current.getBoundingClientRect();
    const tooltipWidth = 280;
    const tooltipHeight = 100; // approximate height with padding
    const gap = 12;
    
    // Check available space in each direction
    const spaceTop = rect.top;
    const spaceBottom = window.innerHeight - rect.bottom;
    const spaceLeft = rect.left;
    const spaceRight = window.innerWidth - rect.right;
    
    let style: React.CSSProperties = {};
    let position: 'top' | 'bottom' | 'left' | 'right' = 'top';
    
    // Priority: bottom > top > right > left (bottom is better for cards)
    if (spaceBottom >= tooltipHeight + gap) {
      position = 'bottom';
      style = {
        top: rect.bottom + gap,
        left: Math.max(gap, Math.min(rect.left + rect.width / 2 - tooltipWidth / 2, window.innerWidth - tooltipWidth - gap)),
      };
    } else if (spaceTop >= tooltipHeight + gap) {
      position = 'top';
      style = {
        top: rect.top - tooltipHeight - gap,
        left: Math.max(gap, Math.min(rect.left + rect.width / 2 - tooltipWidth / 2, window.innerWidth - tooltipWidth - gap)),
      };
    } else if (spaceRight >= tooltipWidth + gap) {
      position = 'right';
      style = {
        top: Math.max(gap, Math.min(rect.top + rect.height / 2 - tooltipHeight / 2, window.innerHeight - tooltipHeight - gap)),
        left: rect.right + gap,
      };
    } else if (spaceLeft >= tooltipWidth + gap) {
      position = 'left';
      style = {
        top: Math.max(gap, Math.min(rect.top + rect.height / 2 - tooltipHeight / 2, window.innerHeight - tooltipHeight - gap)),
        left: rect.left - tooltipWidth - gap,
      };
    } else {
      // Fallback to bottom with horizontal centering
      position = 'bottom';
      style = {
        top: rect.bottom + gap,
        left: Math.max(gap, Math.min(rect.left + rect.width / 2 - tooltipWidth / 2, window.innerWidth - tooltipWidth - gap)),
      };
    }
    
    setTooltipStyle(style);
    setArrowPosition(position);
  };
  
  const handleMouseEnter = () => {
    if (!isTruncated) return;
    updateTooltipPosition();
    setShowTooltip(true);
  };
  
  const handleMouseLeave = () => {
    setShowTooltip(false);
  };
  
  // Arrow styles based on position
  const getArrowStyle = (): React.CSSProperties => {
    if (!rowRef.current) return {};
    const rect = rowRef.current.getBoundingClientRect();
    
    switch (arrowPosition) {
      case 'bottom':
        return {
          top: '-8px',
          left: `${rect.left + rect.width / 2 - (tooltipStyle.left as number)}px`,
        };
      case 'top':
        return {
          bottom: '-8px',
          left: `${rect.left + rect.width / 2 - (tooltipStyle.left as number)}px`,
        };
      case 'right':
        return {
          left: '-8px',
          top: `${rect.top + rect.height / 2 - (tooltipStyle.top as number)}px`,
        };
      case 'left':
        return {
          right: '-8px',
          top: `${rect.top + rect.height / 2 - (tooltipStyle.top as number)}px`,
        };
    }
  };
  
  const arrowBorderClass = {
    bottom: 'border-8 border-transparent border-b-purple-600 dark:border-b-purple-500',
    top: 'border-8 border-transparent border-t-purple-600 dark:border-t-purple-500',
    right: 'border-8 border-transparent border-r-purple-600 dark:border-r-purple-500',
    left: 'border-8 border-transparent border-l-purple-600 dark:border-l-purple-500',
  };
  
  return (
    <>
      <div 
        ref={rowRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="bg-slate-100 dark:bg-slate-900/70 rounded-lg p-2 hover:bg-slate-200 dark:hover:bg-slate-800/70 transition-colors duration-200 cursor-help"
      >
        <div className="text-xs text-slate-500 dark:text-slate-400 truncate">{label}</div>
        <div className="text-sm mt-0.5 font-medium truncate">{displayValue}</div>
      </div>
      
      {/* Tooltip rendered in portal at body level */}
      {isTruncated && showTooltip && createPortal(
        <div 
          className="fixed z-[9999] pointer-events-none animate-in fade-in duration-200"
          style={tooltipStyle}
        >
          <div className="relative bg-gradient-to-br from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-purple-500 text-white text-xs rounded-xl px-4 py-3 shadow-2xl max-w-[280px] whitespace-normal break-words border border-white/20">
            {/* Subtle shine effect */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/10 to-transparent"></div>
            
            {/* Content */}
            <div className="relative">
              <div className="font-bold mb-1.5 text-indigo-100 dark:text-indigo-50 flex items-center gap-1">
                <span className="text-yellow-300">✨</span>
                {label}
              </div>
              <div className="leading-relaxed text-white">{displayValue}</div>
            </div>
            
            {/* Arrow pointing to the field */}
            <div 
              className={`absolute ${arrowBorderClass[arrowPosition]}`}
              style={getArrowStyle()}
            />
          </div>
        </div>,
        document.body
      )}
    </>
  );
}

interface ToolCardProps {
  tool: Tool;
  isNew: boolean;
  isUpdated: boolean;
  lang: string;
}

// Helper function to calculate a tool's average capability score (matches Analytics page)
function calculateAverageScore(tool: Tool): number {
  const capabilities = [
    getCapabilityScore(tool, 'code'),
    getCapabilityScore(tool, 'data'),
    getCapabilityScore(tool, 'content'),
    getCapabilityScore(tool, 'collaboration'),
    getCapabilityScore(tool, 'compliance'),
    getCapabilityScore(tool, 'search'),
    getCapabilityScore(tool, 'visual'),
    getCapabilityScore(tool, 'automation')
  ];
  
  const avgScore = capabilities.reduce((a, b) => a + b, 0) / capabilities.length;
  return Math.round(avgScore * 10) / 10;
}

function getCapabilityScore(tool: Tool, capability: string): number {
  let score = 0;
  const tags = tool.tags?.join(' ').toLowerCase() || '';
  const purpose = tool.primaryPurpose?.toLowerCase() || '';
  const useCase = tool.bestUseCase?.toLowerCase() || '';
  const combined = `${tags} ${purpose} ${useCase}`;

  switch (capability) {
    case 'code':
      if (tool.capabilities?.codeGeneration) score += 3;
      if (combined.includes('code') || combined.includes('programming') || combined.includes('development')) score += 2;
      if (combined.includes('script') || combined.includes('automation')) score += 1;
      break;
    case 'data':
      if (tool.capabilities?.dataAnalysis) score += 3;
      if (combined.includes('data') || combined.includes('analytics') || combined.includes('intelligence')) score += 2;
      if (combined.includes('dashboard') || combined.includes('visualization') || combined.includes('insights')) score += 1;
      break;
    case 'content':
      if (tool.capabilities?.textGeneration) score += 3;
      if (combined.includes('writing') || combined.includes('content') || combined.includes('creative')) score += 2;
      if (combined.includes('document') || combined.includes('text') || combined.includes('assistant')) score += 1;
      break;
    case 'collaboration':
      if (tool.capabilities?.chat) score += 2;
      if (combined.includes('collaboration') || combined.includes('meeting') || combined.includes('team')) score += 2;
      if (combined.includes('office') || combined.includes('productivity') || combined.includes('workplace')) score += 1;
      break;
    case 'compliance':
      if (tool.complianceAwareness) score += 2;
      if (combined.includes('compliance') || combined.includes('medical') || combined.includes('regulatory')) score += 2;
      if (tool.type === 'internal') score += 2;
      if (combined.includes('enterprise') || combined.includes('security')) score += 1;
      break;
    case 'search':
      if (tool.capabilities?.realTimeSearch) score += 3;
      if (combined.includes('search') || combined.includes('web') || combined.includes('real-time')) score += 2;
      if (combined.includes('knowledge') || combined.includes('research') || combined.includes('literature')) score += 1;
      break;
    case 'visual':
      if (tool.capabilities?.imageGeneration || tool.capabilities?.vision) score += 3;
      if (combined.includes('image') || combined.includes('visual') || combined.includes('diagram')) score += 2;
      if (combined.includes('design') || combined.includes('creative') || combined.includes('generation')) score += 1;
      if (combined.includes('dashboard') || combined.includes('chart')) score += 1;
      break;
    case 'automation':
      if (combined.includes('automation') || combined.includes('workflow') || combined.includes('process')) score += 3;
      if (combined.includes('productivity') || combined.includes('integration') || combined.includes('platform')) score += 2;
      break;
  }
  return Math.min(5, Math.max(0, score));
}

const ToolCard: React.FC<ToolCardProps> = ({ tool, isNew, isUpdated, lang }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isScrollable, setIsScrollable] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [isBackScrollable, setIsBackScrollable] = useState(false);
  const [isBackAtBottom, setIsBackAtBottom] = useState(true);

  const frontScrollRef = useRef<HTMLDivElement>(null);
  const backScrollRef = useRef<HTMLDivElement>(null);

  const t = (translations as any)[lang] || translations.en;
  const { items: compareList, add: addToCompare, remove: removeFromCompare } = useComparisonStore();
  const toolIdentifier = tool.id || tool.name;
  const isInCompare = compareList.some(item => (item.id || item.name) === toolIdentifier);
  
  // Calculate average capability score (matches Analytics Capability Comparison Matrix)
  const averageScore = calculateAverageScore(tool);
  const maxScore = 5;

  const handleToggleCompare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isInCompare) {
      removeFromCompare(toolIdentifier);
    } else {
      addToCompare(tool);
    }
  };

  const checkScroll = (ref: React.RefObject<HTMLDivElement>, setScrollable: (v: boolean) => void, setAtBottom: (v: boolean) => void) => {
    const el = ref.current;
    if (!el) return;
    const scrollable = el.scrollHeight > el.clientHeight;
    const atBottom = el.scrollHeight - el.scrollTop <= el.clientHeight + 1;
    setScrollable(scrollable);
    setAtBottom(atBottom);
  };

  useEffect(() => {
    const checkBothScrolls = () => {
      checkScroll(frontScrollRef, setIsScrollable, setIsAtBottom);
      checkScroll(backScrollRef, setIsBackScrollable, setIsBackAtBottom);
    };
    
    // Initial check
    const timer = setTimeout(checkBothScrolls, 50); // Delay to allow rendering
    
    // Re-check on window resize
    window.addEventListener('resize', checkBothScrolls);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', checkBothScrolls);
    };
  }, [tool]); // Re-check if tool changes

  const handleCardClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.tagName === 'BUTTON' || target.tagName === 'A' || target.closest('button') || target.closest('a')) {
      return;
    }
    setIsFlipped(prev => !prev);
  };

  return (
    <div className="h-[420px] sm:h-[400px] [perspective:1000px]">
      <div className={`relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}>
        {/* Front of card */}
        <div className="absolute w-full h-full [backface-visibility:hidden]">
          <div 
            onClick={handleCardClick}
            className="flex flex-col rounded-2xl border border-blue-200/50 dark:border-blue-700/50 p-4 hover:shadow-2xl transition-all duration-300 bg-white/95 dark:bg-slate-900/95 sm:hover:-translate-y-2 hover:border-blue-400/80 dark:hover:border-blue-500/80 cursor-pointer group h-full"
          >
            <div className="flex-shrink-0">
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-xs px-2 py-1 rounded-xl font-medium transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg whitespace-nowrap ${tool.type === 'internal' ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md" : "bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-md"}`}>
                    {tool.type === 'internal' ? t.internal : t.external}
                  </span>
                  {isNew && <span className="text-xs px-2 py-0.5 rounded-xl bg-emerald-600 text-white animate-pulse whitespace-nowrap">{t.new}</span>}
                  {isUpdated && <span className="text-xs px-2 py-0.5 rounded-xl border group-hover:border-blue-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors whitespace-nowrap">{t.updated}</span>}
                </div>
                <button className={`px-2 py-1 rounded-lg transition-all duration-300 hover:scale-105 text-xs font-medium touch-manipulation flex-shrink-0 ${isInCompare ? "bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-md" : "border border-purple-200 dark:border-purple-700 hover:bg-gradient-to-r hover:from-purple-500 hover:to-blue-500 hover:text-white"}`}
                  onClick={handleToggleCompare}>
                  <GitCompare className="w-3 h-3 inline mr-1" />
                  {isInCompare ? t.remove : t.addToCompare}
                </button>
              </div>

              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    {tool.logoUrl && (
                      <img src={tool.logoUrl} alt={`${tool.name} logo`} className="w-8 h-8 rounded-lg object-contain bg-white/50 p-1 border border-slate-200 dark:border-slate-700" onError={(e) => e.currentTarget.style.display = 'none'} />
                    )}
                    <h3 className="text-lg font-semibold leading-tight line-clamp-2">{tool.name}</h3>
                  </div>
                </div>
              </div>

              {/* Project Status Badge and Deployment Info */}
              {tool.projectStatus && (
                <div className="mb-3 space-y-2">
                  {/* Project Status Badge */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-xs px-3 py-1.5 rounded-lg font-semibold shadow-sm transition-all duration-300 group-hover:scale-105 ${
                      tool.projectStatus === 'Production' ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white' :
                      tool.projectStatus === 'Scaling' ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white' :
                      tool.projectStatus === 'Development' ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white' :
                      tool.projectStatus === 'External Tool - Not Applicable' ? 'bg-gradient-to-r from-slate-400 to-slate-500 text-white' :
                      'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                    }`}>
                      📊 {tool.projectStatus}
                    </span>
                    
                    {/* Average Capability Score Badge */}
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-sm transition-all duration-300 group-hover:scale-105">
                      <span className="text-sm">⭐</span>
                      <span className="text-xs font-bold">{averageScore.toFixed(1)}</span>
                      <span className="text-xs opacity-75">/ {maxScore}</span>
                    </div>
                    
                    {/* Last Updated Badge - Calendar with date always visible, tooltip on hover */}
                    {tool.statusLastUpdated && (
                      <div 
                        className="relative flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-50 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-700 cursor-help group/date"
                        title={`Project last updated: ${tool.statusLastUpdated}`}
                      >
                        <span className="text-purple-600 dark:text-purple-400">📅</span>
                        <span className="text-xs font-medium text-purple-700 dark:text-purple-300">
                          {tool.statusLastUpdated}
                        </span>
                        {/* Enhanced tooltip on hover for more details */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-slate-900 dark:bg-slate-700 text-white text-xs rounded-lg whitespace-nowrap opacity-0 invisible group-hover/date:opacity-100 group-hover/date:visible transition-all duration-200 pointer-events-none z-50 shadow-lg">
                          <div className="font-medium">Project Last Updated</div>
                          <div className="text-purple-300">{tool.statusLastUpdated}</div>
                          {/* Arrow */}
                          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px">
                            <div className="border-4 border-transparent border-t-slate-900 dark:border-t-slate-700"></div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Deployment Phase */}
                  {tool.deploymentPhase && (
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700">
                        <span className="text-blue-600 dark:text-blue-400">�</span>
                        <span className="font-medium text-blue-700 dark:text-blue-300">{tool.deploymentPhase}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div ref={frontScrollRef} className="flex-1 overflow-y-auto pr-2 -mr-2 mb-3" onScroll={() => checkScroll(frontScrollRef, setIsScrollable, setIsAtBottom)}>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">{tool.primaryPurpose}</p>
              {tool.salesDescription && (
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">{tool.salesDescription}</p>
              )}
              <div className="flex flex-wrap gap-1 mt-2">
                {(tool.tags || []).map(tag => (
                  <span key={tag} className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex-shrink-0">
              {isScrollable && !isAtBottom && (
                <div className="text-center text-xs text-slate-400 dark:text-slate-500 animate-bounce mb-1">
                  <ArrowDown className="w-4 h-4 mx-auto" />
                </div>
              )}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  {tool.accessLink && <AccessLink href={tool.accessLink} label={t.accessTool} toolName={tool.name} linkType="tool" />}
                  {tool.documentationLink && <AccessLink href={tool.documentationLink} label={t.docs} toolName={tool.name} linkType="docs" />}
                </div>
                <div className="text-xs text-slate-400 dark:text-slate-500">
                  Click to flip
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Back of card */}
        <div className="absolute w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <div 
            onClick={handleCardClick}
            className="flex flex-col rounded-2xl border border-blue-200/50 dark:border-blue-700/50 p-4 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-slate-800 dark:via-blue-900 dark:to-purple-900 cursor-pointer h-full"
          >
            <div className="flex-shrink-0">
              <div className="flex items-center justify-between gap-2 mb-3">
                <h4 className="font-semibold">{tool.name} - Details</h4>
                <div className="text-xs text-slate-400 dark:text-slate-500">
                  Click to flip
                </div>
              </div>
            </div>

            <div ref={backScrollRef} className="flex-1 overflow-y-auto pr-2 -mr-2" onScroll={() => checkScroll(backScrollRef, setIsBackScrollable, setIsBackAtBottom)}>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <InfoRow label={t.targetUsers} value={tool.targetUsers} />
                <InfoRow label={t.bestUseCase} value={tool.bestUseCase} />
                <InfoRow label={t.tech} value={tool.technology} />
                <InfoRow label={t.cost} value={tool.cost} />
                <InfoRow label="Office 365" value={tool.office365Integration} />
                <InfoRow label="Web Search" value={tool.capabilities?.realTimeSearch} />
                <InfoRow label="Code Gen" value={tool.capabilities?.codeGeneration} />
                <InfoRow label="Image Gen" value={tool.capabilities?.imageGeneration} />
              </div>
            </div>

            <div className="flex-shrink-0 mt-3">
              {isBackScrollable && !isBackAtBottom && (
                <div className="text-center text-xs text-slate-400 dark:text-slate-500 animate-bounce">
                  <ArrowDown className="w-4 h-4 mx-auto" />
                </div>
              )}
              <div className="flex items-center justify-between gap-2">
                <button className={`w-full px-2 py-1 rounded-lg transition-all duration-300 hover:scale-105 text-xs font-medium touch-manipulation ${isInCompare ? "bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-md" : "border border-purple-200 dark:border-purple-700 hover:bg-gradient-to-r hover:from-purple-500 hover:to-blue-500 hover:text-white"}`}
                  onClick={handleToggleCompare}>
                  <GitCompare className="w-3 h-3 inline mr-1" />
                  {isInCompare ? t.remove : t.addToCompare}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToolCard;
