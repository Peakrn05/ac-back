import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Country } from "../entities/country.entity";
import { Service } from "../entities/service.entity";
import { TimeSlot } from "../entities/time-slot.entity";

@Injectable()
export class CatalogService {
  constructor(
    @InjectRepository(Service) private readonly services: Repository<Service>,
    @InjectRepository(TimeSlot) private readonly timeSlots: Repository<TimeSlot>,
    @InjectRepository(Country) private readonly countries: Repository<Country>,
  ) {}

  async listServices() {
    const services = await this.services.find({
      where: { isActive: true },
      relations: { rating: true },
      order: { sortOrder: "ASC" },
    });

    return services.map((service) => ({
      id: service.id,
      name: service.name,
      iconKey: service.iconKey,
      price: service.price,
      priceUnit: service.priceUnit,
      duration: service.duration,
      desc: service.description,
      cardGradient: service.cardGradient,
      rating: service.rating
        ? { stars: service.rating.stars, count: service.rating.reviewCount }
        : null,
    }));
  }

  async listTimeSlots() {
    const slots = await this.timeSlots.find({
      where: { isActive: true },
      order: { sortOrder: "ASC" },
    });

    return slots.map((slot) => ({ slot: slot.label, value: slot.slot }));
  }

  async listCountries() {
    return this.countries.find({ order: { sortOrder: "ASC" } });
  }
}
