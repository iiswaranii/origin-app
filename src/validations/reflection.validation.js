const z = require("zod");

const createReflectionSchema = z.object({
    content: z.string().min(1, "Reflection content is required").max(5000, "Reflection must be under 5000 characters"),

    mood: z.string().max(80, "Mood must be under 80 characters").optional()
});

const updateReflectionSchema = z.object({
    content: z.string().min(1, "Reflection content is required").max(5000, "Reflection must be under 5000 characters").optional(),

    mood: z.string().max(80, "Mood must be under 80 characters").optional()
});

module.exports = {createReflectionSchema, updateReflectionSchema};