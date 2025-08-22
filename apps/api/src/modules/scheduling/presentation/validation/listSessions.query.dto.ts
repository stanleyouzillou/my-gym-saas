import { IsISO8601, IsOptional, IsString } from 'class-validator';

export class ListSessionsQueryDto {
  @IsOptional()
  @IsString()
  programId?: string;

  @IsOptional()
  @IsISO8601()
  from?: string; // ISO

  @IsOptional()
  @IsISO8601()
  to?: string; // ISO
}
