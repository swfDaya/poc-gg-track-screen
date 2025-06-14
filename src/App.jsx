"use client";

import { useState, useRef } from "react";
import "./App.css";
import ScrollContainer from "./scrollContainer";
import helm6 from "./assets/helm6.png";
import SwipeMe from "./SwipeMe";

const exerciseData = [
  { set: 1, weight: 10, reps: Math.floor(Math.random() * (20 - 10 + 1)) + 10 },
  { set: 2, weight: 15, reps: Math.floor(Math.random() * (20 - 10 + 1)) + 10 },
  { set: 3, weight: 20, reps: Math.floor(Math.random() * (20 - 10 + 1)) + 10 },
  { set: 4, weight: 25, reps: Math.floor(Math.random() * (20 - 10 + 1)) + 10 },
  { set: 5, weight: 30, reps: Math.floor(Math.random() * (20 - 10 + 1)) + 10 },
];

const handleUploadCloudClick = () => {
  // Haptic feedback
  if (navigator.vibrate) {
    navigator.vibrate(50);
  }
};

function App() {
  const [selectedSet, setSelectedSet] = useState(0);
  const addEmptyElements = (array) => ["", ...array, ""];

  const sets = addEmptyElements(Array.from({ length: 50 }, (_, i) => i + 1));
  const weights = addEmptyElements(
    Array.from({ length: 200 }, (_, i) => (i + 1) * 0.25)
  );
  const [rotation, setRotation] = useState(0); // State to track image rotation
  const setsRef = useRef(null); // Ref for ScrollContainer with `sets`
  const weightsRef = useRef(null); // Ref for ScrollContainer with `weights`

  const [swipeKey, setSwipeKey] = useState(0); // State to trigger re-render of SwipeMe

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
                onClick={() => setSelectedSet(index)}
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
        <div className="body-root-control">
          <div className="body-root-control-left">
            <div className="body-root-control-left-inner">
              <ScrollContainer
                data={sets}
                selected={20} // Example selected index for `sets`
                ref={setsRef}
                isWeights={false} // Indicate this is for `sets`
                onScroll={() => handleScroll(setsRef, true)} // Pass scroll handler for `sets`
                setRotation={setRotation} // Pass setRotation to update rotation state
              />
            </div>
          </div>
          <div className="body-root-control-center">
            <img
              src={helm6 || "/placeholder.svg"}
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
                setRotation={setRotation} // Pass setRotation to update rotation state
              />
            </div>
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
