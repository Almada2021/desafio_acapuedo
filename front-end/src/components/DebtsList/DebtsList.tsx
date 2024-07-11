import { Box, CircularProgress, Typography } from "@mui/material";
import DebtCard from "../DebtCard/DebtCard";
import useDebts from "../../hooks/useDebts";
import { useUser } from "../../hooks/useUser";

const DebtList = () => {
  const { debts, loading, error } = useDebts();
  const  { user } = useUser();
  if (!user) {
    return <Typography color="error">Por favor ingresa para tener tus compras.</Typography>;
  }
  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Box
      component="section"
      p={2}
      display="flex"
      justifyContent="center"
      alignItems="center"
      mx="auto" 
      gap={2}
      my={2}
      flexWrap="wrap"
      padding={2}
    >
      {debts.map((debt) => (
        <DebtCard key={debt.id} debt={debt} />
      ))}
    </Box>
  );
};

export default DebtList;