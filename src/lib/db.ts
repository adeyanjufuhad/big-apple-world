import { neon } from "@neondatabase/serverless";

// Storefront connects with a restricted role: SELECT on the catalog, INSERT on events/orders.
export const sql = neon(process.env.DATABASE_URL!);
