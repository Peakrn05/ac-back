import { IsIn } from "class-validator";
import type { BookingStatus } from "../../entities/booking.entity";

export class UpdateBookingStatusDto {
  @IsIn(["pending", "confirmed", "in-progress", "completed", "cancelled"])
  status: BookingStatus;
}
