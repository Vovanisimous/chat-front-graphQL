import React, { createContext, useReducer, useContext, FC, Dispatch } from "react";
import { IUser } from "../entity/User";
import { IMessage } from "../entity/Message";

const MessageStateContext = createContext(null);

const messageReducer = (state: any, action: { type: string; payload: any }) => {
    let usersCopy, userIndex;
    const { username, message, messages, reaction } = action.payload;
    switch (action.type) {
        case "SET_USERS":
            return {
                ...state,
                users: action.payload,
            };
        case "SET_USER_MESSAGES":
            usersCopy = [...state.users];

            userIndex = usersCopy.findIndex((u) => u.username === username);

            usersCopy[userIndex] = { ...usersCopy[userIndex], messages };

            return {
                ...state,
                users: usersCopy,
            };
        case "SET_SELECTED_USER":
            usersCopy = state.users.map((user: IUser) => ({
                ...user,
                selected: user.username === action.payload,
            }));

            return {
                ...state,
                users: usersCopy,
            };
        case "ADD_MESSAGE":
            usersCopy = [...state.users];

            userIndex = usersCopy.findIndex((u) => u.username === username);

            message.reactions = [];

            let newUser = {
                ...usersCopy[userIndex],
                messages: usersCopy[userIndex].messages
                    ? [message, ...usersCopy[userIndex].messages]
                    : null,
                latestMessage: message,
            };

            usersCopy[userIndex] = newUser;

            return {
                ...state,
                users: usersCopy,
            };

        case "ADD_REACTION":
            usersCopy = [...state.users];

            userIndex = usersCopy.findIndex((u) => u.username === username);

            let userCopy = { ...usersCopy[userIndex] };

            const messageIndex = userCopy.messages?.findIndex(
                (message: IMessage) => message.uuid === reaction.message.uuid,
            );

            if (messageIndex > -1) {
                let messagesCopy = [...userCopy.messages];

                let reactionsCopy = [...messagesCopy[messageIndex].reactions];

                let reactionIndex = reactionsCopy.findIndex((r) => r.uuid === reaction.uuid);

                if (reactionIndex > -1) {
                    reactionsCopy[reactionIndex] = reaction;
                } else {
                    reactionsCopy = [...reactionsCopy, reaction];
                }

                messagesCopy[messageIndex] = {
                    ...messagesCopy[messageIndex],
                    reactions: reactionsCopy,
                };

                userCopy = {
                    ...userCopy,
                    messages: messagesCopy,
                };
                usersCopy[userIndex] = userCopy
            }

            return {
                ...state,
                users: usersCopy,
            };
        default:
            throw new Error(`Unknown action type: ${action.type}`);
    }
};

const MessageDispatchContext = createContext<Dispatch<{ type: string; payload: any }>>(() => {});

export const MessageProvider: FC = ({ children }) => {
    const [state, dispatch] = useReducer(messageReducer, { users: null });

    return (
        <MessageDispatchContext.Provider value={dispatch}>
            <MessageStateContext.Provider value={state}>{children}</MessageStateContext.Provider>
        </MessageDispatchContext.Provider>
    );
};

export const useMessageState = () => useContext(MessageStateContext);
export const useMessageDispatch = () => useContext(MessageDispatchContext);
