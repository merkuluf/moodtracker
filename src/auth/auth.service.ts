import { HttpStatus, Injectable } from '@nestjs/common';
import { RESPONSE } from 'src/common/Responses';
import { ApiException } from 'src/middleware/api.exception';

@Injectable()
export class AuthService {
    private readonly BOT_TOKEN = process.env.BOT_TOKEN;

    async validateTelegramData(initData: any): Promise<any> {
        if (!initData) {
            throw new ApiException(RESPONSE.NOT_FOUND('initData'), HttpStatus.BAD_REQUEST);
        }

        const dataParams = new URLSearchParams(initData);
        const hash = dataParams.get('hash');
        dataParams.delete('hash');

        const dataCheckString = Array.from(dataParams.keys())
            .sort()
            .map((key) => `${key}=${dataParams.get(key)}`)
            .join('\n');

        const encoder = new TextEncoder();
        const keyMaterial = await crypto.subtle.importKey(
            'raw',
            encoder.encode('WebAppData'),
            { name: 'HMAC', hash: { name: 'SHA-256' } },
            false,
            ['sign']
        );

        const secretKey = await crypto.subtle.sign('HMAC', keyMaterial, encoder.encode(this.BOT_TOKEN));

        const hmac = await crypto.subtle.sign(
            'HMAC',
            await crypto.subtle.importKey('raw', secretKey, { name: 'HMAC', hash: { name: 'SHA-256' } }, false, [
                'sign',
            ]),
            encoder.encode(dataCheckString)
        );

        const hexHmac = Array.from(new Uint8Array(hmac))
            .map((b) => b.toString(16).padStart(2, '0'))
            .join('');

        const valid = hexHmac === hash;

        if (!valid) {
            throw new ApiException(RESPONSE.INVALID('initData'), HttpStatus.UNAUTHORIZED);
        }

        return JSON.parse(dataParams.get('user') || '{}');
    }
}
