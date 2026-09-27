import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class CardsService {
  constructor(private prisma: PrismaService) {}

  async search(query: string, franchiseKey?: string) {
    const parts = query.trim().split(/\s+/);
    const numberPart = parts.find((p) => /^\d+$/.test(p));
    const setCode = parts[parts.length - 1].toUpperCase();
    const nameParts = parts.filter((p) => p !== numberPart && p.toUpperCase() !== setCode);
    const nameQuery = nameParts.join(" ");
    return this.prisma.card.findMany({
      where: {
        AND: [
          numberPart ? { number: numberPart } : {},
          nameQuery ? { name: { contains: nameQuery, mode: "insensitive" } } : {},
          franchiseKey ? { set: { franchise: { key: { equals: franchiseKey, mode: "insensitive" } } } } : {},
        ],
      },
      include: { set: { include: { franchise: true } }, variants: true },
      take: 20,
    });
  }

  findVariants(cardId: number) {
    return this.prisma.cardVariant.findMany({ where: { cardId } });
  }
}
