export class ApiException extends Error {
    constructor(
        public readonly message: string,
        public readonly statusCode: number
    ) {
        super(message)
        this.name = 'ApiException'
    }
}
