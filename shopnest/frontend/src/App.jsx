import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { FaShoppingCart, FaUser, FaSearch, FaHome, FaTag, FaShoppingBag } from 'react-icons/fa'
import axios from 'axios'

// API base URL from environment variable
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://18.201.155.139:4001' // in here also change the ip in your machine
const PRODUCTS_API = `${API_BASE_URL}/api/products`

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

function Navbar() {
  const [cartCount, setCartCount] = useState(0)
  
  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2">
              <FaShoppingBag className="text-blue-600 text-2xl" />
              <span className="text-2xl font-bold text-gray-800">ShopNest</span>
            </Link>
            
            <div className="hidden md:flex space-x-6">
              <Link to="/" className="flex items-center space-x-1 text-gray-700 hover:text-blue-600">
                <FaHome /> <span>Home</span>
              </Link>
              <Link to="/products" className="flex items-center space-x-1 text-gray-700 hover:text-blue-600">
                <FaTag /> <span>Products</span>
              </Link>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
            
            <Link to="/cart" className="relative">
              <FaShoppingCart className="text-2xl text-gray-700 hover:text-blue-600" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            
            <Link to="/login" className="flex items-center space-x-1">
              <FaUser className="text-xl text-gray-700 hover:text-blue-600" />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    fetchFeaturedProducts()
  }, [])
  
  const fetchFeaturedProducts = async () => {
    try {
      const response = await axios.get(PRODUCTS_API)
            setFeaturedProducts(response.data.slice(0, 4))

    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div>
      {/* Hero Section */}
      <section className="mb-12">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 md:p-12 text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Welcome to ShopNest
          </h1>
          <p className="text-xl mb-8 opacity-90">
            Discover amazing products at great prices. Built with microservices architecture.
          </p>
          <Link to="/products" className="btn-primary bg-white text-blue-600 hover:bg-gray-100 inline-block">
            Shop Now
          </Link>
        </div>
      </section>
      
      {/* Featured Products */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6">Featured Products</h2>
        
        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
      
      {/* Stats Section */}
      <section className="bg-white rounded-xl shadow-md p-8 mb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold text-blue-600 mb-2">5+</div>
            <div className="text-gray-600">Microservices</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-blue-600 mb-2">100%</div>
            <div className="text-gray-600">Dockerized</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-blue-600 mb-2">24/7</div>
            <div className="text-gray-600">Availability</div>
          </div>
        </div>
      </section>
    </div>
  )
}

function ProductsPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    fetchProducts()
  }, [])
  
  const fetchProducts = async () => {
    try {
      const response = await axios.get(PRODUCTS_API)
      setProducts(response.data)
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">All Products</h1>
      
      {loading ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}

function ProductCard({ product }) {
  return (
    <div className="card hover:shadow-xl transition-all duration-300">
      <img 
        src={product.image_url || 'https://via.placeholder.com/300'} 
        alt={product.name}
        className="w-full h-48 object-cover rounded-t-lg mb-4"
      />
      <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
      <div className="flex justify-between items-center">
        <span className="text-2xl font-bold text-blue-600">${product.price}</span>
        <button className="btn-primary">
          Add to Cart
        </button>
      </div>
      <div className="mt-3 flex items-center text-sm text-gray-500">
        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">{product.category}</span>
        <span className="ml-auto">
          ⭐ {product.rating} ({product.num_reviews})
        </span>
      </div>
    </div>
  )
}

function CartPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Your Shopping Cart</h1>
      <div className="bg-white rounded-xl shadow-md p-8 text-center">
        <FaShoppingCart className="text-6xl text-gray-300 mx-auto mb-4" />
        <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
        <p className="text-gray-600 mb-6">Add some products to get started!</p>
        <Link to="/products" className="btn-primary">
          Browse Products
        </Link>
      </div>
    </div>
  )
}

function LoginPage() {
  return (
    <div className="max-w-md mx-auto">
      <div className="card">
        <h1 className="text-2xl font-bold mb-6 text-center">Sign In</h1>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input 
              type="email" 
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <input 
              type="password" 
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="••••••••"
            />
          </div>
          <button type="submit" className="btn-primary w-full">
            Sign In
          </button>
        </form>
        <p className="mt-6 text-center text-gray-600">
          Demo Credentials: admin@shopnest.com / Admin@123
        </p>
      </div>
    </div>
  )
}

function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8 mt-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <FaShoppingBag className="text-2xl" />
              <span className="text-2xl font-bold">ShopNest</span>
            </div>
            <p className="text-gray-400">
              Modern e-commerce platform built with microservices architecture.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2 text-gray-400">
              <li>Product Service (Node.js + PostgreSQL)</li>
              <li>User Service (Python + MongoDB)</li>
              <li>Cart Service (Go + Redis)</li>
              <li>Real-time Notifications</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-400 hover:text-white">Home</Link></li>
              <li><Link to="/products" className="text-gray-400 hover:text-white">Products</Link></li>
              <li><Link to="/cart" className="text-gray-400 hover:text-white">Cart</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
          <p>© 2024 ShopNest. Built with ❤️ using Docker & Microservices.</p>
          <p className="mt-2">Running on: {API_BASE_URL}</p>
        </div>
      </div>
    </footer>
  )
}

export default App
