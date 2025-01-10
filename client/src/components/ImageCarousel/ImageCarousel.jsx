import React, { useState, useEffect } from "react";

import image1 from '../../assets/itemBGs/bg_blue.png';
import image2 from '../../assets/itemBGs/bg_blue.png';
import image3 from '../../assets/itemBGs/bg_blue.png';

import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

const images = [
    image1,
    image2,
    image3,
];

const ImageCarousel = () => {
    return (
        <Carousel 
            autoPlay 
            infiniteLoop 
            showArrows={false} 
            showStatus={false} 
            showThumbs={false} 
            showIndicators={false} 
            interval={3000} // Optional: Customize the autoplay interval
        >
            {images.map((image, index) => (
                <div key={index}>
                    <img 
                        src={image} 
                        alt={`Image ${index + 1}`} 
                        style={{
                            width: '200px',  // Uniform width
                            height: 'auto', // Adjust height proportionally
                        }} 
                    />
                </div>
            ))}
        </Carousel>
    );
};

const carouselContainerStyle = {
    overflow: "hidden",
    width: "100%",
    height: "300px", // Set height based on your needs
    position: "relative",
    display: "flex",
    alignItems: "center",
};

const imageStyle = {
    minWidth: "100%",
    height: "100%",
    transition: "transform 0.5s ease-in-out",
    position: "absolute",
};

export default ImageCarousel;