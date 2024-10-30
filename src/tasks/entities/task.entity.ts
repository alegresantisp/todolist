import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ default: 'pendiente' })  
  status: 'pendiente' | 'en progreso' | 'completada';

  @ManyToOne(() => User, (user) => user.tasks)
  user: User;
}