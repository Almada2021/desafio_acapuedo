import { Redirect, Route, Switch, useLocation, useSearch } from "wouter";
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
import LoadingOverlay from "./components/LoadingOverlay/LoadingOverlay";
import Footer from "./components/Footer/Footer";
import CartDetail from "./components/CartDetail/CartDetail";
import Admin from "./components/Admin/Admin";
function App() {
  const { user } = useUser();
  const searchParams = useSearch();
  const docId = new URLSearchParams(searchParams).get("doc_id");
  const { products, loading } = useProducts();
  const [location] = useLocation();
  if (docId) {
    return <Redirect href={`/debts/${docId}`} />;
  }
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
        <Route path="/dashboard">
          <Admin/>
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
        <Route path="/cart/:id">
          <Box component="section" padding={{ xs: 2, sm: 6, md: 10 }}>
            <CartDetail />
          </Box>
        </Route>
        <Route path="/cart">
          <Box component="section" padding={{ xs: 2, sm: 6, md: 10 }}>
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
          <Box minHeight="90svh">
            <Box
              component="section"
              p={2}
              display="flex"
              justifyContent="center"
              flexWrap="wrap"
              padding={2}
            >
              {loading && <LoadingOverlay />}
              {products.map((product: Product) => (
                <ProductCard key={product?.id} product={product} />
              ))}
            </Box>
          </Box>
          <Footer />
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
