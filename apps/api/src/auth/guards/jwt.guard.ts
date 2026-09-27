import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import * as jwt from "jsonwebtoken";

export const IS_PUBLIC_KEY = "isPublic";

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(ctx: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [ctx.getHandler(), ctx.getClass()]);
    if (isPublic) return true;
    const req = ctx.switchToHttp().getRequest();
    const auth = req.headers["authorization"];
    if (!auth?.startsWith("Bearer ")) throw new UnauthorizedException();
    try {
      req.user = jwt.verify(auth.slice(7), process.env.CARDCAROUSEL_JWT_SECRET || "dev-secret");
      return true;
    } catch { throw new UnauthorizedException(); }
  }
}
