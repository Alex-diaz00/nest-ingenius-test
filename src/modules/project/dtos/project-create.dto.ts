import {
  IsDefined,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  IsArray,
  IsInt,
} from 'class-validator';
import { Exclude, Type } from 'class-transformer';
import { User } from '../../user/entities/user.entity';

export class ProjectCreate {
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  readonly name: string;

  @IsOptional()
  @IsString()
  readonly description?: string;

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  @Type(() => Number)
  readonly members?: number[];

  @Exclude()
  owner: User;
}
