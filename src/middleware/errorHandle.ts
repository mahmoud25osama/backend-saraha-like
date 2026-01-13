import { Request, Response } from 'express'

export const errorHandle = (err: any, req: Request, res: Response) => {
    res.status(err.statusCode || 500).json({
        error: 'Error',
        message: err.message,
        code: err.statusCode,
    })
}
