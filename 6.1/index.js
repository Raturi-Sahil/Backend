const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();
const JWT_SECRET = "Hithere";
const users = [];

app.use(express.json());


app.post('/sign-up', function(req, res) {
    const username = req.body.username;
    const password = req.body.password;
// The find function returns the first element that satisfies the condition.
    if(users.find(u => u.username === username)) {
        return res.json({
            msg: "User already exists" 
        });
    } else {
        

        users.push({
            username: username,
            password: password,            
        });

        res.json({
            msg: "User signed up successfully",
        });
    }
});

app.post('/sign-in', function(req, res) {
    const username = req.body.username;
    const password = req.body.password;

    if(users.find(u => u.username === username && u.password === password)) {

        const token = jwt.sign({username: username}, JWT_SECRET)
        res.json({
            msg: "User signed in successfully",
            token: token
        });
        
    } else if(users.find(u => u.username === username && u.password !== password)) {
        return res.json({
            msg: "Incorrect password"
        });
    } else {
        return res.json({
            msg: "Username doesn't exist"
        });
    }

});

app.get('/me', function(req, res) {
    const token = req.headers.token;
    const decodedInfo = jwt.verify(token, JWT_SECRET);

    const user = users.find(u => u.username === decodedInfo.username)
    
    if(user)
        res.json({
            username: user.username,
            password: user.password
        })
    else {
        res.json({
            msg: "Token invalid"
        })
    }

})


app.listen(3000, function() {
    console.log("Hey i m listening on port 3000");
})
// const express = require('express');

// const app = express();

// const users = [];

// //returns a random long string
// function generateToken() {
//     let options = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

//     let token = '';

//     for(let i = 0; i < 32; i++) {
//         token += options[Math.floor(Math.random()*options.length)];
//     }

//     return token;
// }


// app.use(express.json());


// app.post('/sign-up', function(req, res) {
//     const username = req.body.username;
//     const password = req.body.password;
// // The find function returns the first element that satisfies the condition.
//     if(users.find(u => u.username === username)) {
//         return res.json({
//             msg: "User already exists" 
//         });
//     } else {
//         const token = generateToken();

//         users.push({
//             username: username,
//             password: password,
//             token: token
//         });

//         res.json({
//             msg: "User signed up successfully",
//         });
//     }
// });

// app.post('/sign-in', function(req, res) {
//     const username = req.body.username;
//     const password = req.body.password;

//     if(users.find(u => u.username === username && u.password === password)) {

//         const token = generateToken();

//         users.find(u => u.username === username && u.password === password).token = token;
//         /* every time a user signs in we update the token with new token.
//         if i do const user = users.find(u => u.username === username && u.password === password)
//         then user will store reference to the particular index which satisfies  the condition, say user = users[1] and if we update the user, user[1] will also get updated. Same is true for other programming languages as well.
//          */
//         res.json({
//             msg: "User signed in successfully",
//             token: token
//         });
        
//     } else if(users.find(u => u.username === username && u.password !== password)) {
//         return res.json({
//             msg: "Incorrect password"
//         });
//     } else {
//         return res.json({
//             msg: "Username doesn't exist"
//         });
//     }

// });

// app.get('/me', function(req, res) {
//     const token = req.headers.token;
//     const user = users.find(u => u.token === token);
//     if(user)
//         res.json({
//             username: user.username,
//             password: user.password
//         })
//     else {
//         res.json({
//             msg: "Token invalid"
//         })
//     }

// })


// app.listen(3000, function() {
//     console.log("Hey i m listening on port 3000");
// })