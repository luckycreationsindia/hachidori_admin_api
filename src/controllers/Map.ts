import {NextFunction, Request, Response} from "express";
import {ApiSuccessResponse} from "../interfaces/api-interface";
import ErrorHandler from "../utils/error_handler";
import mainMap from "../../assets/map1_active.json";
import mapData from "../../assets/map1_data.json";

export async function getMap(req: Request, res: Response, next: NextFunction) {
    try {
        const response: ApiSuccessResponse = {
            status: 1, data: {
                map: mainMap,
                data: mapData,
            }
        };
        res.status(200).json(response);
    } catch (err) {
        next(new ErrorHandler(String(err), 500));
    }
}