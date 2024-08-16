import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
    imports: [
        PrismaModule,
        JwtModule.register({
            secret: process.env.JWT_SECRET || 'your_secret_key', // Use a strong secret in production
            signOptions: { expiresIn: '1h' }, // Token expiry time
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService],
})
export class AuthModule {}
