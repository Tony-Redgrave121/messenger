import {IMessagesResponse} from "@appTypes";

export default interface ICommentState {
    comment: IMessagesResponse | null,
    commentState: boolean
}