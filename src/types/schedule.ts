import {Prisma} from "@prisma/client";

export const scheduleSelect = (withData: boolean) => ({
    id: true,
    title: true,
    description: true,
    startDate: true,
    endDate: true,
    data: withData,
});

export type SchedulePayload<WithData extends boolean> =
    Prisma.SchedulesGetPayload<{
        select: ReturnType<typeof scheduleSelect>;
    }>;

export type ScheduleWithChildrenPayload<WithData extends boolean> =
    Prisma.SchedulesGetPayload<{
        select: ReturnType<typeof scheduleSelect> & {
            children: { select: ReturnType<typeof scheduleSelect> };
        };
    }>;