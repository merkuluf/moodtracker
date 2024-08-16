import { Controller, Post, Body, Headers, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoggingInterceptor } from 'src/interceptors/logging.interceptor';
import { PrismaService } from 'src/prisma/prisma.service';

interface IUserTG {
    username: string;
    first_name: string;
    id: number;
}

interface IUser {
    id: number;
    name: string;
    telegram_id: string;
    email: string;
}

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
    constructor(
        private readonly authService: AuthService,
        private readonly prisma: PrismaService
    ) {}

    @Post('validate')
    async validateToken(@Headers() headers: any): Promise<IUser> {
        const { authorization } = headers;
        const initData = authorization.split(' ')[1];

        const validationResult = await this.authService.validateTelegramData(initData);
        const username = getUsername(validationResult);

        const telegram_id = validationResult.id.toString();

        const userExist = await this.prisma.user.findFirst({
            where: {
                telegram_id: telegram_id,
            },
        });

        if (!userExist) {
            const newUser = await this.prisma.user.create({
                data: {
                    telegram_id: telegram_id,
                    name: username,
                },
            });

            return newUser;
        }
        return userExist;
    }
}
