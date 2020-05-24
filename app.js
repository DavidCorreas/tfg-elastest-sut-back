const express = require('express');

const app = express();

app.use('/api/posts', (req, res, next) => {
    const posts = [
        {id: "id-dafasdf", title: "First server-side post", content: "This is coming from the server"},
        {id: "id-adsferw", title: "Second server-side post", content: "This is coming from the server!"}
    ]
    res.status(200).json({
        message: "Post fetched succesfully",
        posts: posts
    })
});

module.exports = app;