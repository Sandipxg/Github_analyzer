import { motion } from "framer-motion";
import ComparisonMetrics from "./ComparisonMetrics";

export default function Comparison({ usernames, onExportReady }) {
  if (!usernames.first && !usernames.second) return null;

  return (
    <motion.div
      className="comparison-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {usernames.first && usernames.second && (
        <ComparisonMetrics
          usernames={usernames}
          onExportReady={onExportReady}
        />
      )}
    </motion.div>
  );
}
