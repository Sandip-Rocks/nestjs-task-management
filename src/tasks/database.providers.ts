import { Sequelize } from 'sequelize-typescript';
import { Task } from '../tasks/task.model';
import { User } from 'src/auth/user.model';

export const databaseProviders = [
  {
    provide: 'SEQUELIZE',
    useFactory: async () => {
      const sequelize = new Sequelize({
        dialect: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'postgres',
        password: 'root',
        database: 'task-management',
      });
      sequelize.addModels([User, Task]);
      await sequelize.sync();
      return sequelize;
    },
  },
];
