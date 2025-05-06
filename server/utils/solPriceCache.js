let fetch; // will be loaded dynamically (only once)

let cachedPrice = null;
let lastUpdated = 0;
const TTL = 10 * 60 * 1000; // 10 minutes in milliseconds

async function getSolUsdPrice() {
  if (!fetch) {
    fetch = (await import('node-fetch')).default; // dynamic ESM import
  }

  const now = Date.now();

  if (!cachedPrice || now - lastUpdated > TTL) {
    try {
      const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd');
      const data = await res.json();
      cachedPrice = data.solana.usd;
      lastUpdated = now;
      console.log('[SOL/USD] Price updated:', cachedPrice);
    } catch (err) {
      console.error('[SOL/USD] Fetch failed:', err.message);
      return null; // allow payment fallback if desired
    }
  }

  return cachedPrice;
}

module.exports = { getSolUsdPrice };