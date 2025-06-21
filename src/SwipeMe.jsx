"use client";

import { useRef, useEffect, useState } from "react";
// eslint-disable-next-line no-unused-vars
import { useSpring, animated } from "react-spring";
import { useDrag } from "@use-gesture/react";
// import chevronRight from "./assets/chevrons-right.svg";
import chevronRightWhite from "./assets/chevrons-right-white.svg";
import "./SwipeMe.css";

import PropTypes from "prop-types";

const SwipeMe = ({ swipeKey, setSwipeKey }) => {

  const containerRef = useRef(null);
  const sliderRef = useRef(null);
  const maxXRef = useRef(0);
  const isAnimatingRef = useRef(false);
  const [ready, setReady] = useState(false);

  const [{ x }, api] = useSpring(() => ({ x: 0 }));

  // Calculate dimensions
  const updateDimensions = () => {
    if (containerRef.current && sliderRef.current) {
      const containerWidth = containerRef.current.offsetWidth;
      const sliderWidth = sliderRef.current.offsetWidth;
      maxXRef.current = containerWidth - sliderWidth;
      setReady(true);
    }
  };

  useEffect(() => {
    // Reset everything
    api.start({ x: 0, immediate: true });
    isAnimatingRef.current = false;

    // Calculate dimensions
    const timer = setTimeout(() => {
      updateDimensions();
    }, 0);

    // Handle resize
    window.addEventListener("resize", updateDimensions);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", updateDimensions);
    };
  }, [api, swipeKey]);

  const bind = useDrag(
    ({ active, movement: [mx], last, memo }) => {
      if (!ready || isAnimatingRef.current) {
        return memo;
      }

      // Always recalculate maxX to ensure it's current
      updateDimensions();
      const currentMaxX = maxXRef.current;

      if (currentMaxX <= 0) return memo;

      const clampedX = Math.min(Math.max(0, mx), currentMaxX);
      const threshold = currentMaxX * 0.8;

      if (last) {
        // Drag ended
        if (clampedX >= threshold) {
          isAnimatingRef.current = true;

          // Haptic feedback
          if (navigator.vibrate) {
            navigator.vibrate(200);
          }

          // Animate to end
          api.start({ x: currentMaxX });

          // Update counter and reset
          setSwipeKey((prev) => {
            return prev + 1;
          });

          setTimeout(() => {
            api.start({ x: 0 });
            setTimeout(() => {
              isAnimatingRef.current = false;
            }, 300);
          }, 500);
        } else {
          // Failed swipe - return to start
          api.start({ x: 0 });
        }
      } else if (active) {
        // Currently dragging
        api.start({ x: clampedX, immediate: true });
      }

      return memo;
    },
    {
      axis: "x",
      filterTaps: true,
      // Don't set static bounds - we calculate them dynamically
    }
  );

  return (
    <div className="swipe-container" ref={containerRef}>
      <animated.div
        {...bind()}
        ref={sliderRef}
        className="swipe-slider"
        style={{
          transform: x.to((x) => `translateX(${x}px)`),
          touchAction: "none",
        }}
      >
        <img
          src={chevronRightWhite}
          alt="Swipe right"
          className="swipe-icon"
          style={{ transform: x.to((x) => `translateX(${x}px)`) }}
        />
      </animated.div>
    </div>
  );
};

export default SwipeMe;
