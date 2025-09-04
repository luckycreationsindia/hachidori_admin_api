import {NextFunction, Request, Response} from "express";
import {
    addWorkflow,
    deleteWorkflow,
    getWorkflow,
    getWorkflows, updateWorkflow,
} from "../services/Workflow";
import {
    createWorkflowSchema,
    updateWorkflowSchema,
    getWorkflowsQuerySchema,
    UpdateWorkflowInput,
    GetWorkflowsQuery,
} from "../interfaces/workflow";
import {Prisma} from "@prisma/client";

export class WorkflowController {
    static async create(req: Request, res: Response, next: NextFunction) {
        try {
            const body = {
                ...req.body,
            };
            const data: Prisma.WorkflowCreateInput = createWorkflowSchema.parse(body) as Prisma.WorkflowCreateInput;
            data.user = {connect: {id: req.user?.id!}};
            const workflow = await addWorkflow(data);
            return res.status(201).json({status: 1, data: workflow});
        } catch (err: any) {
            next(err);
        }
    }

    static async getOne(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);
            const withData = req.query.withData === "true";
            const workflow = await getWorkflow(id, withData);
            if (!workflow) return res.status(404).json({status: -1, message: "Workflow not found"});
            return res.json({status: 1, data: workflow});
        } catch (err: any) {
            next(err);
        }
    }

    static async getMany(req: Request, res: Response, next: NextFunction) {
        try {
            const query: GetWorkflowsQuery = getWorkflowsQuerySchema.parse(req.query);
            const workflows = await getWorkflows(query);
            return res.json({status: 1, data: workflows});
        } catch (err: any) {
            next(err);
        }
    }

    static async update(req: Request, res: Response, next: NextFunction) {
        try {
            const data: UpdateWorkflowInput = updateWorkflowSchema.parse(req.body);
            const id = Number(req.params.id);
            const workflow = await updateWorkflow(id, data as Prisma.WorkflowUpdateInput);
            return res.json({status: 1, data: workflow});
        } catch (err: any) {
            next(err);
        }
    }

    static async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);
            const workflow = await deleteWorkflow(id);
            return res.json({status: 1, data: workflow});
        } catch (err: any) {
            next(err);
        }
    }
}
