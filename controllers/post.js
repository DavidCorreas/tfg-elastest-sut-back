const Post = require("../models/post");

exports.updatePost = (req, res, next) => {
  let imagePath = req.body.imagePath;
  if (req.file) {
    const host = req.get("host").replace('localhost', 'express')
    const url = req.protocol + "://" + host;
    imagePath = url + "/images/" + req.file.filename;
  }
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath,
    creator: req.userData.userId,
  });
  Post.updateOne({ _id: req.params.id, creator: req.userData.userId }, post)
    .then((result) => {
      console.log(result);
      if (result.n > 0) {
        res.status(200).json({ message: "Update successful!" });
      } else {
        res.status(401).json({ message: "Not authorized!" });
      }
    })
    .catch(() => {
      res.status(500).json({ message: "Couldn't update post" });
    });
};

exports.addPost = (req, res, next) => {
  const host = req.get("host").replace('localhost', 'express')
  const url = req.protocol + "://" + host;
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + "/images/" + req.file.filename,
    creator: req.userData.userId,
  });
  post
    .save()
    .then((createdPost) => {
      res.status(201).json({
        post: {
          ...createdPost,
          id: createdPost._id,
        },
        message: "Post added successfully!",
      });
    })
    .catch(() => {
      res.status(500).json({
        message: "Creating a post failed!",
      });
    });
};

exports.getAllPosts = (req, res, next) => {
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
    })
    .catch(() => {
      res.status(500).json({ message: "Fetching post falied!" });
    });
};

exports.getPost = (req, res, next) => {
  Post.findById(req.params.id).then((post) => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: "Post not found!" });
    }
  })
  .catch(() => {
    res.status(500).json({ message: 'Fetching post falied!' })
  });
}

exports.deletePost = (req, res, next) => {
  Post.deleteOne({ _id: req.params.id, creator: req.userData.userId }).then(result => {
    console.log(result);
    if (result.n > 0) {
      res.status(200).json({ message: "Post deleted!" });
    } else {
      res.status(401).json({ message: 'Not authorized!' })
    }
  })
  .catch(() => {
    res.status(500).json({ message: 'Deleting post falied!' })
  });
}
