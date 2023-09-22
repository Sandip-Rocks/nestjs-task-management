import { INTEGER } from 'sequelize';
import {
  Column,
  DataType,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { Task } from '../tasks/task.model';
@Table
export class User extends Model {
  static save() {
    throw new Error('Method not implemented.');
  }
  @PrimaryKey
  @Column({
    allowNull: false,
    autoIncrement: true,
    type: INTEGER(),
  })
  id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  username: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password: string;

  @Column({
    type: INTEGER(), // This should match the data type of the id in the Task model
  })
  userId: number;

  @HasMany(() => Task, { foreignKey: 'userId' })
  tasks: Task[];
}
