import {
  IsOptional,
  IsString,
  IsNotEmpty,
  MinLength,
  IsBoolean,
  IsArray,
  IsInt,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class ProjectUpdate {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  readonly name?: string;

  @IsOptional()
  @IsString()
  readonly description?: string;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) =>
    typeof value === 'string'
      ? ['true', '1', 'yes'].includes(value.toLowerCase())
      : Boolean(value),
  )
  readonly isArchived?: boolean;

}
