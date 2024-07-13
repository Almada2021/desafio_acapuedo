import { Router } from 'express';
import { DebtController } from '../controllers/debtController';
import prisma from '../../infrastructure/prismaClient';
import { isAdmin } from '../../infrastructure/middlewares/authMiddleware';

const router = Router();
const debtController = new DebtController();

router.post('/debts', (req, res) => debtController.createDebt(req, res));

router.get('/debts/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
      const debts = await prisma.debt.findMany({
        where: {
          userId: Number(userId),
        },
        orderBy: {
          createdAt: "desc"
        }
      });
      res.json(debts);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
});
router.get('/history/:status', isAdmin, (req, res) => debtController.getDebts(req, res));
export default router;