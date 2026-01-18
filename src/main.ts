import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);


  app.use(cookieParser());
  app.setGlobalPrefix("api/v1");


//executes for every request for validating data
  app.useGlobalPipes(new ValidationPipe({
    transform:true,
    whitelist:true,
    forbidNonWhitelisted:true,
    
  }))

  //for cors
  app.enableCors({
    origin: 'http://localhost:3000', // frontend URL
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true, // if you need cookies/auth headers
  });

  const configService=app.get(ConfigService)
  const PORT=configService.get<number>("PORT")
  await app.listen(PORT|| 3000);
  console.log(`Application is running on port ${PORT}`);
}
bootstrap();
