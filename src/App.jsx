"use client";

import { useState, useRef } from "react";
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

// const handleUploadCloudClick = () => {
//   // Haptic feedback
//   if (navigator.vibrate) {
//     navigator.vibrate(50);
//   }
// };

function App() {
  const [selectedSet, setSelectedSet] = useState(0);
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

  return (
    <div className="app-root">
      <div className="body-root">
        <div className="body-root-header" role="heading" tabIndex="0">
          2. Shoulder press
        </div>
        <div className="body-root-sets">
          <div className="body-root-sets-legend">
            <p>set</p>
            <p>weight</p>
            <p>reps</p>
          </div>
          <div className="body-root-sets-data">
            {exerciseData.map((exercise, index) => (
              <div
                key={exercise.set}
                className={`body-root-sets-each ${
                  selectedSet === index ? "selected" : ""
                }`}
                onClick={() => handleSetClick(index)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") setSelectedSet(index);
                }} // Add keyboard support
                role="button" // Add role for accessibility
                tabIndex="0" // Make it focusable
              >
                <p>{exercise.set}</p>
                <p>{exercise.weight}</p>
                <p>{exercise.reps}</p>
              </div>
            ))}
          </div>
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
              style={{ transform: `rotate(${rotation * 1.5}deg)` }} // Apply rotation
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
            <button className="save-button">
              <img className="save-icon" src={reset} />
            </button>
          </div>
          <div className="body-root-control-new-tick-button-container">
            <button className="save-button">
              <img className="save-icon" src={clock} />
            </button>
          </div>
          <div className="body-root-control-new-clock-button-container">
            <button className="save-button">
              <img className="save-icon" src={check} />
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
