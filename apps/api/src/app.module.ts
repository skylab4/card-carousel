import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { AuthModule } from "./auth/auth.module";
import { CollectionsModule } from "./collections/collections.module";
import { CardsModule } from "./cards/cards.module";
import { PrismaModule } from "./prisma/prisma.module";
import { JwtAuthGuard } from "./auth/guards/jwt.guard";

@Module({
  imports: [PrismaModule, AuthModule, CollectionsModule, CardsModule],
  providers: [{ provide: APP_GUARD, useClass: JwtAuthGuard }],
})
export class AppModule {}
