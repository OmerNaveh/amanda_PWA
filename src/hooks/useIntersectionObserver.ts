import { useState, useEffect } from "react";

const useIntersectionObserver = (
  ref: any,
  { threshold = 0.6, ...options }: any = {}
) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.intersectionRatio >= threshold);
      },
      { threshold, ...options }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [ref, threshold, options]);

  return isVisible;
};

export default useIntersectionObserver;
