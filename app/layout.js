import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import "./globals.css";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import I18nProvider from "./components/I18nProvider";
import { initializeDataStorage } from "./lib/init";

// Initialize data storage on server side
try {
  initializeDataStorage();
} catch (error) {
  console.error("Failed to initialize data storage:", error);
}

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "Finer Lux - Pre-Owned Watches & Jewellery",
  description:
    "Buy & Sell luxury watches, jewellery with us. Instant payment on the spot — via direct bank transfer, cash or crypto. Only Authenticated pieces. We help customers to save time and enjoy more of what they love.",
  metadataBase: new URL("https://finerlux.com"),
  openGraph: {
    title: "Finer Lux - Pre-Owned Watches & Jewellery",
    description:
      "Buy & Sell luxury watches, jewellery with us. Instant payment on the spot — via direct bank transfer, cash or crypto. Only Authenticated pieces. We help customers to save time and enjoy more of what they love.",
    images: [
      {
        url: "/assets/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Finer Lux - Pre-Owned Watches & Jewellery",
      },
    ],
    type: "website",
  },
  icons: {
    icon: "/favicon.jpg",
    apple: "/favicon.jpg",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.className}>
      <head>
        <script
          type="text/javascript"
          dangerouslySetInnerHTML={{
            __html: `
              (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "qtx9p399lq");
            `,
          }}
        />
      </head>
      <body>
        <I18nProvider>
          <Navbar />
          {children}
          <Footer />
          <SpeedInsights />
          <Analytics />
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
        </I18nProvider>
      </body>
    </html>
  );
}
