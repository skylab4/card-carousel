import { Injectable, UnauthorizedException } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class AuthService {
  private jwtSecret = process.env.CARDCAROUSEL_JWT_SECRET || "dev-secret";
  constructor(private prisma: PrismaService) {}

  async register(email: string, password: string) {
    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) throw new Error("User already exists");
    const hash = await bcrypt.hash(password, 10);
    const user = await this.prisma.user.create({ data: { email, password: hash } });
    const { password: _p, ...safe } = user as any;
    return safe;
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new UnauthorizedException("Invalid credentials");
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) throw new UnauthorizedException("Invalid credentials");
    const token = jwt.sign({ sub: user.id, email: user.email }, this.jwtSecret, { expiresIn: "7d" });
    return { accessToken: token };
  }
}
