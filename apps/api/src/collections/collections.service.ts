import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class CollectionsService {
  constructor(private prisma: PrismaService) {}

  findAll(userId: number) {
    return this.prisma.collection.findMany({
      where: { userId },
      include: { items: { include: { variant: { include: { card: true } } } } },
    });
  }

  async findOne(userId: number, id: number) {
    const col = await this.prisma.collection.findFirst({ where: { id, userId }, include: { items: { include: { variant: { include: { card: true } } } } } });
    if (!col) throw new NotFoundException("Collection not found");
    return col;
  }

  create(userId: number, name: string) {
    return this.prisma.collection.create({ data: { userId, name } });
  }

  async update(userId: number, id: number, name: string) {
    await this.findOne(userId, id);
    return this.prisma.collection.update({ where: { id }, data: { name } });
  }

  async remove(userId: number, id: number) {
    await this.findOne(userId, id);
    return this.prisma.collection.delete({ where: { id } });
  }

  addItem(collectionId: number, variantId: number, condition: string, quantity: number) {
    return this.prisma.collectionItem.create({ data: { collectionId, variantId, condition, quantity } });
  }

  removeItem(itemId: number) {
    return this.prisma.collectionItem.delete({ where: { id: itemId } });
  }
}
