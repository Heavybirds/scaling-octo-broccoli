const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const WebSocket = require('ws');

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require('./routes/auth');
const flightTrackerRoutes = require('./routes/flightTracker');
const schedulingRoutes = require('./routes/scheduling');
const meetingNotesRoutes = require('./routes/meetingNotes');
const financingRoutes = require('./routes/financing');
const workflowRoutes = require('./routes/workflow');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    message: 'Private Jet Ecosystem Platform API',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/flights', flightTrackerRoutes);
app.use('/api/scheduling', schedulingRoutes);
app.use('/api/meeting-notes', meetingNotesRoutes);
app.use('/api/financing', financingRoutes);
app.use('/api/workflow', workflowRoutes);

// WebSocket connection for real-time flight tracking
wss.on('connection', (ws) => {
  console.log('New WebSocket connection established');
  
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      console.log('Received:', data);
      
      // Echo back for now - will be replaced with actual flight data
      ws.send(JSON.stringify({ type: 'ack', message: 'Connected to flight tracker' }));
    } catch (error) {
      console.error('WebSocket message error:', error);
    }
  });
  
  ws.on('close', () => {
    console.log('WebSocket connection closed');
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Private Jet Ecosystem Platform running on port ${PORT}`);
  console.log(`📡 WebSocket server ready for real-time flight tracking`);
  console.log(`🔒 Secure data hosting enabled`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = { app, server, wss };
