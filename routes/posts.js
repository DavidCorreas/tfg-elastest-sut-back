const express = require("express");
const multer = require("multer");

const router = express.Router();
const Post = require("../models/post");
const checkAuth = require("../middleware/check-auth");

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
};

const storage = multer.diskStorage({
  destination: (req, file, callBack) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");
    if (isValid) {
      error = null;
    }
    callBack(error, "images");
  },
  filename: (req, file, callBack) => {
    const name = file.originalname.toLocaleLowerCase().split(" ").join("-");
    const ext = MIME_TYPE_MAP[file.mimetype];
    callBack(null, name + "-" + Date.now() + "." + ext);
  },
});

// Anadir posts a la BD
router.post(
  "",
  checkAuth,
  multer({ storage: storage }).single("image"),
  (req, res, next) => {
    const url = req.protocol + "://" + req.get("host");
    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      imagePath: url + "/images/" + req.file.filename,
      creator: req.userData.userId
    });
    post.save().then((createdPost) => {
      res.status(201).json({
        post: {
          ...createdPost,
          id: createdPost._id,
        },
        message: "Post added successfully!",
      });
    });
  }
);

// Coger todos los posts de la BD
router.get("", (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const postQuery = Post.find();
  let fetchedPosts;
  if (pageSize && currentPage) {
    postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  postQuery
    .then((documents) => {
      fetchedPosts = documents;
      return Post.countDocuments();
    })
    .then((count) => {
      res.status(200).json({
        message: "Post fetched succesfully",
        posts: fetchedPosts,
        maxPosts: count,
      });
    });
});

// Actualizar post
router.put(
  "/:id",
  checkAuth,
  multer({ storage: storage }).single("image"),
  (req, res, next) => {
    let imagePath = req.body.imagePath;
    if (req.file) {
      const url = req.protocol + "://" + req.get("host");
      imagePath = url + "/images/" + req.file.filename;
    }
    const post = new Post({
      _id: req.body.id,
      title: req.body.title,
      content: req.body.content,
      imagePath: imagePath,
    });
    Post.updateOne({ _id: req.params.id, creator: req.userData.userId }, post).then(result => {
      console.log(result);
      if (result.n > 0) {
        res.status(200).json({ message: "Update successful!" });
      } else {
        res.status(401).json({ message: 'Not authorized!' })
      }
    });
  }
);

// Obtener post por id
router.get("/:id", (req, res, next) => {
  Post.findById(req.params.id).then((post) => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: "Post not found!" });
    }
  });
});

// Borrar Post de la BD
router.delete("/:id", checkAuth, (req, res, next) => {
  Post.deleteOne({ _id: req.params.id, creator: req.userData.userId }).then(result => {
    console.log(result);
    if (result.n > 0) {
      res.status(200).json({ message: "Post deleted!" });
    } else {
      res.status(401).json({ message: 'Not authorized!' })
    }
  });
});

module.exports = router;
