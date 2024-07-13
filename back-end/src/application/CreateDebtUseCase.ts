import { createDebt } from "../domains/services/debtService";
import { HttpService } from "../infrastructure/httpService";
import prisma from "../infrastructure/prismaClient";

export class CreateDebtUseCase {
  private httpService: HttpService;

  constructor(httpService: HttpService) {
    this.httpService = httpService;
  }

  async execute(debtData: any): Promise<any> {
    const debt = await createDebt(debtData.debt);
    const response =  await this.httpService.postDebt(debtData, debt);
    const updatedDebt = await prisma.debt.update({
      where: { id: debt.id },
      data: { payUrl: response.debt.payUrl },
    });
    return response;
  }
}