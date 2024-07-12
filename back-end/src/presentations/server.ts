import express, { Request, Response } from "express";
import userRoutes from "./routes/userRoutes";
import cors from "cors";
import crypto from "crypto";
import debtRoutes from './routes/debtRoutes';
import productRoutes from './routes/productRoutes';
import bodyParser from 'body-parser';
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

function procesarEstadoDeuda(debt: any, res: Response) {
  // Aquí puedes procesar el estado de la deuda según sea necesario
  // Por ejemplo, actualizar el estado de la deuda en tu base de datos
  console.log(`Recibimos notificación de estado deuda para la deuda ${debt}`)
  // Ejemplo de respuesta
  res.status(200).json({ info: 'Estado de deuda procesado', debt });
}


export class Server {
  public static start() {
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  }
}
