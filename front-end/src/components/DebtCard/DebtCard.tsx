// src/components/DebtCard/DebtCard.tsx
import { Box, Card, CardContent, Typography } from "@mui/material";
import { Debt } from "../../lib/entities/Debt";
import { Link } from "wouter";

interface DebtCardProps {
  debt: Debt;
}

const DebtCard = ({ debt }: DebtCardProps) => {
  const statusMap: { [key: string]: string } = {
    PENDING: "Pendiente",
    PAID: "Pagado",
    FAILED: "Fallido",
  };
  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="div">
          {debt.label}
        </Typography>
        <Typography color="textSecondary">
          Valor: {debt.value.toLocaleString()} Gs
        </Typography>

        <Typography color="textSecondary" style={{display: "flex"}}>
          Estado:
          <div
            style={{
              backgroundColor:
                debt.status === "PAID"
                  ? "green"
                  : debt.status === "PENDING"
                  ? "orange"
                  : "red",
                
              borderRadius: "4px",
              color: "white",
              padding: "4px 8px",
              margin: "0 4px",
              fontSize: "12px",
              fontWeight: "bold",
              textTransform: "uppercase",
            }}
          >
            {statusMap[debt.status] || debt.status}
          </div>
        </Typography>
        <Typography color="textSecondary">
          URL De Pago: <a href={debt.payUrl}>Link</a>
        </Typography>
        <Typography color="textSecondary">
          Creada: {new Date(debt.createdAt).toLocaleString()}
        </Typography>
        <Box display="flex" gap={2}>
          <Link href={`/debts/${debt.id}`}>Obtener informacion</Link>
          <Link href={`/cart/${debt.id}`}>Ver Pedido</Link>
        </Box>
      </CardContent>
    </Card>
  );
};

export default DebtCard;
