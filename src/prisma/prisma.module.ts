import { Global, Module } from '@nestjs/common'
import { PrismaService } from './prisma.service'

// some comments
@Global()
@Module({
    providers: [PrismaService],
    exports: [PrismaService],
})
export class PrismaModule {}
