// These are the models or what we say as entities mapping the tables in the DB.

// All the details are taken from https://typeorm.io/entities

import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Priority } from '../enums/Priority';
import { Status } from '../enums/Status';

// Entity is a class that maps to a database table. You can create an entity by defining a new class and mark it with @Entity():
@Entity() // Decorator Factory
export class Task {
  // creates a primary column which value will be automatically generated with an auto-increment value. It will create int column
  // with auto-increment/serial/sequence/identity (depend on the database and configuration provided). You don't have to manually
  // assign its value before save - value will be automatically generated.
  @PrimaryGeneratedColumn()
  id: string;

  @Column({
    type: 'text',
    nullable: false, // Makes column NULL or NOT NULL in the database. By default column is nullable: false.
  })
  title: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  date: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  description: string;

  // This is an imp one
  @Column({
    type: 'simple-enum',
    enum: Priority,
    default: Priority.LOW,
  })
  priority: Priority;

  @Column({
    type: 'simple-enum',
    enum: Status,
    default: Status.TODO,
  })
  status: Status;
}
