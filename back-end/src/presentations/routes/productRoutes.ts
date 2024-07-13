import express from 'express';
import { addProduct, deleteProduct, editProduct, getAllProducts } from '../controllers/productController';
import { isAdmin } from '../../infrastructure/middlewares/authMiddleware';

const router = express.Router();

router.post('/products', isAdmin, addProduct);
router.get('/products',  getAllProducts);
router.delete('/products/:id', isAdmin, deleteProduct);
router.put('/products/:id', isAdmin, editProduct);

export default router;