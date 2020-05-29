const express = require("express");
const multer = require("multer");
const postController = require('../controllers/post');
const router = express.Router();
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
  postController.addPost
);

// Coger todos los posts de la BD
router.get("", postController.getAllPosts);

// Actualizar post
router.put(
  "/:id",
  checkAuth,
  multer({ storage: storage }).single("image"),
  postController.updatePost
);

// Obtener post por id
router.get("/:id", postController.getPost);

// Borrar Post de la BD
router.delete("/:id", checkAuth, postController.deletePost);

module.exports = router;
