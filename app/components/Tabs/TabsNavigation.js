"use client";

export default function TabsNavigation({ tabs, activeTab, setActiveTab }) {
  return (
    <div className="bg-[#E3E8ED] rounded-[16px] md:rounded-[30px] px-2 md:px-4 py-1.5 md:h-[54px] flex items-center gap-2 justify-between w-full">
      <div className="w-full flex flex-wrap sm:flex-nowrap justify-center sm:justify-between lg:justify-evenly items-center gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            data-tab-id={tab.id}
            data-tab-label={tab.label}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3.5 md:px-5 lg:px-8 py-[5px] md:py-2 text-nowrap rounded-[30px] text-sm md:text-lg font-normal transition-colors ${
              activeTab === tab.id
                ? "bg-[#017EFE] text-white"
                : "text-black hover:bg-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
