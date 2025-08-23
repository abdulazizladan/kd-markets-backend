import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsDateString, IsEnum, IsOptional, IsDate } from 'class-validator';
import { ActivityStatus, ActivityFrequency } from '../entities/activity.entity';

export class CreateActivityDto {
  @ApiProperty({
    description: 'The name or title of the activity to be created',
    example: 'Monthly Market Inspection'
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Detailed description of what the activity involves',
    example: 'Conduct thorough inspection of all market stalls and facilities'
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'The date and time when the activity is scheduled to occur',
  })
  @IsDate()
  scheduledTime: Date;

  @ApiProperty({
    description: 'How often this activity should be performed',
    enum: ActivityFrequency,
    example: ActivityFrequency.Monthly
  })
  @IsEnum(ActivityFrequency)
  @IsNotEmpty()
  frequency: ActivityFrequency;

  @ApiProperty({
    description: 'Current status of the activity (defaults to Planned)',
    enum: ActivityStatus,
    example: ActivityStatus.Planned,
    default: ActivityStatus.Planned
  })
  @IsEnum(ActivityStatus)
  @IsOptional()
  status?: ActivityStatus = ActivityStatus.Planned;

  @ApiProperty({
    description: 'Date when this activity was last completed (required by database)'
  })
  @IsDate()
  lastCompleted: Date;
}
