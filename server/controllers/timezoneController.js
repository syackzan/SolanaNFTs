
exports.getTimezone = async (req, res) => {
    const now = new Date();
    const plusTwoHours = new Date(now.getTime() + 4 * 60 * 60 * 1000); // Add 2 hours in ms
    res.json({ utc: plusTwoHours.toISOString() });
};