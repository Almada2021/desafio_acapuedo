import { Router } from 'express';
import { createAdmin, createUser, loginAdmin, loginUser, getUserById } from '../controllers/userController';

const router = Router();

router.get('/user/:id', getUserById);
router.post('/users', createUser);
router.post('/login', loginUser);
router.post('/admins', createAdmin);
router.post('/admins/login', loginAdmin);
export default router;