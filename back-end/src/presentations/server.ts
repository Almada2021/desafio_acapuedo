import express, { Request, Response } from "express";
import userRoutes from "./routes/userRoutes";
import cors from "cors";
import crypto from "crypto";
import debtRoutes from './routes/debtRoutes';
import productRoutes from './routes/productRoutes';
import bodyParser from 'body-parser';
import prisma from "../infrastructure/prismaClient";
const app = express();
const API_SECRET = process.env.API_KEY;

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use("/api", userRoutes);
app.use("/api", debtRoutes);
app.use("/api", productRoutes);


app.post("/hook", (req: Request, res: Response) => {
  console.log("Request recibido en el hook");
  try {
    if (req.method !== 'POST' || req.headers['content-type'] !== 'application/json') {
      throw new Error('Request inválido');
    }
    console.log('Hash recibido:', req.headers['x-adams-notify-hash']);
    const content = JSON.stringify(req.body);
    const sentHash = req.headers['x-adams-notify-hash'] as string;
    const myHash = crypto.createHash('md5').update('adams' + content + process.env.APP_SECRET).digest('hex');
    console.log('Hash calculado:', myHash);
    // if (sentHash !== myHash) {
    //   throw new Error('Firma inválida');
    // }
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
  // EXPIRED = 'VENCIDO',
}
async function procesarEstadoDeuda(debt: any, res: Response) {
  try {
    console.log(`Recibido cambio de estado de la deuda ${debt}`);
    const { docId, payStatus } = debt;
    let newStatus: "PENDING" | "PAID" = payStatus.status.toUpperCase();
    let id =Number(docId)
    console.log(docId, newStatus)
    const existingDebt = await prisma.debt.findUnique({
      where: { id }
    });

    if (!existingDebt) {
      throw new Error('Deuda no encontrada');
    }

    const updated = await prisma.debt.update({
      where: { id },
      data: { status: PayStatus[newStatus] },
    });
    console.log(`Deuda actualizada: ${updated.status}`);
    if (new Date(payStatus.time) > new Date(existingDebt.updatedAt)) {
      console.log(`Estado de deuda actualizado para la deuda ${docId}`);
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
