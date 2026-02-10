package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/go-redis/redis/v8"
)

var redisClient *redis.Client
var ctx = context.Background()

func main() {
	// Initialize Redis
	redisHost := os.Getenv("REDIS_HOST")
	if redisHost == "" {
		redisHost = "redis-cache"
	}
	redisPort := os.Getenv("REDIS_PORT")
	if redisPort == "" {
		redisPort = "6379"
	}

	redisClient = redis.NewClient(&redis.Options{
		Addr:     fmt.Sprintf("%s:%s", redisHost, redisPort),
		Password: "",
		DB:       0,
	})

	// Test Redis connection
	_, err := redisClient.Ping(ctx).Result()
	if err != nil {
		log.Printf("Warning: Redis connection failed: %v", err)
	}

	// Create Gin router
	router := gin.Default()

	// Routes
	router.GET("/health", healthCheck)
	router.GET("/api/cart/:user_id", getCart)
	router.POST("/api/cart/:user_id/add", addToCart)

	// Start server
	port := os.Getenv("PORT")
	if port == "" {
		port = "4003"
	}

	log.Printf("🚀 Cart Service running on port %s", port)
	router.Run(":" + port)
}

func healthCheck(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"status":    "healthy",
		"service":   "cart-service",
		"timestamp": time.Now().Format(time.RFC3339),
	})
}

func getCart(c *gin.Context) {
	userID := c.Param("user_id")
	c.JSON(http.StatusOK, gin.H{
		"user_id": userID,
		"items":   []string{},
		"total":   0,
	})
}

func addToCart(c *gin.Context) {
	userID := c.Param("user_id")
	c.JSON(http.StatusOK, gin.H{
		"message": "Item added to cart",
		"user_id": userID,
	})
}
