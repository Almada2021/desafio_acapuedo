import { Button, Stack, TextField, Typography } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useUser } from "../../hooks/useUser";
import { Link } from "wouter";

const LoginUserForm = ({url = "/api/login"}: {url?: string}) => {
  const { setUser } = useUser();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email address").required("Required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Required"),
    }),
    onSubmit: async (values) => {
      const response = await fetch(`${import.meta.env.VITE_API_URL}${url}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      const data = await response.json();
      setUser({...data?.user, token: data?.token }); 
    },
  });

  return (
    <Stack
      component="form"
      onSubmit={formik.handleSubmit}
      spacing={2}
      sx={{ p: 2, boxShadow: 3, width: "400px", margin: "auto" }}
    >
      {url != "/api/login" && (<Typography variant="h5" textAlign="center"> Admin </Typography>)}
      <TextField
        fullWidth
        label="Email"
        name="email"
        value={formik.values.email}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.email && Boolean(formik.errors.email)}
        helperText={formik.touched.email && formik.errors.email}
        required
      />
      <TextField
        fullWidth
        label="Contraseña"
        type="password"
        name="password"
        value={formik.values.password}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.password && Boolean(formik.errors.password)}
        helperText={formik.touched.password && formik.errors.password}
        required
      />
      <Button type="submit" variant="contained" color="primary">
        Iniciar Sesión
      </Button>
      <Typography variant="body2" color="textSecondary" align="center">
        {url === "/api/login" && (
          <>
          ¿Eres El Administrador? <Link href="/admin">Entra</Link>
          </>
        )}  
      </Typography>
    </Stack>
  );
};

export default LoginUserForm;