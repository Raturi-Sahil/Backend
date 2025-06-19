const jwt = require('jsonwebtoken');
require('dotenv').config();
const JWT_KEY = process.env.SECRET;

function authorize(requiredRole = null) {
       return function userAuth(req, res, next) {
                try {
                    const authHeader = req.headers.authorization;

                    if(authHeader && authHeader.startsWith("Bearer ")) {
                        const token = authHeader.split(" ")[1];
                        jwt.verify(token, JWT_KEY, (err, decoded) => {
                            if(err) {
                                return res.status(401).json({msg: "Invalid or Expired token"});
                            }
                            console.log(decoded.role);
                            if(requiredRole && decoded.role != requiredRole) {
                                return res.status(403).json({msg: `Forbidden: ${requiredRole}s only`});
                            }
                            req.userId = decoded.id;
                            req.userRole = decoded.role;
                            next();
                        });
                    } else {
                        return res.status(401).json({msg: "Access denied, No token provided"});
                    }
                }catch(error) {
                    console.error(error);
                    res.status(500).json({msg: "Internal server error"});
                }
            }
}
module.exports = {
    authorize
}