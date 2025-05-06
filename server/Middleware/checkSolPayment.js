const { connection } = require("../config/solanaNetInstance");
const User = require("../Models/User"); // path may vary
const { getSolUsdPrice } = require('../utils/solPriceCache');

const EXPECTED_DESTINATION = "5ZyYTa4gR3pzMcgtHYYBfANL5nvc2za7EM5BjhB78ogz";
const MAX_TX_AGE_SECONDS = 90;
const USD_BUFFER = 0.75; // Accept at least 75% of expected USD value

exports.verifySolPayment = async (req, res, next) => {
  try {
    const { signature, receiverPubKey, nft } = req.body;

    console.log("[verifySolPayment] Called with signature:", signature);
    console.log("[verifySolPayment] receiverPubKey:", receiverPubKey);

    // 💳 Bypass for card payments
    if (signature === "CARD") {
      console.log("[verifySolPayment] Payment type is CARD — skipping verification.");
      return next();
    }

    if (!signature) {
      console.warn("[verifySolPayment] No signature provided.");
      return res.status(400).json({ error: "Transaction signature is required." });
    }

    // 🔁 Check for duplicate transaction
    const alreadyUsed = nft?.purchases?.transactions?.some(
      (tx) => tx.txSignature === signature
    );
    if (alreadyUsed) {
      console.warn("[verifySolPayment] Duplicate transaction detected.");
      return res.status(409).json({ error: "Transaction has already been used." });
    }

    console.log("[verifySolPayment] Fetching transaction from Solana...");
    const txn = await connection.getParsedTransaction(signature, { commitment: "confirmed" });

    if (!txn) {
      console.warn("[verifySolPayment] Transaction not found or not confirmed.");
      return res.status(404).json({ error: "Transaction not found or not confirmed." });
    }

    const blockTime = txn.blockTime;
    if (!blockTime) {
      console.warn("[verifySolPayment] Transaction missing blockTime.");
      return res.status(400).json({ error: "Transaction has no timestamp. Possibly not finalized." });
    }

    const now = Math.floor(Date.now() / 1000);
    const age = now - blockTime;
    console.log(`[verifySolPayment] Transaction age: ${age}s`);

    if (age > MAX_TX_AGE_SECONDS) {
      console.warn(`[verifySolPayment] Transaction too old (${age}s).`);
      return res.status(410).json({ error: "Transaction is too old." });
    }

    const expectedUsd = nft.storeInfo.price;
    console.log(`[verifySolPayment] NFT expected price (USD): $${expectedUsd}`);

    const solUsd = await getSolUsdPrice();
    console.log("[verifySolPayment] Current SOL/USD price:", solUsd);

    if (!solUsd) {
      console.warn("[verifySolPayment] Skipping SOL/USD price check due to fetch failure");
      return next(); // allow the purchase anyway
    }

    const minSolRequired = (expectedUsd * USD_BUFFER) / solUsd;
    const minLamportsRequired = Math.floor(minSolRequired * 1e9);
    console.log(`[verifySolPayment] Min lamports required: ${minLamportsRequired}`);

    const instructions = txn.transaction.message.instructions;
    let paymentVerified = false;

    for (const instruction of instructions) {
      if (instruction.program === "system" && instruction.parsed?.type === "transfer") {
        const { destination, lamports } = instruction.parsed.info;
        console.log(`[verifySolPayment] Checking transfer to: ${destination} with ${lamports} lamports`);

        if (
          destination === EXPECTED_DESTINATION &&
          lamports >= minLamportsRequired
        ) {
          console.log("[verifySolPayment] ✅ Payment verified!");
          paymentVerified = true;
          break;
        }
      }
    }

    if (!paymentVerified) {
      console.warn("[verifySolPayment] ❌ Payment verification failed.");
      return res.status(403).json({ error: "Payment verification failed." });
    }

    console.log("[verifySolPayment] ✅ All checks passed, continuing.");
    next();

  } catch (error) {
    console.error("[verifySolPayment] Error verifying SOL payment:", error);
    res.status(500).json({ error: "Internal server error during payment verification." });
  }
};
