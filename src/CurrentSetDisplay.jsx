import PropTypes from "prop-types";
import { AnimatePresence } from "framer-motion";
import Animation from "./Animation";
import "./CurrentSetDisplay.css";

const CurrentSetDisplay = ({ inRest }) => {
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
              <p>Set 1</p>
              <p>- -</p>
              <p>- -</p>
            </Animation>
          ) : (
            <Animation animationKey="rest-mode" className="rest-mode-content">
              <div className="current-date">
                <p>27 Jun 25</p>
              </div>
              <div className="current-time">
                <p>01 : 27 : 54</p>
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
};

export default CurrentSetDisplay;
