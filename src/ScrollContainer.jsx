import React, { useState, useEffect, useRef, useCallback } from "react";
import PropTypes from "prop-types";
import "./App.css";

const ScrollContainer = React.forwardRef(
  ({ data, selected, isWeights, setRotation }, ref) => {
    const [middleIndex, setMiddleIndex] = useState(1);
    const itemRefs = useRef([]);
    const oldScrollPos = useRef(0);
    const animationFrameId = useRef();
    const isScrolling = useRef(false);
    const lastMiddleIndex = useRef(-1);

    // Calculate item height based on container height to show exactly 3 items
    const itemHeight = `${100 / 3}%`;

    const findMiddleElement = useCallback(() => {
      if (!ref.current) return;

      const container = ref.current;
      const containerRect = container.getBoundingClientRect();
      const containerCenter = containerRect.top + containerRect.height / 2;

      let closestIndex = -1;
      let minDistance = Infinity;
      let secondMinDistance = Infinity;

      // Find the two closest elements to the center
      itemRefs.current.forEach((el, index) => {
        if (!el) return;

        const rect = el.getBoundingClientRect();
        const elementCenter = rect.top + rect.height / 2;
        const distance = Math.abs(containerCenter - elementCenter);

        if (distance < minDistance) {
          // Shift previous closest to second closest
          secondMinDistance = minDistance;

          // Update new closest
          minDistance = distance;
          closestIndex = index;
        } else if (distance < secondMinDistance) {
          secondMinDistance = distance;
        }
      });

      // Only update if we have valid indices and the element is significantly closer
      if (
        closestIndex !== -1 &&
        (minDistance < secondMinDistance * 0.8 || // At least 20% closer
          Math.abs(minDistance - secondMinDistance) < 1) // Or nearly same distance
      ) {
        if (closestIndex !== lastMiddleIndex.current) {
          lastMiddleIndex.current = closestIndex;
          setMiddleIndex(closestIndex);
          if (navigator.vibrate) {
            navigator.vibrate(50);
          }
        }
      }
    }, [ref]);

    const updateWhileScrolling = useCallback(() => {
      findMiddleElement();
      if (isScrolling.current) {
        animationFrameId.current = requestAnimationFrame(updateWhileScrolling);
      }
    }, [findMiddleElement]);

    const handleScroll = useCallback(() => {
      if (!isScrolling.current) {
        isScrolling.current = true;
        animationFrameId.current = requestAnimationFrame(updateWhileScrolling);
      }

      const currentScrollPos = ref.current?.scrollTop || 0;
      const scrollDirection =
        oldScrollPos.current > currentScrollPos ? "up" : "down";
      oldScrollPos.current = currentScrollPos;

      setRotation((prev) => {
        let newRotation;
        if (!isWeights) {
          newRotation = scrollDirection === "up" ? prev + 4 : prev - 4;
        } else {
          newRotation = scrollDirection === "up" ? prev - 4 : prev + 4;
        }
        return newRotation;
      });
    }, [isWeights, setRotation, ref, updateWhileScrolling]);

    // Initialize and clean up scroll listener
    useEffect(() => {
      const scrollContainer = ref.current;
      if (!scrollContainer) return;

      scrollContainer.addEventListener("scroll", handleScroll);

      return () => {
        scrollContainer.removeEventListener("scroll", handleScroll);
        cancelAnimationFrame(animationFrameId.current);
      };
    }, [handleScroll, ref]);

    // Handle scroll end detection
    useEffect(() => {
      const timer = setTimeout(() => {
        isScrolling.current = false;
        cancelAnimationFrame(animationFrameId.current);

        // Final verification when scrolling stops
        if (ref.current && itemRefs.current[middleIndex]) {
          itemRefs.current[middleIndex].scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
      }, 150);

      return () => clearTimeout(timer);
    }, [middleIndex, ref]);

    // Handle initial selection and programmatic changes
    useEffect(() => {
      const scrollContainer = ref.current;
      const actualSelected = isWeights ? selected * 4 : selected;

      if (
        selected !== undefined &&
        scrollContainer &&
        itemRefs.current[actualSelected]
      ) {
        // Use microtask to ensure DOM is ready
        Promise.resolve().then(() => {
          itemRefs.current[actualSelected].scrollIntoView({
            behavior: "auto",
            block: "center",
          });
          setMiddleIndex(actualSelected);
          if (navigator.vibrate) {
            navigator.vibrate(50);
          }
          lastMiddleIndex.current = actualSelected;
        });
      }
    }, [isWeights, ref, selected]);

    return (
      <div className="body-root-control-left-inner-scroll" ref={ref}>
        <div className="body-root-control-left-inner-scroll-list">
          {/* Top padding */}
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
                  index === middleIndex + 1 || index === middleIndex - 2
                    ? "0.75px solid #282828"
                    : "0.75px solid #fafafa",
              }}
            >
              {item}
            </div>
          ))}

          {/* Bottom padding */}
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
