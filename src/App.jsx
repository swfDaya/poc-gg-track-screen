"use client";

import { useState, useRef, useEffect } from "react";
import "./App.css";
import play from "./assets/play.svg";
import pause from "./assets/pause.svg";
import rewind from "./assets/rewind.svg";
import stopCircle from "./assets/stop-circle.svg";
import SwipeMe from "./SwipeMe";
import MainContent from "./MainContent";
import CurrentSetDisplay from "./CurrentSetDisplay";
import SetsSelector from "./SetsSelector";
import ControlPanel from "./ControlPanel";

const exerciseDataPrevious = [
  { set: 1, weight: 10, reps: Math.floor(Math.random() * (20 - 10 + 1)) + 10 },
  { set: 2, weight: 15, reps: Math.floor(Math.random() * (20 - 10 + 1)) + 10 },
  { set: 3, weight: 20, reps: Math.floor(Math.random() * (20 - 10 + 1)) + 10 },
  { set: 4, weight: 25, reps: Math.floor(Math.random() * (20 - 10 + 1)) + 10 },
  { set: 5, weight: 30, reps: Math.floor(Math.random() * (20 - 10 + 1)) + 10 },
];

const exerciseDataToday = [
  { set: 1, weight: 15, reps: Math.floor(Math.random() * (20 - 10 + 1)) + 10 },
  { set: 2, weight: 20, reps: Math.floor(Math.random() * (20 - 10 + 1)) + 10 },
  { set: 3, weight: 25, reps: Math.floor(Math.random() * (20 - 10 + 1)) + 10 },
];

