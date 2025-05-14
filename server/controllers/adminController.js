const NftMetadata = require('../Models/NftMetadata'); // adjust path if needed

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