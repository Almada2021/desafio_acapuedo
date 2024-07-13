import { useEffect, useState } from "react";
import { useUser } from "./useUser";

export interface Debt {
  id: string;
  label: string;
  value: number;
  payUrl: string;
  createdAt: string;
}

export interface Debts {
  paidDebts?: Debt[];
  pendingDebts?: Debt[];
}

export const useFetchDebts = (endpoint: string) => {
  const { user } = useUser();
  const [debts, setDebts] = useState<Debts>({
    paidDebts: [],
    pendingDebts: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDebts = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/${endpoint}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user?.token}`,
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
  }, [endpoint, user]);

  return { debts: debts.paidDebts, loading, error };
};