const express = require('express');
const router = express.Router();
const User = require('../models/User');
const upload = require('../multer-config');
const fs = require('fs');
const path = require('path');

router.post('/register', upload.array('files', 5), async (req, res) => {
  try {
    const files = req.files.map(file => file.filename); 
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      files: files
    });
    
    await newUser.save();
    res.redirect('/files');
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Route to list all files
router.get('/files', async (req, res) => {
  try {
    const users = await User.find();
    res.render('index', { users });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Route to download a file
router.get('/download/:filename', (req, res) => {
  const filePath = path.join(__dirname, '../uploads/', req.params.filename);
  if (fs.existsSync(filePath)) {
    res.download(filePath);
  } else {
    res.status(404).send('File not found');
  }
});

module.exports = router;




