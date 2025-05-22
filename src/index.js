import 'dotenv/config';
import express from 'express';
import connectDB from './db/connectDB.js';

const app = express();
connectDB();

app.listen(() => {
  console.log(`Server running at ${process.env.PORT}`);
});
