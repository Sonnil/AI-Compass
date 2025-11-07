import { useComparisonStore } from '@/stores/comparison';
import { X, Trash2, GitCompareArrows } from 'lucide-react';
import { useState } from 'react';
import { ComparisonModal } from './ComparisonModal';

export const ComparisonBar = () => {
  const { items: compareList, remove: removeFromCompare, clear: clearCompareList } = useComparisonStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (compareList.length === 0) {
    return null;
  }

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 bg-gray-800 text-white p-4 shadow-lg z-50">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <GitCompareArrows className="h-6 w-6 text-blue-400" />
            <h3 className="text-lg font-semibold">Tool Comparison ({compareList.length})</h3>
            <div className="flex space-x-2">
              {compareList.map(tool => {
                const toolId = tool.id || tool.name;
                return (
                  <div key={toolId} className="flex items-center bg-gray-700 rounded-full px-3 py-1">
                    <span>{tool.name}</span>
                    <button onClick={() => removeFromCompare(toolId)} className="ml-2 text-gray-400 hover:text-white">
                      <X size={16} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg flex items-center transition-colors"
              disabled={compareList.length < 2}
            >
              <GitCompareArrows size={18} className="mr-2" />
              Compare Now
            </button>
            <button 
              onClick={clearCompareList} 
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg flex items-center transition-colors"
            >
              <Trash2 size={18} className="mr-2" />
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Comparison Modal */}
      <ComparisonModal 
        tools={compareList}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};
