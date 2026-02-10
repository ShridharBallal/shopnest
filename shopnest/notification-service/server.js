const express = require('express');
const WebSocket = require('ws');
const redis = require('redis');

const app = express();
const PORT = process.env.PORT || 4004;

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'notification-service',
    timestamp: new Date().toISOString()
  });
});

// Create HTTP server
const server = app.listen(PORT, () => {
  console.log(`🚀 Notification Service running on port ${PORT}`);
});

// WebSocket server
const wss = new WebSocket.Server({ port: 4005 });

wss.on('connection', (ws) => {
  console.log('New WebSocket connection');
  
  ws.on('message', (message) => {
    console.log('Received:', message);
  });
  
  ws.send(JSON.stringify({
    type: 'welcome',
    message: 'Connected to notification service'
  }));
});

console.log(`🔌 WebSocket server running on port 4005`);
