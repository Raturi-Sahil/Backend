

// Middleware to run zod schemas

function validate(schema) {
    return (req, res, next)=>{
        try {
            const result = schema.safeParse(req.body);

            if(!result.success) {
                const errors = result.error.errors.map(err=> err.message);
                return res.status(400).json({errors});
            }

            req.body = result.data; // validated & parsed input.
            return next();
            
        }catch(error) {
            console.log(error);
            res.status(400).json({msg: "Internal server error"});
        }
    }
}

module.exports = validate; // another way to export modules