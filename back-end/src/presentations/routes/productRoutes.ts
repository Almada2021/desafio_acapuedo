import express from 'express';
import { addProduct, getAllProducts } from '../controllers/productController';
import { isAdmin } from '../../infrastructure/middlewares/authMiddleware';

const router = express.Router();

router.post('/products', isAdmin, addProduct);
router.get('/products',  getAllProducts);

export default router;