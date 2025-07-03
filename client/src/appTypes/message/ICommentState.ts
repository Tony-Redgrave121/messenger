import {MessageSchema} from "@entities/Message";

export default interface ICommentState {
    comment: MessageSchema | null,
    commentState: boolean
}