import { Controller, Post, Body, Headers } from '@nestjs/common';
import { AuthService } from './auth.service';

interface IUser {
    username: string;
    first_name: string;
    id: number;
}

function getUsername(userData: IUser) {
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

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}
    @Post('validate')
    async validateToken(@Headers() headers: any): Promise<{ valid: boolean }> {
        const { authorization } = headers;
        const initData = authorization.split(' ')[1];
        const validationResult = await this.authService.validateTelegramData(initData);
        const username = getUsername(validationResult);
        console.log(username, validationResult, '<');
        return { valid: true };
    }
}
