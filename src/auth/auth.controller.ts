import { Controller, Post, Body, Headers, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoggingInterceptor } from 'src/interceptors/logging.interceptor';
import { PrismaService } from 'src/prisma/prisma.service';

import { IUserTG, IUser } from './interfaces/User.interface';

function getUsername(userData: IUserTG) {
    if (userData.username) {
        if (userData.username !== '') {
            return userData.username;
        }
    } else if (userData.first_name) {
        return userData.first_name;
    } else {
        return userData.id.toString();
    }
}

@UseInterceptors(LoggingInterceptor)
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    // this function validates initData and if user is not registered - recording him and returns token
    @Post('validate')
    async validateToken(@Headers() headers: any): Promise<{ token: string }> {
        const { authorization } = headers;
        const initData = authorization.split(' ')[1];

        const validationResult = await this.authService.validateTelegramData(initData);

        const username = getUsername(validationResult);
        const telegram_id = validationResult.id.toString();

        let user = await this.authService.findUser(telegram_id);
        if (!user) {
            user = await this.authService.createUser(telegram_id, username);
        }
        const token = this.authService.generateToken(user);
        console.log(token);
        return { token };
    }
}
