import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module'; 
import { UsersModule } from './users/users.module'; 
import { User } from './users/entities/user.entity';
import { Auth } from './auth/entities/auth.entity';
import { TasksModule } from './tasks/tasks.module';
import { Task } from './tasks/entities/task.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: +process.env.DB_PORT || 5432,
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'alegrin123.',
      database: process.env.DB_NAME,
      entities: [User, Auth, Task],
      synchronize: true,
    }),
    AuthModule,
    UsersModule,
    TasksModule, 
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
