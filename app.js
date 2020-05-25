const express = require('express');
const bodyParser = require('body-parser');

const mongoose = require('mongoose');
const Post = require('./models/post');

const app = express();
mongoose.connect('mongodb+srv://david:D8UNgvlyVFskeMZ8@cluster0-nowfg.mongodb.net/node-angular?retryWrites=true&w=majority', { useUnifiedTopology: true, useNewUrlParser: true })
    .then(() => {
        console.log('Connected to database');
    })
    .catch(() => {
        console.log('Connection failed!');
    });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.setHeader('Acces-Control-Methods', 'GET, POST, DELETE, OPTIONS');
    next();
});

app.post('/api/posts', (req, res, next) => {
    const posts = new Post({
        title: req.body.title,
        content: req.body.content
    });
    posts.save();
    console.log(posts);
    res.status(201).json({
        message: 'Post added successfully!'
    });
});

app.get('/api/posts', (req, res, next) => {
    const posts = [
        {id: "id-dafasdf", title: "First server-side post", content: "This is coming from the server"},
        {id: "id-adsferw", title: "Second server-side post", content: "This is coming from the server!"}
    ]
    res.status(200).json({
        message: "Post fetched succesfully",
        posts: posts
    });
});

module.exports = app;