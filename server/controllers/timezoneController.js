
exports.getTimezone = async (req, res) => {
    res.json({ utc: new Date().toISOString() }); // ISO string in UTC
}