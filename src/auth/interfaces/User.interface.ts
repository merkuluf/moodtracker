export interface IUserTG {
    id: number;
    first_name: string;
    username: string;
    last_name?: string;
    language_code?: string;
    is_premium?: boolean;
    allows_write_to_pm?: boolean;
}

export interface IUser {
    id: number;
    name: string;
    telegram_id: string;
    email?: string;
}
