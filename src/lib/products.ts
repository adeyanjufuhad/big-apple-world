// Catalog types. The data itself lives in Neon (see lib/catalog.ts and db/schema.sql).

export type Category = {
  slug: string;
  name: string;
  image: string;
};

export type Product = {
  slug: string;
  name: string;
  category: string;
  categoryName: string;
  /** Price in Naira. */
  price: number;
  image: string;
  description: string;
  inStock: boolean;
  bestSeller: boolean;
  newArrival: boolean;
};

export type Catalog = {
  categories: Category[];
  products: Product[];
};

export const PLACEHOLDER_IMAGE = "/logo.png";
