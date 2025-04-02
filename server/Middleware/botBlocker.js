module.exports = function botBlocker(req, res, next) {
    const userAgent = req.headers['user-agent'] || '';

    const isSafeBot = /googlebot|bingbot|slurp/i.test(userAgent);
    const isKnownBadBot = /\b(bot|crawl|spider|headless|phantom|wget|curl|axios|python|scrapy)\b/i.test(userAgent);

    if (!isSafeBot && isKnownBadBot) {
        console.warn('🚫 Blocked bot UA:', userAgent);
        return res.status(403).json({ message: 'Bots not allowed.' });
    }

    next();
};
