const express = require('express');

const { getEmotions, getThemes, getValues } = require('../controllers/taxonomy.controller');
const { requireAuth } = require("../middleware/auth.middleware");

const router = express.Router();

router.use(requireAuth);

router.get("/emotions", getEmotions);
router.get("/themes", getThemes);
router.get("/values", getValues);

module.exports = router;