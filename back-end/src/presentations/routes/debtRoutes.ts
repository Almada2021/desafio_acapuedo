import { Router } from 'express';
import { DebtController } from '../controllers/debtController';
import prisma from '../../infrastructure/prismaClient';

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
      });
      res.json(debts);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
export default router;