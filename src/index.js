const express = require('express');
const app = express();

app.use(express.urlencoded({extended: false}));
app.use(express.json);

const PORT = 3000;

app.use('/api/authors', require('../routers/authors'));
app.use('/api/books', require('../routers/books'));

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);    
});

