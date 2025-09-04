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

export async function getSchedule(
    id: number
): Promise<SchedulePayload | null> {
    return await prisma.schedules.findUnique({
        where: {id},
        select: {
            ...scheduleSelect()
        },
    });
}

export async function getSchedules(
    query: { startDate?: Date | undefined; endDate?: Date | undefined } = {}
): Promise<ScheduleWithChildrenPayload[]> {
    const {startDate, endDate} = query;
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
            ...scheduleSelect(),
            children: {select: scheduleSelect()},
        },
    });
}