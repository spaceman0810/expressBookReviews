//This contains the the preloaded book information for this application.
const express = require('express');
const public_users = express.Router();

let books = {
      1 : {"author": "Chinua Achebe","title": "Things Fall Apart", "reviews": "9.1 out of 10. Amazing read." },
      2 : {"author": "Hans Christian Andersen","title": "Fairy tales", "reviews": "9.2 out of 10. Amazing read." },
      3 : {"author": "Dante Alighieri","title": "The Divine Comedy", "reviews": "9.3 out of 10. Amazing read." },
      4 : {"author": "Unknown","title": "The Epic Of Gilgamesh", "reviews": "9.4 out of 10. Amazing read." },
      5 : {"author": "Unknown","title": "The Book Of Job", "reviews": "9.5 out of 10. Amazing read." },
      6 : {"author": "Unknown","title": "One Thousand and One Nights", "reviews": "9.6 out of 10. Amazing read." },
      7 : {"author": "Unknown","title": "Nj\u00e1l's Saga", "reviews": "9.7 out of 10. Amazing read." },
      8 : {"author": "Jane Austen","title": "Pride and Prejudice", "reviews": "9.8 out of 10. Amazing read." },
      9 : {"author": "Honor\u00e9 de Balzac","title": "Le P\u00e8re Goriot", "reviews": "9.9 out of 10. Amazing read." },
      10 : {"author": "Samuel Beckett","title": "Molloy, Malone Dies, The Unnamable, the trilogy", "reviews": "10 out of 10. Amazing read." }
}
	
module.exports = {
    books: books,
    router: public_users
};