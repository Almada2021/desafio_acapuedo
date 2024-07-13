import { useEffect, useState } from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import { Link } from "wouter";

interface DebtDetailProps {
  id: string;
}

interface Debt {
  docId: string;
  label: string;
  slug: string;
  payUrl: string;
  amount: {
    currency: string;
    value: string;
    paid: string;
  };
  exchangeRate: string | null;
  target: {
    type: string | null;
    number: string | null;
    label: string | null;
  };
  description: string | null;
  validPeriod: {
    start: string;
    end: string;
  };
  payStatus: {
    status: string;
    code: string | null;
    time: string;
    text: string | null;
  };
  statusHash: string;
  attr: string | null;
  uiTheme: string | null;
  objId: string;
  objStatus: {
    status: string;
    code: string | null;
    time: string;
    text: string | null;
  };
  created: string;
  updated: string;
  refs: {
    txList: Array<{
      txId: string;
      type: string;
      objStatus: {
        status: string;
        code: string | null;
        time: string;
        text: string;
      };
      provider: string;
      method: string;
      material: string;
      correlationId: string;
      providerStatus: {
        time: string;
        resultCode: string;
        authCode: string;
        message: string;
      };
      origAmount: {
        currency: string;
        value: string;
      };
      realAmount: {
        currency: string;
        value: string;
      };
      exchangeRate: string | null;
      initiator: string;
      created: string;
      updated: string;
      expires: string;
      verified: string | null;
      finalized: string;
      custody: string;
      meta: {
        objId: string;
      };
    }>;
  };
  meta: {
    merchantObjId: string;
    appObjId: string;
    firstTxObjId: string;
    lastTxObjId: string;
  };
}

const DebtDetail = ({ id }: DebtDetailProps) => {
  const [debt, setDebt] = useState<Debt | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const statusMap: { [key: string]: string } = {
    pending: "Pendiente",
    paid: "Pagado",
    failed: "Fallido",
  };
  useEffect(() => {
    const fetchDebt = async () => {
      try {
        const response = await fetch(
          `https://staging.adamspay.com/api/v1/debts/${id}`,
          {
            method: 'GET',
            headers: { 
                'apikey': import.meta.env.VITE_API_KEY
            }
          }
        );
        const data = await response.json();
        setDebt(data.debt);
      } catch (err) {
        setError("Error al obtener los detalles de la deuda");
      } finally {
        setLoading(false);
      }
    };

    fetchDebt();
  }, [id]);

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }
  
  return (
    <Box>
      {debt ? (
        <>
          <Typography variant="h4">Detalles de la Compra</Typography>
          <Typography>Etiqueta: {debt.label}</Typography>
          <Typography>URL de Pago: <a href={debt.payUrl}>Link</a></Typography>
          <Typography>Monto: {Number(debt.amount.value)} {debt.amount.currency}</Typography>
          <Typography display="flex">Estado del Pago:  <div
            style={{
              backgroundColor:
                debt.payStatus.status.toUpperCase() === "PAID"
                  ? "green"
                  : debt.payStatus.status.toUpperCase() === "PENDING"
                  ? "orange"
                  : "red",
                
              borderRadius: "4px",
              color: "white",
              padding: "4px 8px",
              margin: "0 4px",
              fontSize: "12px",
              fontWeight: "bold",
              textTransform: "uppercase",
            }}
          >
            {statusMap[debt.payStatus.status] || debt.payStatus.status}
          </div></Typography>
          <Typography>Creado: {new Date(debt.created).toLocaleString()}</Typography>
          <Typography>Productos Pedidos: <Link href={`/cart/${id}`}>Boleta</Link></Typography>
        </>
      ) : (
        <Typography>No se encontraron detalles de la Compra</Typography>
      )}
    </Box>
  );
};

export default DebtDetail;