const WhitelistSubmission = require('../Models/Whitelist');

exports.checkWhitelistSpot = async (req, res, next) => {
    const { receiverPubKey } = req.body;

    const address = receiverPubKey;

    if (!address) {
      return res.status(400).json({ error: "Missing wallet address" });
    }
  
    try {
      const whitelistEntry = await WhitelistSubmission.findOne({ address });
  
      if (whitelistEntry) {
        if (whitelistEntry.amounts >= 1) {
          whitelistEntry.amounts -= 1;
          await whitelistEntry.save();
          console.log(`Decremented whitelist spot for ${address}, remaining: ${whitelistEntry.amounts}`);
        } else {
          console.log(`Whitelist entry for ${address} has 0 remaining spots — no decrement`);
        }
      } else {
        console.log(`No whitelist entry found for ${address}`);
      }
  
      // Proceed to next middleware or route either way
      next();
    } catch (err) {
      console.error("Whitelist check error:", err);
      res.status(500).json({ error: "Server error checking whitelist" });
    }
  };
  