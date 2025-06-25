"use client";

import { useState, useRef, useEffect } from "react";
import "./App.css";
import ScrollContainer from "./scrollContainer";
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

const exerciseData = [
  { set: 1, weight: 10, reps: Math.floor(Math.random() * (20 - 10 + 1)) + 10 },
  { set: 2, weight: 15, reps: Math.floor(Math.random() * (20 - 10 + 1)) + 10 },
  { set: 3, weight: 20, reps: Math.floor(Math.random() * (20 - 10 + 1)) + 10 },
  { set: 4, weight: 25, reps: Math.floor(Math.random() * (20 - 10 + 1)) + 10 },
  { set: 5, weight: 30, reps: Math.floor(Math.random() * (20 - 10 + 1)) + 10 },
];

function App() {
  const [selectedSet, setSelectedSet] = useState(0);
  const [numberOfSets, setNumberOfSets] = useState(exerciseData.length);
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

  const [selectedWeight, setSelectedWeight] = useState(
    exerciseData[selectedSet].weight
  );
  const [selectedReps, setSelectedReps] = useState(
    exerciseData[selectedSet].reps
  );
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

  const handleTimerReset = () => {
    setTimerIsRunning(false);
    setTimerSeconds(timerInitialSeconds);
    setTimerIsFinished(false);
    // Automatically start the timer after reset
    setTimeout(() => {
      setTimerIsRunning(true);
    }, 100);
  };

  const handleSetClick = (index) => {
    setSelectedSet(index);
    setSelectedWeight(exerciseData[index].weight);
    setSelectedReps(exerciseData[index].reps);
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
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
  };

  // Rest button handlers
  const handleRestAdd10 = () => {
    setTimerSeconds((prev) => prev + 10);
    setTimerInitialSeconds((prev) => prev + 10);
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
    setTimerInitialSeconds((prev) => prev + 30);
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
    ? [1, 2, 3, 4, 5].map((num, index) => <p key={index}>{num}</p>)
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
        <div className="body-root-complete">
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
          />
        </div>
        <div className="body-root-current-set">
          <div style={{ width: "100%", textAlign: "center" }}></div>
          <div className="body-root-current-set-data">
            {!inRest ? (
              <>
                <p>Set 1</p>
                <p>- -</p>
                <p>- -</p>
              </>
            ) : (
              <>
                <div className="body-root-current-date">
                  <p>27 Jun 25</p>
                </div>
                <div className="body-root-current-time">
                  <p>01 : 27 : 54</p>
                </div>
              </>
            )}
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
