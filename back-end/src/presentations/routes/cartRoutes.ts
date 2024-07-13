import { Router } from "express";
import { CartController } from "../controllers/cartController";
const cartController = new CartController();
const router = Router();
router.get("/carts/:debtId", cartController.getCartByDebtId);

export default router;