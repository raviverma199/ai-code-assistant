import express from 'express';
import refactorRouter from './Routes/refactor.route';
import ExecutionRouter from './Routes/code.route';
import AIRouter from './Routes/ai.route';
import OAuthRouter from './Routes/oauth.route';
import cors from 'cors';
const app = express();
app.use(express.json());

// Enable CORS for all origins and specify allowed methods and headers
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify allowed methods
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use('/api', refactorRouter);
app.use('/api/code', ExecutionRouter);
app.use('/api', AIRouter);
app.use('/auth', OAuthRouter);

app.listen(2020, () => {
    console.log('Server is running on port 2020');
}).on('error', (err) => {
    console.error('Error starting server:', err);
    process.exit(1);
});

// 
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    process.exit(1); // Exit the process to avoid running in an unstable state
});