import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

export type Href = '/' | '/login' | '/otp' | '/business' | '/needs' | '/location' | '/shop' | '/delivery';

type AppRouterValue = {
  href: Href;
  push: (href: Href) => void;
  replace: (href: Href) => void;
  back: () => void;
  canGoBack: () => boolean;
};

const AppRouterContext = createContext<AppRouterValue | null>(null);

function initialHref(): Href {
  if (typeof window === 'undefined') return '/login';
  if (window.location.hash === '#delivery') return '/delivery';
  if (window.location.hash === '#business') return '/business';
  if (window.location.hash === '#shop') return '/shop';
  return '/login';
}

export function AppRouterProvider({ children }: { children: ReactNode }) {
  const [stack, setStack] = useState<Href[]>(() => [initialHref()]);
  const stackRef = useRef(stack);
  stackRef.current = stack;
  const href = stack[stack.length - 1] ?? '/';
  const push = useCallback((next: Href) => {
    setStack((current) => [...current, next]);
  }, []);
  const replace = useCallback((next: Href) => {
    setStack((current) => [...(current.length > 1 ? current.slice(0, -1) : []), next]);
  }, []);
  const back = useCallback(() => {
    setStack((current) => (current.length > 1 ? current.slice(0, -1) : current));
  }, []);
  const canGoBack = useCallback(() => stackRef.current.length > 1, []);
  const value = useMemo<AppRouterValue>(
    () => ({ href, push, replace, back, canGoBack }),
    [href, push, replace, back, canGoBack],
  );
  return <AppRouterContext.Provider value={value}>{children}</AppRouterContext.Provider>;
}

export function useAppRouter() {
  const value = useContext(AppRouterContext);
  if (!value) throw new Error('useAppRouter must be used inside AppRouterProvider');
  return value;
}

export function Redirect({ href }: { href: Href }) {
  const { replace } = useAppRouter();
  useEffect(() => {
    replace(href);
  }, [href, replace]);
  return null;
}
