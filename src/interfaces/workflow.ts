import {z} from "zod";

export const createWorkflowSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    data: z.string().optional(),
});

export type CreateWorkflowInput = z.infer<typeof createWorkflowSchema>;

export const updateWorkflowSchema = z.object({
    id: z.number().int(),
    title: z.string().optional(),
    description: z.string().optional(),
    data: z.string().optional(),
});

export type UpdateWorkflowInput = z.infer<typeof updateWorkflowSchema>;

export const getWorkflowsQuerySchema = z.object({
    withData: z.coerce.boolean().optional(),
});

export type GetWorkflowsQuery = z.infer<typeof getWorkflowsQuerySchema>;