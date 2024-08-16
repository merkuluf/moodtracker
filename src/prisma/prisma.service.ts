import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    async onModuleInit() {
        console.log('prisma connected')
        await this.$connect()
    }

    async onModuleDestroy() {
        console.log('prisma disconnected')
        await this.$disconnect()
    }
}
