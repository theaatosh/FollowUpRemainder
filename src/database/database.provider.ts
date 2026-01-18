import { ConfigService } from '@nestjs/config';
import { MongooseModuleOptions } from '@nestjs/mongoose';
import { Logger } from '@nestjs/common';

const logger = new Logger('MongoDB');

export const databaseConfigFactory = async (
    configService: ConfigService,
): Promise<MongooseModuleOptions> => {
    const uri = configService.get<string>('MONGO_URI');
    const dbName = configService.get<string>('MONGO_DB_NAME');

    logger.log(`Connecting to MongoDB database: ${dbName}...`);

    return {
        uri,
        dbName,
        onConnectionCreate: (connection) => {
            connection.on('connected', () => logger.log('✅ MongoDB connected successfully'));
            connection.on('error', (err) => logger.error('❌ MongoDB connection error', err));
            connection.on('disconnected', () => logger.warn('⚠️ MongoDB disconnected'));

            // Log immediately if already connected
            if (connection.readyState === 1) {
                logger.log('✅ MongoDB connected successfully');
            }
        },
    };
};

