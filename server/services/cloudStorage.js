const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || '';
const API_KEY = process.env.CLOUDINARY_API_KEY || '';
const API_SECRET = process.env.CLOUDINARY_API_SECRET || '';

const isCloudinaryConfigured = CLOUD_NAME && API_KEY && API_SECRET && 
  API_SECRET !== 'PASTE_YOUR_API_SECRET_HERE';

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: CLOUD_NAME,
    api_key: API_KEY,
    api_secret: API_SECRET,
  });
  console.log('☁️  Cloudinary configured');
} else {
  console.log('⚠️  Cloudinary NOT configured — using MongoDB file storage fallback');
}

/**
 * Upload a PDF to MongoDB directly (bypassing Cloudinary to avoid 401 PDF security blocks)
 */
async function uploadPDF(buffer, originalName) {
  // Always store PDF as base64 data URL in MongoDB to prevent Cloudinary 401 errors
  const base64 = buffer.toString('base64');
  const dataUrl = `data:application/pdf;base64,${base64}`;
  console.log(`📁 Stored PDF in MongoDB (${(buffer.length / 1024 / 1024).toFixed(2)} MB)`);
  return { url: dataUrl, publicId: `local_${Date.now()}` };
}

/**
 * Upload an image to Cloudinary or return base64 for MongoDB storage
 */
async function uploadImage(buffer, originalName) {
  if (isCloudinaryConfigured) {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: 'image',
          folder: 'notefolio/images',
          public_id: `img_${Date.now()}_${originalName.replace(/\.[^.]+$/, '')}`,
          transformation: [
            { width: 800, height: 600, crop: 'limit' },
            { quality: 'auto', fetch_format: 'auto' },
          ],
        },
        (error, result) => {
          if (error) {
            console.error('Cloudinary image upload error:', error);
            reject(error);
          } else {
            resolve({ url: result.secure_url, publicId: result.public_id });
          }
        }
      );
      uploadStream.end(buffer);
    });
  }

  // Fallback: Store as base64 data URL in MongoDB
  const ext = originalName.split('.').pop().toLowerCase();
  const mime = { jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp', gif: 'image/gif' }[ext] || 'image/jpeg';
  const base64 = buffer.toString('base64');
  const dataUrl = `data:${mime};base64,${base64}`;
  console.log(`📁 Stored image in MongoDB (${(buffer.length / 1024).toFixed(1)} KB)`);
  return { url: dataUrl, publicId: `local_${Date.now()}` };
}

/**
 * Delete a file from Cloudinary
 */
async function deleteFile(publicId, resourceType = 'raw') {
  if (!isCloudinaryConfigured || publicId.startsWith('local_')) return;
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
  } catch (error) {
    console.error('Cloudinary delete error:', error);
  }
}

module.exports = { uploadPDF, uploadImage, deleteFile };
