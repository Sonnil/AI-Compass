import React from 'react';
import { X, CheckCircle, XCircle, ExternalLink, HelpCircle } from 'lucide-react';
import { Tool } from '@/types';

interface ComparisonModalProps {
  tools: Tool[];
  onClose: () => void;
  isOpen: boolean;
}

export const ComparisonModal: React.FC<ComparisonModalProps> = ({ tools, onClose, isOpen }) => {
  if (!isOpen || tools.length === 0) return null;

  // Helper to render boolean values
  const renderBoolean = (value?: boolean | string) => {
    // Handle both boolean and string types
    if (value === true || value === 'true') {
      return <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />;
    }
    if (value === false || value === 'false') {
      return <XCircle className="h-5 w-5 text-red-500 mx-auto" />;
    }
    return <HelpCircle className="h-5 w-5 text-gray-400 mx-auto" />;
  };

  // Helper to get capability value (supports both nested and flat structure)
  const getCapability = (tool: Tool, capability: 'codeGeneration' | 'imageGeneration' | 'realTimeSearch') => {
    // Check nested capabilities first
    if (tool.capabilities?.[capability] !== undefined) {
      return tool.capabilities[capability];
    }
    // Fall back to flat properties
    if (capability === 'codeGeneration' && 'codeGeneration' in tool) {
      return (tool as any).codeGeneration;
    }
    if (capability === 'imageGeneration' && tool.imageGeneration !== undefined) {
      return tool.imageGeneration;
    }
    if (capability === 'realTimeSearch' && tool.realTimeWebSearch !== undefined) {
      return tool.realTimeWebSearch;
    }
    return undefined;
  };

  // Comparison rows
  const comparisonRows = [
    { label: 'Type', key: 'type', render: (tool: Tool) => (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
        tool.type === 'internal' 
          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300'
          : 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300'
      }`}>
        {tool.type === 'internal' ? 'Internal' : 'External'}
      </span>
    )},
    { label: 'Primary Purpose', key: 'primaryPurpose', render: (tool: Tool) => tool.primaryPurpose },
    { label: 'Target Users', key: 'targetUsers', render: (tool: Tool) => tool.targetUsers || 'N/A' },
    { label: 'Technology', key: 'technology', render: (tool: Tool) => tool.technology || 'N/A' },
    { label: 'Best Use Case', key: 'bestUseCase', render: (tool: Tool) => tool.bestUseCase || 'N/A' },
    { label: 'Cost', key: 'cost', render: (tool: Tool) => tool.cost || 'N/A' },
    { label: 'Real-Time Web Search', key: 'realTimeWebSearch', render: (tool: Tool) => renderBoolean(getCapability(tool, 'realTimeSearch')) },
    { label: 'Code Generation', key: 'codeGeneration', render: (tool: Tool) => renderBoolean(getCapability(tool, 'codeGeneration')) },
    { label: 'Image Generation', key: 'imageGeneration', render: (tool: Tool) => renderBoolean(getCapability(tool, 'imageGeneration')) },
    { label: 'Access Link', key: 'accessLink', render: (tool: Tool) => (
      tool.accessLink ? (
        <a 
          href={tool.accessLink} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-500 hover:text-blue-600 flex items-center justify-center gap-1 text-sm"
        >
          Visit <ExternalLink className="h-3 w-3" />
        </a>
      ) : 'N/A'
    )},
    { label: 'Tags', key: 'tags', render: (tool: Tool) => (
      <div className="flex flex-wrap gap-1 justify-center">
        {tool.tags?.slice(0, 3).map((tag, idx) => (
          <span key={idx} className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
            #{tag}
          </span>
        ))}
        {tool.tags && tool.tags.length > 3 && (
          <span className="text-xs text-gray-500">+{tool.tags.length - 3}</span>
        )}
      </div>
    )}
  ];

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-[60] backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-4 md:inset-8 lg:inset-16 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl z-[61] flex flex-col overflow-hidden comparison-modal-print">
        {/* Header */}
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-slate-800 dark:to-blue-900 print:bg-white">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Tool Comparison</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Comparing {tools.length} tool{tools.length !== 1 ? 's' : ''} side by side
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label="Close comparison"
          >
            <X className="h-6 w-6 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {/* Comparison Table */}
        <div className="flex-1 overflow-auto p-4 md:p-6">
          <div className="min-w-max">
            <table className="w-full border-collapse">
              <thead className="sticky top-0 bg-white dark:bg-slate-900 z-10">
                <tr>
                  <th className="p-3 text-left font-semibold text-gray-700 dark:text-gray-300 border-b-2 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-slate-800 min-w-[180px]">
                    Feature
                  </th>
                  {tools.map((tool, idx) => (
                    <th 
                      key={tool.id || tool.name} 
                      className="p-3 text-center font-semibold text-gray-700 dark:text-gray-300 border-b-2 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-slate-800 min-w-[280px]"
                    >
                      <div className="flex flex-col items-center gap-2">
                        {tool.logoUrl && (
                          <img 
                            src={tool.logoUrl} 
                            alt={tool.name}
                            className="h-10 w-10 object-contain"
                          />
                        )}
                        <span className="font-bold">{tool.name}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row, rowIdx) => (
                  <tr 
                    key={row.key}
                    className={rowIdx % 2 === 0 ? 'bg-white dark:bg-slate-900' : 'bg-gray-50 dark:bg-slate-800'}
                  >
                    <td className={`p-3 font-medium text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700 ${(row as any).isLarge ? 'align-top' : ''}`}>
                      {row.label}
                    </td>
                    {tools.map((tool) => (
                      <td 
                        key={tool.id || tool.name}
                        className={`${(row as any).isLarge ? 'p-0' : 'p-3'} text-center border-b border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400`}
                      >
                        {row.render(tool)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-4 md:p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-800">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium"
          >
            Close
          </button>
          <button
            onClick={() => window.print()}
            className="px-6 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-colors font-medium"
          >
            Print Comparison
          </button>
        </div>
      </div>
    </>
  );
};
