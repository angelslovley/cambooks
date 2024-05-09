const Book = require('../models/Book');

exports.getBooks = async (req, res) => {
    try {
        const books = await Book.find().populate('category');
        res.json(books);
    } catch (error) {
        res.status(500).json({ message: 'Error getting books' });
    }
};


exports.getFeatBooks = async (req, res) => {
    try {
        const books = await Book.find().limit(3).populate('category');
        res.json(books);
    } catch (error) {
        res.status(500).json({ message: 'Error getting books' });
    }
};

exports.getBook = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id).populate('category');
        if (!book) return res.status(404).json({ message: 'Book not found' });
        res.json(book);
    } catch (error) {
        res.status(500).json({ message: 'Error getting book' });
    }
};



exports.createBook = async (req, res) => {
    try {
        // Extracting fields from request body
        const { title, author, ISBN, publisher, edition, description, price, category, stock, publishedyear, pages } = req.body;

        // Creating new book instance
        const newBook = new Book({
            title,
            author,
            ISBN,
            publisher,
            edition,
            description,
            price,
            category,
            stock,
            publishedyear,
            pages,
            image: req.files['image'][0].path, // Save image path
            pdf: req.files['pdf'][0].path // Save pdf path
        });

        // Save the book instance
        const book = await newBook.save();

        // Send response
        res.json({ book, message: 'Book created successfully' });
    } catch (error) {
        // Error handling
        res.status(500).json({ message: 'Error creating book', error });
    }
};



exports.updateBook = async (req, res) => {
    try {

        // find the book by its id
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(500).json({
                message: 'Book not found'
            });
        }
        // update the book's properties with the new data
        book.title = req.body.title;
        book.author = req.body.author;
        book.publisher = req.body.publisher;
        book.ISBN = req.body.ISBN;
        book.publish_date = req.body.publish_date;
        book.edition = req.body.edition;
        book.pages = req.body.pages;
        book.format = req.body.format;
        book.description = req.body.description;
        book.price = req.body.price;
        book.image = req.body.image;
        book.category = req.body.category;
        book.stock = req.body.stock;

        // save the updated book to the database
        const updatedBook = await book.save();

        // return the updated book as a response
        res.json(   { updatedBook , message: 'Book updated successfully'});
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


exports.deleteBook =async (req, res) => {
    try {
        // find the book by its id
        const deletedBook = await Book.findByIdAndRemove(req.params.id);
        if (!deletedBook) {
            return res.status(500).json({
                message: 'Book not found'
            });
        }
        // delete the book from the database
        // const deletedBook = await book.remove();
console.log("deleted book ...");
        res.json({
            deletedBook,message: 'Book deleted successfully'
        });
    } catch (err) {
        return res.status(500).json({
            message: err
        });
    }
};


exports.searchBooks = (req, res) => {
    const query = req.query.q;
    Book.find({$or: [
        {title: {$regex: query, $options: "i"}}, 
        {author: {$regex: query, $options: "i"}}
    ]}, (err, books) => {
        if (err) {
            return res.status(500).json({
                error: err
            });
        }
        if (!books) {
            return res.status(404).json({
                message: 'No books found'
            });
        }
        res.status(200).json(
           books
        );
    });
};


exports.filterBooks = (req, res) => {
    let query = {};
    if (req.query.category) {
        query.category =  req.query.category
    }
    if (req.query.price_min && req.query.price_max) {
        query.price = { $gte: req.query.price_min, $lte: req.query.price_max };
    }
    
    Book.find(query, (err, books) => {
        if (err) {
            return res.status(500).json({
                error: err
            });
        }
        if (!books) {
            return res.status(404).json({
                message: 'No books found'
            });
        }
        res.status(200).json(
           books
        );
    }).populate('category');;
};

