import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Country } from "../entities/country.entity";
import { ServiceRating } from "../entities/service-rating.entity";
import { Service } from "../entities/service.entity";
import { TimeSlot } from "../entities/time-slot.entity";
import { CatalogController } from "./catalog.controller";
import { CatalogService } from "./catalog.service";

@Module({
  imports: [TypeOrmModule.forFeature([Country, Service, ServiceRating, TimeSlot])],
  controllers: [CatalogController],
  providers: [CatalogService],
})
export class CatalogModule {}
