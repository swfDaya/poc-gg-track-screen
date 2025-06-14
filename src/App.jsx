import React, { useEffect, useState, useRef } from "react";
import "./App.css";
import ScrollContainer from "./scrollContainer";
import helm6 from "./assets/helm6.png";

const exerciseData = [
  { set: 1, weight: 10, reps: Math.floor(Math.random() * (20 - 10 + 1)) + 10 },
  { set: 2, weight: 15, reps: Math.floor(Math.random() * (20 - 10 + 1)) + 10 },
  { set: 3, weight: 20, reps: Math.floor(Math.random() * (20 - 10 + 1)) + 10 },
  { set: 4, weight: 25, reps: Math.floor(Math.random() * (20 - 10 + 1)) + 10 },
  { set: 5, weight: 30, reps: Math.floor(Math.random() * (20 - 10 + 1)) + 10 },
];

function App() {
  const [selectedSet, setSelectedSet] = useState(0);
  const addEmptyElements = (array) => ["", ...array, ""];

  const sets = addEmptyElements(Array.from({ length: 50 }, (_, i) => i + 1));
  const weights = addEmptyElements(
    Array.from({ length: 200 }, (_, i) => (i + 1) * 0.25)
  );
  const [rotation, setRotation] = useState(0); // State to track image rotation
  const setsRef = useRef(null); // Ref for ScrollContainer with `sets`
  const oldSetsRef = useRef(null); // Ref for ScrollContainer with `sets`
  const weightsRef = useRef(null); // Ref for ScrollContainer with `weights`
  const oldWightsRef = useRef(null); // Ref for ScrollContainer with `weights`

  const handleScroll = (ref, isSets) => {
    if (!ref.current) return;

    const scrollTop = ref.current.scrollTop;

    if (isSets) {
      const lastScrollTop = oldSetsRef.current || 0; // Default to 0 if not initialized
      const scrollDirection = lastScrollTop > scrollTop ? "up" : "down";
      oldSetsRef.current = scrollTop; // Update last scroll position for next comparison

      // Update lastScrollTop after determining scroll direction
      ref.current.lastScrollTop = scrollTop;
      // For `sets`, rotate anti-clockwise on scroll down, clockwise on scroll up
      setRotation((prevRotation) =>
        scrollDirection === "up" ? prevRotation - 4 : prevRotation + 4
      );
    } else {
      const lastScrollTop = oldWightsRef.current || 0; // Default to 0 if not initialized
      const scrollDirection = lastScrollTop > scrollTop ? "up" : "down";
      oldWightsRef.current = scrollTop; // Update last scroll position for next comparison

      // Update lastScrollTop after determining scroll direction
      ref.current.lastScrollTop = scrollTop;
      // For `weights`, rotate clockwise on scroll down, anti-clockwise on scroll up
      setRotation((prevRotation) =>
        scrollDirection === "up" ? prevRotation + 4 : prevRotation - 4
      );
    }
  };

  useEffect(() => {
    const metaThemeColor = document.querySelector("meta[name=theme-color]");
    if (metaThemeColor) {
      metaThemeColor.setAttribute("content", "#6200ee");
    }
  }, []);

  return (
    <div className="app-root">
      <div className="body-root">
        <div className="body-root-header">2. Shoulder press</div>
        <div className="body-root-sets">
          <div className="body-root-sets-legend">
            <p>Set</p>
            <p>Weight</p>
            <p>Reps</p>
          </div>
          <div className="body-root-sets-data">
            {exerciseData.map((exercise, index) => (
              <div
                key={index}
                className={`body-root-sets-each ${
                  selectedSet === index ? "selected" : ""
                }`}
                onClick={() => setSelectedSet(index)}
              >
                <p>{exercise.set}</p>
                <p>{exercise.weight}</p>
                <p>{exercise.reps}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="body-root-control">
          <div className="body-root-control-left">
            <div className="body-root-control-left-inner">
              <ScrollContainer
                data={sets}
                selected={20} // Example selected index for `sets`
                ref={setsRef}
                isWeights={false} // Indicate this is for `sets`
                onScroll={() => handleScroll(setsRef, true)} // Pass scroll handler for `sets`
              />
            </div>
          </div>
          <div className="body-root-control-center">
            <img
              src={helm6}
              alt="helm6 Icon"
              style={{ transform: `rotate(${rotation}deg)` }} // Apply rotation
            />
          </div>
          <div className="body-root-control-right">
            <div className="body-root-control-right-inner">
              <ScrollContainer
                data={weights}
                selected={30} // Example selected index for `weights`
                ref={weightsRef}
                isWeights={true} // Indicate this is for `weights`
                onScroll={() => handleScroll(weightsRef, false)} // Pass scroll handler for `weights`
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
