import {NextFunction, Request, Response} from "express";
import {
    addSchedule,
    addBulkSchedules,
    deleteSchedule,
    getSchedule,
    getSchedules, updateSchedule,
} from "../services/Schedule";
import {
    createScheduleSchema,
    updateScheduleSchema,
    getSchedulesQuerySchema,
    UpdateScheduleInput,
    GetSchedulesQuery,
} from "../interfaces/schedule";
import {z} from "zod";
import {Prisma} from "@prisma/client";

export class ScheduleController {
    static async create(req: Request, res: Response, next: NextFunction) {
        try {
            const body = {
                ...req.body,
            };
            const data: Prisma.SchedulesCreateInput = createScheduleSchema.parse(body) as Prisma.SchedulesCreateInput;
            data.user = {connect: {id: req.user?.id!}};
            data.workflow = {connect: {id: Number(req.body.workflowId)}};
            const schedule = await addSchedule(data);
            return res.status(201).json({status: 1, data: schedule});
        } catch (err: any) {
            next(err);
        }
    }

    static async createBulk(req: Request, res: Response, next: NextFunction) {
        try {
            const body: Prisma.SchedulesCreateManyInput[] = z
                .array(createScheduleSchema)
                .parse(req.body) as unknown as Prisma.SchedulesCreateManyInput[];

            const withUserId = body.map((schedule) => ({
                ...schedule,
                user: {connect: {id: req.user?.id!}}!,
            }));

            const count = await addBulkSchedules(withUserId);
            return res.status(201).json({status: 1, message: `Added ${count} schedules`});
        } catch (err: any) {
            next(err);
        }
    }

    static async getOne(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);
            const withData = req.query.withData === "true";
            const schedule = await getSchedule(id, withData);
            if (!schedule) return res.status(404).json({status: -1, message: "Schedule not found"});
            return res.json({status: 1, data: schedule});
        } catch (err: any) {
            next(err);
        }
    }

    static async getMany(req: Request, res: Response, next: NextFunction) {
        try {
            const query: GetSchedulesQuery = getSchedulesQuerySchema.parse(req.query);
            const schedules = await getSchedules(query);
            return res.json({status: 1, data: schedules});
        } catch (err: any) {
            next(err);
        }
    }

    static async update(req: Request, res: Response, next: NextFunction) {
        try {
            const data: UpdateScheduleInput = updateScheduleSchema.parse(req.body);
            const id = Number(req.params.id);
            const schedule = await updateSchedule(id, data as Prisma.SchedulesUpdateInput);
            return res.json({status: 1, data: schedule});
        } catch (err: any) {
            next(err);
        }
    }

    static async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);
            const schedule = await deleteSchedule(id);
            return res.json({status: 1, data: schedule});
        } catch (err: any) {
            next(err);
        }
    }
}
