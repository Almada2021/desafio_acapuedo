import { useEffect, useState } from "react";
interface UserInfo {
    name: string;
    email: string;
}
export default function useUniqueUser ({id}: {id: string | number | undefined}) {
    const [user, setUser] = useState<UserInfo | null>({ name: "", email: ""  });
    const [loading, setLoading] = useState<boolean>(false);
    const fetchUser = async () => {
      setLoading(true); // Set loading to true before starting the fetch
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/${id}`);
        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false); // Set loading to false after the fetch is complete
      }
    };
  
    useEffect(() => {
        if(id === undefined) {
            setUser({name:"", email: ""});
        }else {
            fetchUser();
        }
    }, [id]);
  
    return { user, loading, fetchUser };
}
