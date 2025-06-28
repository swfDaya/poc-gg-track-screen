import PropTypes from "prop-types";
import { AnimatePresence } from "framer-motion";
import Timer from "./Timer";
import Tabs from "./Tabs";
import Animation from "./Animation";
import "./MainContent.css";

const MainContent = ({
  inRest,
  timerSeconds,
  setTimerSeconds,
  timerInitialSeconds,
  timerIsRunning,
  timerIsFinished,
  handleTimerStart,
  handleTimerPause,
  handleTimerFinish,
  handleTimerReset,
  exerciseDataPrevious,
  exerciseDataToday,
  selectedSet,
  handleSetClick,
}) => {
  return (
    <div className="main-content">
      <AnimatePresence mode="popLayout">
        {inRest ? (
          <Animation
            animationKey="timer-mode"
            className="timer-mode-content"
            style={{ width: "100%", height: "100%" }}
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
          </Animation>
        ) : (
          <Animation
            animationKey="tabs-mode"
            className="tabs-mode-content"
            style={{ width: "100%", height: "100%" }}
          >
            <Tabs
              exerciseDataPrevious={exerciseDataPrevious}
              exerciseDataToday={exerciseDataToday}
              selectedSet={selectedSet}
              handleSetClick={handleSetClick}
            />
          </Animation>
        )}
      </AnimatePresence>
    </div>
  );
};

MainContent.propTypes = {
  inRest: PropTypes.bool.isRequired,
  timerSeconds: PropTypes.number.isRequired,
  setTimerSeconds: PropTypes.func.isRequired,
  timerInitialSeconds: PropTypes.number.isRequired,
  timerIsRunning: PropTypes.bool.isRequired,
  timerIsFinished: PropTypes.bool.isRequired,
  handleTimerStart: PropTypes.func.isRequired,
  handleTimerPause: PropTypes.func.isRequired,
  handleTimerFinish: PropTypes.func.isRequired,
  handleTimerReset: PropTypes.func.isRequired,
  exerciseDataPrevious: PropTypes.array.isRequired,
  exerciseDataToday: PropTypes.array.isRequired,
  selectedSet: PropTypes.number.isRequired,
  handleSetClick: PropTypes.func.isRequired,
};

export default MainContent;
