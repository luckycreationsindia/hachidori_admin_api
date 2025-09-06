import {z} from "zod";

export const createScheduleSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
    parentId: z.number().int().nullable().optional(),
});

export type CreateScheduleInput = z.infer<typeof createScheduleSchema>;

export const updateScheduleSchema = z.object({
    id: z.number().int(),
    title: z.string().optional(),
    description: z.string().optional(),
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
    data: z.string().optional(),
});

export type UpdateScheduleInput = z.infer<typeof updateScheduleSchema>;

export const getSchedulesQuerySchema = z.object({
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
    year: z.coerce.number().int().optional(),
    month: z.coerce.number().min(1).max(12).optional(),
    includeAll: z.coerce.boolean().optional(),
    withChildren: z.coerce.boolean().optional(),
    withParent: z.coerce.boolean().optional(),
});

export type GetSchedulesQuery = z.infer<typeof getSchedulesQuerySchema>;

export const getScheduleQuerySchema = z.object({
    id: z.number().int(),
    withChildren: z.coerce.boolean().optional(),
});

export type GetScheduleQuery = z.infer<typeof getScheduleQuerySchema>;