const multer = require('multer');

// Use memory storage for serverless compatibility (no disk access on Netlify)
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedMimes = {
      'image': ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
      'pdfUrl': ['application/pdf']
    };
    const field = file.fieldname;
    if (allowedMimes[field] && allowedMimes[field].includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Invalid file type for ${field}.`), false);
    }
  },
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  }
});

module.exports = { upload };
