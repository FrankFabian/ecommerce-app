import { sql, db } from '@vercel/postgres';

/**
 * Exportamos sql para consultas con template tags:
 *   const { rows } = await sql`SELECT * FROM products`;
 * y db por si necesitas un client explícito.
 */
export { sql, db };
