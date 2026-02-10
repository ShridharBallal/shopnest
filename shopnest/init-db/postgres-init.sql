-- Initialize PostgreSQL database for ShopNest
-- This runs automatically when PostgreSQL container starts

-- Create extensions if not exists
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create products table
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    category VARCHAR(100),
    image_url TEXT,
    stock INTEGER DEFAULT 0,
    rating DECIMAL(3,2) DEFAULT 0.0,
    num_reviews INTEGER DEFAULT 0,
    featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create product_images table
CREATE TABLE IF NOT EXISTS product_images (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    alt_text VARCHAR(255),
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);
CREATE INDEX IF NOT EXISTS idx_products_rating ON products(rating DESC);
CREATE INDEX IF NOT EXISTS idx_products_created ON products(created_at DESC);

-- Insert default categories
INSERT INTO categories (name, description, image_url) VALUES
('Electronics', 'Latest gadgets and electronics', 'https://images.unsplash.com/photo-1498049794561-7780e7231661'),
('Fashion', 'Trendy clothing and accessories', 'https://images.unsplash.com/photo-1445205170230-053b83016050'),
('Home & Kitchen', 'Everything for your home', 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6'),
('Books', 'Books for all ages', 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c'),
('Sports', 'Sports equipment and gear', 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211'),
('Beauty', 'Beauty and personal care', 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9')
ON CONFLICT (name) DO NOTHING;

-- Insert sample products
INSERT INTO products (name, description, price, category, image_url, stock, rating, num_reviews, featured) VALUES
('iPhone 15 Pro', 'Latest Apple smartphone with A17 Pro chip', 999.99, 'Electronics', 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-finish-select-202309-6-7inch?wid=5120&hei=2880&fmt=webp&qlt=70&.v=1693009279096', 50, 4.8, 1250, true),
('MacBook Pro M3', 'Powerful laptop for professionals', 1999.99, 'Electronics', 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mbp14-spaceblack-select-202310?wid=904&hei=840&fmt=jpeg&qlt=90&.v=1697311160671', 30, 4.9, 890, true),
('Nike Air Force 1', 'Classic leather sneakers', 110.00, 'Fashion', 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/078d8c67-5fcd-4f1d-86b7-17a6c61d72af/air-force-1-07-mens-shoes-5QFp5Z.png', 100, 4.5, 12400, false),
('Sony WH-1000XM5', 'Noise cancelling headphones', 399.99, 'Electronics', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e', 40, 4.7, 3200, true),
('Dyson V15', 'Cordless vacuum cleaner', 749.99, 'Home & Kitchen', 'https://www.dyson.com.au/-/media/dyson/main-site/products/vacuum-cleaners/sticks/v15/studio-shot/v15detectgoldnickel_1.png?rev=36c5eae1baf74a01900fb96227eb7a1b', 25, 4.6, 2100, true)
ON CONFLICT DO NOTHING;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for products table
DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Log initialization
DO $$
BEGIN
    RAISE NOTICE '✅ ShopNest PostgreSQL database initialized successfully';
END $$;
