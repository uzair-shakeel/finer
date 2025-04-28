import { useState, useEffect } from "react";
import TabsNavigation from "./TabsNavigation";
import SellTab from "./SellTab";
import AuthenticateTab from "./AuthenticateTab";
import SourceTab from "./SourceTab";
import PartExchangeTab from "./PartExchangeTab";
import BuyTab from "./BuyTab";
import { useTranslation } from "react-i18next";

export default function Tab() {
  const { t } = useTranslation();

  const [activeTab, setActiveTab] = useState("sell");

  useEffect(() => {
    const checkSessionStorageForTab = () => {
      if (typeof window !== "undefined") {
        try {
          const tabParam = sessionStorage.getItem("setActiveHomeTab");
          if (tabParam) {
            console.log("Setting active tab to:", tabParam);
            setActiveTab(tabParam);
            sessionStorage.removeItem("setActiveHomeTab");
          }
        } catch (err) {
          console.error("Error checking sessionStorage:", err);
        }
      }
    };

    checkSessionStorageForTab();

    const interval = setInterval(checkSessionStorageForTab, 500);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const tabs = [
    { id: "sell", label: t("tab.sell") },
    { id: "buy", label: t("tab.buy") },
    { id: "part-exchange", label: t("tab.partExchange") },
    { id: "source", label: t("tab.source") },
    { id: "authenticate", label: t("tab.authenticate") },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "buy":
        return <BuyTab />;
      case "part-exchange":
        return <PartExchangeTab />;
      case "sell":
        return <SellTab />;
      case "source":
        return <SourceTab />;
      case "authenticate":
        return <AuthenticateTab />;
      default:
        return <BuyTab />;
    }
  };

  return (
    <main
      id="homeFormSection"
      data-active-tab={activeTab}
      className="flex mt-[12px] md:mt-[32px] flex-col items-center justify-center px-5"
    >
      <div className="w-full max-w-[1296px] mx-auto bg-white rounded-[20px] md:rounded-[30px] p-2.5 md:p-6 overflow-hidden">
        <TabsNavigation
          tabs={tabs}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        <div className="scroll-mt-[80px]">{renderTabContent()}</div>
      </div>
    </main>
  );
}
