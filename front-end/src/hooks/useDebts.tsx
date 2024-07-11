import { useEffect, useState } from "react";
import { Debt } from "../lib/entities/Debt";
import { useUser } from "./useUser";

const useDebts = () => {
  const { user } = useUser();
  const [debts, setDebts] = useState<Debt[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDebts = async () => {
      if (!user) return;

      try {
        const response = await fetch(`http://localhost:3000/api/debts/${user.id}`);
        const data = await response.json();
        setDebts(data);
      } catch (error) {
        setError("Error fetching debts");
      } finally {
        setLoading(false);
      }
    };

    fetchDebts();
  }, [user]);

  return { debts, loading, error };
};

export default useDebts;