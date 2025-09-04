import {Prisma, Schedules} from "@prisma/client";
import {prisma} from "../lib/prisma";
import {SchedulePayload, scheduleSelect, ScheduleWithChildrenPayload} from "../types/schedule";
import {GetScheduleQuery, GetSchedulesQuery} from "../interfaces/schedule";

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
    query: GetScheduleQuery
): Promise<SchedulePayload | null> {
    const {id, withChildren} = query;
    const selectClause: Prisma.SchedulesSelect = {...scheduleSelect()};

    if (withChildren) {
        selectClause.children = {select: scheduleSelect()};
    }

    return await prisma.schedules.findUnique({
        where: {id},
        select: selectClause,
    });
}

export async function getSchedules(
    query: GetSchedulesQuery
): Promise<Partial<ScheduleWithChildrenPayload>[]> {
    const {startDate, endDate, includeAll, withChildren} = query;
    const whereClause: Prisma.SchedulesWhereInput = {};
    const selectClause: Prisma.SchedulesSelect = {...scheduleSelect()};

    if (startDate) {
        whereClause.startDate = {gte: startDate};
    }
    if (endDate) {
        whereClause.endDate = {lte: endDate};
    }
    if (!includeAll) {
        whereClause.parent = null;
    }
    if (withChildren) {
        selectClause.children = {select: scheduleSelect()};
    }

    return await prisma.schedules.findMany({
        where: whereClause,
        select: selectClause,
    });
}