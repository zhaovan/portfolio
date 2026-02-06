import { useEffect, useRef, useState } from "react";

// Singleton observer instance shared across all components
let sharedObserver: IntersectionObserver | null = null;
const observedElements = new Map<Element, (isVisible: boolean) => void>();

function getSharedObserver() {
  if (!sharedObserver && typeof window !== "undefined") {
    sharedObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const callback = observedElements.get(entry.target);
          if (callback) {
            callback(entry.isIntersecting);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "50px",
      },
    );
  }
  return sharedObserver;
}

export function useVideoVisibility(eagerLoad: boolean = false) {
  const [isVisible, setIsVisible] = useState(eagerLoad);
  const elementRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (eagerLoad) return;

    const element = elementRef.current;
    if (!element) return;

    const observer = getSharedObserver();
    if (!observer) return;

    // Register callback for this element
    observedElements.set(element, (visible) => {
      if (visible) {
        setIsVisible(true);
        // Unobserve after becoming visible
        observer.unobserve(element);
        observedElements.delete(element);
      }
    });

    observer.observe(element);

    return () => {
      observer.unobserve(element);
      observedElements.delete(element);
    };
  }, [eagerLoad]);

  return { elementRef, isVisible };
}
