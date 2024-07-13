import { useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import RemoveIcon from "@mui/icons-material/Remove";
import { useCart } from "../../hooks/useCart";
import { Button } from "@mui/material";
import { useUser } from "../../hooks/useUser";
import LoadingOverlay from "../LoadingOverlay/LoadingOverlay";
const CartTable = () => {
  const { cart, removeFromCart, decreaseQuantity, resetCart } = useCart();
  const { user } = useUser();
  const [loading, setLoading] = useState(false);

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleCheckout = async () => {
    const total = calculateTotal();
    if (!user) {
      alert("Debes iniciar sesión o Registrarte para realizar la compra");
      return;
    }

    setLoading(true); // Set loading to true before starting the checkout process

    try {
      if(total === 0) {
        return alert("No hay productos en el carrito");
      }
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/debts`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user: user?.id,
            docId: Math.random().toString(36).substr(2, 9),
            value: total,
            label: "Compra de productos a DON ONOFRE",
          }),
        }
      );

      const data = await response.json();
      if (data.meta.status === "success") {
        window.location.href = data.debt.payUrl;
      } else {
        console.error("Error during checkout:", data);
      }
    } catch (error) {
      console.error("Error during checkout:", error);
    } finally {
      setLoading(false); // Set loading to false after the checkout process is complete
      resetCart();
    }
  };

  return (
    <>
      {loading && <LoadingOverlay />} {/* Show the overlay when loading */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell align="right">Cantidad</TableCell>
              <TableCell align="right">Total</TableCell>
              <TableCell align="right">Acciones</TableCell>
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
                  <IconButton
                    color="primary"
                    onClick={() => decreaseQuantity(String(item.id))}
                  >
                    <RemoveIcon />
                  </IconButton>
                  <IconButton
                    color="secondary"
                    onClick={() => removeFromCart(String(item.id))}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell rowSpan={3} />
              <TableCell colSpan={1}>Total</TableCell>
              <TableCell align="right">
                <Typography variant="h6">
                  {calculateTotal().toLocaleString()} Gs
                </Typography>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <Button
        variant="contained"
        color="primary"
        onClick={handleCheckout}
        sx={{ mt: 2 }}
        disabled={loading} // Disable the button while loading
      >
        Pagar
      </Button>
    </>
  );
};

export default CartTable;