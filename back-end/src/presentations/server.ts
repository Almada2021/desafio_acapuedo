import express from "express";
import userRoutes from "./routes/userRoutes";
import cors from "cors";
import debtRoutes from './routes/debtRoutes';
import productRoutes from './routes/productRoutes';
import bodyParser from 'body-parser';
const app = express();

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use("/api", userRoutes);
app.use("/api", debtRoutes);
app.use("/api", productRoutes);
app.post("/hook", (req, res) => {
  console.log(req.body) // Call your action on the request here
  res.status(200).end() // Responding is important
})

// !idea de ruta que active notificacion y en caso de cambio de estado del deudor enviar email o notificación
export class Server {
  public static start() {
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  }
}
