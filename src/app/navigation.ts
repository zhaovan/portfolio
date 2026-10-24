// Tracks whether the most recent navigation came from the browser's back /
// forward buttons, so the page transition can be skipped when returning to a
// page the visitor has already seen.
let lastNavigationWasBackForward = false;

if (typeof window !== "undefined") {
  window.addEventListener("popstate", () => {
    lastNavigationWasBackForward = true;
  });
  // Clicking a link (or anything else) starts a fresh, forward navigation.
  window.addEventListener(
    "click",
    () => {
      lastNavigationWasBackForward = false;
    },
    true,
  );
}

export function wasBackForwardNavigation() {
  return lastNavigationWasBackForward;
}
