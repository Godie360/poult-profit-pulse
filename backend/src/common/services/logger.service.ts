import { Injectable, LoggerService as NestLoggerService, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.TRANSIENT })
export class LoggerService implements NestLoggerService {
  private context?: string;

  constructor(context?: string) {
    this.context = context;
  }

  setContext(context: string) {
    this.context = context;
  }

  log(message: any, context?: string) {
    this.printMessage('log', message, context || this.context);
  }

  error(message: any, trace?: string, context?: string) {
    this.printMessage('error', message, context || this.context);
    if (trace) {
      console.error(trace);
    }
  }

  warn(message: any, context?: string) {
    this.printMessage('warn', message, context || this.context);
  }

  debug(message: any, context?: string) {
    this.printMessage('debug', message, context || this.context);
  }

  verbose(message: any, context?: string) {
    this.printMessage('verbose', message, context || this.context);
  }

  private printMessage(level: 'log' | 'error' | 'warn' | 'debug' | 'verbose', message: any, context?: string) {
    const timestamp = new Date().toISOString();
    const formattedMessage = this.formatMessage(message);
    const contextStr = context ? `[${context}]` : '';
    
    switch (level) {
      case 'log':
        console.log(`${timestamp} ${contextStr} ${formattedMessage}`);
        break;
      case 'error':
        console.error(`${timestamp} ${contextStr} ${formattedMessage}`);
        break;
      case 'warn':
        console.warn(`${timestamp} ${contextStr} ${formattedMessage}`);
        break;
      case 'debug':
        console.debug(`${timestamp} ${contextStr} ${formattedMessage}`);
        break;
      case 'verbose':
        console.log(`${timestamp} ${contextStr} ${formattedMessage}`);
        break;
    }
  }

  private formatMessage(message: any): string {
    if (typeof message === 'object') {
      return JSON.stringify(message);
    }
    return message;
  }
}