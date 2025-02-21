import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import { motion, useAnimation } from "framer-motion";

const DocsSidenav = () => {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [isOpen, setIsOpen] = useState(!isMobile); // Open by default on desktop
    const controls = useAnimation();

    // Check screen size on resize
    useEffect(() => {
        const handleResize = () => {
            const mobileView = window.innerWidth < 768;
            setIsMobile(mobileView);
            setIsOpen(!mobileView); // Open by default on desktop, closed on mobile
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Animate the sidenav opening/closing
    useEffect(() => {
        if (isOpen) {
            controls.start({ x: 0 });
        } else {
            controls.start({ x: isMobile ? "-100%" : 0 });
        }
    }, [isOpen, isMobile, controls]);

    return (
        <>
            {/* Toggle Button (Only Visible on Mobile) */}
            {isMobile && (
                <button className="sidenav-docs-toggle" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <FaTimes /> : <FaBars />}
                </button>
            )}

            {/* Sidenav Container with Framer Motion Animation */}
            <motion.div
                className="sidenav-docs"
                initial={{ x: isMobile ? "-100%" : 0 }}
                animate={controls}
                transition={{ type: "tween", duration: 0.3 }}
            >
                <div style={{height: '100%', marginTop: '60px'}}>
                    <h2 className="sidenav-docs-title">📖 Docs Navigation</h2>
                    <ul>
                        <li><Link to="/docs?page=intro" onClick={() => isMobile && setIsOpen(false)}>Introduction</Link></li>
                        <li><Link to="/docs?page=marketplace" onClick={() => isMobile && setIsOpen(false)}>Marketplace Rules</Link></li>
                        <li><Link to="/docs?page=create" onClick={() => isMobile && setIsOpen(false)}>Creator Guidelines</Link></li>
                        <li><Link to="/docs?page=earnings-payouts" onClick={() => isMobile && setIsOpen(false)}>Earnings & Payouts</Link></li>
                        <li><Link to="/docs?page=site-rules" onClick={() => isMobile && setIsOpen(false)}>Site Rules</Link></li>
                    </ul>
                </div>
            </motion.div>
        </>
    );
};

export default DocsSidenav;
