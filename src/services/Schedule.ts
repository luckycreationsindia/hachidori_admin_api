import {Prisma, Schedules} from "@prisma/client";
import {prisma} from "../lib/prisma";
import {SchedulePayload, scheduleSelect, ScheduleWithChildrenPayload} from "../types/schedule";

export async function addSchedule(data: Prisma.SchedulesCreateInput): Promise<Partial<Schedules>> {
    return await prisma.schedules.create({
        data,
    });
}

export async function addBulkSchedules(data: Prisma.SchedulesCreateManyInput[]): Promise<number> {
    const result = await prisma.schedules.createMany({
        data,
    });

    return result.count;
}

export async function updateSchedule(id: number, data: Prisma.SchedulesUpdateInput): Promise<Schedules | null> {
    return prisma.schedules.update({
        where: {id},
        data,
    });
}

export async function deleteSchedule(id: number): Promise<Schedules> {
    return prisma.schedules.delete({where: {id}});
}

export async function getSchedule<WithData extends boolean>(
    id: number,
    withData: WithData = false as WithData
): Promise<SchedulePayload<WithData> | null> {
    return await prisma.schedules.findUnique({
        where: {id},
        select: {
            ...scheduleSelect(withData)
        },
    });
}

export async function getSchedules<WithData extends boolean>(
    query: { withData?: WithData | undefined; startDate?: Date | undefined; endDate?: Date | undefined } = {}
): Promise<ScheduleWithChildrenPayload<WithData>[]> {
    const {withData = false as WithData, startDate, endDate} = query;
    const whereClause: Prisma.SchedulesWhereInput = {};

    if (startDate) {
        whereClause.startDate = {gte: startDate};
    }
    if (endDate) {
        whereClause.endDate = {lte: endDate};
    }

    return await prisma.schedules.findMany({
        where: whereClause,
        select: {
            ...scheduleSelect(withData),
            children: {select: scheduleSelect(withData)},
        },
    });
}