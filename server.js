const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/Blog');

// Define Article model
const articleSchema = new mongoose.Schema({
    title: String,
    createdAt: { type: Date, default: Date.now }
});
const Article = mongoose.model('Article', articleSchema);

// Set view engine
app.set('view engine', 'ejs');
app.set('views', './view');

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));

// Route to render form for creating a new article
app.get('/articles/new', (req, res) => {
    res.render('new', { article: new Article() });
});

// Route to handle form submission and save new article
app.post('/articles', async (req, res) => {
    const article = new Article({
        title: req.body.title
    });
    try {
        await article.save();
        res.redirect('/');
    } catch (error) {
        res.render('new', { article: article });
    }
});

// Route to display articles
app.get('/', async (req, res) => {
    try {
        const articles = await Article.find().sort({ createdAt: 'desc' });
        res.render('index', { articles: articles });
    } catch (error) {
        res.status(500).send('Error retrieving articles');
    }
});

// Route to handle DELETE request for deleting an article
app.delete('/articles/:id', async (req, res) => {
    try {
        await Article.findByIdAndDelete(req.params.id);
        res.redirect('/');
    } catch (error) {
        res.status(500).send('Error deleting article');
    }
});

// Start server
const PORT = process.env.PORT || 3030;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});