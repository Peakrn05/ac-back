import { Body, Controller, Get, Param, Patch, Post, Query } from "@nestjs/common";
import type { BookingStatus } from "../entities/booking.entity";
import { BookingsService } from "./bookings.service";
import { CreateBookingDto } from "./dto/create-booking.dto";
import { UpdateBookingScheduleDto } from "./dto/update-booking-schedule.dto";
import { UpdateBookingStatusDto } from "./dto/update-booking-status.dto";

@Controller("bookings")
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Get()
  list(
    @Query("status") status?: BookingStatus | "all",
    @Query("date") date?: string,
    @Query("userId") userId?: string,
  ) {
    return this.bookingsService.list({ status, date, userId });
  }

  @Get("user/:userId")
  listForUser(@Param("userId") userId: string) {
    return this.bookingsService.list({ userId });
  }

  @Get(":id")
  getOne(@Param("id") id: string) {
    return this.bookingsService.getOne(id);
  }

  @Post()
  create(@Body() dto: CreateBookingDto) {
    return this.bookingsService.create(dto);
  }

  @Patch(":id/status")
  updateStatus(@Param("id") id: string, @Body() dto: UpdateBookingStatusDto) {
    return this.bookingsService.updateStatus(id, dto.status);
  }

  @Patch(":id/schedule")
  updateSchedule(@Param("id") id: string, @Body() dto: UpdateBookingScheduleDto) {
    return this.bookingsService.updateSchedule(id, dto);
  }
}
