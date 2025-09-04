import {Prisma, Workflow} from "@prisma/client";
import {prisma} from "../lib/prisma";
import {WorkflowPayload, workflowSelect} from "../types/workflow";

export async function addWorkflow(data: Prisma.WorkflowCreateInput): Promise<Partial<Workflow>> {
    return await prisma.workflow.create({
        data,
    });
}

export async function updateWorkflow(id: number, data: Prisma.WorkflowUpdateInput): Promise<Workflow | null> {
    return prisma.workflow.update({
        where: {id},
        data,
    })
}

export async function deleteWorkflow(id: number): Promise<Workflow> {
    return prisma.workflow.delete({where: {id}});
}

export async function getWorkflow<WithData extends boolean>(id: number, withData: WithData = false as WithData): Promise<WorkflowPayload<WithData> | null> {
    return await prisma.workflow.findUnique({
        where: {id},
        select: {
            ...workflowSelect(withData)
        },
    });
}

export async function getWorkflows<WithData extends boolean>(query: { withData?: WithData | undefined } = {}): Promise<WorkflowPayload<WithData>[]> {
    const {withData = false as WithData} = query;

    return await prisma.workflow.findMany({
        select: {
            ...workflowSelect(withData)
        },
    })
}