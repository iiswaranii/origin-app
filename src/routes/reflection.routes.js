const express = require('express');

const {createReflection, getReflections, getReflectionById, updateReflection, deleteReflection} = require("../controllers/reflection.controller");
  
const { requireAuth } = require("../middleware/auth.middleware");
const { validate } = require("../middleware/validate.middleware");
  
const {createReflectionSchema, updateReflectionSchema} = require("../validations/reflection.validation");
  
const {
    addReflectionEmotion,
    getReflectionEmotions,
    removeReflectionEmotion,
  
    addReflectionTheme,
    getReflectionThemes,
    removeReflectionTheme,
  
    addReflectionValue,
    getReflectionValues,
    removeReflectionValue,
  } = require("../controllers/reflectionTag.controller");
  
  const { tagSchema } = require("../validations/reflectionTag.validation");

const router = express.Router();
  
router.use(requireAuth);
  
router.post("/", validate(createReflectionSchema), createReflection);
router.get("/", getReflections);

router.post("/:id/emotions", validate(tagSchema), addReflectionEmotion);
router.get("/:id/emotions", getReflectionEmotions);
router.delete("/:id/emotions/:emotionId", removeReflectionEmotion);

router.post("/:id/themes", validate(tagSchema), addReflectionTheme);
router.get("/:id/themes", getReflectionThemes);
router.delete("/:id/themes/:themeId", removeReflectionTheme);

router.post("/:id/values", validate(tagSchema), addReflectionValue);
router.get("/:id/values", getReflectionValues);
router.delete("/:id/values/:valueId", removeReflectionValue);

router.get("/:id", getReflectionById);
router.patch("/:id", validate(updateReflectionSchema), updateReflection);
router.delete("/:id", deleteReflection);

module.exports = router;