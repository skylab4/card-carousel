import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class TradesService {
  constructor(private prisma: PrismaService) {}

  /** Find all users whose haves match this user wishlist AND whose wishlist matches this user haves */
  async findMatches(userId: number) {
    // Get this user wishlist variant IDs
    const myWishlist = await this.prisma.wishlistItem.findMany({ where: { userId }, select: { variantId: true } });
    const myWishlistIds = myWishlist.map((w) => w.variantId);

    // Get this user collection variant IDs
    const myItems = await this.prisma.collectionItem.findMany({
      where: { collection: { userId } },
      select: { variantId: true },
    });
    const myHaveIds = myItems.map((i) => i.variantId);

    if (!myWishlistIds.length || !myHaveIds.length) return [];

    // Find users who have cards I want
    const theyHaveIWant = await this.prisma.collectionItem.findMany({
      where: { variantId: { in: myWishlistIds }, NOT: { collection: { userId } } },
      include: { collection: { select: { userId: true } } },
    });

    const candidateUserIds = [...new Set(theyHaveIWant.map((i) => i.collection.userId))];

    // Filter to those who also want something I have
    const matches = [];
    for (const candidateId of candidateUserIds) {
      const theirWishlist = await this.prisma.wishlistItem.findMany({
        where: { userId: candidateId, variantId: { in: myHaveIds } },
        select: { variantId: true },
      });
      if (theirWishlist.length > 0) {
        matches.push({ userId: candidateId, matchingWants: theirWishlist.map((w) => w.variantId) });
      }
    }
    return matches;
  }

  createTrade(initiator: number, responder: number) {
    return this.prisma.trade.create({ data: { initiator, responder, status: "proposed" } });
  }

  getMyTrades(userId: number) {
    return this.prisma.trade.findMany({ where: { OR: [{ initiator: userId }, { responder: userId }] } });
  }

  updateStatus(tradeId: number, status: string) {
    return this.prisma.trade.update({ where: { id: tradeId }, data: { status } });
  }
}
