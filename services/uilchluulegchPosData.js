import React, {
  useState,
  useContext,
  createContext,
  useMemo,
  useEffect,
} from "react";

const AuthContext = createContext({});

export function PosDataProvider({ children }) {
  const [posData, setPosData] = useState([]);

  const contextValue = useMemo(
    () => ({ posData, setPosData }),
    [posData, setPosData]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

export const usePosData = () => useContext(AuthContext);
