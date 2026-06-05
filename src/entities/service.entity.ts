import { Column, CreateDateColumn, Entity, OneToMany, OneToOne, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { Booking } from "./booking.entity";
import { ServiceRating } from "./service-rating.entity";

@Entity({ name: "services" })
export class Service {
  @PrimaryColumn("text")
  id: string;

  @Column("text")
  name: string;

  @Column("text", { name: "icon_key" })
  iconKey: string;

  @Column("numeric", { precision: 10, scale: 2, transformer: { from: Number, to: (value: number) => value } })
  price: number;

  @Column("text", { name: "price_unit" })
  priceUnit: string;

  @Column("text")
  duration: string;

  @Column("text")
  description: string;

  @Column("text", { name: "card_gradient", nullable: true })
  cardGradient: string | null;

  @Column("integer", { name: "sort_order" })
  sortOrder: number;

  @Column("boolean", { name: "is_active", default: true })
  isActive: boolean;

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamptz" })
  updatedAt: Date;

  @OneToOne(() => ServiceRating, (rating) => rating.service)
  rating: ServiceRating | null;

  @OneToMany(() => Booking, (booking) => booking.service)
  bookings: Booking[];
}
