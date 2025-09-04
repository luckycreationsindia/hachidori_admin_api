import {Prisma} from "@prisma/client";

export const workflowSelect = (withData: boolean) => ({
    id: true,
    title: true,
    description: true,
    data: withData,
});

export type WorkflowPayload<WithData extends boolean> =
    Prisma.WorkflowGetPayload<{
        select: ReturnType<typeof workflowSelect>;
    }>;