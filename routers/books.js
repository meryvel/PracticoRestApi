const { Router } = require('express');
const router = Router();
const authors = require ('../authors.json');
const books = require('../books.json');
const _ = require('lodash');

/* 2.Get all books with the author */
const getAllBooksWithAuthor = books => {
    let allBooksAutrhors = [];

    books.map (book => {
        authors.map (author => {
            if(book.authorId == author.id){
                const bookAuthor = {
                    id: book.id,
                    name: book.name,
                    author: book.authorId
                }
                allBooksAutrhors.push(bookAuthor);
            }
        });
    });
    return allBooksAutrhors;    
}

router.get('/', (req, res) => {
    try {
        const allBooks = getAllBooksWithAuthor();
        res.json(allBooks);

    } catch (error) {
        console.log(error);
        res.status(500).json({'msg': 'An error has occurred'});
    }
});


/* 4.Add a book */
router.post('/', (req, res) => {

    const { id, name, authorId } = req.body;
    let existAuthor = false;

    if(id && name && authorId){
        authors.map (author => {
            if(author.id == authorId){
                existAuthor = true;
                const newBook = {...req.body};
                books.push(newBook);
            }
        });
        existAuthor ? res.status(200).json({ 'added' : 'ok'}) 
                    : res.status(400).json({ 'msg': 'The author does not exist'});
        
    } 
});

/* 6. Modify a book */
router.put('/:id', (req, res) => {
    const id = req.params.id;
    const { name, authorId } = req.body;
    let existBook = false;

    if( name.trim() == ''){
        res.status(400).json( {'msg': 'The name is required'});
        return;
    }

    if( authorId.trim() == ''){
        res.status(400).json( {'msg': 'The author is required'});
        return;
    }
   
    _.each(books, (book) => {
        if (book.id == id) {
            existBook = true;
            book.name = name;
            book.authorId = authorId;
        }
        existBook   ? res.json({ 'modified': 'ok' }) 
                    : res.status(400).json({'msg': 'The book does not exist'});
    });
});


/* 8. Delete a book */
router.delete('/:id', (req, res) => {
    const id = req.params.id;
    let existBook = false;

    _.remove(books, (book) => {
        if(book.id == id) {
            existBook = true;
            return id;
        }
    });
    existBook   ? res.json({ 'deleted': 'ok' }) 
                : res.status(400).json({ 'msg': 'The book does not exist'});
    
});

module.exports = router;