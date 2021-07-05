import express from 'express';
import cors from 'cors';

import productRouter from './routes/product.js';
import userRouter from './routes/user.js';
import authRouter from './routes/auth.js';
import orderRouter from './routes/order.js';

import './db.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.get("/", (req, res) => res.send("hello world"));

app.use('/api/products', productRouter);
app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/orders', orderRouter);

app.listen(process.env.PORT, () =>
  console.log(`Server running at http://127.0.0.1:${process.env.PORT}`)
);
