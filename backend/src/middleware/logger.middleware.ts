import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction) {
    const { ip, method, originalUrl } = req;
    const userAgent = req.get('user-agent') || '';
    const startTime = Date.now();

    res.on('finish', () => {
      const { statusCode } = res;
      const contentLength = res.get('content-length');
      const responseTime = Date.now() - startTime;

      this.logger.log(
        `${method} ${originalUrl} ${statusCode} ${contentLength} - ${responseTime}ms - ${userAgent} ${ip}`,
      );

      // Log request body for non-GET requests (excluding passwords)
      if (method !== 'GET' && req.body) {
        const sanitizedBody = { ...req.body };
        if (sanitizedBody.password) sanitizedBody.password = '********';
        if (sanitizedBody.confirmPassword) sanitizedBody.confirmPassword = '********';
        this.logger.debug(`Request Body: ${JSON.stringify(sanitizedBody)}`);
      }

      // Log detailed info for errors
      if (statusCode >= 400) {
        this.logger.error(`Error Response: ${method} ${originalUrl} ${statusCode}`);
      }
    });

    next();
  }
}