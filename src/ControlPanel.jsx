import PropTypes from "prop-types";
import ScrollContainer from "./scrollContainer";
import helm from "./assets/helm6white.png";
import check from "./assets/check.svg";
import clock from "./assets/clock.svg";
import reset from "./assets/reset.svg";
import "./ControlPanel.css";

const ControlPanel = ({
  refreshKey,
  weights,
  selectedWeight,
  weightsRef,
  setRotation,
  rotation,
  reps,
  selectedReps,
  repsRef,
  handleResetClick,
  handleClockClick,
  handleCheckClick,
  inRest,
}) => {
  return (
    <div className="control-panel">
      <div className="control-weights-container">
        <ScrollContainer
          key={refreshKey}
          data={weights}
          selected={selectedWeight}
          ref={weightsRef}
          isWeights={true}
          setRotation={setRotation}
        />
      </div>
      <div className="control-helm-container">
        <img
          src={helm || "/placeholder.svg"}
          alt="helm6 Icon"
          style={{ transform: `rotate(${rotation * 1.25}deg)` }}
        />
      </div>
      <div className="control-reps-container">
        <ScrollContainer
          key={refreshKey}
          data={reps}
          selected={selectedReps}
          ref={repsRef}
          isWeights={false}
          setRotation={setRotation}
        />
      </div>
      <div className="control-reset-button-container">
        <button
          className="save-button"
          onClick={handleResetClick}
          aria-label="Reset"
        >
          <img className="save-icon" src={reset} alt="Reset" />
        </button>
      </div>
      <div className="control-check-button-container">
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
      <div className="control-clock-button-container">
        <button className="save-button" onClick={handleCheckClick}>
          <img className="save-icon" src={check} alt="Check" />
        </button>
      </div>
    </div>
  );
};

ControlPanel.propTypes = {
  refreshKey: PropTypes.number.isRequired,
  weights: PropTypes.array.isRequired,
  selectedWeight: PropTypes.number.isRequired,
  weightsRef: PropTypes.object.isRequired,
  setRotation: PropTypes.func.isRequired,
  rotation: PropTypes.number.isRequired,
  reps: PropTypes.array.isRequired,
  selectedReps: PropTypes.number.isRequired,
  repsRef: PropTypes.object.isRequired,
  handleResetClick: PropTypes.func.isRequired,
  handleClockClick: PropTypes.func.isRequired,
  handleCheckClick: PropTypes.func.isRequired,
  inRest: PropTypes.bool.isRequired,
};

export default ControlPanel;
