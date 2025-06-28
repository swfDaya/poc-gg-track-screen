import PropTypes from "prop-types";
import { AnimatePresence } from "framer-motion";
import Animation from "./Animation";
import "./CurrentSetDisplay.css";

const CurrentSetDisplay = ({
  inRest,
  selectedSet,
  selectedWeight,
  selectedReps,
  currentDate,
  currentTime,
}) => {
  return (
    <div className="current-set-display">
      <div className="current-set-display-spacer"></div>
      <div className="current-set-display-data">
        <AnimatePresence mode="popLayout">
          {!inRest ? (
            <Animation
              animationKey="workout-mode"
              className="workout-mode-content"
            >
              <p>Set {selectedSet + 1}</p>
              <p>{selectedWeight || "- -"}</p>
              <p>{selectedReps || "- -"}</p>
            </Animation>
          ) : (
            <Animation animationKey="rest-mode" className="rest-mode-content">
              <div className="current-date">
                <p>{currentDate || "28 Jun 25"}</p>
              </div>
              <div className="current-time">
                <p>{currentTime || "01 : 27 : 54"}</p>
              </div>
            </Animation>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

CurrentSetDisplay.propTypes = {
  inRest: PropTypes.bool.isRequired,
  selectedSet: PropTypes.number.isRequired,
  selectedWeight: PropTypes.number.isRequired,
  selectedReps: PropTypes.number.isRequired,
  currentDate: PropTypes.string,
  currentTime: PropTypes.string,
};

export default CurrentSetDisplay;
