import { z } from 'zod';

// Allowed match statuses (stored in lowercase).
export const MATCH_STATUS = {
  SCHEDULED: 'scheduled',
  LIVE: 'live',
  FINISHED: 'finished',
};

// GET /matches query params.
export const listMatchesQuerySchema = z.object({
  limit: z.coerce.number().int().positive().max(100).optional(),
});

// :id route param.
export const matchIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

// Helper: verify a value is a valid ISO date string.
const isIsoDateString = (value) => !Number.isNaN(Date.parse(value));

// POST /matches body.
export const createMatchSchema = z
  .object({
    sport: z.string().min(1),
    homeTeam: z.string().min(1),
    awayTeam: z.string().min(1),
    startTime: z
      .string()
      .refine(isIsoDateString, { message: 'startTime must be a valid ISO date string' }),
    endTime: z
      .string()
      .refine(isIsoDateString, { message: 'endTime must be a valid ISO date string' }),
    homeScore: z.coerce.number().int().nonnegative().optional(),
    awayScore: z.coerce.number().int().nonnegative().optional(),
  })
  .superRefine((data, ctx) => {
    if (Date.parse(data.endTime) <= Date.parse(data.startTime)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'endTime must be after startTime',
        path: ['endTime'],
      });
    }
  });

// PATCH /matches/:id/score body.
export const updateScoreSchema = z.object({
  homeScore: z.coerce.number().int().nonnegative(),
  awayScore: z.coerce.number().int().nonnegative(),
});
