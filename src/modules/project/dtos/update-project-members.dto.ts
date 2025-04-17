import { IsArray, IsInt, ArrayNotEmpty } from 'class-validator';

export class UpdateProjectMembersDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  memberIds: number[];
}
