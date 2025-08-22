import {
  IsISO8601,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  Min,
  IsIn,
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export class CreateSessionDto {
  @IsString()
  programId!: string;

  @IsISO8601()
  @IsQuarterHourAligned({
    message:
      'startTime must be aligned to 15-minute intervals (mm=00,15,30,45)',
  })
  startTime!: string; // ISO

  @IsInt()
  @IsPositive()
  @IsIn([15, 30, 45, 60])
  durationMinutes!: number;

  @IsInt()
  @Min(1)
  maxCapacity!: number;

  @IsOptional()
  @IsString()
  coachName?: string;
}

// Custom validator to ensure startTime is aligned to 15-minute intervals
export function IsQuarterHourAligned(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'IsQuarterHourAligned',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, _args: ValidationArguments) {
          if (typeof value !== 'string') return false;
          const date = new Date(value);
          if (isNaN(date.getTime())) return false;
          const minutes = date.getUTCMinutes();
          const seconds = date.getUTCSeconds();
          const ms = date.getUTCMilliseconds();
          return minutes % 15 === 0 && seconds === 0 && ms === 0;
        },
        defaultMessage(_args: ValidationArguments) {
          return 'startTime must be aligned to 15-minute intervals (mm=00,15,30,45)';
        },
      },
    });
  };
}
