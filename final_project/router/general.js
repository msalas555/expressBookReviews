const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username) => {
    
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        if (!doesExist(username)) {
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered."});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    let booksPromise = new Promise((resolve, reject) => {
        resolve(books);
    })
    booksPromise.then((successMessage) => {
        res.send(JSON.stringify(successMessage,null,4))
    })
  //res.send(JSON.stringify(books,null,4))
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    let isbnPromise = new Promise((resolve, reject) => {
        resolve(books[isbn]);
    })
    isbnPromise.then((successMessage) => {
        res.send(JSON.stringify(successMessage,null,4))
    })
    //res.send(books[isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    let author = req.params.author;
    let bookauth = [];

    let authorPromise = new Promise((resolve, reject) => {
        for (let key in books){
            if (books[key]["author"] === author){
                bookauth.push(books[key]);
            }
        }
        if (bookauth){
            resolve(bookauth);
        } else{
            reject("author not found");
        }
        
    })
    authorPromise.then((successMessage) => {
        res.send(JSON.stringify(successMessage,null,4))
    })
});


// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    let title = req.params.title;
    let booktitle = [];

    let titlePromise = new Promise((resolve, reject) => {
        for (let key in books){
            if (books[key]["title"] === title){
                booktitle.push(books[key]);
            }
        }
        if (booktitle){
            resolve(booktitle);
        } else{
            reject("title not found")
        }
    })
    titlePromise.then((successMessage) => {
        res.send(JSON.stringify(successMessage,null,4))
    })

});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    let isbn = req.params.isbn;
    res.send(books[isbn]["reviews"]);
  //return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
