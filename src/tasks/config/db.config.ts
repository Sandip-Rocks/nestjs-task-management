import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: 'localhost', // Update with your PostgreSQL host
      port: 5432, // Update with your PostgreSQL port
      username: 'postgres', // Update with your PostgreSQL username
      password: 'root', // Update with your PostgreSQL password
      database: 'task-management', // Update with your PostgreSQL database name
      autoLoadModels: true,
      synchronize: true, // This option creates tables based on your model definitions (use carefully in production)
    }),
  ],
})
export class ConfigModule {}
