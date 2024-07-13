import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import {
  Button,
  CardActionArea,
  CardActions,
  IconButton,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import Product from "../../lib/entities/Product";
import { useCart } from "../../hooks/useCart";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useState } from "react";
import { useLocation } from "wouter";

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart, cart } = useCart();
  const [quantity, setQuantity] = useState<number>(cart.find((item) => item.id === product.id)?.quantity || 0);
  const [open, setOpen] = useState<boolean>(false);
  const [, navigate] = useLocation();

  const changeQuantity = (change: string | number) => {
    if (quantity <= 0 && change === "-1") return;
    if(quantity + Number(change) > product.stock) return;
    setQuantity(quantity + Number(change));
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    if (quantity > 0 && product.stock >= quantity ) {
      setOpen(true);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Card sx={{ maxWidth: 345, margin: 2 }}>
      <CardActionArea>
        <CardMedia
          component="img"
          height="140"
          image={
            product.imageUrl ||
            "https://i.pinimg.com/564x/45/f2/79/45f279dd0b673c1f695b4d950b433a48.jpg"
          }
          alt={product.name}
          sx={{ width: "300px", objectFit: "cover" }}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {product.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Precio: {product.price.toLocaleString()}&nbsp;Gs
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Stock: {product.stock}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions style={{ justifyContent: "center" }}>
        <IconButton color="inherit" onClick={() => changeQuantity("-1")}>
          <RemoveIcon />
        </IconButton>
        <TextField
          inputProps={{
            min: 0,
            style: { textAlign: "center", maxWidth: "60px", maxHeight: "30px" },
          }}
          id="outlined-basic"
          onChange={(e) => {
            if(product.stock >= Number(e.target.value)){
              setQuantity(Number(e.target.value))
            }
          }}
          value={quantity}
          // type="number"
          variant="outlined"
        />
        <IconButton color="inherit" onClick={() => changeQuantity("1")}>
          <AddIcon />
        </IconButton>
      </CardActions>
      <CardActions style={{ justifyContent: "center" }}>
        <Button
          size="medium"
          variant="outlined"
          color="primary"
          onClick={handleAddToCart}
        >
          Agregar
        </Button>
      </CardActions>
      <Dialog open={open} onClose={handleClose} maxWidth="md"  fullWidth>
        <DialogTitle>Producto agregado al carrito</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¡Has agregado {quantity} unidades de {product.name} al carrito!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Seguir comprando
          </Button>
          <Button
            color="primary"
            variant="outlined"
            startIcon={<ShoppingCartIcon />}
            onClick={() => navigate("/cart")}
          >
            Ir a Pagar
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}
