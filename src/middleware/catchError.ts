import { Errback, NextFunction, Request, Response } from 'express'

export default function catchError(handler: Function) {
    return (req: Request, res: Response, next: NextFunction) => {
        handler(req, res, next).catch((error: Errback) => {
            next(error)
        })
    }
}
