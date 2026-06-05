import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { randomUUID } from "node:crypto";
import { type FindOptionsWhere, Repository } from "typeorm";
import { Booking, type BookingStatus } from "../entities/booking.entity";
import { Payment } from "../entities/payment.entity";
import { Service } from "../entities/service.entity";
import { TimeSlot } from "../entities/time-slot.entity";
import { User } from "../entities/user.entity";
import { CreateBookingDto } from "./dto/create-booking.dto";
import { UpdateBookingScheduleDto } from "./dto/update-booking-schedule.dto";

interface BookingFilters {
  status?: BookingStatus | "all";
  date?: string;
  userId?: string;
}

function btuMultiplier(btu: number) {
  if (btu < 5000) return 1;
  if (btu <= 12000) return 1.15;
  if (btu <= 24000) return 1.3;
  return 1.5;
}

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking) private readonly bookings: Repository<Booking>,
    @InjectRepository(Payment) private readonly payments: Repository<Payment>,
    @InjectRepository(Service) private readonly services: Repository<Service>,
    @InjectRepository(TimeSlot) private readonly timeSlots: Repository<TimeSlot>,
    @InjectRepository(User) private readonly users: Repository<User>,
  ) {}

  async list(filters: BookingFilters = {}) {
    const where: FindOptionsWhere<Booking> = {};
    if (filters.status && filters.status !== "all") where.status = filters.status;
    if (filters.date) where.scheduledDate = filters.date;
    if (filters.userId) where.userId = filters.userId;

    const bookings = await this.bookings.find({
      where,
      relations: { service: true, payment: true },
      order: { createdAt: "DESC" },
    });

    return bookings.map((booking) => this.toResponse(booking));
  }

  async getOne(id: string) {
    const booking = await this.bookings.findOne({
      where: { id },
      relations: { service: true, payment: true },
    });
    if (!booking) throw new NotFoundException("Booking not found.");
    return this.toResponse(booking);
  }

  async create(dto: CreateBookingDto) {
    const service = await this.services.findOne({ where: { id: dto.serviceId, isActive: true } });
    if (!service) throw new BadRequestException("Invalid service.");

    const normalizedTimeSlot = this.normalizeTimeSlot(dto.timeSlot);
    const slot = await this.timeSlots.findOne({ where: { slot: normalizedTimeSlot, isActive: true } });
    if (!slot) throw new BadRequestException("Invalid time slot.");

    const user = dto.userId ? await this.users.findOne({ where: { id: dto.userId } }) : null;
    if (dto.userId && !user) throw new BadRequestException("Invalid user.");

    const btu = dto.btu ?? 5000;
    const total = Number((Number(service.price) * dto.units * btuMultiplier(btu)).toFixed(2));
    const notes = [dto.notes?.trim(), `BTU: ${btu}`].filter(Boolean).join("\n");
    const booking = this.bookings.create({
      id: randomUUID(),
      userId: user?.id ?? null,
      customerName: dto.customerName.trim(),
      customerEmail: dto.customerEmail.toLowerCase(),
      customerPhone: dto.customerPhone?.trim() || null,
      serviceId: service.id,
      units: dto.units,
      scheduledDate: dto.scheduledDate.slice(0, 10),
      timeSlot: normalizedTimeSlot,
      address: dto.address.trim(),
      notes,
      status: "confirmed",
      totalAmount: total,
    });

    const saved = await this.bookings.save(booking);
    const payment = this.payments.create({
      id: randomUUID(),
      bookingId: saved.id,
      method: dto.paymentMethod ?? "credit",
      status: "paid",
      amount: total,
      currency: "USD",
      providerReference: `api-${saved.id.slice(0, 8)}`,
      paidAt: new Date(),
    });
    await this.payments.save(payment);

    return this.getOne(saved.id);
  }

  async updateStatus(id: string, status: BookingStatus) {
    const booking = await this.bookings.findOne({ where: { id } });
    if (!booking) throw new NotFoundException("Booking not found.");

    booking.status = status;
    await this.bookings.save(booking);
    return this.getOne(id);
  }

  async updateSchedule(id: string, dto: UpdateBookingScheduleDto) {
    const booking = await this.bookings.findOne({ where: { id } });
    if (!booking) throw new NotFoundException("Booking not found.");
    if (booking.status === "completed" || booking.status === "cancelled") {
      throw new BadRequestException("Completed or cancelled bookings cannot be postponed.");
    }

    const normalizedTimeSlot = this.normalizeTimeSlot(dto.timeSlot);
    const slot = await this.timeSlots.findOne({ where: { slot: normalizedTimeSlot, isActive: true } });
    if (!slot) throw new BadRequestException("Invalid time slot.");

    booking.scheduledDate = dto.scheduledDate.slice(0, 10);
    booking.timeSlot = normalizedTimeSlot;
    await this.bookings.save(booking);
    return this.getOne(id);
  }

  private normalizeTimeSlot(slot: string) {
    if (/^\d{2}:\d{2}$/.test(slot)) return `${slot}:00`;
    if (/^\d{2}:\d{2}:\d{2}$/.test(slot)) return slot;
    throw new BadRequestException("Time slot must use HH:mm or HH:mm:ss format.");
  }

  private toResponse(booking: Booking) {
    return {
      id: booking.id,
      userId: booking.userId ?? "guest",
      userName: booking.customerName,
      userEmail: booking.customerEmail,
      userPhone: booking.customerPhone ?? "",
      service: booking.serviceId,
      serviceName: booking.service?.name,
      units: booking.units,
      date: booking.scheduledDate,
      timeSlot: booking.timeSlot.slice(0, 5),
      address: booking.address,
      notes: this.cleanNotes(booking.notes ?? null),
      btu: this.extractBtu(booking.notes ?? null),
      status: booking.status,
      total: booking.totalAmount,
      createdAt: booking.createdAt,
      payment: booking.payment
        ? {
            method: booking.payment.method,
            status: booking.payment.status,
            amount: booking.payment.amount,
            currency: booking.payment.currency,
            paidAt: booking.payment.paidAt,
          }
        : null,
    };
  }

  private extractBtu(notes: string | null) {
    if (!notes) return null;
    const match = notes.match(/BTU:\s*(\d+)/i);
    return match ? Number(match[1]) : null;
  }

  private cleanNotes(notes: string | null) {
    if (!notes) return "";
    return notes
      .split(/\r?\n/)
      .filter((line) => !/^BTU:\s*\d+/i.test(line.trim()))
      .join("\n")
      .trim();
  }
}
