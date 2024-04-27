const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users').authenticated;
const genl_routes = require('./router/general.js').general;
const { books, router: booksRouter } = require("./router/booksdb.js");
const app = express();

app.use(express.json());
app.use('/books', booksRouter);
app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))
app.use("/customer/auth", customer_routes);

app.use("/customer/auth/*", function auth(req,res,next)
{    console.log("Authentication middleware triggered");
//Write the authenication mechanism here
	if(req.session.authorization)
	{
		let token=req.session.authorization['accessToken'];
		jwt.verify(token,"access",(err,user)=>
		{
			if(!err)
			{
				req.user=user;
				next();
			}
			else
			{
				return res.status(403).json({message: "User not authenticated. Token not verified by jwt. 403 error."})
			}
		}
				);
	}
	else
	{
		return res.status(403).json({message: "User not logged in. 403 error."})
	}
}
	);
	
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

let seconds = 0;
let minutes = 0;
let hours = 0;

const timer = setInterval(() => {
    seconds++;
    if (seconds === 60) {
        seconds = 0;
        minutes++;
    }
    if (minutes === 60) {
        minutes = 0;
        hours++;
    }
    process.stdout.write(`\rRunning Time: ${hours}h ${minutes}m ${seconds}s`);
}, 1000); // Update the timer every second

app.listen(PORT,()=>console.log("Server is running. This is from the index.js file."));
console.clear();