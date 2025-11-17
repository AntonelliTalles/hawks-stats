import { z } from 'zod';

export const skaterSchema = z.object({
  name: z.string().min(2),
  number: z.coerce.number().int().min(0).max(99).optional().or(z.literal(NaN)).transform(v => Number.isNaN(v) ? undefined : v),
  position: z.enum(['C', 'LW', 'RW', 'D']),
  is_active: z.boolean().default(true),
});
export type SkaterFormData = z.infer<typeof skaterSchema>;
