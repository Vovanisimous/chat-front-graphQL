export interface IUser{
    username: string;
    email: string;
    createdAt: string;
    token?: string;
    latestMessage?: {
        uuid: string;
        content: string;
        from: string;
        to: string;
        createdAt: string;
    }
    imageUrl?: string;
}