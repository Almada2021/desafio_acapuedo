import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { Button, CardActionArea, CardActions } from "@mui/material";
import Product from "../../lib/entities/Product";
import { useCart } from "../../hooks/useCart";

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();


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
          {/* <Typography variant="body2" color="text.secondary">
            Stock: {product.stock}
          </Typography> */}
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Button size="small" color="primary" onClick={() => addToCart(product)}>
          Agregar
        </Button>
      </CardActions>
    </Card>
  );
}
