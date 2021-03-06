import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as config from 'config';

const dbConfig = config.get<{
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  synchronize: boolean;
}>('db');

export const typeormConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || dbConfig.host,
  port: Number(process.env.DB_PORT) || dbConfig.port,
  username: process.env.DB_USERNAME || dbConfig.username,
  password: process.env.DB_PASSWORD || dbConfig.password,
  database: process.env.DB_DATABASE || dbConfig.database,
  entities: [__dirname + './../**/*.entity.js'],
  synchronize: Boolean(process.env.DB_SYNCHRONIZE) || dbConfig.synchronize,
  logging: 'all',
};
