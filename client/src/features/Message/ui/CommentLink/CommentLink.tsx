import React, { FC } from 'react';
import { HiOutlineChevronRight } from 'react-icons/hi2';
import { useNavigate } from 'react-router';
import { useParams } from 'react-router-dom';
import { setWrapperState } from '@entities/Messenger';
import { useAppDispatch } from '@shared/lib';
import { MessageSchema, MessengerTypes } from '@shared/types';
import style from './comment-link.module.css';

interface ICommentLinkProps {
    messengerType: MessengerTypes;
    message: MessageSchema;
}

const CommentLink: FC<ICommentLinkProps> = ({ messengerType, message }) => {
    const { messengerId, postId } = useParams();

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const commentsOnClick = () => {
        dispatch(setWrapperState(false));

        setTimeout(() => {
            navigate(`/channel/${messengerId}/post/${message.message_id}`);
            dispatch(setWrapperState(true));
        }, 200);
    };

    return (
        <>
            {messengerType === 'channel' && !postId && (
                <button className={style.CommentsContainer} onClick={commentsOnClick}>
                    <p>{message?.comments_count || 0} Comments</p>
                    <HiOutlineChevronRight />
                </button>
            )}
        </>
    );
};

export default CommentLink;
