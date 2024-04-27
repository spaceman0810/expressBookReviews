//This contains the skeletal implementations for the routes which a general user can access.

const express = require('express');
const { books, router: booksRouter } = require("./booksdb.js");
const public_users = express.Router();
const axios = require('axios');

let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

public_users.post("/register", (req,res) => {
  //Write your code here
    const { username, password } = req.body;

  if (username && password) {
    if (!isValid(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "\n User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "\n User already exists!"});    
    }
  } 
  return res.status(404).json({message: "\n Unable to register user."});
});

public_users.get("/auth/get_message", (req,res) => {
  return res.status(200).json({message: "\n Hello, You are an authenticated user. Congratulations!"});
});


/* // Start - Equivalent completed with promises and callbacks below
// Get the book list available in the shop
booksRouter.get("/",(req,res)=>{
  // Updated the code here
    res.json(books);
});

// GET by specific ID request: Retrieve a single book with ISBN
booksRouter.get("/isbn/:isbn",function (req, res) {
  // Updated the code here
	const ISBN = req.params.isbn;
	 const book = books[ISBN];
    if (book) {
        res.json(book);
    } else {
        res.status(404).json({ message: "General: Book not found based on this ISBN." });
    }
});

 // Get book details based on author
booksRouter.get('/author/:author',function (req, res) {
  // Updated the code here
    const author = req.params.author;
    const booksByAuthor = Object.values(books).filter(book => book.author === author);
    
    if (booksByAuthor.length > 0) {
        res.json(booksByAuthor);
    } else {
        res.status(404).json({ message: "General: No books found by this author." });
    }
});

// Get book details based on partial author
booksRouter.get('/partialauthor/:author',function (req, res) {
  // Updated the code here
    
	const partialAuthor = req.params.author.toLowerCase(); // Convert to lowercase for case-insensitive search
    const booksByPartialAuthor = Object.values(books).filter(book => book.author.toLowerCase().includes(partialAuthor));
	
	 if (booksByPartialAuthor.length > 0) {
        res.json(booksByPartialAuthor);
    } else {
        res.status(404).json({ message: "General: No books found by this partial author." });
    }
	
});

// Get all books based on title
booksRouter.get('/title/:title',function (req, res) {
  // Updated the code here
    const title = req.params.title;
    const booksBytitle = Object.values(books).filter(book => book.title === title);
    
    if (booksBytitle.length > 0) {
        res.json(booksBytitle);
    } else {
        res.status(404).json({ message: "General: No books found by this title." });
    }
});

// Get all books based on partial title
booksRouter.get('/partialtitle/:title',function (req, res) {
  // Updated the code here   
	const partialtitle = req.params.title.toLowerCase(); // Convert to lowercase for case-insensitive search
    const booksByPartialtitle = Object.values(books).filter(book => book.title.toLowerCase().includes(partialtitle));
	
	 if (booksByPartialtitle.length > 0) {
        res.json(booksByPartialtitle);
    } else {
        res.status(404).json({ message: "General: No books found by this partial title." });
    }
});

// End - Equivalent completed with promises and callbacks below */

// Get the book list available in the shop by partial reviews
booksRouter.get('/reviews/:reviews',function (req, res) {
	const reviews = req.params.reviews;
	const partialreviews = req.params.reviews.toLowerCase(); // Convert to lowercase for case-insensitive search
    const booksByPartialreviews = Object.values(books).filter(book => book.reviews.toLowerCase().includes(partialreviews));


  if (booksByPartialreviews.length > 0) {
      res.json(booksByPartialreviews);
  } else {
      res.status(404).json({ message: "General: No books found by this partial review." });
  }
});

// Get the book review available in the shop by ISBN
booksRouter.get('/reviews/:isbn', (req, res) => {
    const ISBN = req.params.isbn;
    const book = books[ISBN]; // Access the book directly using the ISBN as the key
    
    if (book && book.reviews) {
        res.json(book.reviews);
    } else {
        res.status(404).json({ message: "General: Book reviews not found based on this ISBN." });
    }
});



// Start - Promises and callbacks equivalent

// Get the book list available in the shop with promises and callbacks
booksRouter.get("/", (req, res) => {
    console.log("\nFetching books from the database...");
    // Promise function to perform asynchronous operation
    function fetchBooksFromDatabase() {
		console.log("\nStarting promise function...");
        return new Promise((resolve, reject) => {
            // Simulated database query
            setTimeout(() => {
                // Resolve promise with book data
                console.log("\nBooks fetched successfully.");
                resolve(Object.values(books));
            }, 1000); // Simulate delay of 1 second
        });
    }

    // Call the function and handle the promise
    fetchBooksFromDatabase()
        .then(data => {
            console.log("\nSending response with book data...");
            // Send response with book data
            res.json(data);
        })
        .catch(err => {
            // Handle error
            console.error('\nError fetching book list:', err);
            res.status(500).json({ message: '\nInternal server error.' });
        });
});


// GET by specific ID request: Retrieve a single book with ISBN with promises and callbacks

booksRouter.get("/isbn/:isbn", function (req, res) {
    console.log("\nFetching book from the database by ISBN...");
    const ISBN = req.params.isbn;
    const book = books[ISBN];
    
    // Promise function to check if the book exists
    function checkBookExists() {
        console.log("\nStarting promise function to check book existence...");
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Check if the book exists
                if (book) {
                    console.log("\nBook found.");
                    resolve(book);
                } else {
                    console.log(`\nBook with ISBN ${ISBN} not found.`);
                    reject(new Error(`Book with ISBN ${ISBN} not found.`));
                }
            }, 1000); // Simulate delay of 1 second
        });
    }

    // Call the function and handle the promise
    checkBookExists()
        .then(book => {
            console.log("\nSending response with book data...");
            res.json(book);
        })
        .catch(err => {
            console.error('\nError fetching book by ISBN:', err.message);
            res.status(404).json({ message: err.message });
        });
});
  

