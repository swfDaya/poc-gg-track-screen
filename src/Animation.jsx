import { motion, AnimatePresence } from "framer-motion";
import PropTypes from "prop-types";
import "./Animation.css";

const Animation = ({
  children,
  animationKey,
  mode = "popLayout",
  className = "",
  style = {},
  customTransition = null,
}) => {
  // Default elastic spring animation configuration
  const defaultTransition = {
    type: "spring",
    damping: 20,
    stiffness: 400,
    opacity: { duration: 0.2 },
  };

  const transition = customTransition || defaultTransition;

  return (
    <AnimatePresence mode={mode}>
      <motion.div
        key={animationKey}
        className={`animated-container ${className}`}
        style={style}
        initial={{ x: 300, scaleX: 0.3, opacity: 0 }}
        animate={{ x: 0, scaleX: 1, opacity: 1 }}
        exit={{ x: -300, scaleX: 0.3, opacity: 0 }}
        transition={transition}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

Animation.propTypes = {
  children: PropTypes.node.isRequired,
  animationKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  mode: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
  customTransition: PropTypes.object,
};

export default Animation;
