'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Tab {
  id: string;
  label: string;
  icon: string;
  content: React.ReactNode;
}

interface ServiceTabsProps {
  tabs: Tab[];
}

export default function ServiceTabs({ tabs }: ServiceTabsProps) {
  const [activeTab, setActiveTab] = useState(tabs[0]?.id || '');

  return (
    <div>
      <div className="flex gap-1 p-1 rounded-xl bg-surface-container-low/30 border border-surface-container/50 mb-8 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap focus-ring ${
              activeTab === tab.id
                ? 'bg-surface-container text-on-surface shadow-sm border border-surface-container/50'
                : 'text-on-surface-variant/60 hover:text-on-surface-variant hover:bg-surface-container-low/50'
            }`}
          >
            <span className="material-symbols-outlined text-base">{tab.icon}</span>
            <span className="font-label-md text-sm">{tab.label}</span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2 }}
        >
          {tabs.find(t => t.id === activeTab)?.content}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
