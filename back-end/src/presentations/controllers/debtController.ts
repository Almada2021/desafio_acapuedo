import { CreateDebtUseCase } from "../../application/CreateDebtUseCase";
import { HttpService } from "../../infrastructure/httpService";
import prisma from "../../infrastructure/prismaClient";
function formatDateToCustomFormat(date: Date): string {
  let isoString = date.toISOString();
  let formattedDate = isoString.slice(0, 19);
  let offsetMinutes = date.getTimezoneOffset();
  let offsetHours = Math.floor(Math.abs(offsetMinutes) / 60);
  let offsetMinutesRemaining = Math.abs(offsetMinutes) % 60;
  let offset = "+0000";
  formattedDate += offset;
  return formattedDate;
}
export class DebtController {
  private createDebtUseCase: CreateDebtUseCase;

  constructor() {
    const httpService = new HttpService();
    this.createDebtUseCase = new CreateDebtUseCase(httpService);
  }

  async createDebt(req: any, res: any) {
    const { docId, value, label, user, cart } = req.body;
    let start: Date | string = new Date();
    let end: Date | string = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    // convert start and end dates to ISO format for Adamspay API like this start: cut the Z and add 0
    start = formatDateToCustomFormat(start);
    end = formatDateToCustomFormat(end);

    const debtData = {
      debt: {
        user,
        docId,
        amount: {
          currency: "PYG",
          value,
        },
        label,
        validPeriod: {
          start: start,
          end: end,
        },
      },
    };

    try {
      const result = await this.createDebtUseCase.execute(debtData);
      // console.log(result)
      const createdCart = await prisma.cart.create({
        data: {
          productIds: cart.map((item: any) => item.id),
          quantities: cart.map((item: any) => item.quantity),
          totalCost: value,
          debtId: Number(result.debt.docId), // Ensure this is correctly set
          userId: user,
        },
      });
  
      res.json(result);
    } catch (error: any) {
      console.log(error)
      res.status(500).json({ error: error.message });
    }
  }
  async getDebts(req: any, res: any) {
    try {
      const { status } = req.params;
  
      if (status === 'paid') {
        const paidDebts = await prisma.debt.findMany({
          where: { status: 'PAID' },
        });
        return res.json( paidDebts );
      }
  
      if (status === 'pending') {
        const pendingDebts = await prisma.debt.findMany({
          where: { status: 'PENDING' },
        });
        return res.json( pendingDebts );
      }
  
      if (status === 'all') {
        const paidDebts = await prisma.debt.findMany({
          where: { status: 'PAID' },
        });
  
        const pendingDebts = await prisma.debt.findMany({
          where: { status: 'PENDING' },
        });
  
        return res.json({
          paidDebts,
          pendingDebts,
        });
      }
  
      res.status(400).json({ error: 'Invalid status parameter' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
