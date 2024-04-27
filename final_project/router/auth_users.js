//This contains the skeletal implementations for the routes which an authorized user can access.

const express = require('express');
const jwt = require('jsonwebtoken');
const { books, router: booksRouter } = require("./booksdb.js");
const regd_users = express.Router();

let users = []

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
    let usersWithSameName = users.filter((user) => {
        return user.username === username;
    });
    return usersWithSameName.length > 0;
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    let validUsers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    return validUsers.length > 0;
}

//only registered users can login
/* regd_users.post("/login", (req,res) => {
  //Write your code here
			const username=req.query.username;
			const password=req.query.password;
			
			if (!username || !password)
			{
				return res.status(404).json({message: "Error logging in. Username/Password not recognized. 404 error."});
			}
			
			 if(authenticatedUser(username,password)) {
        try {
            let accessToken=jwt.sign({data:password},'access',{expiresIn:'10s'});
            req.session.authorization = {
                accessToken,
                username,
				loginTime: Date.now() // Store login time
            }
            return res.status(200).send("User successfully logged in. Jwt signed token. 200 status.");
        } catch (error) {
            console.error("Error generating JWT token:", error);
            return res.status(500).json({message: "Internal server error. Failed to generate JWT token."});
        }
    } else {
        return res.status(208).json({message: "Invalid Login. Check username and password or register. 208 status."});
    }
   
  return res.status(300).json({message: "Yet to be implemented"});
}); */

//only registered users can login
regd_users.post("/login", (req, res) => {
	 console.log("Received POST request to /login");
    //Write your code here
    const username = req.query.username;
    const password = req.query.password;

    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in. Username/Password not recognized. 404 error." });
    }
const expiresInSeconds = 6000;
    if (authenticatedUser(username, password)) {
        try {
            const accessToken = jwt.sign({ data: password }, 'access', { expiresIn: expiresInSeconds +'s' });
            const loginTime = Date.now(); // Store login time
            req.session.authorization = {
                accessToken,
                username,
                loginTime
            }

            // Calculate remaining time until token expiry
            const remainingTime = Math.floor((loginTime + expiresInSeconds * 1000 - Date.now()) / 1000); // in seconds

            // Log countdown in console
            console.log(`\nToken expires in ${remainingTime} seconds.`);

            setTimeout(() => {
                // After token expiry, remove the session authorization
                delete req.session.authorization;
                console.log("Token expired. You are logged out.");

                // Remove the user from the users array
                users = users.filter(user => user.username !== username);
                console.log(`User '${username}' removed from registered users. Token has expired.`);
            }, expiresInSeconds*10000); // 10 seconds timeout

            return res.status(200).send("User successfully logged in. Jwt signed token. 200 status.");
        } catch (error) {
            console.error("Error generating JWT token:", error);
            return res.status(500).json({ message: "Internal server error. Failed to generate JWT token." });
        }
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password or register. 208 status." });
    }

    return res.status(300).json({ message: "Yet to be implemented" });
});



// Add a book review
regd_users.put("/auth/reviews/:isbn", (req, res) => {
	 // Check if the user is authenticated
	 if (!req.session || !req.session.authorization || !req.session.authorization.username) {
        return res.status(401).json({ message: "Unauthorized. Please login to add a review." });
    }
	
    const username = req.session.authorization.username; // Assuming username is sent in the request query
    const isbn = req.params.isbn;
    const reviews = req.body.reviews; // Assuming reviews are sent in the request body
	
	console.log("Received PUT request to /auth/reviews/:isbn");
	console.log("Username:", username);
    console.log("ISBN:", isbn);
    console.log("Reviews:", reviews);
	
	// Log the current state of the books object
    console.log("Current state of books object:", books);
	
    // Check if the book exists
   if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found based on this ISBN." });
    } else {
        // Add or update the review for the book
        books[isbn].reviews = reviews;
		   console.log("Current state of books object after PUT:", books[isbn]);
        return res.status(200).json({ message: "Review added/updated successfully." });
		 
    }
});



// Add a book review
regd_users.delete("/auth/reviews/:isbn", (req, res) => {
	 // Check if the user is authenticated
	 if (!req.session || !req.session.authorization || !req.session.authorization.username) {
        return res.status(401).json({ message: "Unauthorized. Please login to add a review." });
    }
	
    const username = req.session.authorization.username; // Assuming username is sent in the request query
    const isbn = req.params.isbn;
	
	console.log("Received DELETE request to /auth/reviews/:isbn");
	console.log("Username:", username);
    console.log("ISBN:", isbn);

	
	// Log the current state of the books object
    console.log("Current state of books object:", books);
	
    // Check if the book exists
   if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found based on this ISBN." });
    } else {
        // Add or update the review for the book
        delete books[isbn].reviews ;
		console.log("Current state of books object after DELETE:", books[isbn]);
		return res.status(200).json({ message: `User '${username}' has made a change to Book with ISBN '${isbn}'. Review deleted successfully.`,updatedBook: books[isbn] });
		 
	
    }
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
