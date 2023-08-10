const fs = require('fs');
const path = require('path');
const Image = require('../models/image');

module.exports = {
    uploadImage: async (req, res) => {
        try {
          const { title, description, keywords } = req.body;
          const { filename } = req.file;
    
          const image = new Image({
            title,
            description,
            keywords: keywords.split(',').map((keyword) => keyword.trim()),
            uniqueIdentifier: filename,
          });
    
          await image.save();
    
          res.status(201).json({ message: 'Image uploaded successfully' });
        } catch (error) {
          res.status(500).json({ error: 'Error uploading image' });
        }
      },
  searchImages: async (req, res) => {
    try {
      const { title, keywords, sortBy, sortOrder, page, pageSize } = req.query;

      const query = {};
      if (title) query.title = { $regex: title, $options: 'i' };
      if (keywords) query.keywords = { $in: keywords.split(',') };

      const sortOptions = {};
      if (sortBy && ['title', 'uploadDate'].includes(sortBy)) {
        sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;
      }

      const images = await Image.find(query)
        .sort(sortOptions)
        .skip((page - 1) * pageSize)
        .limit(parseInt(pageSize));

      res.status(200).json(images);
    } catch (error) {
      res.status(500).json({ error: 'Error searching images' });
    }
  },
};
