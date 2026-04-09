import { createContext, useContext, useState, type ReactNode } from 'react';

interface DevModeContextType {
  devMode: boolean;
  toggleDevMode: () => void;
}

const DevModeContext = createContext<DevModeContextType>({ devMode: false, toggleDevMode: () => {} });

export function DevModeProvider({ children }: { children: ReactNode }) {
  const [devMode, setDevMode] = useState(false);
  return (
    <DevModeContext.Provider value={{ devMode, toggleDevMode: () => setDevMode(v => !v) }}>
      {children}
    </DevModeContext.Provider>
  );
}

export const useDevMode = () => useContext(DevModeContext);
