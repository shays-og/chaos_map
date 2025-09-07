const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
require('dotenv').config();

// Route file
const attackRoutes = require('./routes/api');

const app = express();
app.use(express.json()); // Middleware to parse JSON bodies

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

// Make the `io` object available to all routes
app.set('socketio', io);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.error(err));

// Use the API routes
app.use('/api/attack', attackRoutes);

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Backend server running on port ${PORT}`));