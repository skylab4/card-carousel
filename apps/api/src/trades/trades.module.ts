import { Module } from "@nestjs/common";
import { TradesService } from "./trades.service";
import { TradesController } from "./trades.controller";
import { PrismaModule } from "../prisma/prisma.module";

@Module({ imports: [PrismaModule], providers: [TradesService], controllers: [TradesController] })
export class TradesModule {}
