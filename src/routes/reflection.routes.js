const express = require('express');

const {createReflection, getReflections, getReflectionById, updateReflection, deleteReflection} = require("../controllers/reflection.controller");
  
const { requireAuth } = require("../middleware/auth.middleware");
const { validate } = require("../middleware/validate.middleware");
  
const {createReflectionSchema, updateReflectionSchema} = require("../validations/reflection.validation");
  
const router = express.Router();
  
router.use(requireAuth);
  
router.post("/", validate(createReflectionSchema), createReflection);
router.get("/", getReflections);
router.get("/:id", getReflectionById);
router.patch("/:id", validate(updateReflectionSchema), updateReflection);
router.delete("/:id", deleteReflection);

module.exports = router;