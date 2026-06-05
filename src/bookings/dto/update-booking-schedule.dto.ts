import { IsDateString, IsString } from "class-validator";

export class UpdateBookingScheduleDto {
  @IsDateString()
  scheduledDate: string;

  @IsString()
  timeSlot: string;
}
