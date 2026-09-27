import { Controller, Get, Query, Param, ParseIntPipe } from "@nestjs/common";
import { CardsService } from "./cards.service";
import { Public } from "../common/decorators/public.decorator";

@Controller("cards")
export class CardsController {
  constructor(private svc: CardsService) {}

  @Public()
  @Get()
  search(@Query("q") q: string, @Query("franchise") franchise?: string) {
    return this.svc.search(q ?? "", franchise);
  }

  @Public()
  @Get(":id/variants")
  variants(@Param("id", ParseIntPipe) id: number) {
    return this.svc.findVariants(id);
  }
}
