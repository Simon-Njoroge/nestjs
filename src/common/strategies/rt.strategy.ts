import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy ,StrategyOptionsWithRequets } from "passport-jwt";
import { ConfigService } from "@nestjs/config";
import { Request } from "express";

interface JwtPayload {
  sub: string;
  email: string;
}
interface JwtPayloadWithRt extends JwtPayload {
  refreshToken: string;
}
@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, "jwt-rt") {
  constructor(private readonly configService: ConfigService) {
  const options: StrategyOptionsWithRequets = {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        ignoreExpiration: false,
        secretOrKey: configService.getOrThrow<string>("JWT_RT_SECRET"),
        passReqToCallback: true,
  };
    super(options);
}
 validate(req: Request, payload: JwtPayload): JwtPayloadWithRt {
    const refreshToken = req.headers['authorization']?.replace("Bearer ", "").trim();
    if (!refreshToken) {
      throw new Error("Refresh token not found");
    }
    return { ...payload, refreshToken };
  }
} 