const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');  // Ensure the project routes are imported
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Authentication Routes
app.use('/api/auth', authRoutes);  // Signup/Login Routes

// Project Routes (Protected)
app.use('/api/projects', projectRoutes);  // Project creation/join routes

// Set up HTTP server and WebSocket
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
});

// WebSocket Connection for real-time features
io.on('connection', (socket) => {
    console.log('New WebSocket connection');
    socket.on('codeChange', (codeData) => {
        socket.broadcast.emit('receiveCode', codeData);
    });

    socket.on('sendMessage', (messageData) => {
        io.emit('receiveMessage', messageData);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
