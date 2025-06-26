"use client";

import { useState, useRef, useEffect } from "react";
import "./App.css";
import ScrollContainer from "./scrollContainer";
import { motion, AnimatePresence } from "framer-motion";
import helm from "./assets/helm6white.png";
import check from "./assets/check.svg";
import clock from "./assets/clock.svg";
import reset from "./assets/reset.svg";
import play from "./assets/play.svg";
import pause from "./assets/pause.svg";
import rewind from "./assets/rewind.svg";
import stopCircle from "./assets/stop-circle.svg";
import SwipeMe from "./SwipeMe";
import Timer from "./Timer";
import Tabs from "./Tabs";

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
  const [numberOfSets, setNumberOfSets] = useState(exerciseDataPrevious.length);
  const setsParentRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Timer state
  const [timerSeconds, setTimerSeconds] = useState(120);
  const [timerInitialSeconds, setTimerInitialSeconds] = useState(120);
  const [timerIsRunning, setTimerIsRunning] = useState(false);
  const [timerIsFinished, setTimerIsFinished] = useState(false);

  useEffect(() => {
    if (setsParentRef.current) {
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
    ? Array.from({ length: numberOfSets }, (_, i) => i + 1).map(
        (num, index) => <p key={index}>{num}</p>
      )
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

  const elasticTransition = {
    initial: { x: 300, scaleX: 0.3, opacity: 0 },
    animate: { x: 0, scaleX: 1, opacity: 1 },
    exit: { x: -300, scaleX: 0.3, opacity: 0 },
    transition: {
      type: "spring",
      damping: 20,
      stiffness: 400,
      opacity: { duration: 0.2 },
    },
  };

  return (
    <div className="app-root">
      <div className="body-root">
        <div className="body-root-complete">
          <AnimatePresence mode="popLayout">
            {inRest ? (
              <motion.div
                key="timer-mode"
                className="timer-mode-content"
                style={{ width: "100%", height: "100%" }}
                initial={{ x: 300, scaleX: 0.3, opacity: 0 }}
                animate={{ x: 0, scaleX: 1, opacity: 1 }}
                exit={{ x: -300, scaleX: 0.3, opacity: 0 }}
                transition={{
                  type: "spring",
                  damping: 20,
                  stiffness: 400,
                  opacity: { duration: 0.2 },
                }}
              >
                <Timer
                  seconds={timerSeconds}
                  setSeconds={setTimerSeconds}
                  initialSeconds={timerInitialSeconds}
                  isRunning={timerIsRunning}
                  isFinished={timerIsFinished}
                  onStart={handleTimerStart}
                  onPause={handleTimerPause}
                  onFinish={handleTimerFinish}
                  onReset={handleTimerReset}
                  className="timer-fullscreen"
                />
              </motion.div>
            ) : (
              <motion.div
                key="tabs-mode"
                className="tabs-mode-content"
                style={{ width: "100%", height: "100%" }}
                initial={{ x: 300, scaleX: 0.3, opacity: 0 }}
                animate={{ x: 0, scaleX: 1, opacity: 1 }}
                exit={{ x: -300, scaleX: 0.3, opacity: 0 }}
                transition={{
                  type: "spring",
                  damping: 20,
                  stiffness: 400,
                  opacity: { duration: 0.2 },
                }}
              >
                <Tabs
                  exerciseDataPrevious={exerciseDataPrevious}
                  exerciseDataToday={exerciseDataToday}
                  selectedSet={selectedSet}
                  handleSetClick={handleSetClick}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="body-root-current-set">
          <div style={{ width: "100%", textAlign: "center" }}></div>
          <div className="body-root-current-set-data">
            <AnimatePresence mode="popLayout">
              {!inRest ? (
                <motion.div
                  key="workout-mode"
                  className="workout-mode-content"
                  initial={{ x: 300, scaleX: 0.3, opacity: 0 }}
                  animate={{ x: 0, scaleX: 1, opacity: 1 }}
                  exit={{ x: -300, scaleX: 0.3, opacity: 0 }}
                  transition={{
                    type: "spring",
                    damping: 20,
                    stiffness: 400,
                    opacity: { duration: 0.2 },
                  }}
                >
                  <p>Set 1</p>
                  <p>- -</p>
                  <p>- -</p>
                </motion.div>
              ) : (
                <motion.div
                  key="rest-mode"
                  className="rest-mode-content"
                  initial={{ x: 300, scaleX: 0.3, opacity: 0 }}
                  animate={{ x: 0, scaleX: 1, opacity: 1 }}
                  exit={{ x: -300, scaleX: 0.3, opacity: 0 }}
                  transition={{
                    type: "spring",
                    damping: 20,
                    stiffness: 400,
                    opacity: { duration: 0.2 },
                  }}
                >
                  <div className="body-root-current-date">
                    <p>27 Jun 25</p>
                  </div>
                  <div className="body-root-current-time">
                    <p>01 : 27 : 54</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        <div className="body-root-sets-select" ref={setsParentRef}>
          {displayItems.map((content, index) => {
            const clickHandler = !inRest
              ? () => handleSetClick(index)
              : restHandlers[index];
            return (
              <div
                key={index}
                onClick={clickHandler}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    clickHandler();
                  }
                }}
                role="button"
                tabIndex="0"
                className={`step-circle ${
                  !inRest && selectedSet === index ? "selected" : ""
                }`}
                style={{
                  width: stepCircleSize,
                  height: stepCircleSize,
                }}
              >
                {content}
              </div>
            );
          })}
        </div>

        <div className="body-root-control-new">
          <div className="body-root-control-weights-scroll-container">
            <ScrollContainer
              key={refreshKey}
              data={weights}
              selected={selectedWeight}
              ref={weightsRef}
              isWeights={true}
              setRotation={setRotation}
            />
          </div>
          <div className="body-root-control-helm-scroll-container">
            <img
              src={helm || "/placeholder.svg"}
              alt="helm6 Icon"
              style={{ transform: `rotate(${rotation * 1.25}deg)` }}
            />
          </div>
          <div className="body-root-control-sets-scroll-container">
            <ScrollContainer
              key={refreshKey}
              data={reps}
              selected={selectedReps}
              ref={repsRef}
              isWeights={false}
              setRotation={setRotation}
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
              style={{
                backgroundColor: inRest ? "crimson" : "#3a3a3a",
              }}
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
