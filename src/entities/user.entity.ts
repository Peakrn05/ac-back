import { Column, CreateDateColumn, Entity, OneToMany, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { Booking } from "./booking.entity";

export type UserRole = "user" | "admin";

@Entity({ name: "users" })
export class User {
  @PrimaryColumn("text")
  id: string;

  @Column("text")
  name: string;

  @Column("text", { unique: true })
  email: string;

  @Column("text", { name: "password_hash" })
  passwordHash: string;

  @Column({ type: "enum", enum: ["user", "admin"], enumName: "user_role", default: "user" })
  role: UserRole;

  @Column("text", { nullable: true })
  phone: string | null;

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamptz" })
  updatedAt: Date;

  @OneToMany(() => Booking, (booking) => booking.user)
  bookings: Booking[];
}
