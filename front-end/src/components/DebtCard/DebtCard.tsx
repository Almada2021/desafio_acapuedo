// src/components/DebtCard/DebtCard.tsx
import { Card, CardContent, Typography } from "@mui/material";
import { Debt } from "../../lib/entities/Debt";
import { Link } from "wouter";

interface DebtCardProps {
  debt: Debt;
}

const DebtCard = ({ debt }: DebtCardProps) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="div">
          {debt.label}
        </Typography>
        <Typography color="textSecondary">
          Valor: {debt.value.toLocaleString()} Gs
        </Typography>
        <Typography color="textSecondary">
          Creada: {new Date(debt.createdAt).toLocaleDateString()}
        </Typography>
        <Link
            href={`/debts/${debt.id}`}
        >
          Obtener informacion
        </Link>
      </CardContent>
    </Card>
  );
};

export default DebtCard;
