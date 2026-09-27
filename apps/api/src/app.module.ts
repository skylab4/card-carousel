import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { AuthModule } from "./auth/auth.module";
import { CollectionsModule } from "./collections/collections.module";
import { CardsModule } from "./cards/cards.module";
import { WishlistModule } from "./wishlist/wishlist.module";
import { TradesModule } from "./trades/trades.module";
import { PrismaModule } from "./prisma/prisma.module";
import { JwtAuthGuard } from "./auth/guards/jwt.guard";

@Module({
  imports: [PrismaModule, AuthModule, CollectionsModule, CardsModule, WishlistModule, TradesModule],
  providers: [{ provide: APP_GUARD, useClass: JwtAuthGuard }],
})
export class AppModule {}
