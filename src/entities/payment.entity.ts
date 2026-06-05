import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryColumn } from "typeorm";
import { Booking } from "./booking.entity";

export type PaymentMethod = "paypal" | "credit" | "debit";
export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

@Entity({ name: "payments" })
export class Payment {
  @PrimaryColumn("text")
  id: string;

  @Column("text", { name: "booking_id" })
  bookingId: string;

  @Column({ type: "enum", enum: ["paypal", "credit", "debit"], enumName: "payment_method" })
  method: PaymentMethod;

  @Column({ type: "enum", enum: ["pending", "paid", "failed", "refunded"], enumName: "payment_status", default: "pending" })
  status: PaymentStatus;

  @Column("numeric", { precision: 10, scale: 2, transformer: { from: Number, to: (value: number) => value } })
  amount: number;

  @Column("char", { length: 3, default: "USD" })
  currency: string;

  @Column("text", { name: "provider_reference", nullable: true })
  providerReference: string | null;

  @Column("timestamptz", { name: "paid_at", nullable: true })
  paidAt: Date | null;

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt: Date;

  @OneToOne(() => Booking, (booking) => booking.payment)
  @JoinColumn({ name: "booking_id" })
  booking: Booking;
}
