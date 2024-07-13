import { useEffect, useState } from "react";
import { Redirect, useParams } from "wouter";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Button,
} from "@mui/material";
import { useUser } from "../../hooks/useUser";
import jsPDF from "jspdf";

interface Product {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

const CartDetail = () => {
  const { user } = useUser();
  const { id } = useParams();
  const [cart, setCart] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/carts/${id}`
        );
        const data = await response.json();
        setCart(data.products);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [id]);

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text("DON ONOFRE", 20, 10);
    doc.text(`~${user?.name}`, 80, 10);
    const total = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (doc as any).autoTable({
      head: [["Nombre", "Cantidad", "Precio", "Subtotal"]],
      body: cart.map((item) => [
        item.name,
        item.quantity,
        item.price.toLocaleString() + " Gs",
        (item.price * item.quantity).toLocaleString() + " Gs",
      ]),
      foot: [["", "", "Total", total.toLocaleString() + " Gs"]],
    });
    doc.save("boleta.pdf");
  };
  if (!user) {
    return <Redirect to="/login" />;
  }

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Box component="section" padding={{ xs: 2, sm: 6, md: 10 }}>
      <Button
        variant="contained"
        color="primary"
        onClick={downloadPDF}
        sx={{ mb: 2 }}
      >
        Descargar Boleta
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell align="right">Cantidad</TableCell>
              <TableCell align="right">Precio</TableCell>
              <TableCell align="right">Subtotal</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cart.map((item) => (
              <TableRow key={item.id}>
                <TableCell component="th" scope="row">
                  {item.name}
                </TableCell>
                <TableCell align="right">{item.quantity}</TableCell>
                <TableCell align="right">
                  {item.price.toLocaleString()} Gs
                </TableCell>
                <TableCell align="right">
                  {(item.price * item.quantity).toLocaleString()} Gs
                </TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell colSpan={3} align="right">
                <strong>Total</strong>
              </TableCell>
              <TableCell align="right">
                <strong>
                  {cart
                    .reduce((sum, item) => sum + item.price * item.quantity, 0)
                    .toLocaleString()}{" "}
                  Gs
                </strong>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default CartDetail;