function App() {
  const [selectedSet, setSelectedSet] = useState(0);
  const [numberOfSets] = useState(exerciseDataPrevious.length);
  const setsParentRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Timer state
  const [timerSeconds, setTimerSeconds] = useState(120);
  const [timerInitialSeconds, setTimerInitialSeconds] = useState(120);
  const [timerIsRunning, setTimerIsRunning] = useState(false);
  const [timerIsFinished, setTimerIsFinished] = useState(false);

  useEffect(() => {
    if (setsParentRef.current) {
      console.log("Sets parent ref:", setsParentRef);
      const { offsetWidth, offsetHeight } = setsParentRef.current;
      setDimensions({ width: offsetWidth, height: offsetHeight });
    }
  }, []);

  const [selectedWeight, setSelectedWeight] = useState(() => {
    // Boundary check: ensure exerciseDataPrevious has elements and selectedSet is valid
    if (
      exerciseDataPrevious &&
      exerciseDataPrevious.length > 0 &&
      selectedSet >= 0 &&
      selectedSet < exerciseDataPrevious.length
    ) {
      return exerciseDataPrevious[selectedSet].weight;
    }
    return 0; // Default weight value
  });
  const [selectedReps, setSelectedReps] = useState(() => {
    // Boundary check: ensure exerciseDataPrevious has elements and selectedSet is valid
    if (
      exerciseDataPrevious &&
      exerciseDataPrevious.length > 0 &&
      selectedSet >= 0 &&
      selectedSet < exerciseDataPrevious.length
    ) {
      return exerciseDataPrevious[selectedSet].reps;
    }
    return 1; // Default reps value
  });
  const [refreshKey, setRefreshKey] = useState(0);

  const addEmptyElements = (array) => ["", ...array, ""];

  const reps = addEmptyElements(Array.from({ length: 50 }, (_, i) => i + 1));
  const weights = addEmptyElements(
    Array.from({ length: 200 }, (_, i) => (i + 1) * 0.25)
  );
  const [rotation, setRotation] = useState(0);
  const repsRef = useRef(null);
  const weightsRef = useRef(null);

  const [swipeKey, setSwipeKey] = useState(0);
  const [inRest, setInRest] = useState(false);

  // Timer control functions
  const handleTimerStart = () => {
    if (timerIsFinished) {
      setTimerSeconds(timerInitialSeconds);
      setTimerIsFinished(false);
    }
    setTimerIsRunning(true);
  };

  const handleTimerPause = () => {
    setTimerIsRunning(false);
  };

  const handleTimerFinish = () => {
    setTimerIsRunning(false);
    setTimerSeconds(0);
    setTimerIsFinished(true);
  };

  const handleTimerReset = (autoStart = false) => {
    setTimerIsRunning(false);
    setTimerSeconds(timerInitialSeconds);
    setTimerIsFinished(false);
    if (autoStart) {
      setTimeout(() => {
        setTimerIsRunning(true);
      }, 100);
    }
  };

  // Removed duplicate handleRestRewind declaration to fix redeclaration error

  const handleSetClick = (index) => {
    setSelectedSet(index);

    // Boundary check: ensure exerciseDataPrevious has elements and index is valid
    if (
      exerciseDataPrevious &&
      exerciseDataPrevious.length > 0 &&
      index >= 0 &&
      index < exerciseDataPrevious.length
    ) {
      setSelectedWeight(exerciseDataPrevious[index].weight);
      setSelectedReps(exerciseDataPrevious[index].reps);
    } else {
      // Set default values if boundary check fails
      setSelectedWeight(0);
      setSelectedReps(1);
    }

    setRefreshKey((prev) => prev + 1);
  };

  // Haptic feedback handlers
  const handleResetClick = () => {
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
    setRefreshKey((prev) => prev + 1);
  };

  const handleClockClick = () => {
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
    setInRest((prev) => !prev);
  };

  const handleCheckClick = () => {
    // TODO: Implement check click handler logic here
  };
  // Rest button handlers
  const handleRestAdd10 = () => {
    setTimerSeconds((prev) => prev + 10);
    // Only update initial seconds if timer is not running or finished
    if (!timerIsRunning || timerIsFinished) {
      setTimerInitialSeconds((prev) => prev + 10);
    }
  };

  const handleRestRewind = () => {
    handleTimerReset();
  };

  const handleRestPlay = () => {
    if (timerIsRunning) {
      handleTimerPause();
    } else {
      handleTimerStart();
    }
  };

  const handleRestStop = () => {
    handleTimerFinish();
  };

  const handleRestAdd30 = () => {
    setTimerSeconds((prev) => prev + 30);
    // Only update initial seconds if timer is not running or finished
    if (!timerIsRunning || timerIsFinished) {
      setTimerInitialSeconds((prev) => prev + 30);
    }
  };

  const stepCircleSize = dimensions.height * 0.6;

  // Define rest button handlers array
  const restHandlers = [
    handleRestAdd10,
    handleRestRewind,
    handleRestPlay,
    handleRestStop,
    handleRestAdd30,
  ];

  const displayItems = !inRest
    ? Array.from({ length: numberOfSets }, (_, i) => i + 1).map((num) => (
        <p key={`set-${num}`}>{num}</p>
      ))
    : [
        <span key="add10">+10</span>,
        <img key="rewind" src={rewind} alt="Rewind" className="button-icon" />,
        <img
          key="play-pause"
          src={timerIsRunning ? pause : play}
          alt={timerIsRunning ? "Pause" : "Play"}
          className="button-icon"
        />,
        <img key="stop" src={stopCircle} alt="Stop" className="button-icon" />,
        <span key="add30">+30</span>,
      ];

  return (
    <div className="app-root">
      <div className="body-root">
        <MainContent
          inRest={inRest}
          timerSeconds={timerSeconds}
          setTimerSeconds={setTimerSeconds}
          timerInitialSeconds={timerInitialSeconds}
          timerIsRunning={timerIsRunning}
          timerIsFinished={timerIsFinished}
          handleTimerStart={handleTimerStart}
          handleTimerPause={handleTimerPause}
          handleTimerFinish={handleTimerFinish}
          handleTimerReset={handleTimerReset}
          exerciseDataPrevious={exerciseDataPrevious}
          exerciseDataToday={exerciseDataToday}
          selectedSet={selectedSet}
          handleSetClick={handleSetClick}
        />
        <CurrentSetDisplay
          inRest={inRest}
          selectedSet={selectedSet}
          selectedWeight={selectedWeight}
          selectedReps={selectedReps}
          currentDate="28 Jun 25"
          currentTime="01 : 27 : 54"
        />
        <SetsSelector
          ref={setsParentRef}
          displayItems={displayItems}
          inRest={inRest}
          selectedSet={selectedSet}
          handleSetClick={handleSetClick}
          restHandlers={restHandlers}
          stepCircleSize={stepCircleSize}
        />
        <ControlPanel
          refreshKey={refreshKey}
          weights={weights}
          selectedWeight={selectedWeight}
          weightsRef={weightsRef}
          setRotation={setRotation}
          rotation={rotation}
          reps={reps}
          selectedReps={selectedReps}
          repsRef={repsRef}
          handleResetClick={handleResetClick}
          handleClockClick={handleClockClick}
          handleCheckClick={handleCheckClick}
          inRest={inRest}
        />
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
