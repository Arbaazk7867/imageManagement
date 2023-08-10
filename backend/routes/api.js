const express = require('express');
const multer = require('multer');
const imageController = require('../app/controllers/imagecontroller');

const router = express.Router();
const upload = multer();

router.post('/upload', upload.single('image'), imageController.uploadImage);
router.get('/search', imageController.searchImages);

module.exports = router;
