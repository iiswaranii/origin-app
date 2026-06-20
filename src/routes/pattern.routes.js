const express = require('express');

const {
    getEmotionPatterns,
    getThemePatterns,
    getValuePatterns,
} = require("../controllers/pattern.controller");

const { requireAuth } = require("../middleware/auth.middleware");

const router = express.Router();

router.use(requireAuth);

router.get("/emotions", getEmotionPatterns);
router.get("/themes", getThemePatterns);
router.get("/values", getValuePatterns);

module.exports = router;