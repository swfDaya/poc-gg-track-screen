"use client";

import { useState } from "react";
import PropTypes from "prop-types";
import { motion, AnimatePresence } from "framer-motion";
import "./Tabs.css";

// Component definitions moved outside for better performance
const PreviousWorkoutsComponent = ({
  exerciseDataPrevious,
  selectedSet,
  handleSetClick,
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
      {exerciseDataPrevious && exerciseDataPrevious.length > 0 ? (
        exerciseDataPrevious.map((exercise, index) => {
          const isSelected = index === selectedSet;
          return (
            <div
              key={`prev-set-${exercise.set}`}
              className={`workout-column ${isSelected ? "selected" : ""}`}
              style={{
                backgroundColor: isSelected ? "crimson" : "transparent",
                cursor: "pointer",
              }}
              onClick={() => {
                handleSetClick(index);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleSetClick(index);
                }
              }}
              tabIndex={0}
              role="button"
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
                  color: isSelected ? "black" : "white",
                }}
              >
                {exercise.weight}
              </div>
              <div
                className="workout-cell"
                style={{
                  color: isSelected ? "black" : "white",
                }}
              >
                {exercise.reps}
              </div>
            </div>
          );
        })
      ) : (
        <p>No previous workout data available</p>
      )}
    </div>
  </div>
);

PreviousWorkoutsComponent.propTypes = {
  exerciseDataPrevious: PropTypes.arrayOf(
    PropTypes.shape({
      set: PropTypes.number.isRequired,
      weight: PropTypes.number.isRequired,
      reps: PropTypes.number.isRequired,
    })
  ),
  selectedSet: PropTypes.number,
  handleSetClick: PropTypes.func,
};

PreviousWorkoutsComponent.defaultProps = {
  exerciseDataPrevious: [],
  selectedSet: 0,
  handleSetClick: () => {},
};

const TodayWorkoutComponent = ({
  exerciseDataToday,
  selectedSet,
  handleSetClick,
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
      {exerciseDataToday && exerciseDataToday.length > 0 ? (
        exerciseDataToday.map((exercise, index) => {
          const isSelected = index === selectedSet;
          return (
            <div
              key={`today-set-${exercise.set}`}
              className={`workout-column ${isSelected ? "selected" : ""}`}
              style={{
                backgroundColor: isSelected ? "crimson" : "transparent",
                cursor: "pointer",
              }}
              onClick={() => {
                handleSetClick(index);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleSetClick(index);
                }
              }}
              tabIndex={0}
              role="button"
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
                  color: isSelected ? "black" : "white",
                }}
              >
                {exercise.weight}
              </div>
              <div
                className="workout-cell"
                style={{
                  color: isSelected ? "black" : "white",
                }}
              >
                {exercise.reps}
              </div>
            </div>
          );
        })
      ) : (
        <p>No workout data for today</p>
      )}
    </div>
  </div>
);

TodayWorkoutComponent.propTypes = {
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

TodayWorkoutComponent.defaultProps = {
  exerciseDataToday: [],
  selectedSet: 0,
  handleSetClick: () => {},
};

export default function Tabs({
  exerciseDataPrevious,
  exerciseDataToday,
  selectedSet,
  handleSetClick,
}) {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    {
      id: 0,
      label: "Previous",
      type: "previous",
      content: (
        <PreviousWorkoutsComponent
          exerciseDataPrevious={exerciseDataPrevious}
          selectedSet={selectedSet}
          handleSetClick={handleSetClick}
        />
      ),
    },
    {
      id: 1,
      label: "Today",
      type: "today",
      content: (
        <TodayWorkoutComponent
          exerciseDataToday={exerciseDataToday}
          selectedSet={selectedSet}
          handleSetClick={handleSetClick}
        />
      ),
    },
  ];

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
              x: activeTab === 0 ? -70 : 70,
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
            <motion.div
              key={activeTab}
              className="content-panel"
              initial={{
                opacity: 0,
                y: activeTab === 0 ? -20 : 20,
                rotateX: 90,
              }}
              animate={{
                opacity: 1,
                y: 0,
                rotateX: 0,
              }}
              exit={{
                opacity: 0,
                y: activeTab === 0 ? 20 : -20,
                rotateX: -90,
              }}
              transition={{
                duration: 0.2,
                ease: "easeInOut",
                rotateX: { duration: 0.3 },
              }}
            >
              {/* Content Div */}
              <div className={`content-div ${tabs[activeTab].type}`}>
                {tabs[activeTab].content}
              </div>
            </motion.div>
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
