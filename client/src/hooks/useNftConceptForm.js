import { useState } from 'react';

import {
    infoData,
    getAttributesData,
    storeInfoData,
    propertiesData,
} from '../config/gameConfig';

import { useTransactionsController } from '../providers/TransactionsProvider';

export const useNftConceptForm = () => {

    const { setImageName } = useTransactionsController();

    //States that make up Meta data information
    const [info, setInfo] = useState(infoData);

    const [attributes, setAttributes] = useState(getAttributesData());

    const [properties, setProperties] = useState(propertiesData);

    //State that makes up Store Information
    const [storeInfo, setStoreInfo] = useState(storeInfoData);

    //Store Image for display
    const [image, setImage] = useState(null);

    //Stores newly created metadata for?
    const [newMetadata, setNewMetadata] = useState(null);

    //Function that resets local metadata when needed
    const resetNftConceptForm = () => {
        setInfo(infoData);
        setAttributes(getAttributesData());
        setProperties(propertiesData);
        setStoreInfo(storeInfoData);
        setImageName('');
        setImage(null);
        setNewMetadata(null);
    }

    //Handles form input change for Info state
    const handleInfoChange = (e) => {
        const { name, value } = e.target;
        setInfo({ ...info, [name]: value });
    };

    //Handles form input change for Store Info
    const handleStoreChange = (key, value) => {
        setStoreInfo((prev) => ({
            ...prev,
            [key]: value
        }));
    };

    //Handle Image uploads
    const handleImageChange = (e) => {
        const file = e.target.files[0]; // Get the selected file

        if (file) {
            const img = new Image();
            const fileURL = URL.createObjectURL(file); // Create a temporary URL for the image

            img.onload = () => {
                const { width, height } = img;

                // Validate image dimensions
                if (width > 512 || height > 512 || width !== height) {
                    alert("Image dimensions must be 512x512 or smaller, and same width/height.");
                    e.target.value = ""; // Reset the file input
                } else {
                    setImage(file); // Set the image as usual if valid
                    setImageName(file.name);
                }

                URL.revokeObjectURL(fileURL); // Clean up the temporary URL
            };

            img.onerror = () => {
                alert("Invalid image file.");
                URL.revokeObjectURL(fileURL); // Clean up the temporary URL
            };

            img.src = fileURL; // Trigger the `onload` handler by setting the image source
        }
    };

    // Handle input change
    const handleAttributeChange = (index, field, newValue) => {
        const updatedAttributes = attributes.map((attr, i) =>
            i === index ? { ...attr, [field]: newValue } : attr
        );
        setAttributes(updatedAttributes);
    };

    return {
        info,
        setInfo,
        attributes,
        setAttributes,
        properties,
        setProperties,
        storeInfo,
        setStoreInfo,
        image,
        setImage,
        newMetadata,
        setNewMetadata,
        resetNftConceptForm,
        handleInfoChange,
        handleStoreChange,
        handleImageChange,
        handleAttributeChange
    }
}