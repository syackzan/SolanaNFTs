import React from "react";
import { motion } from "framer-motion";

const SubmissionStatus = ({ status }) => {
    if (status === "idle") return null;

    return (
        <motion.div
            className="submission-status"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            {status === "uploading" && "Uploading image..."}
            {status === "processing" && "Processing submission..."}
            {status === "complete" && "✅ Submission successful!"}
            {status === "failed" && "❌ Submission failed. Please try again!"}
        </motion.div>
    );
};

export default SubmissionStatus;