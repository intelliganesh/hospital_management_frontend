
import React, { useState } from 'react';

interface Tab {
  title: string;
  items: string[] | React.ReactNode[];
  badge?: string;
  badgeColor?: string;
}

interface TabProps {
  tabs: Tab[];
  className?: string;
  tabClassName?: string;
  contentClassName?: string;
}

const TabbedCollapsible: React.FC<TabProps> = ({ 
  tabs = [],
  className = "",
  tabClassName = "",
  contentClassName = ""
}) => {
  const [activeTab, setActiveTab] = useState(0);

//   const getBadgeColor = (color: string) => {
//     const colors = {
//       green: 'bg-green-500',
//       blue: 'bg-blue-500',
//       red: 'bg-red-500',
//       yellow: 'bg-yellow-500',
//       purple: 'bg-purple-500',
//       orange: 'bg-orange-500'
//     };
//     return colors[color] || 'bg-green-500';
//   };

  return (
    <div className={`w-full px-3 mx-auto bg-card dark:bg-background rounded-lg overflow-hidden ${className}`}>
      {/* Tab Headers */}
      <div className="flex border-b border-border">
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === index
                ? '  border-b-2 border-primary'
                : ' hover:text-primary'
            } ${tabClassName}`}
            onClick={() => setActiveTab(index)}
          >
            <span>{tab?.title}</span>
            {tab?.badge && (
              <span className={`${tab?.badgeColor ? tab?.badgeColor : 'bg-primary'} text-white text-xs font-bold px-2 py-1 rounded-full min-w-[20px] text-center`}>
                {tab?.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className={`p-4 ${contentClassName}`}>
        {tabs[activeTab] && (
          <div className="space-y-2">
            {Array.isArray(tabs[activeTab].items) ? (
              tabs[activeTab].items.map((item, index) => (
              <div
                key={index}
                className="bg-neutral-100 dark:bg-card px-4 py-3 rounded  transition-colors cursor-pointer"
              >
                {item}
              </div>
            ))
            ) : (
              tabs[activeTab].items
            ) }
          </div>
        )}
      </div>
    </div>
  );
};

export default TabbedCollapsible;
