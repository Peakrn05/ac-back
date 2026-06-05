import type { TypeOrmModuleOptions } from "@nestjs/typeorm";
import type { ConfigService } from "@nestjs/config";
import { Booking } from "../entities/booking.entity";
import { Country } from "../entities/country.entity";
import { Payment } from "../entities/payment.entity";
import { ServiceRating } from "../entities/service-rating.entity";
import { Service } from "../entities/service.entity";
import { TimeSlot } from "../entities/time-slot.entity";
import { User } from "../entities/user.entity";

export function databaseConfig(config: ConfigService): TypeOrmModuleOptions {
  const base: TypeOrmModuleOptions = {
    type: "postgres",
    entities: [Booking, Country, Payment, Service, ServiceRating, TimeSlot, User],
    synchronize: false,
    ssl: config.get<string>("DATABASE_SSL") === "true" ? { rejectUnauthorized: false } : false,
  };

  const databaseUrl = config.get<string>("DATABASE_URL");
  if (databaseUrl) {
    return { ...base, url: databaseUrl };
  }

  const host = config.get<string>("DB_HOST");
  const username = config.get<string>("DB_USERNAME") ?? config.get<string>("DB_USER");
  const password = config.get<string>("DB_PASSWORD");
  const database = config.get<string>("DB_DATABASE") ?? config.get<string>("DB_NAME");

  if (!host || !username || !password || !database) {
    throw new Error(
      "Database config missing. Set DATABASE_URL, or set DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, and DB_DATABASE.",
    );
  }

  return {
    ...base,
    host,
    port: config.get<number>("DB_PORT") ?? 5432,
    username,
    password,
    database,
  };
}
