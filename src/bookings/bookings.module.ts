import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Booking } from "../entities/booking.entity";
import { Payment } from "../entities/payment.entity";
import { Service } from "../entities/service.entity";
import { TimeSlot } from "../entities/time-slot.entity";
import { User } from "../entities/user.entity";
import { BookingsController } from "./bookings.controller";
import { BookingsService } from "./bookings.service";

@Module({
  imports: [TypeOrmModule.forFeature([Booking, Payment, Service, TimeSlot, User])],
  controllers: [BookingsController],
  providers: [BookingsService],
})
export class BookingsModule {}
