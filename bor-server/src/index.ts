import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Initialize environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
	cors: {
		origin: '*',
		methods: ['GET', 'POST'],
	},
});

// Configure CORS
app.use(
	cors({
		origin: '*',
		methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
		allowedHeaders: ['*'],
		credentials: true,
	})
);

app.use(express.json());

// Connect to MongoDB with more detailed error logging
mongoose
	.connect(process.env.MONGO_URI!)
	.then(() => console.log('Connected to MongoDB'))
	.catch((err) => {
		console.error('MongoDB connection error details:', {
			message: err.message,
			code: err.code,
			errorResponse: err.errorResponse,
			// Add stack trace in development
			stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
		});
		// Optionally exit the process on connection failure
		// process.exit(1);
	});

// Basic health check route
app.get('/health', (req, res) => {
	res.json({ status: 'ok' });
});

// Start server
const port = process.env.PORT || 6969;
httpServer.listen(port, () => {
	console.log(`Server running on port ${port}`);
});
