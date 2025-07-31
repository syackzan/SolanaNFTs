
const NftMetadata = require('../Models/NftMetadata'); // adjust path if needed
const { rollSecureRandomInt, applyAttributes, fetchRollQualityHelper } = require('../utils/gameHelpers');
const { uploadMetadata } = require('../utils/pinataBackend');

exports.patchMissingAttributes = async (req, res) => {
    const { attributesToAdd } = req.body;

    if (!Array.isArray(attributesToAdd) || attributesToAdd.length === 0) {
        return res.status(400).json({
            error: '`attributesToAdd` must be a non-empty array of strings.',
        });
    }

    try {
        const nfts = await NftMetadata.find();
        let updatedCount = 0;

        for (const nft of nfts) {
            let changed = false;

            // ✅ Patch missing attributes
            const existingTraits = nft.attributes.map(attr => attr.trait_type);
            const newAttributes = [];

            for (const trait of attributesToAdd) {
                if (!existingTraits.includes(trait)) {
                    newAttributes.push({ trait_type: trait, value: "0" });
                    changed = true;
                }
            }

            if (newAttributes.length > 0) {
                nft.attributes.push(...newAttributes);
            }

            let storeInfoChanged = false;

            // ✅ Patch storeInfo.goldCost and babyBoohCost if missing
            if (nft.storeInfo.goldCost === undefined) {
                nft.storeInfo.goldCost = 0;
                storeInfoChanged = true;
            }

            if (nft.storeInfo.babyBoohCost === undefined) {
                nft.storeInfo.babyBoohCost = 0;
                storeInfoChanged = true;
            }

            if (storeInfoChanged) {
                nft.markModified('storeInfo');
                changed = true;
            }

            if (changed || storeInfoChanged) {
                await nft.save();
                updatedCount++;
            }
        }

        return res.json({
            message: `Patched ${updatedCount} NFTs with missing attributes and storeInfo defaults.`,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'An error occurred while patching NFT attributes.' });
    }
};

exports.deleteAttributeFromAllNfts = async (req, res) => {
    const { attributeToRemove } = req.body;

    if (typeof attributeToRemove !== 'string' || attributeToRemove.trim() === '') {
        return res.status(400).json({ error: '`attributeToRemove` must be a non-empty string.' });
    }

    try {
        const nfts = await NftMetadata.find();
        let updatedCount = 0;

        for (const nft of nfts) {
            const originalLength = nft.attributes.length;

            // Remove the attribute if it exists
            nft.attributes = nft.attributes.filter(attr => attr.trait_type !== attributeToRemove);

            if (nft.attributes.length < originalLength) {
                await nft.save();
                updatedCount++;
            }
        }

        return res.json({
            message: `Removed attribute "${attributeToRemove}" from ${updatedCount} NFTs.`
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'An error occurred while removing attribute from NFTs.' });
    }
};

exports.replaceAttributeAcrossNfts = async (req, res) => {
    const { from, to } = req.body;

    if (
        typeof from !== 'string' || from.trim() === '' ||
        typeof to !== 'string' || to.trim() === ''
    ) {
        return res.status(400).json({ error: '`from` and `to` must be non-empty strings.' });
    }

    try {
        const nfts = await NftMetadata.find();
        let updatedCount = 0;

        for (const nft of nfts) {
            let changed = false;

            nft.attributes = nft.attributes.map(attr => {
                if (attr.trait_type === from) {
                    changed = true;
                    return {
                        trait_type: to,
                        value: attr.value
                    };
                }
                return attr;
            });

            if (changed) {
                await nft.save();
                updatedCount++;
            }
        }

        return res.json({
            message: `Replaced "${from}" with "${to}" in ${updatedCount} NFTs.`
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'An error occurred while replacing attribute.' });
    }
};

exports.rollForAllServerItems = async (req, res) => {
    try {
        // Get all NFT documents
        const allNfts = await NftMetadata.find();

        if (!allNfts.length) {
            return res.status(404).json({ message: 'No NFTs found.' });
        }

        // Loop and update each NFT
        for (const nft of allNfts) {

            const seedNumber = rollSecureRandomInt();
            const rollQuality = Math.floor(Math.random() * (100 - 90 + 1)) + 90;

            const rarityAttribute = nft.attributes.find(type => type.trait_type === "rarity");
            const result = await fetchRollQualityHelper(seedNumber, rollQuality, rarityAttribute?.value);

            nft.attributes = applyAttributes(nft.attributes, result.output);

            // Optionally store seed or roll info in storeInfo
            if (nft.storeInfo) {
                nft.storeInfo.statsSeedRoll = seedNumber; // or use actual seed number
                nft.storeInfo.rollQuality = rollQuality; // or actual quality
            }

            console.log("NFT updated");

            await nft.save();
            console.log(nft._id);
            return;
        }

        res.status(200).json({ message: 'All NFTs updated with rolled attributes.' });
    } catch (error) {
        console.error("Error in rollForAllServerItems:", error);
        res.status(500).json({ error: 'Failed to update NFTs.' });
    }
}

exports.replaceBlueprintMetadata = async (req, res) => {
    try {
        // Get all NFT documents
        const allNfts = await NftMetadata.find();

        if (!allNfts.length) {
            return res.status(404).json({ message: 'No NFTs found.' });
        }

        // Loop and update each NFT
        for (const nft of allNfts) {

            const newAgeAttributes = Array.isArray(nft.attributes)
                    ? [
                        ...nft.attributes.filter(attr => attr.value !== "0"),
                        ...(nft.storeInfo?.rollQuality ? [{ trait_type: "rollQuality", value: nft.storeInfo.rollQuality }] : []),
                        ...(nft.storeInfo?.statsSeedRoll ? [{ trait_type: "statsSeedRoll", value: nft.storeInfo.statsSeedRoll }] : [])
                    ]
                    : [];

            //Set Up Metadata
            const newOffchainMetadata = {
                name: nft.name,
                symbol: nft.symbol,
                description: nft.description,
                image: nft.image,
                external_link: nft.external_link,
                attributes: newAgeAttributes,
                properties: nft.properties,
            };

            const metadataURI = await uploadMetadata(newOffchainMetadata);

            nft.storeInfo.metadataUri = metadataURI;

            await nft.save();
        }

        res.status(200).json({ message: 'All NFT metadata updated.' });
    } catch (error) {
        console.error("Error in update Metadata Blueprint", error);
        res.status(500).json({ error: 'Failed to update NFTs.' });
    }
}