
const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Update = require('../models/Update');
const authMiddleware = require('../middleware/auth');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { memoryStorage } = require('multer');

// Log to confirm middleware import
console.log('Auth middleware loaded:', typeof authMiddleware);

// Verify Cloudinary configuration
console.log('Cloudinary config:', {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY ? '[REDACTED]' : undefined,
  api_secret: process.env.CLOUDINARY_API_SECRET ? '[REDACTED]' : undefined,
});

// Configure multer to store files in memory
const storage = memoryStorage();
const upload = multer({ storage });

// Add a new product
router.post('/products', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    console.log('Request user after middleware:', req.user);
    if (!req.user || !req.user.email) {
      console.error('User not authenticated or email missing', req.user);
      return res.status(401).json({ error: 'User not authenticated or email missing' });
    }

    const lowerEmail = req.user.email.toLowerCase().trim();
    const { name, description, category, price, quantity, location, harvestDate, unit, farmer } = req.body;

    // Log the entire request body and files for debugging
    console.log('Request body:', req.body);
    console.log('Request files:', req.files);

    // Validate payload
    if (!name || !description || !category || !price || !quantity || !location || !harvestDate || !farmer) {
      console.error('Missing required fields:', { name, description, category, price, quantity, location, harvestDate, farmer });
      return res.status(400).json({ error: 'All fields are required' });
    }
    // Parse farmer object since it's sent as a JSON string
    let farmerData;
    try {
      farmerData = typeof farmer === 'string' ? JSON.parse(farmer) : farmer;
      console.log('Parsed farmer data:', farmerData);
    } catch (error) {
      console.error('Error parsing farmer data:', error.message);
      return res.status(400).json({ error: 'Invalid farmer data format' });
    }
    if (!farmerData.email || farmerData.email.toLowerCase().trim() !== lowerEmail) {
      console.error('farmer.email does not match authenticated user:', farmerData.email, lowerEmail);
      return res.status(403).json({ error: 'Unauthorized: farmer.email does not match' });
    }
    if (isNaN(price) || price <= 0) {
      console.error('Invalid price:', price);
      return res.status(400).json({ error: 'Price must be a positive number' });
    }
    if (isNaN(quantity) || quantity <= 0) {
      console.error('Invalid quantity:', quantity);
      return res.status(400).json({ error: 'Quantity must be a positive number' });
    }
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(harvestDate)) {
      console.error('Invalid harvest date format:', harvestDate);
      return res.status(400).json({ error: 'Harvest date must be in YYYY-MM-DD format' });
    }

    // Debug file upload
    console.log('Received file:', req.file);

    // Upload image to Cloudinary if provided
    let imageUrl = null;
    if (req.file) {
      console.log('Uploading to Cloudinary (file):', req.file.originalname);
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'products', resource_type: 'image' },
          (error, result) => {
            if (error) {
              console.error('Cloudinary upload error (file):', error);
              reject(error);
            } else {
              console.log('Cloudinary upload success (file):', result.secure_url);
              resolve(result.secure_url);
            }
          }
        );
        stream.end(req.file.buffer);
      });
      imageUrl = result;
    } else if (req.body.imageBase64) {
      console.log('Processing Base64 image for web');
      // Validate Base64 data
      if (!req.body.imageBase64.startsWith('data:image/')) {
        console.error('Invalid Base64 format: Missing data:image/ prefix');
        return res.status(400).json({ error: 'Invalid Base64 image format' });
      }
      const base64Data = req.body.imageBase64.replace(/^data:image\/[a-zA-Z+]+;base64,/, '');
      console.log('Base64 data length after stripping prefix:', base64Data.length);
      if (base64Data.length === 0) {
        console.error('Base64 data is empty after stripping prefix');
        return res.status(400).json({ error: 'Base64 image data is empty' });
      }
      let buffer;
      try {
        buffer = Buffer.from(base64Data, 'base64');
        console.log('Converted Base64 to buffer, length:', buffer.length);
      } catch (error) {
        console.error('Error converting Base64 to buffer:', error.message);
        return res.status(400).json({ error: 'Invalid Base64 encoding' });
      }
      try {
        const result = await new Promise((resolve, reject) => {
          cloudinary.uploader.upload_stream(
            { folder: 'products', resource_type: 'image', format: 'jpg' },
            (error, result) => {
              if (error) {
                console.error('Cloudinary upload error (Base64):', error);
                reject(error);
              } else {
                console.log('Cloudinary upload success (Base64):', result.secure_url);
                resolve(result.secure_url);
              }
            }
          ).end(buffer);
        });
        imageUrl = result;
      } catch (error) {
        console.error('Failed to upload Base64 image to Cloudinary:', error.message);
        return res.status(500).json({ error: 'Failed to upload image to Cloudinary', details: error.message });
      }
    } else {
      console.log('No file or Base64 image uploaded');
    }

    const product = new Product({
      name: name.trim(),
      description: description.trim(),
      category: category.trim(),
      price: Number(price),
      quantity: Number(quantity),
      location: location.trim(),
      harvestDate,
      unit: unit ? unit.trim() : null,
      imageUrl,
      farmer: {
        email: lowerEmail,
        name: farmerData.name ? farmerData.name.trim() : '',
      },
    });
    console.log('Saving product:', product);
    await product.save();

    const update = new Update({
      farmer: lowerEmail,
      message: `"${name}" added to crops`,
    });
    console.log('Saving update:', update);
    await update.save();

    console.log('Product added by:', lowerEmail, 'Product:', product.name);
    res.status(201).json({ message: 'Product added successfully', product });
  } catch (error) {
    console.error('Error adding product:', error.message);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

// Get all products for the authenticated farmer
router.get('/products', authMiddleware, async (req, res) => {
  try {
    console.log('Request user after middleware:', req.user);
    if (!req.user || !req.user.email) {
      console.error('User not authenticated or email missing', req.user);
      return res.status(401).json({ error: 'User not authenticated or email missing' });
    }
    const lowerEmail = req.user.email.toLowerCase().trim();
    console.log('Fetching products for:', lowerEmail);
    const products = await Product.find({ 'farmer.email': lowerEmail });
    res.json({ products });
  } catch (error) {
    console.error('Error fetching products:', error.message);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

// Update a product by ID
router.put('/products/:id', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    console.log('Request user after middleware:', req.user);
    if (!req.user || !req.user.email) {
      console.error('User not authenticated or email missing', req.user);
      return res.status(401).json({ error: 'User not authenticated or email missing' });
    }

    const lowerEmail = req.user.email.toLowerCase().trim();
    const { id } = req.params;
    const { name, description, category, price, quantity, location, harvestDate, unit } = req.body;

    // Log the entire request body and files for debugging
    console.log('Request body:', req.body);
    console.log('Request files:', req.file);

    // Validate payload
    if (!name || !description || !category || !price || !quantity || !location || !harvestDate) {
      console.error('Missing required fields:', { name, description, category, price, quantity, location, harvestDate });
      return res.status(400).json({ error: 'All fields are required' });
    }
    if (isNaN(price) || price <= 0) {
      console.error('Invalid price:', price);
      return res.status(400).json({ error: 'Price must be a positive number' });
    }
    if (isNaN(quantity) || quantity <= 0) {
      console.error('Invalid quantity:', quantity);
      return res.status(400).json({ error: 'Quantity must be a positive number' });
    }
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(harvestDate)) {
      console.error('Invalid harvest date format:', harvestDate);
      return res.status(400).json({ error: 'Harvest date must be in YYYY-MM-DD format' });
    }

    // Find the product and verify ownership
    const product = await Product.findById(id);
    if (!product) {
      console.error('Product not found:', id);
      return res.status(404).json({ error: 'Product not found' });
    }
    if (product.farmer.email !== lowerEmail) {
      console.error('Unauthorized: Product does not belong to user:', lowerEmail);
      return res.status(403).json({ error: 'Unauthorized: You do not own this product' });
    }

    // Handle image upload if provided
    let imageUrl = product.imageUrl; // Keep existing image if no new image is uploaded
    if (req.file) {
      console.log('Uploading new image to Cloudinary (file):', req.file.originalname);
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'products', resource_type: 'image' },
          (error, result) => {
            if (error) {
              console.error('Cloudinary upload error (file):', error);
              reject(error);
            } else {
              console.log('Cloudinary upload success (file):', result.secure_url);
              resolve(result.secure_url);
            }
          }
        );
        stream.end(req.file.buffer);
      });
      imageUrl = result;
    } else if (req.body.imageBase64) {
      console.log('Processing Base64 image for web');
      if (!req.body.imageBase64.startsWith('data:image/')) {
        console.error('Invalid Base64 format: Missing data:image/ prefix');
        return res.status(400).json({ error: 'Invalid Base64 image format' });
      }
      const base64Data = req.body.imageBase64.replace(/^data:image\/[a-zA-Z+]+;base64,/, '');
      console.log('Base64 data length after stripping prefix:', base64Data.length);
      if (base64Data.length === 0) {
        console.error('Base64 data is empty after stripping prefix');
        return res.status(400).json({ error: 'Base64 image data is empty' });
      }
      let buffer;
      try {
        buffer = Buffer.from(base64Data, 'base64');
        console.log('Converted Base64 to buffer, length:', buffer.length);
      } catch (error) {
        console.error('Error converting Base64 to buffer:', error.message);
        return res.status(400).json({ error: 'Invalid Base64 encoding' });
      }
      try {
        const result = await new Promise((resolve, reject) => {
          cloudinary.uploader.upload_stream(
            { folder: 'products', resource_type: 'image', format: 'jpg' },
            (error, result) => {
              if (error) {
                console.error('Cloudinary upload error (Base64):', error);
                reject(error);
              } else {
                console.log('Cloudinary upload success (Base64):', result.secure_url);
                resolve(result.secure_url);
              }
            }
          ).end(buffer);
        });
        imageUrl = result;
      } catch (error) {
        console.error('Failed to upload Base64 image to Cloudinary:', error.message);
        return res.status(500).json({ error: 'Failed to upload image to Cloudinary', details: error.message });
      }
    }

    // Update product fields
    product.name = name.trim();
    product.description = description.trim();
    product.category = category.trim();
    product.price = Number(price);
    product.quantity = Number(quantity);
    product.location = location.trim();
    product.harvestDate = harvestDate;
    product.unit = unit ? unit.trim() : product.unit;
    product.imageUrl = imageUrl;

    console.log('Updating product:', product);
    await product.save();

    const update = new Update({
      farmer: lowerEmail,
      message: `"${name}" updated`,
    });
    console.log('Saving update:', update);
    await update.save();

    console.log('Product updated by:', lowerEmail, 'Product:', product.name);
    res.status(200).json({ message: 'Product updated successfully', product });
  } catch (error) {
    console.error('Error updating product:', error.message);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

// Delete a product by ID
router.delete('/products/:id', authMiddleware, async (req, res) => {
  try {
    console.log('DELETE request received for ID:', req.params.id);
    console.log('Request user after middleware:', req.user);

    if (!req.user || !req.user.email) {
      console.error('User not authenticated or email missing', req.user);
      return res.status(401).json({ error: 'User not authenticated or email missing' });
    }

    const lowerEmail = req.user.email.toLowerCase().trim();
    const { id } = req.params;

    console.log('Fetching product with ID:', id);
    const product = await Product.findById(id);
    if (!product) {
      console.error('Product not found:', id);
      return res.status(404).json({ error: 'Product not found' });
    }

    console.log('Product found:', product);
    if (product.farmer.email !== lowerEmail) {
      console.error('Unauthorized: Product does not belong to user:', lowerEmail, 'Product owner:', product.farmer.email);
      return res.status(403).json({ error: 'Unauthorized: You do not own this product' });
    }

    console.log('Deleting product with ID:', id);
    const deleteResult = await Product.deleteOne({ _id: id });
    console.log('Delete operation result:', deleteResult);

    if (deleteResult.deletedCount === 0) {
      console.error('No product was deleted, ID:', id);
      return res.status(404).json({ error: 'Product not found or already deleted' });
    }

    console.log('Product deleted:', product.name);

    const update = new Update({
      farmer: lowerEmail,
      message: `"${product.name}" deleted`,
    });
    console.log('Saving update:', update);
    await update.save();

    console.log('Product deleted by:', lowerEmail, 'Product:', product.name);
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error.message);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

module.exports = router;
