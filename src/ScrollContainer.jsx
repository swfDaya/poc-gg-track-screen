import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import "./App.css";

const ScrollContainer = React.forwardRef(
  ({ data, selected, isWeights, setRotation }, ref) => {
    const [middleIndex, setMiddleIndex] = useState(1);
    const itemRefs = useRef([]);
    const oldSetsRef = useRef(null);
    const oldWightsRef = useRef(null);
    const scrollEndTimer = useRef(null);
    const isScrolling = useRef(false);

    // Calculate item height based on container height to show exactly 3 items
    const itemHeight = `${100 / 3}%`;

    useEffect(() => {
      if (!ref.current) return;

      const observer = new IntersectionObserver(
        (entries) => {
          if (!isScrolling.current) return;

          const visibleEntries = entries.filter(
            (entry) => entry.isIntersecting
          );

          if (visibleEntries.length >= 3 && ref.current) {
            const containerRect = ref.current.getBoundingClientRect();
            const containerCenter =
              containerRect.top + containerRect.height / 2;

            let closestEntry = null;
            let minDistance = Infinity;

            visibleEntries.forEach((entry) => {
              const entryRect = entry.target.getBoundingClientRect();
              const entryCenter = entryRect.top + entryRect.height / 2;
              const distance = Math.abs(containerCenter - entryCenter);

              if (distance < minDistance) {
                minDistance = distance;
                closestEntry = entry;
              }
            });

            if (closestEntry) {
              const middleValue =
                closestEntry.target.getAttribute("data-value");
              const newIndex = data.findIndex(
                (item) => String(item) === middleValue
              );

              if (newIndex !== -1 && newIndex !== middleIndex) {
                setMiddleIndex(newIndex);
              }
            }
          }
        },
        {
          root: ref.current,
          threshold: Array.from({ length: 100 }, (_, i) => i * 0.01),
          rootMargin: "0px",
        }
      );

      const handleScroll = () => {
        isScrolling.current = true;
        clearTimeout(scrollEndTimer.current);

        scrollEndTimer.current = setTimeout(() => {
          isScrolling.current = false;
          if (middleIndex !== -1 && itemRefs.current[middleIndex]) {
            itemRefs.current[middleIndex].scrollIntoView({
              behavior: "smooth",
              block: "center",
            });
          }
        }, 150);

        const currentScrollPos = ref.current.scrollTop;

        if (!isWeights) {
          const lastScrollTop = oldWightsRef.current || 0;
          const scrollDirection =
            lastScrollTop > currentScrollPos ? "up" : "down";
          oldWightsRef.current = currentScrollPos;
          setRotation((prev) =>
            scrollDirection === "up" ? prev + 4 : prev - 4
          );
        } else {
          const lastScrollTop = oldSetsRef.current || 0;
          const scrollDirection =
            lastScrollTop > currentScrollPos ? "up" : "down";
          oldSetsRef.current = currentScrollPos;
          setRotation((prev) =>
            scrollDirection === "up" ? prev - 4 : prev + 4
          );
        }
      };

      const scrollContainer = ref.current;
      if (scrollContainer) {
        scrollContainer.addEventListener("scroll", handleScroll);
      }

      // Observe all items
      setTimeout(() => {
        itemRefs.current.forEach((el) => {
          if (el) observer.observe(el);
        });
      }, 0);

      return () => {
        clearTimeout(scrollEndTimer.current);
        if (scrollContainer) {
          scrollContainer.removeEventListener("scroll", handleScroll);
        }
        observer.disconnect();
      };
    }, [data, middleIndex, ref, isWeights, setRotation]);

    useEffect(() => {
      const scrollContainer = ref.current;
      const actualSelected = isWeights ? selected * 4 : selected;

      if (
        selected !== undefined &&
        scrollContainer &&
        itemRefs.current[actualSelected]
      ) {
        const scrollOptions = {
          behavior: "auto", // Use 'auto' for initial positioning
          block: "center",
        };

        if (isWeights) {
          itemRefs.current[actualSelected].scrollIntoView(scrollOptions);
        } else {
          const timeout = setTimeout(() => {
            itemRefs.current[actualSelected].scrollIntoView(scrollOptions);
          }, 0);
          return () => clearTimeout(timeout);
        }
      }
    }, [isWeights, ref, selected]);

    return (
      <div className="body-root-control-left-inner-scroll" ref={ref}>
        <div className="body-root-control-left-inner-scroll-list">
          {/* Add padding elements to center the first and last items */}
          <div style={{ height: itemHeight, width: "100%" }} />

          {data.map((item, index) => (
            <div
              key={`${item}-${index}`}
              ref={(el) => (itemRefs.current[index] = el)}
              data-value={item}
              className="body-root-control-left-inner-scroll-item"
              style={{
                height: itemHeight,
                color: index === middleIndex ? "crimson" : "#fafafa",
                fontWeight: index === middleIndex ? "bold" : "normal",
                fontSize: index === middleIndex ? "1.75rem" : "1.25rem",
                borderBottom:
                  index === middleIndex - 2 || index === middleIndex + 1
                    ? "0.75px solid #282828"
                    : "0.75px solid #fafafa",
              }}
            >
              {item}
            </div>
          ))}

          {/* Add padding elements to center the first and last items */}
          <div style={{ height: itemHeight, width: "100%" }} />
        </div>
      </div>
    );
  }
);

ScrollContainer.propTypes = {
  data: PropTypes.array.isRequired,
  selected: PropTypes.number.isRequired,
  isWeights: PropTypes.bool.isRequired,
  setRotation: PropTypes.func.isRequired,
};

export default ScrollContainer;
