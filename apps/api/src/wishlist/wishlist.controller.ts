import { Controller, Get, Post, Delete, Param, Body, ParseIntPipe } from "@nestjs/common";
import { WishlistService } from "./wishlist.service";
import { CurrentUser } from "../common/decorators/current-user.decorator";

@Controller("wishlist")
export class WishlistController {
  constructor(private svc: WishlistService) {}

  @Get() findAll(@CurrentUser() user: any) { return this.svc.findAll(user.sub); }
  @Post() add(@CurrentUser() user: any, @Body() body: { variantId: number }) { return this.svc.add(user.sub, body.variantId); }
  @Delete(":id") remove(@CurrentUser() user: any, @Param("id", ParseIntPipe) id: number) { return this.svc.remove(user.sub, id); }
}
