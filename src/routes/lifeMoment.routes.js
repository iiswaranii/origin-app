const express = require("express");

const {
  createLifeMoment,
  getLifeMoments,
  getLifeMomentById,
  updateLifeMoment,
  deleteLifeMoment,
} = require("../controllers/lifeMoment.controller");

const {
  addLifeMomentEmotion,
  getLifeMomentEmotions,
  removeLifeMomentEmotion,

  addLifeMomentTheme,
  getLifeMomentThemes,
  removeLifeMomentTheme,

  addLifeMomentValue,
  getLifeMomentValues,
  removeLifeMomentValue,
} = require("../controllers/lifeMomentTag.controller");

const { tagSchema } = require("../validations/reflectionTag.validation");

const { requireAuth } = require("../middleware/auth.middleware");
const { validate } = require("../middleware/validate.middleware");

const {createLifeMomentSchema, updateLifeMomentSchema,} = require("../validations/lifeMoment.validation");

const router = express.Router();

router.use(requireAuth);

router.post("/", validate(createLifeMomentSchema), createLifeMoment);
router.get("/", getLifeMoments);

router.post("/:id/emotions", validate(tagSchema), addLifeMomentEmotion);
router.get("/:id/emotions", getLifeMomentEmotions);
router.delete("/:id/emotions/:emotionId", removeLifeMomentEmotion);

router.post("/:id/themes", validate(tagSchema), addLifeMomentTheme);
router.get("/:id/themes", getLifeMomentThemes);
router.delete("/:id/themes/:themeId", removeLifeMomentTheme);

router.post("/:id/values", validate(tagSchema), addLifeMomentValue);
router.get("/:id/values", getLifeMomentValues);
router.delete("/:id/values/:valueId", removeLifeMomentValue);

router.get("/:id", getLifeMomentById);
router.patch("/:id", validate(updateLifeMomentSchema), updateLifeMoment);
router.delete("/:id", deleteLifeMoment);

module.exports = router;