import { INTEGER } from 'sequelize';
import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  BelongsTo,
} from 'sequelize-typescript';
import { User } from '../auth/user.model';

export enum TaskStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
}
@Table
export class Task extends Model {
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
  })
  title: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  description: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  status: TaskStatus;

  @BelongsTo(() => User, 'userId')
  user: User;
}
