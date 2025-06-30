import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

dotenv.config();

import authRoutes from '../src/routes/authRoutes';
import productRoutes from '../src/routes/productRoutes';
import categoryRoutes from '../src/routes/categoryRoutes';
import cartRoutes from '../src/routes/cartRoutes';
import wishListRoutes from '../src/routes/wishListRoutes';
import addressRoutes from '../src/routes/addressRoutes';

import { errorHandler, notFoundHandler } from './middlewares/errorHandler';

const PORT = process.env.PORT || 9000;
const app = express();

app.use(express.json());
app.use(cookieParser());

// Routes middleware
app.get('/', (req, res) => {
  res.send('API is running...');
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/carts', cartRoutes);
app.use('/api/wishlists', wishListRoutes);
app.use('/api/addresses', addressRoutes);
app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on PORT:${PORT}`);
});
