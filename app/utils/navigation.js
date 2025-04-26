import { useRouter } from "next/navigation";

/**
 * @param {string} item  
 * @param {string} details  
 * @param {string} price 
 */
export const navigateToBuyForm = (item, details, price) => {
  const queryParams = new URLSearchParams();
  if (item) queryParams.append("item", item);
  if (details) queryParams.append("details", details);
  if (price) queryParams.append("price", price);

  sessionStorage.setItem("scrollToBuyForm", "true");

  window.location.href = `/enquire?tab=buy&${queryParams.toString()}`;
};

/**
 * Scroll to the home form section smoothly
 * @param {string} tabId - The ID of the tab to activate (optional)
 */
export const scrollToHomeFormSection = (tabId = "buy") => {
  const formSection = document.getElementById("homeFormSection");

  if (formSection) {
    if (tabId) {
      sessionStorage.setItem("setActiveHomeTab", tabId);
    }

    // Add offset to the scroll position
    const offset = 80; // This matches your scroll-mt-[80px] class
    const elementPosition = formSection.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth"
    });

    setTimeout(() => {
      const tabButton = document.querySelector(`[data-tab-id="${tabId}"]`);
      if (tabButton) {
        tabButton.click();
      } else {
        const buttons = document.querySelectorAll("button");
        for (const button of buttons) {
          if (button.textContent.trim().toLowerCase() === tabId.toLowerCase()) {
            button.click();
            break;
          }
        }
      }
    }, 500);
  }
};
