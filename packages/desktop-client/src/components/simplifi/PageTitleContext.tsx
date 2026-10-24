import { createContext, useContext, useEffect, useState } from 'react';
import type { Dispatch, ReactNode, SetStateAction } from 'react';

type PageTitleContextValue = {
  title: ReactNode | null;
  setTitle: Dispatch<SetStateAction<ReactNode | null>>;
};

const PageTitleContext = createContext<PageTitleContextValue | null>(null);

export function PageTitleProvider({ children }: { children: ReactNode }) {
  const [title, setTitle] = useState<ReactNode | null>(null);
  return (
    <PageTitleContext.Provider value={{ title, setTitle }}>
      {children}
    </PageTitleContext.Provider>
  );
}

/**
 * The title a page registered for the app header, or `null` when the
 * header should fall back to the title derived from the current route.
 */
export function usePageTitle() {
  return useContext(PageTitleContext)?.title ?? null;
}

/**
 * Lets a page show its title in the app header instead of rendering its own
 * heading. Returns `false` when there is no app header to render into, in
 * which case the page should render the heading itself.
 */
export function useRegisterPageTitle(title: ReactNode | null) {
  const context = useContext(PageTitleContext);
  const setTitle = context?.setTitle;

  useEffect(() => {
    if (!setTitle || title == null) {
      return;
    }
    setTitle(title);
    return () => setTitle(null);
  }, [setTitle, title]);

  return context != null;
}
