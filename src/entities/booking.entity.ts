import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { Payment } from "./payment.entity";
import { Service } from "./service.entity";
import { User } from "./user.entity";

export type BookingStatus = "pending" | "confirmed" | "in-progress" | "completed" | "cancelled";

@Entity({ name: "bookings" })
export class Booking {
  @PrimaryColumn("text")
  id: string;

  @Column("text", { name: "user_id", nullable: true })
  userId: string | null;

  @Column("text", { name: "customer_name" })
  customerName: string;

  @Column("text", { name: "customer_email" })
  customerEmail: string;

  @Column("text", { name: "customer_phone", nullable: true })
  customerPhone: string | null;

  @Column("text", { name: "service_id" })
  serviceId: string;

  @Column("integer")
  units: number;

  @Column("date", { name: "scheduled_date" })
  scheduledDate: string;

  @Column("time", { name: "time_slot" })
  timeSlot: string;

  @Column("text")
  address: string;

  @Column("text", { default: "" })
  notes: string;

  @Column({ type: "enum", enum: ["pending", "confirmed", "in-progress", "completed", "cancelled"], enumName: "booking_status", default: "pending" })
  status: BookingStatus;

  @Column("numeric", { name: "total_amount", precision: 10, scale: 2, transformer: { from: Number, to: (value: number) => value } })
  totalAmount: number;

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamptz" })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.bookings, { nullable: true })
  @JoinColumn({ name: "user_id" })
  user: User | null;

  @ManyToOne(() => Service, (service) => service.bookings)
  @JoinColumn({ name: "service_id" })
  service: Service;

  @OneToOne(() => Payment, (payment) => payment.booking)
  payment: Payment | null;
}
