"use client";

import { useState, useRef, useEffect } from "react";
import "./App.css";
import ScrollContainer from "./scrollContainer";
import helm from "./assets/helm6white.png";
import check from "./assets/check.svg";
import clock from "./assets/clock.svg";
import reset from "./assets/reset.svg";
import SwipeMe from "./SwipeMe";

const exerciseData = [
  { set: 1, weight: 10, reps: Math.floor(Math.random() * (20 - 10 + 1)) + 10 },
  { set: 2, weight: 15, reps: Math.floor(Math.random() * (20 - 10 + 1)) + 10 },
  { set: 3, weight: 20, reps: Math.floor(Math.random() * (20 - 10 + 1)) + 10 },
  { set: 4, weight: 25, reps: Math.floor(Math.random() * (20 - 10 + 1)) + 10 },
  { set: 5, weight: 30, reps: Math.floor(Math.random() * (20 - 10 + 1)) + 10 },
];

function App() {
  const [selectedSet, setSelectedSet] = useState(1);

  const [numberOfSets, setNumberOfSets] = useState(exerciseData.length); // State for number of sets
  const setsParentRef = useRef(null); // Ref for ScrollContainer with `sets`
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (setsParentRef.current) {
      const { offsetWidth, offsetHeight } = setsParentRef.current;
      setDimensions({ width: offsetWidth, height: offsetHeight });
    }
  }, []);

  const [selectedWeight, setSelectedWeight] = useState(exerciseData[0].weight); // State for selected weight
  const [selectedReps, setSelectedReps] = useState(exerciseData[0].reps); // State for selected reps
  const [refreshKey, setRefreshKey] = useState(0);

  const addEmptyElements = (array) => ["", ...array, ""];

  const reps = addEmptyElements(Array.from({ length: 50 }, (_, i) => i + 1));
  const weights = addEmptyElements(
    Array.from({ length: 200 }, (_, i) => (i + 1) * 0.25)
  );
  const [rotation, setRotation] = useState(0); // State to track image rotation
  const repsRef = useRef(null); // Ref for ScrollContainer with `sets`
  const weightsRef = useRef(null); // Ref for ScrollContainer with `weights`

  const [swipeKey, setSwipeKey] = useState(0); // State to trigger re-render of SwipeMe

  const handleSetClick = (index) => {
    setSelectedSet(index);
    setSelectedWeight(exerciseData[index].weight); // Update selected weight based on set
    setSelectedReps(exerciseData[index].reps); // Update selected reps based on set
    setRefreshKey((prev) => prev + 1); // Always increment to force remount
  };

  // Haptic feedback handlers
  const handleResetClick = () => {
    // Haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
    setRefreshKey((prev) => prev + 1); // Always increment to force remount
  };

  const handleClockClick = () => {
    // Haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
  };

  const handleCheckClick = () => {
    // Haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
  };

  return (
    <div className="app-root">
      <div className="body-root">
        <div className="body-root-current-set">
          <div style={{ width: "100%", textAlign: "center" }}>Today</div>
          <div className="body-root-current-set-data">
            <p>Set {selectedSet + 1}</p>
            <p>10 kg</p>
            <p>16 s</p>
          </div>
        </div>
        <div className="body-root-sets-select" ref={setsParentRef}>
          {[1, 2, 3, 4, 5].map((set, index) => {
            const stepCircleSize = dimensions.height * 0.6;
            const innerCircleSize = dimensions.height * 0.59;
            return (
              <div
                key={index}
                onClick={() => handleSetClick(index)}
                className={`step-circle ${
                  selectedSet === index ? "selected" : ""
                }`}
                style={{
                  width: stepCircleSize,
                  height: stepCircleSize,
                }}
              >
                <p>{set}</p>
                {/* <div
                  className={`step-inner-circle ${
                    selectedSet === index ? "selected" : ""
                  }`}
                  style={{
                    width: innerCircleSize,
                    height: innerCircleSize,
                  }}
                >
                  <p>{set}</p>
                </div> */}
              </div>
            );
          })}
        </div>

        <div className="body-root-control-new">
          <div className="body-root-control-weights-scroll-container">
            <ScrollContainer
              key={refreshKey} // Use refreshKey to force remount
              data={weights}
              selected={selectedWeight} // Example selected index for `weights`
              ref={weightsRef}
              isWeights={true} // Indicate this is for `weights`
              // onScroll={() => handleScroll(weightsRef, false)} // Pass scroll handler for `weights`
              setRotation={setRotation} // Pass setRotation to update rotation state
            />
          </div>
          <div className="body-root-control-helm-scroll-container">
            <img
              src={helm || "/placeholder.svg"}
              alt="helm6 Icon"
              style={{ transform: `rotate(${rotation * 1.25}deg)` }} // Apply rotation
            />
          </div>
          <div className="body-root-control-sets-scroll-container">
            <ScrollContainer
              key={refreshKey} // Use refreshKey to force remount
              data={reps}
              selected={selectedReps} // Example selected index for `weights`
              ref={repsRef}
              isWeights={false} // Indicate this is for `weights`
              // onScroll={() => handleScroll(repsRef, false)} // Pass scroll handler for `weights`
              setRotation={setRotation} // Pass setRotation to update rotation state
            />
          </div>
          <div className="body-root-control-new-save-button-container">
            <button
              className="save-button"
              onClick={handleResetClick}
              aria-label="Reset"
            >
              <img className="save-icon" src={reset} alt="Reset" />
            </button>
          </div>
          <div className="body-root-control-new-tick-button-container">
            <button
              className="save-button"
              onClick={handleClockClick}
              aria-label="Clock"
            >
              <img className="save-icon" src={clock} alt="Clock" />
            </button>
          </div>
          <div className="body-root-control-new-clock-button-container">
            <button className="save-button" onClick={handleCheckClick}>
              <img className="save-icon" src={check} alt="Check" />
            </button>
          </div>
        </div>
        <SwipeMe
          key={`swipe-${swipeKey}`}
          swipeKey={swipeKey}
          setSwipeKey={setSwipeKey}
        />
      </div>
    </div>
  );
}

export default App;
