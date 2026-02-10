const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const redis = require('redis');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 4001;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('combined'));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use('/api', limiter);

// Database connection
const pool = new Pool({
  host: process.env.DB_HOST || 'postgres-db',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'shopnest',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password'
});

// Redis connection
const redisClient = redis.createClient({
  url: `redis://${process.env.REDIS_HOST || 'redis-cache'}:${process.env.REDIS_PORT || 6379}`
});

(async () => {
  try {
    await redisClient.connect();
    console.log('✅ Connected to Redis');
  } catch (err) {
    console.log('⚠️ Redis connection error:', err.message);
  }
})();

// Health endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'product-service',
    timestamp: new Date().toISOString(),
    redis: redisClient.isReady ? 'connected' : 'disconnected'
  });
});

// API Documentation
app.get('/api/docs', (req, res) => {
  res.json({
    service: 'Product Service',
    version: '1.0.0',
    endpoints: {
      products: {
        GET_ALL: 'GET /api/products',
        GET_ONE: 'GET /api/products/:id',
        CREATE: 'POST /api/products',
        UPDATE: 'PUT /api/products/:id',
        DELETE: 'DELETE /api/products/:id',
        SEARCH: 'GET /api/products/search/:query'
      },
      categories: {
        GET_ALL: 'GET /api/categories'
      }
    }
  });
});

// Get all products
app.get('/api/products', async (req, res) => {
  try {
    const cacheKey = `products:${JSON.stringify(req.query)}`;
    const cached = await redisClient.get(cacheKey);
    
    if (cached) {
      return res.json(JSON.parse(cached));
    }
    
    const { rows } = await pool.query('SELECT * FROM products ORDER BY created_at DESC LIMIT 50');
    
    await redisClient.setEx(cacheKey, 60, JSON.stringify(rows));
    
    res.json(rows);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single product
app.get('/api/products/:id', async (req, res) => {
  try {
    const cacheKey = `product:${req.params.id}`;
    const cached = await redisClient.get(cacheKey);
    
    if (cached) {
      return res.json(JSON.parse(cached));
    }
    
    const { rows } = await pool.query('SELECT * FROM products WHERE id = $1', [req.params.id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    await redisClient.setEx(cacheKey, 300, JSON.stringify(rows[0]));
    
    res.json(rows[0]);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create product
app.post('/api/products', async (req, res) => {
  try {
    const { name, description, price, category, image_url, stock } = req.body;
    
    const { rows } = await pool.query(
      `INSERT INTO products (name, description, price, category, image_url, stock) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [name, description, price, category, image_url, stock]
    );
    
    // Clear cache
    await redisClient.del('products:*');
    
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get categories
app.get('/api/categories', async (req, res) => {
  try {
    const cacheKey = 'categories';
    const cached = await redisClient.get(cacheKey);
    
    if (cached) {
      return res.json(JSON.parse(cached));
    }
    
    const { rows } = await pool.query('SELECT * FROM categories ORDER BY name');
    
    await redisClient.setEx(cacheKey, 600, JSON.stringify(rows));
    
    res.json(rows);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Search products
app.get('/api/products/search/:query', async (req, res) => {
  try {
    const { query } = req.params;
    const { rows } = await pool.query(
      `SELECT * FROM products 
       WHERE name ILIKE $1 OR description ILIKE $1 OR category ILIKE $1
       LIMIT 20`,
      [`%${query}%`]
    );
    
    res.json(rows);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Featured products
app.get('/api/products/featured', async (req, res) => {
  try {
    const cacheKey = 'featured_products';
    const cached = await redisClient.get(cacheKey);
    
    if (cached) {
      return res.json(JSON.parse(cached));
    }
    
    const { rows } = await pool.query(
      'SELECT * FROM products WHERE featured = true ORDER BY rating DESC LIMIT 8'
    );
    
    await redisClient.setEx(cacheKey, 300, JSON.stringify(rows));
    
    res.json(rows);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Product Service running on port ${PORT}`);
  console.log(`📚 API: http://localhost:${PORT}/api/docs`);
  console.log(`🏥 Health: http://localhost:${PORT}/health`);
});
