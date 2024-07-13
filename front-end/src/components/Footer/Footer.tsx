import { Box, Typography, Link } from "@mui/material";

const Footer = () => {
  return (
    <Box
      component="footer"
      p={2}
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      bgcolor="primary.main"
      color="white"
    >
      <Typography variant="body2">
        &copy; {new Date().getFullYear()} Tienda de Don Onofre. Todos los derechos para su libre uso.<a href="https://github.com/almada2021/">Github</a>
      </Typography>
      <Box>
        <Link href="/inicio" color="inherit" underline="none" mx={1}>
          Inicio
        </Link>
        <Link href="/compras" color="inherit" underline="none" mx={1}>
          Compras
        </Link>
        <Link href="/cart" color="inherit" underline="none" mx={1}>
          Carrito
        </Link>
      </Box>
    </Box>
  );
};

export default Footer;