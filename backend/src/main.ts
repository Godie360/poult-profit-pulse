import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { LoggerService } from './common/services/logger.service';

async function bootstrap() {
  // Create a logger instance for the application
  const logger = new LoggerService('Application');

  // Create the NestJS application with our custom logger
  const app = await NestFactory.create(AppModule, {
    logger,
  });

  // Enable CORS for frontend
  app.enableCors({
    origin: ['http://localhost:5173', 'http://localhost:8080'], // Allow both Vite default port and port 8080
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Poult Profit Pulse API')
    .setDescription('API documentation for Poult Profit Pulse - Poultry Management System')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Get port from environment variables or use default
  const port = process.env.PORT || 3000;
  await app.listen(port);

  // Log application startup information
  logger.log(`Application is running on: http://localhost:${port}`);
  logger.log(`Swagger documentation: http://localhost:${port}/api`);
  logger.log('Backend API is ready to serve requests');
}
bootstrap();
