import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppController } from "./app.controller";
import { AuthModule } from "./auth/auth.module";
import { Booking } from "./entities/booking.entity";
import { Country } from "./entities/country.entity";
import { Payment } from "./entities/payment.entity";
import { ServiceRating } from "./entities/service-rating.entity";
import { Service } from "./entities/service.entity";
import { TimeSlot } from "./entities/time-slot.entity";
import { User } from "./entities/user.entity";
import { BookingsModule } from "./bookings/bookings.module";
import { CatalogModule } from "./catalog/catalog.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: "postgres",
        url: config.getOrThrow<string>("DATABASE_URL"),
        entities: [Booking, Country, Payment, Service, ServiceRating, TimeSlot, User],
        synchronize: false,
        ssl: config.get<string>("DATABASE_SSL") === "true" ? { rejectUnauthorized: false } : false,
      }),
    }),
    AuthModule,
    BookingsModule,
    CatalogModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
