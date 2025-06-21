const {z} = require('zod');

const signupSchema = z.object({
    username: z.string().min(3).max(50),
    email: z.string().email(),
    password: z.string().min(4).max(50).refine((val) => /[A-Z]/.test(val), {
        message: "Must contain atleast one uppercase character"
    })
    .refine((val) => /[a-z]/.test(val), {
        message: "Must contain atleast one lowecase character"
    })
    .refine((val) => /[0-9]/.test(val), {
        message: "Must contain a number"
    })
    .refine((val) => /[^A-Za-z0-9]/.test(val), {
        message: "Must contain a special character"
    }),
    role: z.enum(["user", "admin"])
});


const signinSchema = z.object({
    email: z.string().email(),
    password: z.string().min(4).max(50).refine((val) => /[A-Z]/.test(val), {
        message: "Must contain atleast one uppercase character"
    })
    .refine((val) => /[a-z]/.test(val), {
        message: "Must contain atleast one lowecase character"
    })
    .refine((val) => /[0-9]/.test(val), {
        message: "Must contain a number"
    })
    .refine((val) => /[^A-Za-z0-9]/.test(val), {
        message: "Must contain a special character"
    })
});

module.exports = {
    signupSchema, signinSchema
}