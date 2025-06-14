import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import "./App.css";

const ScrollContainer = React.forwardRef(
  ({ data, selected, isWeights, onScroll, setRotation }, ref) => {
    ScrollContainer.propTypes = {
      data: PropTypes.array.isRequired,
      selected: PropTypes.array.isRequired,
      isWeights: PropTypes.array.isRequired,
      onScroll: PropTypes.func.isRequired,
      setRotation: PropTypes.func.isRequired, // Added setRotation to PropTypes
    };

    const [middleIndex, setMiddleIndex] = useState(1);
    const itemRefs = useRef([]);

    const oldSetsRef = useRef(null); // Ref for ScrollContainer with `sets`
    const oldWightsRef = useRef(null); // Ref for ScrollContainer with `weights`

    const [prevScrollPos, setPrevScrollPos] = useState(0);

    useEffect(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          const visible = entries.filter((entry) => entry.isIntersecting);
          if (visible.length > 0) {
            const visibleValues = visible.map(
              (entry) => entry.target.dataset.value
            );

            if (visibleValues.length > 1) {
              const newIndex = isWeights
                ? Number(visibleValues[1]) * 4
                : Number(visibleValues[1]);
              setMiddleIndex(newIndex);
              // Haptic feedback
              if (navigator.vibrate) {
                navigator.vibrate(50);
              }
            }
          }
        },
        {
          root: ref.current, // Observe within the parent element
          threshold: 0.1, // Adjust threshold to ensure more elements are considered visible
        }
      );

      const handleScroll = () => {
        const currentScrollPos = ref.current.scrollTop;
        setPrevScrollPos(currentScrollPos);
        if (!ref.current) return;

        const scrollTop = ref.current.scrollTop;

        if (isWeights) {
          const lastScrollTop = oldWightsRef.current || 0; // Default to 0 if not initialized
          const scrollDirection = lastScrollTop > scrollTop ? "up" : "down";
          oldWightsRef.current = scrollTop; // Update last scroll position for next comparison

          // Update lastScrollTop after determining scroll direction
          ref.current.lastScrollTop = scrollTop;
          // For `weights`, rotate clockwise on scroll down, anti-clockwise on scroll up
          setRotation((prevRotation) =>
            scrollDirection === "up" ? prevRotation + 4 : prevRotation - 4
          );
        } else {
          const lastScrollTop = oldSetsRef.current || 0; // Default to 0 if not initialized
          const scrollDirection = lastScrollTop > scrollTop ? "up" : "down";
          oldSetsRef.current = scrollTop; // Update last scroll position for next comparison

          // Update lastScrollTop after determining scroll direction
          ref.current.lastScrollTop = scrollTop;
          // For `sets`, rotate anti-clockwise on scroll down, clockwise on scroll up
          setRotation((prevRotation) =>
            scrollDirection === "up" ? prevRotation - 4 : prevRotation + 4
          );
        }
      };

      const scrollContainer = ref.current;
      if (scrollContainer) {
        scrollContainer.addEventListener("scroll", handleScroll);
      }

      itemRefs.current.forEach((ref) => {
        if (ref) observer.observe(ref);
      });

      return () => {
        if (scrollContainer) {
          scrollContainer.removeEventListener("scroll", handleScroll);
        }
        itemRefs.current.forEach((ref) => {
          if (ref) observer.unobserve(ref);
        });
      };
    }, [onScroll, ref, prevScrollPos]);

    useEffect(() => {
      const scrollContainer = ref.current;

      if (selected !== undefined && scrollContainer) {
        itemRefs.current[isWeights ? selected * 4 : selected].scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }, [selected]);

    return (
      <div className="body-root-control-left-inner-scroll" ref={ref}>
        {data.map((item, index) => (
          <div
            key={item}
            ref={(el) => (itemRefs.current[index] = el)}
            data-value={item}
            className={`body-root-control-left-inner-scroll-item`}
            style={{
              color: index === middleIndex ? "crimson" : "#fafafa",
              fontWeight: index === middleIndex ? "bold" : "normal",
              fontSize: index === middleIndex ? "1.75rem" : "1.25rem",
              borderBottom:
                index === middleIndex + 1 || index === middleIndex - 2
                  ? "0.25px solid #121212"
                  : "0.25px solid #ccc",
            }}
          >
            {item}
          </div>
        ))}
      </div>
    );
  }
);

export default ScrollContainer;
