const express = require("express");
const postController = require('../controllers/post');
const router = express.Router();
const checkAuth = require("../middleware/check-auth");
const extractFile = require("../middleware/multer");


// Anadir posts a la BD
router.post(
  "",
  checkAuth,
  extractFile,
  postController.addPost
);

// Coger todos los posts de la BD
router.get("", postController.getAllPosts);

// Actualizar post
router.put(
  "/:id",
  checkAuth,
  extractFile,
  postController.updatePost
);

// Obtener post por id
router.get("/:id", postController.getPost);

// Borrar Post de la BD
router.delete("/:id", checkAuth, postController.deletePost);

module.exports = router;
