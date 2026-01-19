import {
  IsBoolean,
  IsNumber,
  IsString,
  IsOptional,
  Min,
  Max,
  Matches,
} from 'class-validator';
export class UpdateSettingsDto {
  @IsOptional()
  @IsBoolean()
  notificationsEnabled?: boolean;
  @IsOptional()
  @IsBoolean()
  soundEnabled?: boolean;
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1440) // Max 24 hours
  reminderOffset?: number;
  @IsOptional()
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'defaultFollowUpTime must be in HH:mm format (24-hour)',
  })
  defaultFollowUpTime?: string;
  @IsOptional()
  @IsBoolean()
  quietHoursEnabled?: boolean;
  @IsOptional()
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'quietHoursStart must be in HH:mm format (24-hour)',
  })
  quietHoursStart?: string;
  @IsOptional()
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'quietHoursEnd must be in HH:mm format (24-hour)',
  })
  quietHoursEnd?: string;
  @IsOptional()
  @IsString()
  timeZone?: string; // Should validate against IANA timezone list in production
}