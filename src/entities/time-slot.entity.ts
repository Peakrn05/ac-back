import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity({ name: "time_slots" })
export class TimeSlot {
  @PrimaryColumn("time")
  slot: string;

  @Column("text")
  label: string;

  @Column("integer", { name: "sort_order" })
  sortOrder: number;

  @Column("boolean", { name: "is_active", default: true })
  isActive: boolean;
}
