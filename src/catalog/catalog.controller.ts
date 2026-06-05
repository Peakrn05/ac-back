import { Controller, Get } from "@nestjs/common";
import { CatalogService } from "./catalog.service";

@Controller()
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  @Get("services")
  services() {
    return this.catalogService.listServices();
  }

  @Get("time-slots")
  timeSlots() {
    return this.catalogService.listTimeSlots();
  }

  @Get("countries")
  countries() {
    return this.catalogService.listCountries();
  }
}
