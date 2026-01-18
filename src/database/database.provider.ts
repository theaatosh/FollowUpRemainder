import { ConfigService } from '@nestjs/config';
import { MongooseModuleOptions } from '@nestjs/mongoose';
import { Logger } from '@nestjs/common';

const logger = new Logger('MongoDB');

export const databaseConfigFactory = async (
  configService: ConfigService,
): Promise<MongooseModuleOptions> => {
  return {
    uri: configService.get<string>('MONGO_URI'),
    dbName: configService.get<string>('MONGO_DB_NAME'),
    connectionFactory: (connection) => {
      connection.on('connected', () => logger.log('MongoDB connected'));
      connection.on('error', (err) => logger.error('MongoDB connection error', err));
      connection.on('disconnected', () => logger.warn('MongoDB disconnected'));

      return connection;
    },
  };
};
