import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';
import { getQueueToken } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { ExpressAdapter } from '@bull-board/express';
import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);


  app.use(cookieParser());
  app.setGlobalPrefix("api/v1");


  //executes for every request for validating data
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,

  }))

  //for cors
  app.enableCors({
    origin: 'http://localhost:3000', // frontend URL
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true, // if you need cookies/auth headers
  });


  // ===== Bull Board Setup =====
  // Get the queue from NestJS DI container
  const notificationQueue = app.get<Queue>(getQueueToken('notifications'));
  const serverAdapter = new ExpressAdapter();
  serverAdapter.setBasePath('/admin/queues');
  createBullBoard({
    queues: [new BullMQAdapter(notificationQueue)],
    serverAdapter,
  });
  // Mount Bull Board (Note: this is OUTSIDE the /api/v1 prefix)
  app.use('/admin/queues', serverAdapter.getRouter());
  // ===== End Bull Board Setup =====

  const configService = app.get(ConfigService)
  const PORT = configService.get<number>("PORT")
  await app.listen(PORT || 3000);
  console.log(`Application is running on port ${PORT}`);
  console.log(`Bull Board available at http://localhost:${PORT}/admin/queues`);
}


bootstrap();
