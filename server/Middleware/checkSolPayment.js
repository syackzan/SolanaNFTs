// verifySolPayment.js
const { Connection, clusterApiUrl } = require('@solana/web3.js');

// Connect to Solana Mainnet (or Devnet if testing)
const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

// Define your expected values
const EXPECTED_DESTINATION = "5ZyYTa4gR3pzMcgtHYYBfANL5nvc2za7EM5BjhB78ogz";
const EXPECTED_LAMPORTS = 2000000; // Example: 0.004 SOL = 4_000_000 lamports

exports.verifySolPayment = async (req, res, next) => {
  try {
    const { signature } = req.body; // Or req.query or wherever you send it

    if (signature === 'CARD') {
      return next();
    }

    if (!signature) {
      console.log("No signature found")
      return res.status(400).json({ error: "Transaction signature is required." });
    }

    const txn = await connection.getParsedTransaction(signature, { commitment: 'confirmed' });

    if (!txn) {
      console.log("TXN not found or confirmed.")
      return res.status(404).json({ error: "Transaction not found or not confirmed." });
    }

    const instructions = txn.transaction.message.instructions;

    let paymentVerified = false;

    for (const instruction of instructions) {
      if (instruction.program === 'system' && instruction.parsed.type === 'transfer') {
        const { destination, lamports } = instruction.parsed.info;

        if (
          destination === EXPECTED_DESTINATION &&
          lamports >= EXPECTED_LAMPORTS // >= if you want to accept a little more
        ) {
          paymentVerified = true;
          break;
        }
      }
    }

    if (!paymentVerified) {
      return res.status(403).json({ error: "Payment verification failed." });
    }

    // Payment verified!
    next();

  } catch (error) {
    console.error('Error verifying SOL payment:', error);
    res.status(500).json({ error: "Internal server error during payment verification." });
  }
};