import {Prisma, Schedules} from "@prisma/client";
import {prisma} from "../lib/prisma";
import {SchedulePayload, scheduleSelect, ScheduleWithChildrenPayload} from "../types/schedule";
import {GetScheduleQuery, GetSchedulesQuery} from "../interfaces/schedule";

export async function addSchedule(data: Prisma.SchedulesCreateInput): Promise<Partial<Schedules>> {
    const {startDate, endDate, ...rest} = data;
    const start = new Date(startDate);
    const end = new Date(endDate);

    const parent = await prisma.schedules.create({
        data: {
            ...rest,
            startDate: start,
            endDate: end,
        },
    });

    const childSchedules: Prisma.SchedulesCreateManyInput[] = [];
    let current = new Date(start);

    while (current <= end) {
        const next = new Date(current);
        next.setHours(end.getHours(), end.getMinutes(), end.getSeconds(), end.getMilliseconds());

        childSchedules.push({
            title: parent.title,
            description: parent.description,
            parentId: parent.id,
            startDate: new Date(current),
            endDate: new Date(next),
            workflowId: parent.workflowId,
            userId: parent.userId,
        });

        current.setDate(current.getDate() + 1);
        current.setHours(start.getHours(), start.getMinutes(), start.getSeconds(), start.getMilliseconds());
    }

    if (childSchedules.length > 0) {
        await addBulkSchedules(childSchedules);
    }

    return parent;
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