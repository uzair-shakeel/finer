import React from "react";
import { useTranslation } from "next-i18next";

const ConditionsModal = () => {
  const { t } = useTranslation();
  
  const conditions = [
    { key: "new", title: t("modal.conditionTitles.new") },
    { key: "unworn", title: t("modal.conditionTitles.unworn") },
    { key: "veryGood", title: t("modal.conditionTitles.veryGood") },
    { key: "good", title: t("modal.conditionTitles.good") },
    { key: "fair", title: t("modal.conditionTitles.fair") },
    { key: "incomplete", title: t("modal.conditionTitles.incomplete") }
  ];

  return (
    <div>
      <ul className="list-disc pl-5 space-y-2">
        {conditions.map((condition) => (
          <li key={condition.key} className="text-sm sm:text-base">
            <strong>{condition.title}:</strong> {t(`modal.conditions.${condition.key}`)}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ConditionsModal;