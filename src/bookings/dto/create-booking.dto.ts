import { IsDateString, IsEmail, IsIn, IsInt, IsOptional, IsString, Max, Min, MinLength } from "class-validator";
import type { PaymentMethod } from "../../entities/payment.entity";

export class CreateBookingDto {
  @IsOptional()
  @IsString()
  userId?: string;

  @IsString()
  @MinLength(2)
  customerName: string;

  @IsEmail()
  customerEmail: string;

  @IsOptional()
  @IsString()
  customerPhone?: string;

  @IsString()
  serviceId: string;

  @IsInt()
  @Min(1)
  @Max(10)
  units: number;

  @IsDateString()
  scheduledDate: string;

  @IsString()
  timeSlot: string;

  @IsString()
  @MinLength(5)
  address: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsIn(["paypal", "credit", "debit"])
  paymentMethod?: PaymentMethod;
}
