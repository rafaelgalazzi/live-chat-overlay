import { useState, ReactNode } from 'react';

interface Tab {
  label: string;
  content: ReactNode;
}

interface BaseTabsProps {
  tabs: Tab[];
  defaultIndex?: number;
}

export function BaseTabs({ tabs, defaultIndex = 0 }: BaseTabsProps) {
  const [activeIndex, setActiveIndex] = useState(defaultIndex);

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="flex border-b border-light mb-4">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={`flex-1 py-2 text-sm font-medium transition-colors  cursor-pointer
              ${activeIndex === index ? 'border-b-2  text-blue-600' : 'text-light hover:text-blue-500'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div>{tabs[activeIndex].content}</div>
    </div>
  );
}
