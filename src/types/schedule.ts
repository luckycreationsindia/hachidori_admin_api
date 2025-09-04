import {Prisma} from "@prisma/client";

export const scheduleSelect = () => ({
    id: true,
    title: true,
    description: true,
    startDate: true,
    endDate: true,
    workflowId: true,
});

export type SchedulePayload =
    Prisma.SchedulesGetPayload<{
        select: ReturnType<typeof scheduleSelect>;
    }>;

export type ScheduleWithChildrenPayload =
    Prisma.SchedulesGetPayload<{
        select: ReturnType<typeof scheduleSelect> & {
            children: { select: ReturnType<typeof scheduleSelect> };
        };
    }>;