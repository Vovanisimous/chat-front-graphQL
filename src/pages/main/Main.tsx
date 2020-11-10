import React, { Fragment, useEffect } from "react";
import { Button, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useSubscription, gql } from "@apollo/client";

import { useAuthDispatch, useAuthState } from "../../context/auth";
import { useMessageDispatch } from "../../context/message";
import { Users } from "./Users";
import { Messages } from "./Messages";

const NEW_MESSAGE = gql`
    subscription newMessage {
        newMessage {
            uuid
            from
            to
            content
            createdAt
        }
    }
`;

const NEW_REACTION = gql`
    subscription newReaction {
        newReaction {
            uuid
            content
            message{
                uuid
                from
                to
            }
        }
    }
`;

export const Main = () => {
    const authDispatch: any = useAuthDispatch();
    const messageDispatch: any = useMessageDispatch();
    const { user } = useAuthState();

    const { data: messageData, error: messageError } = useSubscription(NEW_MESSAGE);

    const { data: reactionData, error: reactionError } = useSubscription(NEW_REACTION);

    useEffect(() => {
        if (messageError) console.log(messageError);

        if (messageData) {
            const otherUser =
                user.username === messageData.newMessage.to
                    ? messageData.newMessage.from
                    : messageData.newMessage.to;

            messageDispatch({
                type: "ADD_MESSAGE",
                payload: {
                    username: otherUser,
                    message: messageData.newMessage,
                },
            });
        }
    }, [messageData, messageError]);

    useEffect(() => {
        if (reactionError) console.log(reactionError);

        if (reactionData) {
            const otherUser =
                user.username === reactionData.newReaction.message.to
                    ? reactionData.newReaction.message.from
                    : reactionData.newReaction.message.to;

            messageDispatch({
                type: "ADD_REACTION",
                payload: {
                    username: otherUser,
                    reaction: reactionData.newReaction,
                },
            });
        }
    }, [reactionData, reactionError]);

    const logout = () => {
        authDispatch({ type: "LOGOUT" });
        window.location.href = "/login";
    };

    return (
        <Fragment>
            <Row className={"bg-white justify-content-around mb-1"}>
                <Link to={"/profile"}>
                    <Button variant={"link"}>Profile</Button>
                </Link>
                {!user && <Link to={"/register"}>
                    <Button variant={"link"}>Register</Button>
                </Link>}
                <Button variant={"link"} onClick={logout}>
                    Logout
                </Button>
            </Row>
            <Row className={"bg-white"}>
                <Users />
                <Messages />
            </Row>
        </Fragment>
    );
};
