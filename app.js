const express = require('express');
const bodyParser = require('body-parser');

const mongoose = require('mongoose');
const Post = require('./models/post');

const app = express();

// Conectar a mongo DB
mongoose.connect('mongodb+srv://david:D8UNgvlyVFskeMZ8@cluster0-nowfg.mongodb.net/node-angular?retryWrites=true&w=majority', { useUnifiedTopology: true, useNewUrlParser: true })
    .then(() => {
        console.log('Connected to database');
    })
    .catch(() => {
        console.log('Connection failed!');
    });

// Usar parsers para coger informacion de los bodys y url de los mensajes http 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Anadir cabeceras para CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
    next();
});

// Anadir posts a la BD
app.post('/api/posts', (req, res, next) => {
    const post = new Post({
        title: req.body.title,
        content: req.body.content
    });
    post.save()
        .then(createdPost => {
            res.status(201).json({
                postId: createdPost._id,
                message: 'Post added successfully!'
            });
        })
});

// Coger post de la BD
app.get('/api/posts', (req, res, next) => {
    Post.find()
        .then(documents => {
            res.status(200).json({
                message: "Post fetched succesfully",
                posts: documents
            });
        });
});

// Borrar Post de la BD
app.delete('/api/posts/:id', (req, res, next) => {
    console.log('Deleting post: ' + req.params.id)
    Post.deleteOne({ _id: req.params.id })
        .then( result => {
            console.log(result);
            res.status(200).json({ message: 'Post deleted!' });
        })
});

// Exportar app al server
module.exports = app;