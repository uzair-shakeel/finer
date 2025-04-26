"use client"
import { useSearchParams } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import BuyTab from './BuyTab';
import SellTab from './SellTab';
import PartExchangeTab from './PartExchangeTab';
import SourceTab from './SourceTab';
import AuthenticateTab from './AuthenticateTab';
import { useTranslation } from 'react-i18next';

export default function TabComponent() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState('sell'); 
  const buyTabRef = useRef(null);
  
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam && ['sell', 'buy', 'partExchange', 'source', 'authenticate'].includes(tabParam)) {
      setActiveTab(tabParam);
      
      if (tabParam === 'buy' && sessionStorage.getItem('scrollToBuyForm') === 'true') {
        sessionStorage.removeItem('scrollToBuyForm');
        
        setTimeout(() => {
          const buyForm = document.getElementById('buyForm');
          if (buyForm) {
            buyForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
            
            const firstInput = buyForm.querySelector('input');
            if (firstInput) {
              firstInput.focus();
            }
          }
        }, 500); 
      }
    }
  }, [searchParams]);
  
  const tabs = [
    { id: 'sell', label: t("tab.sell") },
    { id: 'buy', label: t("tab.buy") },
    { id: 'partExchange', label: t("tab.partExchange") },
    { id: 'source', label: t("tab.source") },
    { id: 'authenticate', label: t("tab.authenticate") },
  ];

  return (
    <div className="w-full px-2 md:px-0 max-w-[1120px] mx-auto">
      <div className="tabs">
        <div className="flex flex-wrap md:gap-[2px] border-b border-[#f7f7f7]">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 md:py-3 font-medium text-center relative focus:outline-none ${
                activeTab === tab.id
                  ? "text-black after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-[#017EFE]"
                  : "text-[#828282] hover:text-[#414141]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="tab-content scroll-mt-[80px]">
        {activeTab === 'sell' && <SellTab />}
        {activeTab === 'buy' && <BuyTab ref={buyTabRef} />}
        {activeTab === 'partExchange' && <PartExchangeTab />}
        {activeTab === 'source' && <SourceTab />}
        {activeTab === 'authenticate' && <AuthenticateTab />}
      </div>
    </div>
  );
} 