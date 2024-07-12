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
  try {
    if (req.method !== 'POST' || req.headers['content-type'] !== 'application/json') {
      throw new Error('Request inválido');
    }
    const content = JSON.stringify(req.body);
    const sentHash = req.headers['x-adams-notify-hash'] as string;
    const myHash = crypto.createHash('md5').update('adams' + content + API_SECRET).digest('hex');
    if (sentHash !== myHash) {
      throw new Error('Firma inválida');
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
    res.status(500).json({ info: 'Error', exception: e.message, line: e.line, trace: e.stack });
  }
});

async function procesarEstadoDeuda(debt: any, res: Response) {
  try {
    const { docId, payStatus } = debt;
    const existingDebt = await prisma.debt.findUnique({
      where: { id: docId }
    });

    if (!existingDebt) {
      throw new Error('Deuda no encontrada');
    }

    if (new Date(payStatus.time) > new Date(existingDebt.updatedAt)) {
      await prisma.debt.update({
        where: { id: docId },
        data: { status: payStatus.status }
      });
      console.log(`Estado de deuda actualizado para la deuda ${docId}`);
      res.status(200).json({ info: 'Estado de deuda procesado', debt });
    } else {
      res.status(400).json({ info: 'El estado de la deuda no es más reciente' });
    }
  } catch (e: any) {
    res.status(500).json({ info: 'Error al procesar el estado de la deuda', exception: e.message });
  }
}
export class Server {
  public static start() {
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  }
}
