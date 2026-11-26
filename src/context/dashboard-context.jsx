import { createContext, useContext, useState, useEffect } from "react";
import { subdomainAPI } from "@/lib/api";
import { DEMO_SUBDOMAINS, IS_LOCAL_DEMO } from "@/lib/demo-data";

const DashboardContext = createContext();

export function DashboardProvider({ children }) {
  const [subdomains, setSubdomains] = useState(
    IS_LOCAL_DEMO ? DEMO_SUBDOMAINS : []
  );
  const [loading, setLoading] = useState(!IS_LOCAL_DEMO);
  const [error, setError] = useState(null);

  const fetchSubdomains = async () => {
    if (IS_LOCAL_DEMO) {
      setSubdomains(DEMO_SUBDOMAINS);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await subdomainAPI.list();
      setSubdomains(data);
    } catch (err) {
      console.error("Failed to fetch subdomains:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!IS_LOCAL_DEMO) {
      fetchSubdomains();
    }
  }, []);

  const refresh = () => {
    fetchSubdomains();
  };

  return (
    <DashboardContext.Provider
      value={{
        subdomains,
        setSubdomains,
        loading,
        error,
        refresh,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useDashboard = () => useContext(DashboardContext);
