import { useState } from 'react';

import {
    infoData,
    getAttributesData,
    storeInfoData,
    propertiesData,
} from '../config/gameConfig';

import { useTransactionsController } from '../providers/TransactionsProvider';

export const useNftConceptForm = () => {

    const {setImageName} = useTransactionsController();

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
        resetNftConceptForm
    }
}