// Get book details based on author with promises and callbacks
booksRouter.get('/author/:author',function (req, res) {
    console.log("\nFetching book from the database by auhtor...");
    const author = req.params.author;
    const booksByAuthor = Object.values(books).filter(book => book.author === author);
    
    // Promise function to check if the book exists
    function checkBookExists() {
        console.log("\nStarting promise function to check book existence...");
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Check if the book exists
                if (booksByAuthor.length > 0) {
                    console.log("\nBook found.");
                    resolve(booksByAuthor);
                } else {
                    console.log(`\nBook with auhtor ${author} not found.`);
                    reject(new Error(`Book with auhtor ${author} not found.`));
                }
            }, 1000); // Simulate delay of 1 second
        });
    }

    // Call the function and handle the promise
    checkBookExists()
        .then(book => {
            console.log("\nSending response with book data...");
            res.json(booksByAuthor);
        })
        .catch(err => {
            console.error('\nError fetching book by author:', err.message);
            res.status(404).json({ message: err.message });
        });
});


// Get book details based on partial author with promises and callbacks
booksRouter.get('/partialAuthor/:author',function (req, res) {
    console.log("\nFetching book from the database by auhtor...");
    const partialAuthor = req.params.author.toLowerCase(); // Convert to lowercase for case-insensitive search
    const booksByPartialAuthor = Object.values(books).filter(book => book.author.toLowerCase().includes(partialAuthor));
    
    // Promise function to check if the book exists
    function checkBookExists() {
        console.log("\nStarting promise function to check book existence...");
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Check if the book exists
                if (booksByPartialAuthor.length > 0) {
                    console.log("\nBook found.");
                    resolve(booksByPartialAuthor);
                } else {
                    console.log(`\nBook with partial auhtor ${partialAuthor} not found.`);
                    reject(new Error(`Book with partial auhtor ${partialAuthor} not found.`));
                }
            }, 1000); // Simulate delay of 1 second
        });
    }

    // Call the function and handle the promise
    checkBookExists()
        .then(book => {
            console.log("\nSending response with book data...");
            res.json(booksByPartialAuthor);
        })
        .catch(err => {
            console.error('\nError fetching book by partial author:', err.message);
            res.status(404).json({ message: err.message });
        });
});


// Get all books based on title with promises and callbacks
booksRouter.get('/title/:title',function (req, res) {
    console.log("\nFetching book from the database by title...");
    const title = req.params.title;
    const booksBytitle = Object.values(books).filter(book => book.title === title);
    
    // Promise function to check if the book exists
    function checkBookExists() {
        console.log("\nStarting promise function to check book existence...");
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Check if the book exists
                if (booksBytitle.length > 0) {
                    console.log("\nBook found.");
                    resolve(booksBytitle);
                } else {
                    console.log(`\nBook with title ${title} not found.`);
                    reject(new Error(`Book with title ${title} not found.`));
                }
            }, 1000); // Simulate delay of 1 second
        });
    }

    // Call the function and handle the promise
    checkBookExists()
        .then(book => {
            console.log("\nSending response with book data...");
            res.json(booksBytitle);
        })
        .catch(err => {
            console.error('\nError fetching book by author:', err.message);
            res.status(404).json({ message: err.message });
        });
});


// Get all books based on partial title with promises and callbacks
booksRouter.get('/partialtitle/:title',function (req, res) {
    console.log("\nFetching book from the database by partial title...");
	const partialtitle = req.params.title.toLowerCase(); // Convert to lowercase for case-insensitive search
    const booksByPartialtitle = Object.values(books).filter(book => book.title.toLowerCase().includes(partialtitle));
    
    // Promise function to check if the book exists
    function checkBookExists() {
        console.log("\nStarting promise function to check book existence...");
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Check if the book exists
                if (booksByPartialtitle.length > 0) {
                    console.log("\nBook found.");
                    resolve(booksByPartialtitle);
                } else {
                    console.log(`\nBook with partial title ${partialtitle} not found.`);
                    reject(new Error(`Book with partial title ${partialtitle} not found.`));
                }
            }, 1000); // Simulate delay of 1 second
        });
    }

    // Call the function and handle the promise
    checkBookExists()
        .then(book => {
            console.log("\nSending response with book data...");
            res.json(booksByPartialtitle);
        })
        .catch(err => {
            console.error('\nError fetching book by partial title:', err.message);
            res.status(404).json({ message: err.message });
        });
});

// End - Promises and callbacks equivalent


module.exports.general = public_users;
module.exports.router = booksRouter;