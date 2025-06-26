"use client";

import { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import "./Timer.css";

export default function Timer({
  seconds,
  setSeconds,
  initialSeconds,
  isRunning,
  isFinished,
  onStart,
  onPause,
  onFinish,
  onReset,
  style,
  className,
}) {
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isRunning && seconds > 0) {
      intervalRef.current = setInterval(() => {
        setSeconds((prev) => {
          if (prev <= 1) {
            onFinish?.();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, seconds, onFinish, setSeconds]);

  const progress = ((initialSeconds - seconds) / initialSeconds) * 100;
  const circumference = 2 * Math.PI * 35; // Reduced from 45 to 35
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className={`timer-element ${className || ""}`} style={style}>
      <svg className="timer-circle" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="35" className="timer-circle-bg" />
        <circle
          cx="50"
          cy="50"
          r="35"
          className={`timer-circle-progress ${isFinished ? "finished" : ""} ${
            isRunning ? "running" : ""
          }`}
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: strokeDashoffset,
          }}
        />
      </svg>
      <div className={`timer-text ${isFinished ? "finished" : ""}`}>
        <span className="seconds-main">{seconds}</span>
        <span className="seconds-sub">s</span>
      </div>
    </div>
  );
}

Timer.propTypes = {
  seconds: PropTypes.number.isRequired,
  setSeconds: PropTypes.func.isRequired,
  initialSeconds: PropTypes.number.isRequired,
  isRunning: PropTypes.bool.isRequired,
  isFinished: PropTypes.bool.isRequired,
  onStart: PropTypes.func,
  onPause: PropTypes.func,
  onFinish: PropTypes.func,
  onReset: PropTypes.func,
  style: PropTypes.object,
  className: PropTypes.string,
};
