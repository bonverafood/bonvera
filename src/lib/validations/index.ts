import { z } from "zod";

/**
 * Shared validation schemas live here.
 * Feature-specific schemas belong in `src/features/<feature>/schema.ts`.
 */

export const idSchema = z.string().min(1);
