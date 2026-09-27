import { Controller, Get, Post, Put, Param, Body, ParseIntPipe } from "@nestjs/common";
import { TradesService } from "./trades.service";
import { CurrentUser } from "../common/decorators/current-user.decorator";

@Controller("trades")
export class TradesController {
  constructor(private svc: TradesService) {}

  /** GET /api/v1/trades/matches - find trade matches for logged-in user */
  @Get("matches") matches(@CurrentUser() user: any) { return this.svc.findMatches(user.sub); }
  @Get() mine(@CurrentUser() user: any) { return this.svc.getMyTrades(user.sub); }
  @Post() create(@CurrentUser() user: any, @Body() body: { responderId: number }) { return this.svc.createTrade(user.sub, body.responderId); }
  @Put(":id/status") updateStatus(@Param("id", ParseIntPipe) id: number, @Body() body: { status: string }) { return this.svc.updateStatus(id, body.status); }
}
