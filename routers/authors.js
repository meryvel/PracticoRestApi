const { Router } = require('express');
const router = Router();
const authors = require ('../authors.json');
const books = require('../books.json');
const _ = require('lodash');


/* 1.Get all authors */
router.get('/', (req, res) => {
    try {
        res.json(authors);
    } catch (err) {
        console.log(err);
        res.status(400).json({'msg': 'An error has occurred'});
    }
});


/* 3.Add an author */
router.post('/', (req, res) => {

    const { id, name, lastname } = req.body;

    if( id && name && lastname ) {
        const newAuthor = { ...req.body };
        authors.push(newAuthor);
        res.status(200).json({ 'added': 'ok'});
    } else {
        res.status(500).json({ 'statusCode': 'Bad Request'});
    }
});


/* 5.Modify an author */
router.put('/:id', (req, res) => {
    try {
        const id = req.params.id;
        const { name, lastname } = req.body;

        if( name.trim() == ''){
            res.status(400).json( {'msg': 'The name is required'});
            return;
        }

        if( lastname.trim() == ''){
            res.status(400).json( {'msg': 'The lastname is required'});
            return;
        }

        _.each(authors, (author) => {
            if(author.id == id){
                author.name = name;
                author.lastname = lastname;
            }
        });
        res.json({ 'modified' : 'ok' });

    } catch (error) {
        console.log(error);
        res.status(500).json({'msg': 'An error has occurred'});
    }
});   
    

/* 7.Delete a author */
router.delete('/:id', (req, res) => {
    try {
        const id = req.params.id;
        let existAuthor = false;

        _.remove(authors, (author) => {
            if(author.id == id) {
                _.remove(books, (book) => {
                    return book.authorId == id;
                })
                existAuthor = true;
                return id;
            }
        });

        existAuthor   ? res.status(200).json({ 'deleted': 'ok' }) 
                : res.status(400).json({ 'msg': `The author does not exist`});
        
    } catch (error) {
        console.log(error);
        res.status(500).json({'msg': 'An error has occurred'});
    }
});

module.exports = router;