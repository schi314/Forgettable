import { NextFunction, Request, Response } from 'express';
import { encounterService } from '../services/index';

export const createEncounter = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {

    try {
        await encounterService.createEncounter(req.body);
        res.status(200).end();
    } catch (e) {
        res.status(400);
        next(e);
    }
};