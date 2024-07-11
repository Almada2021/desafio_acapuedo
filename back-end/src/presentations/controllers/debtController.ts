// src/presentation/controllers/DebtController.ts
import { CreateDebtUseCase } from "../../application/CreateDebtUseCase";
import { HttpService } from "../../infrastructure/httpService";
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
    const { docId, value, label, user } = req.body;
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
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
  async getDebts(req: any, res: any) {
    
  }
}
