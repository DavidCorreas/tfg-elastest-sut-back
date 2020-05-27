const express = require('express');
const multer = require('multer');

const router = express.Router();
const Post = require('../models/post');

const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg'
}

const storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        const isValid = MIME_TYPE_MAP[file.mimetype]
        let error = new Error('Invalid mime type');
        if (isValid) {
            error = null;
        }
        callBack(error, 'images');
    },
    filename: (req, file, callBack) => {
        const name = file.originalname.toLocaleLowerCase().split(' ').join('-');
        const ext = MIME_TYPE_MAP[file.mimetype];
        callBack(null, name + '-' + Date.now() + '.' + ext);
    }
});

// Anadir posts a la BD
router.post('', multer({storage: storage}).single('image'), (req, res, next) => {
    const url = req.protocol + '://' + req.get('host');
    const post = new Post({
        title: req.body.title,
        content: req.body.content,
        imagePath: url + '/images/' + req.file.filename
    });
    post.save()
        .then(createdPost => {
            res.status(201).json({
                post: {
                    ...createdPost,
                    id: createdPost._id
                },
                message: 'Post added successfully!'
            });
        })
});

// Coger post de la BD
router.get('', (req, res, next) => {
    Post.find()
        .then(documents => {
            res.status(200).json({
                message: "Post fetched succesfully",
                posts: documents
            });
        });
});
// Actualizar post
router.put('/:id', (req, res, next) => {
    const post = new Post({
        _id: req.body.id,
        title: req.body.title,
        content: req.body.content
    })
    Post.updateOne({ _id: req.params.id }, post).then( result => {
        console.log(result);
        res.status(200).json({ message: 'Update successful!' });
    })
})

// Obtener post por id
router.get('/:id', (req, res, next) => {
    Post.findById(req.params.id).then(post => {
        if (post) {
            res.status(200).json(post);
        } else {
            res.status(404).json({ message: 'Post not found!' });
        }
    })
})

// Borrar Post de la BD
router.delete('/:id', (req, res, next) => {
    console.log('Deleting post: ' + req.params.id)
    Post.deleteOne({ _id: req.params.id })
        .then( result => {
            console.log(result);
            res.status(200).json({ message: 'Post deleted!' });
        })
});

module.exports = router;