import { forwardRef } from "react";
import PropTypes from "prop-types";
import "./SetsSelector.css";

const SetsSelector = forwardRef(
  (
    {
      displayItems,
      inRest,
      selectedSet,
      handleSetClick,
      restHandlers,
      stepCircleSize,
    },
    ref
  ) => {
    return (
      <div className="sets-selector" ref={ref}>
        {displayItems.map((content, index) => {
          const clickHandler = !inRest
            ? () => handleSetClick(index)
            : restHandlers[index];
          const keyValue = !inRest
            ? `set-${index + 1}`
            : `rest-control-${index}`;
          return (
            <button
              key={keyValue}
              onClick={clickHandler}
              className={`step-circle ${
                !inRest && selectedSet === index ? "selected" : ""
              }`}
              style={{
                width: stepCircleSize,
                height: stepCircleSize,
              }}
              aria-label={!inRest ? `Set ${index + 1}` : `Control ${index + 1}`}
            >
              {content}
            </button>
          );
        })}
      </div>
    );
  }
);

SetsSelector.displayName = "SetsSelector";

SetsSelector.propTypes = {
  displayItems: PropTypes.array.isRequired,
  inRest: PropTypes.bool.isRequired,
  selectedSet: PropTypes.number.isRequired,
  handleSetClick: PropTypes.func.isRequired,
  restHandlers: PropTypes.array.isRequired,
  stepCircleSize: PropTypes.number.isRequired,
};

export default SetsSelector;
