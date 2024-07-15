import { Button, Stack, TextField, Snackbar } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useUser } from "../../hooks/useUser";
import { Redirect } from "wouter";
import { useState } from "react";

const AddProductForm = () => {
  const { user } = useUser();
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: "",
      price: "",
      stock: "",
      imageUrl: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Required"),
      price: Yup.number().required("Required").min(0, "No puede ser negativo el precio"),
      stock: Yup.number().required("Required").min(0, "No puede ser negativo el stock"),
      imageUrl: Yup.string().url("Invalid URL"),
    }),
    onSubmit: async (values) => {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user?.token}`,
        },
        body: JSON.stringify(values),
      });
      if (response.ok) {
        setOpenSnackbar(true);
        return <Redirect to="/" />;
      }
    },
  });

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <>
      <Stack
        component="form"
        onSubmit={formik.handleSubmit}
        spacing={2}
        sx={{ p: 2, boxShadow: 3, width: "400px", margin: "auto" }}
      >
        <TextField
          fullWidth
          label="Nombre"
          name="name"
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.name && Boolean(formik.errors.name)}
          helperText={formik.touched.name && formik.errors.name}
          required
        />
        <TextField
          fullWidth
          label="Precio"
          name="price"
          type="number"
          value={formik.values.price}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.price && Boolean(formik.errors.price)}
          helperText={formik.touched.price && formik.errors.price}
          required
        />
        <TextField
          fullWidth
          label="Stock"
          name="stock"
          type="number"
          value={formik.values.stock}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.stock && Boolean(formik.errors.stock)}
          helperText={formik.touched.stock && formik.errors.stock}
          required
        />
        <TextField
          fullWidth
          label="URL de la Imagen"
          name="imageUrl"
          value={formik.values.imageUrl}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.imageUrl && Boolean(formik.errors.imageUrl)}
          helperText={formik.touched.imageUrl && formik.errors.imageUrl}
        />
        <Button type="submit" variant="contained" color="primary">
          Agregar Producto
        </Button>
      </Stack>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message="Producto agregado exitosamente"
      />
    </>
  );
};

export default AddProductForm;