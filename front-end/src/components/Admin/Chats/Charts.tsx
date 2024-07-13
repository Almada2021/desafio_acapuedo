import { useEffect, useState } from "react";
import { Box, Typography, CircularProgress, Grid, Button } from "@mui/material";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useUser } from "../../../hooks/useUser";

interface Debt {
  id: number;
  value: number;
  createdAt: string;
}

const SalesChart = () => {
  const [debts, setDebts] = useState<Debt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useUser();
  const [showDayChart, setShowDayChart] = useState(true);

  useEffect(() => {
    const fetchDebts = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/history/paid`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${user?.token}`,
            },
          }
        );
        const data = await response.json();
        setDebts(data);
      } catch (err) {
        setError("Error fetching debt history");
      } finally {
        setLoading(false);
      }
    };

    fetchDebts();
  }, [user?.token]);

  const processSalesData = (debts: Debt[]) => {
    const salesByDay: { [key: string]: number } = {};
    const salesByHour: { [key: string]: number } = {};

    debts.forEach((debt) => {
      const date = new Date(debt.createdAt);
      const day = date.toISOString().split('T')[0];
      const hour = date.getHours().toString();

      if (!salesByDay[day]) salesByDay[day] = 0;
      if (!salesByHour[hour]) salesByHour[hour] = 0;

      salesByDay[day] += debt.value;
      salesByHour[hour] += debt.value;
    });

    return { salesByDay, salesByHour };
  };

  const { salesByDay, salesByHour } = processSalesData(debts);

  const dayData = Object.keys(salesByDay).map(day => ({
    date: day,
    ventas: salesByDay[day],
  }));

  const hourData = Object.keys(salesByHour).map(hour => ({
    time: `${hour}:00`,
    ventas: salesByHour[hour],
  }));

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Box>
      <Button onClick={() => setShowDayChart(!showDayChart)}>
        {showDayChart ? "Mostrar Ventas por Hora" : "Mostrar Ventas por Día"}
      </Button>
      <Grid container spacing={4}>
        {showDayChart ? (
          <Grid item xs={12}>
            <Typography variant="h4" sx={{ minWidth: "150px" }}>Ventas por Día</Typography>
            <ResponsiveContainer width="100%" height={500}>
              <LineChart data={dayData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="ventas" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </Grid>
        ) : (
          <Grid item xs={12}>
            <Typography variant="h4" sx={{ width: '98vw' }}>Ventas por Hora</Typography>
            <ResponsiveContainer width="100%" height={500}>
              <LineChart data={hourData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="ventas" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default SalesChart;