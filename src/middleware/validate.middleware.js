const { errorResponse } = require("../utils/apiResponse");

function validate(schema) {
    return function (req, res, next) {
      const result = schema.safeParse(req.body);
  
        if (!result.success) {
            return errorResponse(
            res,
            400,
            "Validation failed",
            result.error.issues.map((issue) => ({
                field: issue.path.join("."),
                message: issue.message,
            }))
            );
        }
  
        req.body = result.data;
        next();
    };
}
  
module.exports = {validate};