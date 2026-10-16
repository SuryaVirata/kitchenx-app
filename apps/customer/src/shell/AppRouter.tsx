import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

export type Href =
  | '/'
  | '/login'
  | '/otp'
  | '/business'
  | '/shop'
  | '/delivery'
  | '/setup'
  | '/pan'
  | '/gst'
  | '/fssai'
  | '/edit-details'
  | '/edit-outlet';

type AppRouterValue = {
  href: Href;
  push: (href: Href) => void;
  replace: (href: Href) => void;
  back: () => void;
  canGoBack: () => boolean;
  popTo: (href: Href) => void;
};

const AppRouterContext = createContext<AppRouterValue | null>(null);

function initialHref(): Href {
  if (typeof window === 'undefined') return '/';
  const hash = window.location.hash;
  if (hash === '#delivery') return '/delivery';
  if (hash === '#business') return '/business';
  if (hash === '#shop') return '/shop';
  if (hash === '#setup') return '/setup';
  if (hash === '#pan') return '/pan';
  if (hash === '#gst') return '/gst';
  if (hash === '#fssai') return '/fssai';
  if (hash === '#edit-details') return '/edit-details';
  if (hash === '#edit-outlet') return '/edit-outlet';
  return '/';
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
  const popTo = useCallback((next: Href) => {
    setStack((current) => {
      const index = current.lastIndexOf(next);
      if (index >= 0) return current.slice(0, index + 1);
      return [...current, next];
    });
  }, []);
  const value = useMemo<AppRouterValue>(
    () => ({ href, push, replace, back, canGoBack, popTo }),
    [href, push, replace, back, canGoBack, popTo],
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
