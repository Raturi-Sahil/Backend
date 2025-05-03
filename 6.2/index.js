const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();
const JWT_SECRET = "imthebest";

const users = []

app.use(express.json()); // Middleware that let's u extract json body from the request. 

function auth(req, res, next) {
    
    const token = req.headers.token;
    
    if(token) {

        jwt.verify(token, JWT_SECRET, (err, decoded)=> {
            if(err) {
                res.status(401).json({message: "Unauthorized"})
            } else {
                req.user = decoded
                next();
            }
        });

    } else {
        res.status(401).json({
            msg: "Invalid"
        })
    }
    
}



app.post('/sign-up', function(req, res){
    const username = req.body.username;
    const password = req.body.password;

    if(users.find(u => u.username === username)) {
        res.json({
            msg: "User already exist",
        });
    } else {

        users.push({
            username: username,
            password: password
        })

        res.json({
            msg: "Signed up successfully"
        })
    }
});

app.post('/sign-in', function(req, res){
    const username = req.body.username;
    const password = req.body.password;

    const token = jwt.sign({
        username: username
    }, JWT_SECRET);

    if(users.find(u => u.username === username && u.password === password)) {
        res.json({
            mgs: "signed in successfully",
            token: token
        });
    }  else {
        return res.json({
            msg: "Invalid username or password"
        });
    }

    
});

app.use(auth);

/**
 * the /me is an authenticated endpoint, which means you will have to send token along with it. 
 */
app.get('/me', function(req, res){
    
    /**  the find function will return a null or an object {}, whereas filter returns null array or array with elements. 
     *   the below syntax works only for find and not for filter, cuz if([]) even this will return true, 
     * whereas if the find returns null, if(null) will run the else block.
*/
        res.json({
            username: req.user.username,
        })
    
});

app.listen(3000, function() {
    console.log("Hi there....")
});

