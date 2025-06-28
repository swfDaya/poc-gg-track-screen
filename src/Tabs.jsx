import { useState, useMemo } from "react";
import PropTypes from "prop-types";
import { motion, AnimatePresence } from "framer-motion";
import Animation from "./Animation";
import "./Tabs.css";

// Component definitions moved outside for better performance
// Reusable workout component that handles both previous and today's workout data
const WorkoutComponent = ({
  exerciseData,
  selectedSet,
  handleSetClick,
  keyPrefix = "workout",
  emptyStateMessage = "No workout data available",
}) => (
  <div className="previous-workouts-container">
    {/* First column - 30% width */}
    <div className="previous-workouts-labels">
      <div className="previous-workouts-label-item">
        <p>set</p>
      </div>
      <div className="previous-workouts-label-item">
        <p>weight</p>
      </div>
      <div className="previous-workouts-label-item">
        <p>reps</p>
      </div>
    </div>

    {/* Second column - 70% width */}
    <div className="previous-workouts-data">
      {exerciseData && exerciseData.length > 0 ? (
        exerciseData.map((exercise, index) => {
          const isSelected = index === selectedSet;
          return (
            <button
              key={`${keyPrefix}-set-${exercise.set}`}
              className={`workout-column ${isSelected ? "selected" : ""}`}
              style={{
                backgroundColor: isSelected ? "crimson" : "transparent",
                cursor: "pointer",
                border: "none",
                padding: 0,
                margin: 0,
                width: "30%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                borderTopLeftRadius: isSelected ? "8px" : "0",
                borderTopRightRadius: isSelected ? "8px" : "0",
              }}
              onClick={() => {
                handleSetClick(index);
              }}
              aria-label={`Select set ${exercise.set}`}
            >
              <div
                className="workout-cell"
                style={{
                  color: isSelected ? "black" : "crimson",
                }}
              >
                {exercise.set}
              </div>
              <div
                className="workout-cell"
                style={{
                  color: isSelected ? "black" : "#fafafa",
                }}
              >
                {exercise.weight}
              </div>
              <div
                className="workout-cell"
                style={{
                  color: isSelected ? "black" : "#fafafa",
                }}
              >
                {exercise.reps}
              </div>
            </button>
          );
        })
      ) : (
        <p>{emptyStateMessage}</p>
      )}
    </div>
  </div>
);

WorkoutComponent.propTypes = {
  exerciseData: PropTypes.arrayOf(
    PropTypes.shape({
      set: PropTypes.number.isRequired,
      weight: PropTypes.number.isRequired,
      reps: PropTypes.number.isRequired,
    })
  ),
  selectedSet: PropTypes.number,
  handleSetClick: PropTypes.func,
  keyPrefix: PropTypes.string,
  emptyStateMessage: PropTypes.string,
};

WorkoutComponent.defaultProps = {
  exerciseData: [],
  selectedSet: 0,
  handleSetClick: () => {},
  keyPrefix: "workout",
  emptyStateMessage: "No workout data available",
};

export default function Tabs({
  exerciseDataPrevious,
  exerciseDataToday,
  selectedSet,
  handleSetClick,
}) {
  const [activeTab, setActiveTab] = useState(0);

  // Tab indicator positioning constants
  const TAB_BUTTON_WIDTH = 140; // matches CSS .tab-button width
  const TAB_INDICATOR_OFFSET = TAB_BUTTON_WIDTH / 2; // half of tab width for centering

  const tabs = useMemo(
    () => [
      {
        id: 0,
        label: "Previous",
        type: "previous",
        content: (
          <WorkoutComponent
            exerciseData={exerciseDataPrevious}
            selectedSet={selectedSet}
            handleSetClick={handleSetClick}
            keyPrefix="prev"
            emptyStateMessage="No previous workout data available"
          />
        ),
      },
      {
        id: 1,
        label: "Today",
        type: "today",
        content: (
          <WorkoutComponent
            exerciseData={exerciseDataToday}
            selectedSet={selectedSet}
            handleSetClick={handleSetClick}
            keyPrefix="today"
            emptyStateMessage="No workout data for today"
          />
        ),
      },
    ],
    [exerciseDataPrevious, exerciseDataToday, selectedSet, handleSetClick]
  );

  return (
    <div className="tabs-container">
      {/* Animated Background */}
      <motion.div
        className="tabs-background"
        layoutId="background"
        transition={{ duration: 0.3, ease: "easeInOut" }}
      />

      {/* Grid Container */}
      <div className="tabs-grid">
        {/* Row 1: Tab Headers */}
        <div className="tabs-header">
          {/* Sliding Indicator */}
          <motion.div
            className="tabs-indicator"
            animate={{
              x: activeTab === 0 ? -TAB_INDICATOR_OFFSET : TAB_INDICATOR_OFFSET,
            }}
            transition={{
              type: "spring",
              stiffness: 500,
              damping: 35,
            }}
          />

          {/* Tab Buttons */}
          <div className="tabs-buttons">
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`tab-button ${
                  activeTab === tab.id ? "active" : "inactive"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>{tab.label}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Rows 2-3: Content Area */}
        <div className="tabs-content">
          <AnimatePresence mode="wait">
            <Animation
              animationKey={activeTab}
              className="content-panel"
              customTransition={{
                type: "spring",
                damping: 35,
                stiffness: 800,
                opacity: { duration: 0.025 },
              }}
            >
              {/* Content Div */}
              <div className={`content-div ${tabs[activeTab].type}`}>
                {tabs[activeTab].content}
              </div>
            </Animation>
          </AnimatePresence>
        </div>
      </div>

      {/* Border Glow Effect */}
      <motion.div
        className="tabs-border-glow"
        animate={{
          opacity: [0.3, 0.7, 0.3],
        }}
        transition={{
          duration: 2,
          repeat: Number.POSITIVE_INFINITY,
        }}
      />
    </div>
  );
}

Tabs.propTypes = {
  exerciseDataPrevious: PropTypes.arrayOf(
    PropTypes.shape({
      set: PropTypes.number.isRequired,
      weight: PropTypes.number.isRequired,
      reps: PropTypes.number.isRequired,
    })
  ),
  exerciseDataToday: PropTypes.arrayOf(
    PropTypes.shape({
      set: PropTypes.number.isRequired,
      weight: PropTypes.number.isRequired,
      reps: PropTypes.number.isRequired,
    })
  ),
  selectedSet: PropTypes.number,
  handleSetClick: PropTypes.func,
};

Tabs.defaultProps = {
  exerciseDataPrevious: [],
  exerciseDataToday: [],
  selectedSet: 0,
  handleSetClick: () => {},
};
