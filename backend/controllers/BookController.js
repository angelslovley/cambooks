const Book = require('../models/Book');
const upload = require('../middleware/multerConfig'); 
const Subscription = require('../models/Subscription');
const User = require('../models/User');


exports.getBooks = async (req, res) => {
    try {
        const books = await Book.find().populate('category');
        const booksWithFiles = books.map(book => ({
            ...book.toObject(),
            imageUrl: req.protocol + '://' + req.get('host') + book.image,
            pdfUrl: req.protocol + '://' + req.get('host') + book.pdf
        }));
        res.json(booksWithFiles);
    } catch (error) {
        res.status(500).json({ message: 'Error getting books' });
    }
};


exports.getFeatBooks = async (req, res) => {
    try {
        const books = await Book.find().limit(3).populate('category');
        const featBooks = books.map(book => ({
            ...book.toObject(),
            imageUrl: req.protocol + '://' + req.get('host') + book.image,
            pdfUrl: req.protocol + '://' + req.get('host') + book.pdf
        }));
        res.json(featBooks);
    } catch (error) {
        res.status(500).json({ message: 'Error getting featured books' });
    }
};

exports.getBook = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id).populate('category');
        if (!book) return res.status(404).json({ message: 'Book not found' });
        const bookWithFiles = {
            ...book.toObject(),
            imageUrl: req.protocol + '://' + req.get('host') + book.image,
            pdfUrl: req.protocol + '://' + req.get('host') + book.pdf
        };
        res.json(bookWithFiles);
    } catch (error) {
        res.status(500).json({ message: 'Error getting book' });
    }
};



exports.createBook = async (req, res) => {
    try {
        console.log("entered")
        const { title, author, ISBN, publisher, edition, description, price, category, stock, publishedyear, pages , image ,pdf } = req.body;
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
            image: image, 
            pdf: pdf
        });
        console.log("here")
        await newBook.save();
        res.status(200).json({ message: 'Book created successfully' });
        // const bookWithFiles = {
        //     ...book.toObject(),
        //     imageUrl: req.protocol + '://' + req.get('host') + book.image,
        //     pdfUrl: req.protocol + '://' + req.get('host') + book.pdf
        // };
        // res.json({  message: 'Book created successfully' });
       
    } catch (error) {
        res.status(500).json({ message: 'Error creating book', error });
    }
};



exports.updateBook = async (req, res) => {
    try 
    {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(500).json({
                message: 'Book not found'
            });
        }

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
        book.category = req.body.category;
        book.stock = req.body.stock;
        if (req.files && req.files['image']) {
            book.image = req.files['image'][0].path;
        }
        if (req.files && req.files['pdf']) {
            book.pdf = req.files['pdf'][0].path;
        }
        const updatedBook = await book.save();

        res.json({ updatedBook, message: 'Book updated successfully' });
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


exports.checkBookSubscription = async (req, res) => {
    try {
        const bookId = req.params.bookId;
        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }
        
        const subscription = await Subscription.findOne({ book: bookId });
        if (!subscription) {
            return res.json({ subscribed: false, message: 'Book is not subscribed' });
        }

        const subscribedUsers = await User.find({ _id: { $in: subscription.users } });
        res.json({ subscribed: true, subscribedUsers });
    } catch (error) {
        res.status(500).json({ message: 'Error checking book subscription', error });
    }
};