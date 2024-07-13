import express, { Request, Response } from "express";
import userRoutes from "./routes/userRoutes";
import cors from "cors";
import crypto from "crypto";
import debtRoutes from './routes/debtRoutes';
import productRoutes from './routes/productRoutes';
import cartRoutes from './routes/cartRoutes';
import bodyParser from 'body-parser';
import prisma from "../infrastructure/prismaClient";
import { Cart } from "@prisma/client";
const app = express();
const API_SECRET = process.env.API_KEY;

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use("/api", userRoutes);
app.use("/api", debtRoutes);
app.use("/api", productRoutes);
app.use("/api", cartRoutes)

app.post("/hook", (req: Request, res: Response) => {
  try {
    if (req.method !== 'POST' || req.headers['content-type'] !== 'application/json') {
      throw new Error('Request inválido');
    }
    const post = req.body;
    const notify = post.notify;
    if (!notify || !notify.type) {
      throw new Error('Formato inválido');
    }
    if (notify.type === 'debtStatus') {
      return procesarEstadoDeuda(post.debt, res);
    }
    res.status(202).json({ info: 'No procesamos esta notificación' });
  } catch (e: any) {
    console.error('Error en el hook:', e.message);
    res.status(204).json({ info: 'Error', exception: e.message, line: e.line, trace: e.stack });
  }
});
enum PayStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  FAILED = 'FAILED',
}
async function procesarEstadoDeuda(debt: any, res: Response) {
  try {
    const { docId, payStatus } = debt;
    let newStatus: "PENDING" | "PAID" | "FAILED" = payStatus.status.toUpperCase();
    let id = Number(docId);
    const existingDebt = await prisma.debt.findUnique({
      where: { id }
    });

    if (!existingDebt) {
      throw new Error('Deuda no encontrada');
    }

    if (new Date(payStatus.time) > new Date(existingDebt.updatedAt)) {
      const updated = await prisma.debt.update({
        where: { id },
        data: { status: PayStatus[newStatus] },
      });
      const carts: Cart[] = await prisma.cart.findMany({
        where: { debtId: id },
      });
      
      if (carts.length === 0) {
        throw new Error('Carrito no encontrado');
      }
      
      for (const cart of carts) {
        for (let i = 0; i < cart.productIds.length; i++) {
          await prisma.product.update({
            where: { id: cart.productIds[i] },
            data: { stock: { decrement: cart.quantities[i] } },
          });
        }
      }

      res.status(200).json({ info: 'Estado de deuda procesado', debt });
    } else {
      res.status(204).json({ info: 'El estado de la deuda no es más reciente' });
    }
  } catch (e: any) {
    console.error('Error en el procesamiento del estado de la deuda:', e.message);
    res.status(203).json({ info: 'Error al procesar el estado de la deuda', exception: e.message });
  }
}
export class Server {
  public static start() {
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  }
}