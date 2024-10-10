const express = require('express');
const cors = require('cors');
require('dotenv').config();  // Ensure that .env file is loaded
const http = require('http');
const socketIo = require('socket.io');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth').router;  // Import the router object correctly from auth.js
const projectRoutes = require('./routes/projects');  // Import project routes
const app = express();

// Middleware
app.use(cors());
app.use(express.json());  // Parse JSON request bodies

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/auth', authRoutes);  // Use authentication routes correctly
app.use('/api/projects', projectRoutes);  // Use project routes

// Set up HTTP server and WebSocket
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
});

// WebSocket Connection for real-time collaboration (Code editor, Chat)
io.on('connection', (socket) => {
    console.log('New WebSocket connection');

    // Handle real-time code collaboration
    socket.on('codeChange', (codeData) => {
        socket.broadcast.emit('receiveCode', codeData);  // Broadcast code change to other clients
    });

    // Handle real-time chat messages
    socket.on('sendMessage', (messageData) => {
        io.emit('receiveMessage', messageData);  // Broadcast chat message to all clients
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
