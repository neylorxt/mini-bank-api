import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Routes from './Routes/Routes.js';

dotenv.config();

const app = express();

const allowedOrigins = ['http://localhost:3000','http://localhost:5173', 'https://ton-site.com'];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
}));

app.use(express.json());

app.use('/mini-bank_api', Routes);

export default app;