"use client";

import type { Catalog } from "@/lib/products";
import { createContext, useContext } from "react";

const CatalogContext = createContext<Catalog>({ categories: [], products: [] });

/** Makes the server-fetched catalog available to client components (cart, etc.). */
export function CatalogProvider({ catalog, children }: { catalog: Catalog; children: React.ReactNode }) {
  return <CatalogContext.Provider value={catalog}>{children}</CatalogContext.Provider>;
}

export function useCatalog() {
  return useContext(CatalogContext);
}
