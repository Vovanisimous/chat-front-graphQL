import React, { useState } from "react";
import { IMessage } from "../../entity/Message";
import classNames from "classnames";
import { useAuthState } from "../../context/auth";
import moment from "moment";
import { Button, OverlayTrigger, Popover, Tooltip } from "react-bootstrap";
import {gql, useMutation} from "@apollo/client";

const reactions = ["❤", "😆", "😯", "😢", "😡", "👍", "👎"];

const REACT_TO_MESSAGE = gql`
    mutation reactToMessage($uuid: String! $content: String!){
        reactToMessage(uuid: $uuid, content: $content){
            uuid
        }
    }
`

interface IProps {
    message: IMessage;
}

export const Message = (props: IProps) => {
    const { content, createdAt, from, to, uuid } = props.message;
    const { user } = useAuthState();
    const sentBy = from === user.username;
    const received = !sentBy;
    const [showPopover, setShowPopover] = useState(false);
    // @ts-ignore
    const messageReactions = [...new Set(props.message.reactions.map((reaction) => reaction.content))]

    const [reactToMessage] = useMutation(REACT_TO_MESSAGE, {
        onError: err => console.log(err),
        onCompleted: (data) => {
            setShowPopover(false)
        }
    })

    const react = (reaction: string) => {
        reactToMessage({variables: {uuid, content: reaction}})
    };

    const reactButton = (
        <OverlayTrigger
            trigger={"click"}
            placement={"top"}
            show={showPopover}
            onToggle={setShowPopover}
            transition={false}
            overlay={
                <Popover className={"rounded-pill"} id={"1"}>
                    <Popover.Content className={'d-flex px-0 py-1 align-items-center react-button-popover'}>
                        {reactions.map((reaction) => (
                            <Button variant="link" className={"react-icon-button"} key={reaction} onClick={() => react(reaction)}>
                                {reaction}
                            </Button>
                        ))}
                    </Popover.Content>
                </Popover>
            }
        >
            <Button variant={"link"} className={"px-2"}>
                <i className={"far fa-smile"} />
            </Button>
        </OverlayTrigger>
    );

    return (
        <div
            className={classNames("d-flex my-3", {
                "ml-auto": sentBy,
                "mr-auto": received,
            })}
        >
            {sentBy && reactButton}
            <div className={"message-container"}>
                <OverlayTrigger
                    placement={sentBy ? "right" : "left"}
                    overlay={
                        <Tooltip id={`tooltip-${sentBy}`}>
                            {moment(createdAt).format("MMMM DD, YYYY @ h:mm a")}
                        </Tooltip>
                    }
                    transition={false}
                >
                    <div
                        className={classNames("py-2 px-3 rounded-pill position-relative my-2", {
                            "bg-primary": sentBy,
                            "bg-secondary": received,
                        })}
                    >
                        <p className={classNames({ "text-white": sentBy })}>{content}</p>
                    </div>
                </OverlayTrigger>
                {props.message.reactions.length > 0 && (
                    <div className={"reactions-div bg-secondary p-1 rounded-pill"}>
                        {messageReactions} {props.message.reactions.length}
                    </div>
                )}
            </div>
            {received && reactButton}
        </div>
    );
};
