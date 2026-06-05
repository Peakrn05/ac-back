import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity({ name: "countries" })
export class Country {
  @PrimaryColumn("char", { length: 2 })
  code: string;

  @Column("text")
  name: string;

  @Column("text", { name: "dial_code" })
  dialCode: string;

  @Column("integer", { name: "sort_order" })
  sortOrder: number;
}
