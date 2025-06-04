import {Injectable} from '@nestjs/common';
import {PassportStrategy} from '@nestjs/passport';
import {ExtractJwt, Strategy} from 'passport-jwt';
import {ConfigService} from '@nestjs/config';

interface JwtPayload {
    sub: string;
    email: string;
}
@Injectable()
export class AtStrategy extends PassportStrategy(Strategy, 'jwt-at') {
    constructor(private readonly configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey:  configService.getOrThrow<string>('JWT_AT_SECRET'),
        });
    }
    validate(payload: JwtPayload):JwtPayload {
        return payload;
    }
}