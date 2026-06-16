const express = require("express");
const {signup, login, me} = require("../controllers/auth.controller");
const {signupSchema, loginSchema} = require("../validations/auth.validation");
const {requireAuth} = require("../middleware/auth.middleware");
const router = express.Router();

function validate(schema) {
    return function (req, res, next) {
        const result = schema.safeParse(req.body);

        if(!result.success) {
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
    }
}

router.post("/signup", validate(signupSchema), signup);
router.post("/login", validate(loginSchema), login);
router.get("/me", requireAuth, me);

module.exports = router;