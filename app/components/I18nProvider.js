"use client";

import { useEffect, useState } from "react";
import { initI18n } from "../../i18n";
import { Toaster } from "react-hot-toast";

export default function I18nProvider({ children }) {
     const [initialized, setInitialized] = useState(false);

     useEffect(() => {
          initI18n().then(() => {
               setInitialized(true);
          });
     }, []);

     if (!initialized) {
          return <div>
               <Toaster
                    position="top-right"
                    toastOptions={{
                         duration: 3000,
                         style: {
                              background: "#fff",
                              color: "#333",
                              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                              borderRadius: "8px",
                              padding: "12px 20px",
                         },
                         success: {
                              iconTheme: {
                                   primary: "#10B981",
                                   secondary: "#FFFFFF",
                              },
                         },
                         error: {
                              iconTheme: {
                                   primary: "#EF4444",
                                   secondary: "#FFFFFF",
                              },
                         },
                    }}
               />
          </div>;
     }

     return children;
}