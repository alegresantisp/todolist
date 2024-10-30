import { IsString, IsIn, IsOptional } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()  
  description?: string;

  @IsIn(['pendiente', 'en progreso', 'completada'])  
  status: 'pendiente' | 'en progreso' | 'completada';
}