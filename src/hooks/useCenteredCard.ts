import { useEffect, useState } from "react";

const useCenteredCard = (containerSelector: string, itemCount: number) => {
  const [centeredIndex, setCenteredIndex] = useState<number | null>(null);

  useEffect(() => {
    const container = document.querySelector(
      containerSelector
    ) as HTMLDivElement;

    const handleScroll = () => {
      if (!container) return;
      let closestCentered = null;
      let minDistance = Infinity;

      for (let index = 0; index < itemCount; index++) {
        const card = container.children[index] as HTMLDivElement;
        if (!card) continue;
        const cardCenter = card.offsetLeft + card.offsetWidth / 2;
        const containerCenter =
          container.scrollLeft + container.offsetWidth / 2;

        const distance = Math.abs(containerCenter - cardCenter);
        if (distance < minDistance) {
          minDistance = distance;
          closestCentered = index;
        }
      }

      setCenteredIndex(closestCentered);
    };

    container.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial call to set the centered index

    return () => container.removeEventListener("scroll", handleScroll);
  }, [containerSelector, itemCount]);

  return centeredIndex;
};

export default useCenteredCard;
