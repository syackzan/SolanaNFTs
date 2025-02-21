import React from "react";
import PropTypes from "prop-types";
import "../../../css/video-embed.css"; // Ensure you create this CSS file

const VideoEmbed = ({ 
    videoUrl, 
    noteText = "Need more help? Watch a tutorial on creating an NFT Blueprint."  // Set default here
}) => {
    return (
        <div className="video-container">
            <p className="video-note"><strong>Help:</strong> {noteText}</p>
            <div className="video-wrapper">
                <iframe
                    src={videoUrl}
                    title="Embedded Video"
                    frameBorder="0"
                    allowFullScreen
                ></iframe>
            </div>
        </div>
    );
};

// Define prop types for better validation
VideoEmbed.propTypes = {
    videoUrl: PropTypes.string.isRequired,  // Video URL is required
    noteText: PropTypes.string              // Optional text with default value
};

export default VideoEmbed;
