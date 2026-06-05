import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from "typeorm";
import { Service } from "./service.entity";

@Entity({ name: "service_ratings" })
export class ServiceRating {
  @PrimaryColumn("text", { name: "service_id" })
  serviceId: string;

  @Column("numeric", { precision: 2, scale: 1, transformer: { from: Number, to: (value: number) => value } })
  stars: number;

  @Column("integer", { name: "review_count" })
  reviewCount: number;

  @Column({ name: "updated_at", type: "timestamptz" })
  updatedAt: Date;

  @OneToOne(() => Service, (service) => service.rating)
  @JoinColumn({ name: "service_id" })
  service: Service;
}
