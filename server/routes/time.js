const express = require('express');

const router = express.Router();

const { getTimezone } = require("../controllers/timezoneController");

router.get("/utc", getTimezone);

module.exports = router;