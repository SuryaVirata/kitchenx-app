import { createContext, ReactNode, useContext, useState } from 'react';

const SplashReadyContext = createContext<{ ready: boolean; setReady: (ready: boolean) => void } | null>(null);

export function SplashReadyProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  return <SplashReadyContext.Provider value={{ ready, setReady }}>{children}</SplashReadyContext.Provider>;
}

export function useSplashReady() {
  return useContext(SplashReadyContext)?.ready ?? false;
}

export function useSetSplashReady() {
  const value = useContext(SplashReadyContext);
  if (!value) throw new Error('useSetSplashReady must be used inside SplashReadyProvider');
  return value.setReady;
}
