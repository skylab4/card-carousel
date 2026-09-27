import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class WishlistService {
  constructor(private prisma: PrismaService) {}

  findAll(userId: number) {
    return this.prisma.wishlistItem.findMany({
      where: { userId },
      include: { variant: { include: { card: { include: { set: { include: { franchise: true } } } } } } },
    });
  }

  add(userId: number, variantId: number) {
    return this.prisma.wishlistItem.create({ data: { userId, variantId } });
  }

  async remove(userId: number, id: number) {
    const item = await this.prisma.wishlistItem.findFirst({ where: { id, userId } });
    if (!item) throw new NotFoundException("Wishlist item not found");
    return this.prisma.wishlistItem.delete({ where: { id } });
  }
}
