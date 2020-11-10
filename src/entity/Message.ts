import {IUser} from "./User";

export interface IMessage {
        uuid: string,
        content: string,
        from: string,
        to: string,
        createdAt: string,
        reactions: {
                uuid: string;
                content: string;
                createdAt: string;
                message: IMessage;
                user: IUser;
        }[]
}