import { Response } from "express";

class ResponseHandler {
  static success(res: Response, data: unknown, statusCode = 200, message?: string) {
    const responseObject: Record<string, unknown> = {
      message: message || undefined,
      timestamp: new Date().toISOString(),
      success: true,
      status: statusCode,
      data: data,
    };

    // if (message) {
    //   responseObject.message = message;
    // }

    res.status(statusCode).json(responseObject);
  }
}

export { ResponseHandler };
