const jwt = require('jsonwebtoken');
const JWT_SECRET = "onepunchman";


// creating a auth middleware..
function auth(req, res, next) {
    const authorization = req.headers.authorization;
    console.log("Token RECEIVED:", authorization);
    if(authorization){
        jwt.verify(authorization, JWT_SECRET, (err, decoded)=> {
        if(err) {
            console.error("JWT VERIFY ERROR:", err); // <-- ADD THIS
            return res.status(403).json({msg: "unauthorized"});
        } else {
            req.userId = decoded.id;
            next();
        }
    });}
    else {
        res.status(401).json({msg: "Unauthorized"});
    }
}

module.exports = {
    auth,
    JWT_SECRET, 
}