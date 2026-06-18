const express = require("express");

const {
  createLifeMoment,
  getLifeMoments,
  getLifeMomentById,
  updateLifeMoment,
  deleteLifeMoment,
} = require("../controllers/lifeMoment.controller");

const { requireAuth } = require("../middleware/auth.middleware");

const {createLifeMomentSchema, updateLifeMomentSchema,} = require("../validations/lifeMoment.validation");

const router = express.Router();

function validate(schema) {
    return function (req, res, next) {
        const result = schema.safeParse(req.body);
    
        if (!result.success) {
            return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors: result.error.issues.map((issue) => ({
                field: issue.path.join("."),
                message: issue.message,
            })),
            });
        }
    
        req.body = result.data;
        next();
    };
}

router.use(requireAuth);

router.post("/", validate(createLifeMomentSchema), createLifeMoment);
router.get("/", getLifeMoments);
router.get("/:id", getLifeMomentById);
router.patch("/:id", validate(updateLifeMomentSchema), updateLifeMoment);
router.delete("/:id", deleteLifeMoment);

module.exports = router;