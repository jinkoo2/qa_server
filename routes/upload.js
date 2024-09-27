const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create uploads folder if it doesn't exist
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
}

// Set storage engine
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});


// Initialize multer with limits
const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 1024 } // 1GB size limit
});

// File upload endpoint
router.post('/', (req, res) => {
    upload.single('file')(req, res, function (err) {
        if (err) {
            console.error('Error during file upload:', err);
            return res.status(500).json({ message: 'Error uploading file', error: err.message });
        }
        
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        console.log('File received:', req.file);
        res.status(200).json({
            message: 'File uploaded successfully',
            fileName: req.file.filename,
            path: req.file.path,
            size: req.file.size,
        });
    });
});

// Multiple files upload
router.post('/multiple', upload.array('myFiles', 10), (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).send('No files uploaded.');
        }
        res.status(200).send({
            message: 'Files uploaded successfully',
            files: req.files.map(file => ({
                fileName: file.filename,
                path: file.path,
                size: file.size
            }))
        });
    } catch (error) {
        res.status(500).send({ message: 'Error uploading files', error: error.message });
    }
});

module.exports = router;
