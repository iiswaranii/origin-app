const express = require("express");

const {
  createLifeMoment,
  getLifeMoments,
  getLifeMomentById,
  updateLifeMoment,
  deleteLifeMoment,
} = require("../controllers/lifeMoment.controller");

const { requireAuth } = require("../middleware/auth.middleware");
const { validate } = require("../middleware/validate.middleware");

const {createLifeMomentSchema, updateLifeMomentSchema,} = require("../validations/lifeMoment.validation");

const router = express.Router();

router.use(requireAuth);

router.post("/", validate(createLifeMomentSchema), createLifeMoment);
router.get("/", getLifeMoments);
router.get("/:id", getLifeMomentById);
router.patch("/:id", validate(updateLifeMomentSchema), updateLifeMoment);
router.delete("/:id", deleteLifeMoment);

module.exports = router;