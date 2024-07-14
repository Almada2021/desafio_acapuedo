import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, CircularProgress } from "@mui/material";
import { useUser } from "../../../hooks/useUser";

interface Debt {
  id: string;
  label: string;
  value: number;
  payUrl: string;
  createdAt: string;
}

interface Debts {
  paidDebts: Debt[];
  pendingDebts: Debt[];
}

const useFetchDebts = (endpoint: string) => {
  const { user } = useUser();
  const [debts, setDebts] = useState<Debts>({ paidDebts: [], pendingDebts: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDebts = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/${endpoint}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${user?.token}`,
          },
        });
        const data = await response.json();
        setDebts(data);
      } catch (err) {
        setError("Error fetching debt history");
      } finally {
        setLoading(false);
      }
    };

    fetchDebts();
  }, [endpoint, user]);

  return { debts, loading, error };
};

const DebtHistory = () => {
  const { debts, loading, error } = useFetchDebts("history/all");

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  const calculateTotal = (debts: Debt[]) => debts.reduce((total, debt) => total + debt.value, 0);

  return (
    <div style={{ overflow: "scroll", maxHeight: "80svh"}}>
      <Typography variant="h4">Historial de Deudas</Typography>
      <Typography variant="h6">Deudas Pagadas</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Etiqueta</TableCell>
              <TableCell>Monto</TableCell>
              <TableCell>URL de Pago</TableCell>
              <TableCell>Fecha de Creación</TableCell>
              <TableCell>Ver Pedido</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {debts.paidDebts.map((debt) => (
              <TableRow key={debt.id}>
                <TableCell>{debt.id}</TableCell>
                <TableCell>{debt.label}</TableCell>
                <TableCell>{debt.value.toLocaleString()}</TableCell>
                <TableCell><a href={debt.payUrl}>{debt.payUrl}</a></TableCell>
                <TableCell>{new Date(debt.createdAt).toLocaleString()}</TableCell>
                <TableCell><a href={`/cart/${debt.id}`}>Ver Pedido</a></TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell colSpan={2}>Total</TableCell>
              <TableCell>{calculateTotal(debts.paidDebts).toLocaleString()}</TableCell>
              <TableCell colSpan={3}></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      <Typography variant="h6">Deudas Pendientes</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Etiqueta</TableCell>
              <TableCell>Monto</TableCell>
              <TableCell>URL de Pago</TableCell>
              <TableCell>Fecha de Creación</TableCell>
              <TableCell>Ver Pedido</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {debts.pendingDebts.map((debt) => (
              <TableRow key={debt.id}>
                <TableCell>{debt.id}</TableCell>
                <TableCell>{debt.label}</TableCell>
                <TableCell>{debt.value.toLocaleString()}</TableCell>
                <TableCell><a href={debt.payUrl}>{debt.payUrl}</a></TableCell>
                <TableCell>{new Date(debt.createdAt).toLocaleString()}</TableCell>
                <TableCell><a href={`/cart/${debt.id}`}>Ver Pedido</a></TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell colSpan={2}>Total</TableCell>
              <TableCell>{calculateTotal(debts.pendingDebts).toLocaleString()}</TableCell>
              <TableCell colSpan={3}></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default DebtHistory;