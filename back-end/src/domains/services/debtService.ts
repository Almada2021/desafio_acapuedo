import prisma from "../../infrastructure/prismaClient";
type DebtData = {
    user: number;
    docId: string;
    amount: {
      currency: string;
      value: number;
    };
    label: string;
    validPeriod: {
      start: string;
      end: string;
    };
  };
  
export async function getDebt(userId: number) {
    const debts = await prisma.debt.findMany({
      where: { userId },
    });
    return debts;
}
export async function createDebt(debtData: DebtData) {
  const { user, label, amount } = debtData;
  const debt = await prisma.debt.create({
    data: {
      userId: user,
      value: amount.value,
      label,
      status: "PENDING", // Asumiendo que tienes un campo de estado
      payUrl: "", // Asumiendo que tienes un campo de URL de pago
    },
  });
  return debt;
}
