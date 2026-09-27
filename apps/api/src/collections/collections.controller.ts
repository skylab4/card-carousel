import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe } from "@nestjs/common";
import { CollectionsService } from "./collections.service";
import { CurrentUser } from "../common/decorators/current-user.decorator";

@Controller("collections")
export class CollectionsController {
  constructor(private svc: CollectionsService) {}

  @Get()
  findAll(@CurrentUser() user: any) {
    return this.svc.findAll(user.sub);
  }

  @Get(":id")
  findOne(@CurrentUser() user: any, @Param("id", ParseIntPipe) id: number) {
    return this.svc.findOne(user.sub, id);
  }

  @Post()
  create(@CurrentUser() user: any, @Body() body: { name: string }) {
    return this.svc.create(user.sub, body.name);
  }

  @Put(":id")
  update(@CurrentUser() user: any, @Param("id", ParseIntPipe) id: number, @Body() body: { name: string }) {
    return this.svc.update(user.sub, id, body.name);
  }

  @Delete(":id")
  remove(@CurrentUser() user: any, @Param("id", ParseIntPipe) id: number) {
    return this.svc.remove(user.sub, id);
  }

  @Post(":id/items")
  addItem(@Param("id", ParseIntPipe) id: number, @Body() body: { variantId: number; condition: string; quantity?: number }) {
    return this.svc.addItem(id, body.variantId, body.condition, body.quantity ?? 1);
  }

  @Delete(":id/items/:itemId")
  removeItem(@Param("itemId", ParseIntPipe) itemId: number) {
    return this.svc.removeItem(itemId);
  }
}
