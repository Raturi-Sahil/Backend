const { z } = require('zod');


const courseCreateSchema = z.object({
    title: z.string().min(4, "title is required").max(100),
    description: z.string(),
    price: z.coerce.number().positive("price must be a positive number")
});

const courseUpdateSchema = courseCreateSchema.partial();


module.exports = {
    courseCreateSchema, courseUpdateSchema
}