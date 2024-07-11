import { Redirect, Route, Switch, useLocation } from "wouter";
import Navbar from "./components/Navbar";
import Welcome from "./components/Welcome/Welcome";
import { Box } from "@mui/material";
import ProductCard from "./components/ProductCard/ProductCard";
import RegisterUserForm from "./components/RegisterUserForm/RegisterUserForm";
import { useUser } from "./hooks/useUser";
import LoginUserForm from "./components/LoginUserForm/LoginUserForm";
import AddProductForm from "./components/AddProductForm/AddProductForm";
import useProducts from "./hooks/useProducts";
import Product from "./lib/entities/Product";
import CartTable from "./components/Cart/Cart";
import DebtList from "./components/DebtsList/DebtsList";
import DebtDetail from "./components/DebtDetail/DebtDetail";
function App() {
  const { user } = useUser();
  const products = useProducts();
  const [location] = useLocation();
  if (user && location == "/register") {
    return <Redirect href="/inicio" />;
  }
  if (location == "/") {
    return <Redirect href="/inicio" />;
  }

  return (
    <>
      <Navbar />
      <Switch>
        <Route path="/"></Route>
        <Route path="/register">
          {!user ? (
            <Box
              component="section"
              p={2}
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <RegisterUserForm></RegisterUserForm>
            </Box>
          ) : (
            <Redirect href="/" />
          )}
        </Route>
        <Route path="/admin">
          {!user ? (
            <Box
              component="section"
              p={2}
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <LoginUserForm url={"/api/admins/login"}></LoginUserForm>
            </Box>
          ) : (
            <Redirect href="/" />
          )}
        </Route>
        <Route path="/cart">
          <Box component="section" padding={10}>
            <CartTable />
          </Box>
        </Route>
        <Route path="/login">
          {!user ? (
            <Box
              component="section"
              p={2}
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <LoginUserForm></LoginUserForm>
            </Box>
          ) : (
            <Redirect href="/" />
          )}
        </Route>
        <Route path="/inicio">
          {user && <Welcome greetings={user?.name} />}
          <Box
            component="section"
            p={2}
            display="flex"
            flexWrap="wrap"
            padding={2}
          >
            {products.map((product: Product) => (
              <ProductCard key={product?.id} product={product} />
            ))}
          </Box>
        </Route>
        <Route path="/add-product">
          {user?.isAdmin && <AddProductForm></AddProductForm>}
        </Route>
        <Route path="/compras">
          <Box
            component="section"
            p={2}
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="500px"
            flexWrap="wrap"
            padding={2}
          >
            <DebtList />
          </Box>
        </Route>
        <Route path="/debts/:id">
          {(params) => (
            <Box
              component="section"
              p={2}
              display="flex"
              justifyContent="center"
              alignItems="center"
              minHeight="500px"
              flexWrap="wrap"
              padding={2}
            >
              <DebtDetail id={params.id} />
            </Box>
          )}
        </Route>
        <Route>404: No such page!</Route>
      </Switch>
    </>
  );
}

export default App;