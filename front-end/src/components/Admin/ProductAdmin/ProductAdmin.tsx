import { useState } from 'react';
import { Button, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import useProducts from '../../../hooks/useProducts';
import Product from '../../../lib/entities/Product';
import { useUser } from '../../../hooks/useUser';
import EditProductForm from './EditProductForm/EditProductForm';

export default function ProductAdmin() {
  const { products, fetchProducts } = useProducts();
  const [open, setOpen] = useState(false);
  const { user } = useUser();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  console.log(selectedProduct);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [productIdToDelete, setProductIdToDelete] = useState<number | null>(null);

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setOpen(true);
  };

  const handleDeleteClick = (id: number) => {
    setProductIdToDelete(id);
    setConfirmOpen(true);
  };

  const handleConfirmClose = () => {
    setConfirmOpen(false);
    setProductIdToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (productIdToDelete !== null) {
      await fetch(`${import.meta.env.VITE_API_URL}/api/products/${productIdToDelete}`, {
        method: 'DELETE',
        headers: {
          "Authorization": `Bearer ${user?.token}`,
        },
      });
      fetchProducts(); // Refresca la lista de productos después de eliminar
      handleConfirmClose();
    }
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedProduct(null);
  };

  return (
    <TableContainer component={Paper} style={{ margin: "20px" }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Nombre</TableCell>
            <TableCell>Precio</TableCell>
            <TableCell>Stock</TableCell>
            <TableCell>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>{product.id}</TableCell>
              <TableCell>{product.name}</TableCell>
              <TableCell>{product.price}</TableCell>
              <TableCell>{product.stock}</TableCell>
              <TableCell>
                <IconButton color="primary" onClick={() => handleEdit(product)}>
                  <EditIcon />
                </IconButton>
                <IconButton color="secondary" onClick={() => handleDeleteClick(product.id)}>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Editar Producto</DialogTitle>
        <DialogContent>
          {selectedProduct && (
            <EditProductForm 
              product={selectedProduct} 
              onClose={handleClose} 
              fetchProducts={fetchProducts} 
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={confirmOpen} onClose={handleConfirmClose}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          ¿Está seguro que desea eliminar este producto?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmClose} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleConfirmDelete} color="secondary">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </TableContainer>
  );
}